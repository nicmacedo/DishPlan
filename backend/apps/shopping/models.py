from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class ListaCompra(models.Model):
    """Lista de compras vinculada a um plano semanal e opcionalmente a um grupo."""

    criador = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="listas_compra",
        verbose_name=_("criador"),
    )
    grupo = models.ForeignKey(
        "groups.Grupo",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="listas_compra",
        verbose_name=_("grupo"),
    )
    plano_semanal = models.OneToOneField(
        "planning.PlanoSemanal",
        on_delete=models.CASCADE,
        related_name="lista_compra",
        verbose_name=_("plano semanal"),
    )
    data = models.DateField(_("data"), auto_now_add=True)

    created_at = models.DateTimeField(_("criado em"), auto_now_add=True)
    updated_at = models.DateTimeField(_("atualizado em"), auto_now=True)

    class Meta:
        verbose_name = _("lista de compras")
        verbose_name_plural = _("listas de compras")
        ordering = ["-data"]

    def __str__(self) -> str:
        return f"Lista {self.data} — {self.plano_semanal}"

    @property
    def progresso_total(self) -> float:
        """Calcula o progresso da lista (% de itens comprados)."""
        total = self.itens.count()
        if total == 0:
            return 0.0
        comprados = self.itens.filter(comprado=True).count()
        return round((comprados / total) * 100, 1)


class ItemCompra(models.Model):
    """Item individual da lista de compras."""

    lista_compra = models.ForeignKey(
        ListaCompra,
        on_delete=models.CASCADE,
        related_name="itens",
        verbose_name=_("lista de compras"),
    )
    ingrediente = models.ForeignKey(
        "recipes.Ingrediente",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="itens_compra",
        verbose_name=_("ingrediente"),
    )
    nome_manual = models.CharField(
        _("nome manual"),
        max_length=200,
        blank=True,
        default="",
        help_text=_("Nome para itens avulsos (sem vinculo a ingrediente)."),
    )
    quantidade = models.FloatField(_("quantidade"), default=1.0)
    unidade = models.CharField(_("unidade"), max_length=30, blank=True, default="")
    comprado = models.BooleanField(_("comprado"), default=False)

    class Meta:
        verbose_name = _("item de compra")
        verbose_name_plural = _("itens de compra")
        ordering = ["comprado", "id"]

    def __str__(self) -> str:
        nome = self.ingrediente.nome if self.ingrediente else self.nome_manual
        status = "✓" if self.comprado else "○"
        return f"{status} {self.quantidade} {self.unidade} {nome}"

    @property
    def nome_display(self) -> str:
        if self.ingrediente:
            return self.ingrediente.nome
        return self.nome_manual
