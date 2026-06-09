from django.urls import include, path

from .views import CsrfTokenView, GoogleLoginView, RegisterView

urlpatterns = [
    path("csrf/", CsrfTokenView.as_view(), name="auth-csrf"),
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("social/google/", GoogleLoginView.as_view(), name="auth-google"),
    path("", include("dj_rest_auth.urls")),
]
