from rest_framework import serializers

from apps.groups.models import GrupoMembro
from apps.groups.serializers import GrupoResumoSerializer
from apps.recipes.serializers import ReceitaListSerializer

from .models import PlanoSemanal, Refeicao


class RefeicaoSerializer(serializers.ModelSerializer):
    receita_detail = ReceitaListSerializer(source="receita", read_only=True)

    class Meta:
        model = Refeicao
        fields = (
            "id",
            "plano_semanal",
            "receita",
            "receita_detail",
            "dia_da_semana",
            "tipo_refeicao",
        )
        read_only_fields = ("id",)

    def validate(self, data):
        request = self.context.get("request")
        plano = data.get("plano_semanal") or self.instance.plano_semanal

        # Verificar se o usuario tem acesso ao plano
        if plano.grupo:
            if not GrupoMembro.objects.filter(
                usuario=request.user, grupo=plano.grupo
            ).exists():
                raise serializers.ValidationError(
                    "Voce nao e membro do grupo deste plano."
                )
        elif plano.criador != request.user:
            raise serializers.ValidationError(
                "Voce nao tem acesso a este plano."
            )

        return data


class RefeicaoWriteSerializer(serializers.ModelSerializer):
    """Serializer simplificado para criacao de refeicoes inline."""

    class Meta:
        model = Refeicao
        fields = ("receita", "dia_da_semana", "tipo_refeicao")


class PlanoSemanalListSerializer(serializers.ModelSerializer):
    criador_nome = serializers.CharField(source="criador.nome", read_only=True)
    grupo = GrupoResumoSerializer(read_only=True)
    total_refeicoes = serializers.SerializerMethodField()

    class Meta:
        model = PlanoSemanal
        fields = (
            "id",
            "semana_referencia",
            "criador_nome",
            "grupo",
            "total_refeicoes",
            "updated_at",
        )

    def get_total_refeicoes(self, obj) -> int:
        return obj.refeicoes.count()


class PlanoSemanalDetailSerializer(serializers.ModelSerializer):
    criador_nome = serializers.CharField(source="criador.nome", read_only=True)
    grupo_detail = GrupoResumoSerializer(source="grupo", read_only=True)
    refeicoes = RefeicaoSerializer(many=True, read_only=True)

    class Meta:
        model = PlanoSemanal
        fields = (
            "id",
            "semana_referencia",
            "criador_nome",
            "grupo",
            "grupo_detail",
            "refeicoes",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "criador_nome")

    def validate_grupo(self, value):
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
