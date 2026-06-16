from rest_framework import permissions

from .models import GrupoMembro


class IsGroupMember(permissions.BasePermission):
    """
    Permite acesso somente a membros do grupo.
    Espera que o objeto tenha um atributo `grupo` ou `id_grupo`,
    ou que o proprio objeto seja um Grupo.
    """

    def has_object_permission(self, request, view, obj):
        from .models import Grupo

        if isinstance(obj, Grupo):
            grupo = obj
        elif hasattr(obj, "grupo"):
            grupo = obj.grupo
        else:
            return False

        return GrupoMembro.objects.filter(
            usuario=request.user,
            grupo=grupo,
        ).exists()


class IsGroupOwner(permissions.BasePermission):
    """Permite acesso somente ao dono do grupo."""

    def has_object_permission(self, request, view, obj):
        from .models import Grupo

        if isinstance(obj, Grupo):
            grupo = obj
        elif hasattr(obj, "grupo"):
            grupo = obj.grupo
        else:
            return False

        return GrupoMembro.objects.filter(
            usuario=request.user,
            grupo=grupo,
            papel=GrupoMembro.Papel.DONO,
        ).exists()


class IsGroupMemberOrReadOnly(permissions.BasePermission):
    """
    Permite leitura a membros do grupo.
    Escrita somente ao dono.
    """

    def has_object_permission(self, request, view, obj):
        from .models import Grupo

        if isinstance(obj, Grupo):
            grupo = obj
        elif hasattr(obj, "grupo"):
            grupo = obj.grupo
        else:
            return False

        if request.method in permissions.SAFE_METHODS:
            return GrupoMembro.objects.filter(
                usuario=request.user,
                grupo=grupo,
            ).exists()

        return GrupoMembro.objects.filter(
            usuario=request.user,
            grupo=grupo,
            papel=GrupoMembro.Papel.DONO,
        ).exists()


class IsOwnerOrGroupMember(permissions.BasePermission):
    """
    Mixin de permissao para objetos que podem ser pessoais ou de grupo.
    - Se o objeto possui id_grupo: verifica se o usuario pertence ao grupo.
    - Se nao: verifica se o usuario e o criador.
    Usado em PlanoSemanal, ListaCompra, Receita.
    """

    creator_field = "criador"

    def has_object_permission(self, request, view, obj):
        grupo = getattr(obj, "grupo", None)
        if grupo is not None:
            return GrupoMembro.objects.filter(
                usuario=request.user,
                grupo=grupo,
            ).exists()

        criador = getattr(obj, self.creator_field, None)
        return criador == request.user
