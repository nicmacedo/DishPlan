from django.contrib import admin

from .models import CompartilhamentoReceita, Ingrediente, IngredienteReceita, Receita


@admin.register(Ingrediente)
class IngredienteAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "categoria")
    list_filter = ("categoria",)
    search_fields = ("nome",)


class IngredienteReceitaInline(admin.TabularInline):
    model = IngredienteReceita
    extra = 1
    autocomplete_fields = ["ingrediente"]


@admin.register(Receita)
class ReceitaAdmin(admin.ModelAdmin):
    list_display = ("id", "titulo", "criador", "grupo", "dificuldade", "created_at")
    list_filter = ("dificuldade", "grupo")
    search_fields = ("titulo", "descricao")
    autocomplete_fields = ["criador", "grupo"]
    readonly_fields = ("created_at", "updated_at")
    inlines = [IngredienteReceitaInline]


@admin.register(CompartilhamentoReceita)
class CompartilhamentoReceitaAdmin(admin.ModelAdmin):
    list_display = ("id", "receita", "grupo", "data_compartilhamento")
    list_filter = ("grupo",)
    autocomplete_fields = ["receita", "grupo"]
    readonly_fields = ("data_compartilhamento",)
