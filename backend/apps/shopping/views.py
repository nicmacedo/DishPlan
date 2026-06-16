from django.db.models import Q
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.groups.models import GrupoMembro
from apps.groups.permissions import IsOwnerOrGroupMember
from apps.planning.models import PlanoSemanal

from .models import ItemCompra, ListaCompra
from .serializers import (
    ItemCompraSerializer,
    ItemCompraToggleSerializer,
    ListaCompraDetailSerializer,
    ListaCompraListSerializer,
)
from .services import gerar_lista_compras


class ListaCompraViewSet(viewsets.ModelViewSet):
    """
    CRUD de listas de compras.
    Inclui acao customizada para gerar automaticamente a partir de um plano semanal.
    """

    filterset_fields = ["plano_semanal", "grupo"]

    def get_serializer_class(self):
        if self.action == "list":
            return ListaCompraListSerializer
        return ListaCompraDetailSerializer

    def get_queryset(self):
        user = self.request.user
        grupos_ids = GrupoMembro.objects.filter(
            usuario=user
        ).values_list("grupo_id", flat=True)

        return (
            ListaCompra.objects.filter(
                Q(criador=user, grupo__isnull=True)
                | Q(grupo_id__in=grupos_ids)
            )
            .select_related("criador", "grupo", "plano_semanal")
            .prefetch_related("itens__ingrediente")
            .distinct()
        )

    def get_permissions(self):
        if self.action in ("update", "partial_update", "destroy"):
            return [permissions.IsAuthenticated(), IsOwnerOrGroupMember()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=["post"], url_path="gerar")
    def gerar_a_partir_do_plano(self, request):
        """
        Gera automaticamente uma lista de compras a partir do plano semanal.
        Body: { "plano_semanal": <id> }
        """
        plano_id = request.data.get("plano_semanal")
        if not plano_id:
            return Response(
                {"detail": "Campo 'plano_semanal' e obrigatorio."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            plano = PlanoSemanal.objects.get(id=plano_id)
        except PlanoSemanal.DoesNotExist:
            return Response(
                {"detail": "Plano semanal nao encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Verificar acesso ao plano
        if plano.grupo:
            if not GrupoMembro.objects.filter(
                usuario=request.user, grupo=plano.grupo
            ).exists():
                return Response(
                    {"detail": "Voce nao e membro do grupo deste plano."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        elif plano.criador != request.user:
            return Response(
                {"detail": "Voce nao tem acesso a este plano."},
                status=status.HTTP_403_FORBIDDEN,
            )

        lista = gerar_lista_compras(plano)
        serializer = ListaCompraDetailSerializer(
            lista, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ItemCompraViewSet(viewsets.ModelViewSet):
    """
    CRUD de itens de compra.
    Inclui PATCH otimizado para toggle de 'comprado' (debounce-friendly).
    """

    serializer_class = ItemCompraSerializer
    filterset_fields = ["lista_compra", "comprado"]

    def get_queryset(self):
        user = self.request.user
        grupos_ids = GrupoMembro.objects.filter(
            usuario=user
        ).values_list("grupo_id", flat=True)

        return (
            ItemCompra.objects.filter(
                Q(lista_compra__criador=user, lista_compra__grupo__isnull=True)
                | Q(lista_compra__grupo_id__in=grupos_ids)
            )
            .select_related("ingrediente", "lista_compra")
            .distinct()
        )

    def get_serializer_class(self):
        if self.action in ("partial_update",):
            return ItemCompraToggleSerializer
        return ItemCompraSerializer

    @action(detail=True, methods=["patch"], url_path="toggle")
    def toggle_comprado(self, request, pk=None):
        """Toggle otimizado para a flag comprado."""
        item = self.get_object()
        item.comprado = not item.comprado
        item.save(update_fields=["comprado"])
        return Response(
            ItemCompraToggleSerializer(item).data,
            status=status.HTTP_200_OK,
        )
