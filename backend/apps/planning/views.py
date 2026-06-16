from django.db.models import Q
from rest_framework import permissions, viewsets

from apps.groups.models import GrupoMembro
from apps.groups.permissions import IsOwnerOrGroupMember

from .models import PlanoSemanal, Refeicao
from .serializers import (
    PlanoSemanalDetailSerializer,
    PlanoSemanalListSerializer,
    RefeicaoSerializer,
)


class PlanoSemanalViewSet(viewsets.ModelViewSet):
    """
    CRUD de planos semanais.
    - list: planos pessoais + planos de grupos do usuario.
    - create: atribui criador automaticamente.
    """

    filterset_fields = ["semana_referencia", "grupo"]
    ordering_fields = ["semana_referencia", "updated_at"]

    def get_serializer_class(self):
        if self.action == "list":
            return PlanoSemanalListSerializer
        return PlanoSemanalDetailSerializer

    def get_queryset(self):
        user = self.request.user
        grupos_ids = GrupoMembro.objects.filter(
            usuario=user
        ).values_list("grupo_id", flat=True)

        return (
            PlanoSemanal.objects.filter(
                Q(criador=user, grupo__isnull=True)  # Planos pessoais
                | Q(grupo_id__in=grupos_ids)  # Planos de grupo
            )
            .select_related("criador", "grupo")
            .prefetch_related(
                "refeicoes__receita__criador",
                "refeicoes__receita__grupo",
            )
            .distinct()
        )

    def get_permissions(self):
        if self.action in ("update", "partial_update", "destroy"):
            return [permissions.IsAuthenticated(), IsOwnerOrGroupMember()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(criador=self.request.user)


class RefeicaoViewSet(viewsets.ModelViewSet):
    """
    CRUD de refeicoes.
    Filtravel por plano_semanal, dia_da_semana e tipo_refeicao.
    """

    serializer_class = RefeicaoSerializer
    filterset_fields = ["plano_semanal", "dia_da_semana", "tipo_refeicao"]

    def get_queryset(self):
        user = self.request.user
        grupos_ids = GrupoMembro.objects.filter(
            usuario=user
        ).values_list("grupo_id", flat=True)

        return (
            Refeicao.objects.filter(
                Q(plano_semanal__criador=user, plano_semanal__grupo__isnull=True)
                | Q(plano_semanal__grupo_id__in=grupos_ids)
            )
            .select_related(
                "plano_semanal__criador",
                "plano_semanal__grupo",
                "receita__criador",
                "receita__grupo",
            )
            .distinct()
        )
