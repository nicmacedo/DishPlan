from django.contrib import admin

from .models import ItemCompra, ListaCompra


class ItemCompraInline(admin.TabularInline):
    model = ItemCompra
    extra = 1
    autocomplete_fields = ["ingrediente"]


@admin.register(ListaCompra)
class ListaCompraAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "data",
        "criador",
        "grupo",
        "plano_semanal",
        "progresso_total",
        "updated_at",
    )
    list_filter = ("data", "grupo")
    search_fields = ("criador__email", "grupo__nome")
    autocomplete_fields = ["criador", "grupo", "plano_semanal"]
    readonly_fields = ("data", "created_at", "updated_at", "progresso_total")
    inlines = [ItemCompraInline]


@admin.register(ItemCompra)
class ItemCompraAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "nome_display",
        "quantidade",
        "unidade",
        "comprado",
        "lista_compra",
    )
    list_filter = ("comprado",)
    autocomplete_fields = ["lista_compra", "ingrediente"]
