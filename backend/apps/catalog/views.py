"""Read-only catalog endpoints."""
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .filters import ProductFilter
from .models import Banner, Category, Product
from .serializers import BannerSerializer, CategorySerializer, ProductSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """List/retrieve active categories ordered for display."""

    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"
    queryset = Category.objects.active()


class BannerViewSet(viewsets.ReadOnlyModelViewSet):
    """List active hero banners ordered for the slider."""

    serializer_class = BannerSerializer
    permission_classes = [AllowAny]
    queryset = Banner.objects.active().select_related("category")


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """List/retrieve products in active categories (incl. out-of-sale).

    Products with is_active=False («В продаже» unchecked in admin) still
    appear in the catalog so the storefront can show «Нет в наличии».
    Ordering still rejects inactive products via Product.objects.active().
    """

    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"
    filterset_class = ProductFilter
    search_fields = ["name", "description"]
    ordering_fields = ["price", "sort_order", "created_at"]
    queryset = (
        Product.objects.filter(category__is_active=True)
        .select_related("category")
        .prefetch_related("variants")
    )
