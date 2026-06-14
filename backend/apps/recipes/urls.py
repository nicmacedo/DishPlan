from rest_framework.routers import DefaultRouter

from .views import (
    CompartilhamentoReceitaViewSet,
    IngredienteViewSet,
    ReceitaViewSet,
)

router = DefaultRouter()
router.register(r"ingredientes", IngredienteViewSet, basename="ingrediente")
router.register(r"receitas", ReceitaViewSet, basename="receita")
router.register(
    r"compartilhamentos", CompartilhamentoReceitaViewSet, basename="compartilhamento"
)

urlpatterns = router.urls
