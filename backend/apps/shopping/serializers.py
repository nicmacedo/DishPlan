from rest_framework import serializers

from apps.groups.models import GrupoMembro
from apps.groups.serializers import GrupoResumoSerializer

from .models import ItemCompra, ListaCompra


class ItemCompraSerializer(serializers.ModelSerializer):
    nome_display = serializers.CharField(read_only=True)
    ingrediente_nome = serializers.CharField(
        source="ingrediente.nome", read_only=True
    )
    ingrediente_categoria = serializers.CharField(
        source="ingrediente.categoria", read_only=True, default=None
    )

    class Meta:
        model = ItemCompra
        fields = (
            "id",
            "lista_compra",
            "ingrediente",
            "ingrediente_nome",
            "ingrediente_categoria",
            "nome_manual",
            "nome_display",
            "quantidade",
            "unidade",
            "comprado",
        )
        read_only_fields = ("id", "nome_display")


class ItemCompraToggleSerializer(serializers.ModelSerializer):
    """Serializer minimo para PATCH da flag comprado (debounce-friendly)."""

    class Meta:
        model = ItemCompra
        fields = ("id", "comprado")
        read_only_fields = ("id",)


class ListaCompraListSerializer(serializers.ModelSerializer):
    progresso_total = serializers.FloatField(read_only=True)
    grupo = GrupoResumoSerializer(read_only=True)
    criador_nome = serializers.CharField(source="criador.nome", read_only=True)
    total_itens = serializers.SerializerMethodField()

    class Meta:
        model = ListaCompra
        fields = (
            "id",
            "data",
            "criador_nome",
            "grupo",
            "plano_semanal",
            "progresso_total",
            "total_itens",
            "updated_at",
        )

    def get_total_itens(self, obj) -> int:
        return obj.itens.count()


class ListaCompraDetailSerializer(serializers.ModelSerializer):
    progresso_total = serializers.FloatField(read_only=True)
    grupo_detail = GrupoResumoSerializer(source="grupo", read_only=True)
    criador_nome = serializers.CharField(source="criador.nome", read_only=True)
    itens = ItemCompraSerializer(many=True, read_only=True)

    class Meta:
        model = ListaCompra
        fields = (
            "id",
            "data",
            "criador_nome",
            "grupo",
            "grupo_detail",
            "plano_semanal",
            "progresso_total",
            "itens",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "data", "created_at", "updated_at", "criador_nome")
