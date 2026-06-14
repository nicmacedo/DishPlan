from django.db.models import Q
from rest_framework import permissions, viewsets
from rest_framework.exceptions import PermissionDenied

from apps.groups.models import GrupoMembro
from apps.groups.permissions import IsOwnerOrGroupMember

from .models import CompartilhamentoReceita, Ingrediente, Receita
from .serializers import (
    CompartilhamentoReceitaSerializer,
    IngredienteSerializer,
    ReceitaDetailSerializer,
    ReceitaListSerializer,
)


class IngredienteViewSet(viewsets.ModelViewSet):
    """
    CRUD de ingredientes.
    Ingredientes sao globais — qualquer usuario autenticado pode listar e criar.
    """

    queryset = Ingrediente.objects.all()
    serializer_class = IngredienteSerializer
    search_fields = ["nome"]
    filterset_fields = ["categoria"]

    def get_permissions(self):
        if self.action in ("destroy",):
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]


class ReceitaViewSet(viewsets.ModelViewSet):
    """
    CRUD de receitas.
    - list: retorna receitas proprias + receitas de grupos do usuario
            + receitas compartilhadas com grupos do usuario.
    - create: atribui o criador automaticamente.
    - update/destroy: somente o criador ou membro do grupo vinculado.
    """

    filterset_fields = ["dificuldade", "grupo"]
    search_fields = ["titulo", "descricao"]

    def get_serializer_class(self):
        if self.action == "list":
            return ReceitaListSerializer
        return ReceitaDetailSerializer

    def get_queryset(self):
        user = self.request.user
        grupos_ids = GrupoMembro.objects.filter(
            usuario=user
        ).values_list("grupo_id", flat=True)

        # IDs de receitas compartilhadas com grupos do usuario
        receitas_compartilhadas_ids = CompartilhamentoReceita.objects.filter(
            grupo_id__in=grupos_ids
        ).values_list("receita_id", flat=True)

        return (
            Receita.objects.filter(
                Q(criador=user)  # Receitas proprias
                | Q(grupo_id__in=grupos_ids)  # Receitas de grupos
                | Q(id__in=receitas_compartilhadas_ids)  # Compartilhadas
            )
            .select_related("criador", "grupo")
            .prefetch_related("ingredientes_receita__ingrediente")
            .distinct()
        )

    def get_permissions(self):
        if self.action in ("update", "partial_update", "destroy"):
            return [permissions.IsAuthenticated(), IsOwnerOrGroupMember()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(criador=self.request.user)


class CompartilhamentoReceitaViewSet(viewsets.ModelViewSet):
    """
    CRUD de compartilhamentos de receita.
    Somente o criador da receita pode compartilha-la.
    """

    serializer_class = CompartilhamentoReceitaSerializer

    def get_queryset(self):
        user = self.request.user
        return (
            CompartilhamentoReceita.objects.filter(receita__criador=user)
            .select_related("receita", "grupo")
        )

    def perform_destroy(self, instance):
        if instance.receita.criador != self.request.user:
            raise PermissionDenied(
                "Somente o criador da receita pode remover compartilhamentos."
            )
        instance.delete()
