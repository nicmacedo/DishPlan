from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from .managers import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("e-mail"), unique=True)
    nome = models.CharField(_("nome"), max_length=150)
    data_nascimento = models.DateField(_("data de nascimento"), null=True, blank=True)

    google_sub = models.CharField(
        _("google subject id"),
        max_length=255,
        unique=True,
        null=True,
        blank=True,
        help_text=_("ID do usuario no Google (preenchido em login via OAuth)."),
    )

    is_active = models.BooleanField(_("ativo"), default=True)
    is_staff = models.BooleanField(_("staff"), default=False)

    created_at = models.DateTimeField(_("criado em"), auto_now_add=True)
    updated_at = models.DateTimeField(_("atualizado em"), auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nome"]

    class Meta:
        verbose_name = _("usuario")
        verbose_name_plural = _("usuarios")
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.email

    def get_full_name(self) -> str:
        return self.nome

    def get_short_name(self) -> str:
        return self.nome.split(" ")[0] if self.nome else self.email
