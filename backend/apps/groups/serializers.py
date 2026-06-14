from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Grupo, GrupoMembro

User = get_user_model()


class GrupoMembroSerializer(serializers.ModelSerializer):
    """Serializer para exibir membros de um grupo."""

    email = serializers.EmailField(source="usuario.email", read_only=True)
    nome = serializers.CharField(source="usuario.nome", read_only=True)

    class Meta:
        model = GrupoMembro
        fields = ("id", "email", "nome", "papel", "created_at")
        read_only_fields = ("id", "created_at")


class GrupoSerializer(serializers.ModelSerializer):
    """Serializer para CRUD de grupos."""

    membros = GrupoMembroSerializer(many=True, read_only=True)
    meu_papel = serializers.SerializerMethodField()

    class Meta:
        model = Grupo
        fields = ("id", "nome", "created_at", "membros", "meu_papel")
        read_only_fields = ("id", "created_at")

    def get_meu_papel(self, obj) -> str | None:
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            membro = obj.membros.filter(usuario=request.user).first()
            if membro:
                return membro.papel
        return None


class AdicionarMembroSerializer(serializers.Serializer):
    """Serializer para convidar/adicionar um membro ao grupo via email."""

    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "Nenhum usuario encontrado com este e-mail."
            )
        return value


class GrupoResumoSerializer(serializers.ModelSerializer):
    """Serializer resumido de grupo para uso em nested responses."""

    class Meta:
        model = Grupo
        fields = ("id", "nome")
        read_only_fields = ("id", "nome")
