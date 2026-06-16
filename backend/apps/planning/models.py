from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class PlanoSemanal(models.Model):
    """Plano semanal de refeicoes, pessoal ou compartilhado com grupo."""

    criador = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="planos_semanais",
        verbose_name=_("criador"),
    )
    grupo = models.ForeignKey(
        "groups.Grupo",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="planos_semanais",
        verbose_name=_("grupo"),
    )
    semana_referencia = models.DateField(
        _("semana de referencia"),
        help_text=_("Data da segunda-feira da semana."),
    )
    updated_at = models.DateTimeField(_("atualizado em"), auto_now=True)
    created_at = models.DateTimeField(_("criado em"), auto_now_add=True)

    class Meta:
        verbose_name = _("plano semanal")
        verbose_name_plural = _("planos semanais")
        ordering = ["-semana_referencia"]
        constraints = [
            models.UniqueConstraint(
                fields=["criador", "semana_referencia"],
                condition=models.Q(grupo__isnull=True),
                name="unique_plano_pessoal_por_semana",
            ),
            models.UniqueConstraint(
                fields=["grupo", "semana_referencia"],
                condition=models.Q(grupo__isnull=False),
                name="unique_plano_grupo_por_semana",
            ),
        ]

    def __str__(self) -> str:
        label = self.grupo.nome if self.grupo else self.criador.email
        return f"Plano {self.semana_referencia} — {label}"


class Refeicao(models.Model):
    """Mapeia uma receita para um dia/turno do plano semanal."""

    class DiaSemana(models.TextChoices):
        SEGUNDA = "segunda", _("Segunda-feira")
        TERCA = "terca", _("Terça-feira")
        QUARTA = "quarta", _("Quarta-feira")
        QUINTA = "quinta", _("Quinta-feira")
        SEXTA = "sexta", _("Sexta-feira")
        SABADO = "sabado", _("Sábado")
        DOMINGO = "domingo", _("Domingo")

    class TipoRefeicao(models.TextChoices):
        CAFE = "cafe", _("Café da Manhã")
        ALMOCO = "almoco", _("Almoço")
        LANCHE = "lanche", _("Lanche")
        JANTAR = "jantar", _("Jantar")
        CEIA = "ceia", _("Ceia")

    plano_semanal = models.ForeignKey(
        PlanoSemanal,
        on_delete=models.CASCADE,
        related_name="refeicoes",
        verbose_name=_("plano semanal"),
    )
    receita = models.ForeignKey(
        "recipes.Receita",
        on_delete=models.CASCADE,
        related_name="refeicoes",
        verbose_name=_("receita"),
    )
    dia_da_semana = models.CharField(
        _("dia da semana"),
        max_length=10,
        choices=DiaSemana.choices,
    )
    tipo_refeicao = models.CharField(
        _("tipo de refeicao"),
        max_length=10,
        choices=TipoRefeicao.choices,
    )

    class Meta:
        verbose_name = _("refeicao")
        verbose_name_plural = _("refeicoes")
        constraints = [
            models.UniqueConstraint(
                fields=["plano_semanal", "dia_da_semana", "tipo_refeicao", "receita"],
                name="unique_refeicao_slot_receita",
            )
        ]

    def __str__(self) -> str:
        return (
            f"{self.get_dia_da_semana_display()} - "
            f"{self.get_tipo_refeicao_display()}: {self.receita.titulo}"
        )
