"""Filters for catalog endpoints."""
import django_filters as filters

from .models import Product


class ProductFilter(filters.FilterSet):
    """Filter products by category slug and popularity."""

    category = filters.CharFilter(field_name="category__slug", lookup_expr="exact")
    is_popular = filters.BooleanFilter(field_name="is_popular")

    class Meta:
        model = Product
        fields = ["category", "is_popular"]
