from rest_framework.routers import DefaultRouter

from .views import PlanoSemanalViewSet, RefeicaoViewSet

router = DefaultRouter()
router.register(r"planos", PlanoSemanalViewSet, basename="plano-semanal")
router.register(r"refeicoes", RefeicaoViewSet, basename="refeicao")

urlpatterns = router.urls
