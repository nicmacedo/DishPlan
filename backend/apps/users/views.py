from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

from .serializers import RegisterSerializer

User = get_user_model()


class FixedOAuth2Client(OAuth2Client):
    """
    Compatibilidade entre dj-rest-auth 7.x e django-allauth 0.56+.
    O dj-rest-auth passa 'scope' como 7° argumento posicional enquanto o allauth
    0.56+ renomeou esse parâmetro para 'scope_delimiter', causando o erro
    "multiple values for argument 'scope_delimiter'".
    Esta subclasse absorve o 'scope' posicional e o descarta corretamente.
    """

    def __init__(
        self,
        request,
        consumer_key,
        consumer_secret,
        access_token_method,
        access_token_url,
        callback_url,
        scope=None,           # argumento posicional legado do dj-rest-auth
        scope_delimiter=" ",  # argumento keyword do allauth moderno
        headers=None,
        basic_auth=False,
    ):
        super().__init__(
            request,
            consumer_key,
            consumer_secret,
            access_token_method,
            access_token_url,
            callback_url,
            scope_delimiter=scope_delimiter,
            headers=headers,
            basic_auth=basic_auth,
        )

class CsrfTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return Response({"detail": "CSRF cookie definido."})


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"detail": "Conta criada com sucesso.", "email": user.email},
            status=status.HTTP_201_CREATED,
        )

class GoogleLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "postmessage"
    client_class = FixedOAuth2Client
