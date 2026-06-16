from django.contrib.auth import get_user_model
from django.db import IntegrityError
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Grupo, GrupoMembro
from .permissions import IsGroupMember, IsGroupOwner
from .serializers import (
    AdicionarMembroSerializer,
    GrupoMembroSerializer,
    GrupoSerializer,
)

User = get_user_model()


class GrupoViewSet(viewsets.ModelViewSet):
    """
    CRUD de grupos.
    - list: retorna apenas os grupos dos quais o usuario e membro.
    - create: cria o grupo e adiciona o usuario como dono.
    - retrieve/update/destroy: verificam permissao de membro/dono.
    """

    serializer_class = GrupoSerializer

    def get_queryset(self):
        return (
            Grupo.objects.filter(membros__usuario=self.request.user)
            .prefetch_related("membros__usuario")
            .distinct()
        )

    def get_permissions(self):
        if self.action in ("update", "partial_update", "destroy"):
            return [permissions.IsAuthenticated(), IsGroupOwner()]
        if self.action in ("retrieve",):
            return [permissions.IsAuthenticated(), IsGroupMember()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        grupo = serializer.save()
        GrupoMembro.objects.create(
            usuario=self.request.user,
            grupo=grupo,
            papel=GrupoMembro.Papel.DONO,
        )

    # ---------- Ações customizadas ----------

    @action(detail=True, methods=["post"], url_path="membros")
    def adicionar_membro(self, request, pk=None):
        """Adiciona um membro ao grupo (somente o dono pode)."""
        grupo = self.get_object()

        # Verificar se o usuario atual e dono
        if not GrupoMembro.objects.filter(
            usuario=request.user,
            grupo=grupo,
            papel=GrupoMembro.Papel.DONO,
        ).exists():
            return Response(
                {"detail": "Somente o dono pode adicionar membros."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = AdicionarMembroSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        usuario = User.objects.get(email=serializer.validated_data["email"])

        try:
            membro = GrupoMembro.objects.create(
                usuario=usuario,
                grupo=grupo,
                papel=GrupoMembro.Papel.MEMBRO,
            )
        except IntegrityError:
            return Response(
                {"detail": "Este usuario ja e membro do grupo."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            GrupoMembroSerializer(membro).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["delete"], url_path="membros/(?P<membro_id>[^/.]+)")
    def remover_membro(self, request, pk=None, membro_id=None):
        """Remove um membro do grupo (dono pode remover qualquer um; membro pode sair)."""
        grupo = self.get_object()

        try:
            membro = GrupoMembro.objects.get(id=membro_id, grupo=grupo)
        except GrupoMembro.DoesNotExist:
            return Response(
                {"detail": "Membro nao encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )

        is_dono = GrupoMembro.objects.filter(
            usuario=request.user,
            grupo=grupo,
            papel=GrupoMembro.Papel.DONO,
        ).exists()

        # Membro saindo do grupo por conta propria
        is_self = membro.usuario == request.user

        if not is_dono and not is_self:
            return Response(
                {"detail": "Sem permissao para remover este membro."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Dono nao pode ser removido (deve excluir o grupo)
        if membro.papel == GrupoMembro.Papel.DONO:
            return Response(
                {"detail": "O dono nao pode ser removido. Exclua o grupo."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        membro.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
