from rest_framework.routers import DefaultRouter

from .views import ItemCompraViewSet, ListaCompraViewSet

router = DefaultRouter()
router.register(r"listas", ListaCompraViewSet, basename="lista-compra")
router.register(r"itens", ItemCompraViewSet, basename="item-compra")

urlpatterns = router.urls
