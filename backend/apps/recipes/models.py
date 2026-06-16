from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class Ingrediente(models.Model):
    """Cadastro global de ingredientes com categorias para filtragem."""

    class Categoria(models.TextChoices):
        CARNES = "carnes", _("Carnes")
        HORTIFRUTI = "hortifruti", _("Hortifrúti")
        LATICINIOS = "laticinios", _("Laticínios")
        GRAOS_CEREAIS = "graos_cereais", _("Grãos e Cereais")
        TEMPEROS = "temperos", _("Temperos e Condimentos")
        BEBIDAS = "bebidas", _("Bebidas")
        PADARIA = "padaria", _("Padaria")
        ENLATADOS = "enlatados", _("Enlatados e Conservas")
        CONGELADOS = "congelados", _("Congelados")
        DOCES = "doces", _("Doces e Sobremesas")
        OUTROS = "outros", _("Outros")

    nome = models.CharField(_("nome"), max_length=150, unique=True)
    categoria = models.CharField(
        _("categoria"),
        max_length=20,
        choices=Categoria.choices,
        default=Categoria.OUTROS,
    )

    class Meta:
        verbose_name = _("ingrediente")
        verbose_name_plural = _("ingredientes")
        ordering = ["nome"]

    def __str__(self) -> str:
        return self.nome


class Receita(models.Model):
    """Receita criada por um usuario, opcionalmente vinculada a um grupo."""

    class Dificuldade(models.TextChoices):
        FACIL = "facil", _("Fácil")
        MEDIO = "medio", _("Médio")
        DIFICIL = "dificil", _("Difícil")

    criador = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="receitas",
        verbose_name=_("criador"),
    )
    grupo = models.ForeignKey(
        "groups.Grupo",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="receitas",
        verbose_name=_("grupo"),
    )
    titulo = models.CharField(_("titulo"), max_length=255)
    descricao = models.TextField(_("descricao"), blank=True, default="")
    modo_preparo = models.TextField(_("modo de preparo"), blank=True, default="")
    dificuldade = models.CharField(
        _("dificuldade"),
        max_length=10,
        choices=Dificuldade.choices,
        default=Dificuldade.FACIL,
    )
    tempo_preparo = models.PositiveIntegerField(
        _("tempo de preparo (min)"), null=True, blank=True
    )
    porcoes = models.PositiveIntegerField(
        _("porcoes"), null=True, blank=True
    )
    # Imagem armazenada como data URI base64 (ex: "data:image/jpeg;base64,...")
    # Máximo recomendado: 5 MB antes da codificação.
    imagem = models.TextField(_("imagem"), null=True, blank=True)
    is_publica = models.BooleanField(
        _("pública"),
        default=False,
        help_text=_("Receitas públicas são visíveis para todos os usuários."),
    )

    ingredientes = models.ManyToManyField(
        Ingrediente,
        through="IngredienteReceita",
        related_name="receitas",
        verbose_name=_("ingredientes"),
    )

    created_at = models.DateTimeField(_("criado em"), auto_now_add=True)
    updated_at = models.DateTimeField(_("atualizado em"), auto_now=True)

    class Meta:
        verbose_name = _("receita")
        verbose_name_plural = _("receitas")
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.titulo


class IngredienteReceita(models.Model):
    """Tabela intermediaria ligando ingredientes a receitas com quantidade e unidade."""

    receita = models.ForeignKey(
        Receita,
        on_delete=models.CASCADE,
        related_name="ingredientes_receita",
        verbose_name=_("receita"),
    )
    ingrediente = models.ForeignKey(
        Ingrediente,
        on_delete=models.CASCADE,
        related_name="receitas_ingrediente",
        verbose_name=_("ingrediente"),
    )
    quantidade = models.FloatField(_("quantidade"))
    unidade = models.CharField(_("unidade"), max_length=30, blank=True, default="")

    class Meta:
        verbose_name = _("ingrediente da receita")
        verbose_name_plural = _("ingredientes da receita")
        constraints = [
            models.UniqueConstraint(
                fields=["receita", "ingrediente"],
                name="unique_receita_ingrediente",
            )
        ]

    def __str__(self) -> str:
        return f"{self.quantidade} {self.unidade} de {self.ingrediente} ({self.receita})"


class CompartilhamentoReceita(models.Model):
    """Compartilha uma receita pessoal com um grupo especifico."""

    receita = models.ForeignKey(
        Receita,
        on_delete=models.CASCADE,
        related_name="compartilhamentos",
        verbose_name=_("receita"),
    )
    grupo = models.ForeignKey(
        "groups.Grupo",
        on_delete=models.CASCADE,
        related_name="receitas_compartilhadas",
        verbose_name=_("grupo"),
    )
    data_compartilhamento = models.DateTimeField(
        _("data de compartilhamento"), auto_now_add=True
    )

    class Meta:
        verbose_name = _("compartilhamento de receita")
        verbose_name_plural = _("compartilhamentos de receita")
        constraints = [
            models.UniqueConstraint(
                fields=["receita", "grupo"],
                name="unique_compartilhamento_receita_grupo",
            )
        ]

    def __str__(self) -> str:
        return f"{self.receita} → {self.grupo}"
