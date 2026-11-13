"""Catalog serializers (read-only public API)."""
from rest_framework import serializers

from .models import Banner, Category, Product, ProductVariant


class RelativeImageMixin(serializers.Serializer):
    """Returns the media-relative URL (e.g. /media/...) so the frontend can
    resolve it against the public host — avoids leaking internal Docker hosts
    during server-side rendering."""

    image = serializers.SerializerMethodField()

    def get_image(self, obj) -> str | None:
        return obj.image.url if obj.image else None


class CategorySerializer(RelativeImageMixin, serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "image", "sort_order", "is_addon"]
        read_only_fields = fields


class BannerSerializer(RelativeImageMixin, serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="slug", read_only=True)

    class Meta:
        model = Banner
        fields = ["id", "title", "subtitle", "button_text", "image", "category", "sort_order"]
        read_only_fields = fields


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ["id", "label", "weight", "price"]
        read_only_fields = fields


class ProductSerializer(RelativeImageMixin, serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="slug", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    variants = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    weight = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "price",
            "weight",
            "image",
            "is_popular",
            "is_active",
            "category",
            "category_name",
            "variants",
        ]
        read_only_fields = fields

    def _active_variants(self, obj: Product) -> list[ProductVariant]:
        # obj.variants is prefetched by the viewset; filter in Python so we
        # reuse that prefetch instead of issuing a new query per product.
        return sorted(
            (v for v in obj.variants.all() if v.is_active),
            key=lambda v: (v.sort_order, v.price),
        )

    def get_variants(self, obj: Product):
        return ProductVariantSerializer(self._active_variants(obj), many=True).data

    def _storefront_variant(self, obj: Product) -> ProductVariant | None:
        """Prefer the large (~400 г) portion — storefront sells only that size."""
        variants = self._active_variants(obj)
        if not variants:
            return None
        for variant in variants:
            label = (variant.label or "").lower()
            if variant.weight == 400 or "больш" in label or "large" in label:
                return variant
        return max(variants, key=lambda v: (v.weight or 0, v.price))

    def get_price(self, obj: Product):
        variant = self._storefront_variant(obj)
        return variant.price if variant else obj.price

    def get_weight(self, obj: Product):
        variant = self._storefront_variant(obj)
        return variant.weight if variant else obj.weight
