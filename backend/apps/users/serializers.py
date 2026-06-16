from django.contrib.auth import get_user_model
from rest_framework import serializers
from allauth.account.models import EmailAddress

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "nome", "data_nascimento")
        read_only_fields = ("id", "email")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=6,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = ("email", "nome", "data_nascimento", "password")

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este e-mail já está cadastrado.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        EmailAddress.objects.create(
            user=user,
            email=user.email,
            primary=True,
            verified=True,
        )
        return user
