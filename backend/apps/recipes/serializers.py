from django.db.models import Q
from rest_framework import serializers

from apps.groups.models import GrupoMembro
from apps.groups.serializers import GrupoResumoSerializer

from .models import (
    CompartilhamentoReceita,
    Ingrediente,
    IngredienteReceita,
    Receita,
)


class IngredienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingrediente
        fields = ("id", "nome", "categoria")


class IngredienteReceitaSerializer(serializers.ModelSerializer):
    ingrediente_nome = serializers.CharField(
        source="ingrediente.nome", read_only=True
    )
    ingrediente_categoria = serializers.CharField(
        source="ingrediente.categoria", read_only=True
    )

    class Meta:
        model = IngredienteReceita
        fields = (
            "id",
            "ingrediente",
            "ingrediente_nome",
            "ingrediente_categoria",
            "quantidade",
            "unidade",
        )


class IngredienteReceitaWriteSerializer(serializers.ModelSerializer):
    """Serializer para escrita de ingredientes na receita (sem nested read fields)."""

    class Meta:
        model = IngredienteReceita
        fields = ("ingrediente", "quantidade", "unidade")


class ReceitaListSerializer(serializers.ModelSerializer):
    """Serializer leve para listagem de receitas."""

    criador_nome = serializers.CharField(source="criador.nome", read_only=True)
    grupo = GrupoResumoSerializer(read_only=True)
    total_ingredientes = serializers.SerializerMethodField()

    class Meta:
        model = Receita
        fields = (
            "id",
            "titulo",
            "descricao",
            "dificuldade",
            "tempo_preparo",
            "porcoes",
            "criador_nome",
            "grupo",
            "total_ingredientes",
            "created_at",
        )

    def get_total_ingredientes(self, obj) -> int:
        return obj.ingredientes_receita.count()


class ReceitaDetailSerializer(serializers.ModelSerializer):
    """Serializer completo para detalhe/criacao/edicao de receitas."""

    criador_nome = serializers.CharField(source="criador.nome", read_only=True)
    grupo_detail = GrupoResumoSerializer(source="grupo", read_only=True)
    ingredientes_receita = IngredienteReceitaSerializer(many=True, read_only=True)
    ingredientes_data = IngredienteReceitaWriteSerializer(
        many=True, write_only=True, required=False
    )

    class Meta:
        model = Receita
        fields = (
            "id",
            "titulo",
            "descricao",
            "modo_preparo",
            "dificuldade",
            "tempo_preparo",
            "porcoes",
            "criador_nome",
            "grupo",
            "grupo_detail",
            "ingredientes_receita",
            "ingredientes_data",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "criador_nome")

    def validate_grupo(self, value):
        """Verifica se o usuario e membro do grupo selecionado."""
        if value is None:
            return value
        request = self.context.get("request")
        if request and not GrupoMembro.objects.filter(
            usuario=request.user, grupo=value
        ).exists():
            raise serializers.ValidationError(
                "Voce nao e membro deste grupo."
            )
        return value

    def create(self, validated_data):
        ingredientes_data = validated_data.pop("ingredientes_data", [])
        receita = Receita.objects.create(**validated_data)
        for item in ingredientes_data:
            IngredienteReceita.objects.create(receita=receita, **item)
        return receita

    def update(self, instance, validated_data):
        ingredientes_data = validated_data.pop("ingredientes_data", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if ingredientes_data is not None:
            # Estrategia: substituir todos os ingredientes
            instance.ingredientes_receita.all().delete()
            for item in ingredientes_data:
                IngredienteReceita.objects.create(receita=instance, **item)

        return instance


class CompartilhamentoReceitaSerializer(serializers.ModelSerializer):
    grupo_nome = serializers.CharField(source="grupo.nome", read_only=True)
    receita_titulo = serializers.CharField(source="receita.titulo", read_only=True)

    class Meta:
        model = CompartilhamentoReceita
        fields = (
            "id",
            "receita",
            "receita_titulo",
            "grupo",
            "grupo_nome",
            "data_compartilhamento",
        )
        read_only_fields = ("id", "data_compartilhamento")

    def validate(self, data):
        request = self.context.get("request")

        # Verificar se o usuario e o criador da receita
        receita = data["receita"]
        if receita.criador != request.user:
            raise serializers.ValidationError(
                "Somente o criador da receita pode compartilha-la."
            )

        # Verificar se o usuario e membro do grupo destino
        grupo = data["grupo"]
        if not GrupoMembro.objects.filter(
            usuario=request.user, grupo=grupo
        ).exists():
            raise serializers.ValidationError(
                "Voce nao e membro do grupo destino."
            )

        return data
