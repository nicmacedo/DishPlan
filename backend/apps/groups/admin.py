from django.contrib import admin

from .models import Grupo, GrupoMembro


class GrupoMembroInline(admin.TabularInline):
    model = GrupoMembro
    extra = 1
    autocomplete_fields = ["usuario"]
    readonly_fields = ("created_at",)


@admin.register(Grupo)
class GrupoAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "total_membros", "created_at")
    search_fields = ("nome",)
    readonly_fields = ("created_at",)
    inlines = [GrupoMembroInline]

    @admin.display(description="Membros")
    def total_membros(self, obj):
        return obj.membros.count()


@admin.register(GrupoMembro)
class GrupoMembroAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "grupo", "papel", "created_at")
    list_filter = ("papel", "grupo")
    autocomplete_fields = ["usuario", "grupo"]
    readonly_fields = ("created_at",)
