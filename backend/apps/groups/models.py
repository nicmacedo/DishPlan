from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class Grupo(models.Model):
    """Representa uma família ou grupo de amigos que compartilham recursos."""

    nome = models.CharField(_("nome"), max_length=150)
    created_at = models.DateTimeField(_("criado em"), auto_now_add=True)

    class Meta:
        verbose_name = _("grupo")
        verbose_name_plural = _("grupos")
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.nome


class GrupoMembro(models.Model):
    """Gerencia quem pertence a qual grupo e com qual papel."""

    class Papel(models.TextChoices):
        DONO = "dono", _("Dono")
        MEMBRO = "membro", _("Membro")

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="membros_grupo",
        verbose_name=_("usuario"),
    )
    grupo = models.ForeignKey(
        Grupo,
        on_delete=models.CASCADE,
        related_name="membros",
        verbose_name=_("grupo"),
    )
    papel = models.CharField(
        _("papel"),
        max_length=10,
        choices=Papel.choices,
        default=Papel.MEMBRO,
    )
    created_at = models.DateTimeField(_("adicionado em"), auto_now_add=True)

    class Meta:
        verbose_name = _("membro do grupo")
        verbose_name_plural = _("membros do grupo")
        constraints = [
            models.UniqueConstraint(
                fields=["usuario", "grupo"],
                name="unique_usuario_grupo",
            )
        ]
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"{self.usuario} — {self.grupo} ({self.papel})"
