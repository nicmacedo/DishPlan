from django.contrib import admin

from .models import PlanoSemanal, Refeicao


class RefeicaoInline(admin.TabularInline):
    model = Refeicao
    extra = 1
    autocomplete_fields = ["receita"]


@admin.register(PlanoSemanal)
class PlanoSemanalAdmin(admin.ModelAdmin):
    list_display = ("id", "semana_referencia", "criador", "grupo", "updated_at")
    list_filter = ("semana_referencia", "grupo")
    search_fields = ("criador__email", "grupo__nome")
    autocomplete_fields = ["criador", "grupo"]
    readonly_fields = ("created_at", "updated_at")
    inlines = [RefeicaoInline]


@admin.register(Refeicao)
class RefeicaoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "plano_semanal",
        "dia_da_semana",
        "tipo_refeicao",
        "receita",
    )
    list_filter = ("dia_da_semana", "tipo_refeicao")
    autocomplete_fields = ["plano_semanal", "receita"]
