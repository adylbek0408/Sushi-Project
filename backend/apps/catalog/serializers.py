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
        fields = ["id", "name", "slug", "image", "sort_order"]
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

    def get_price(self, obj: Product):
        variants = self._active_variants(obj)
        return variants[0].price if variants else obj.price

    def get_weight(self, obj: Product):
        variants = self._active_variants(obj)
        return variants[0].weight if variants else obj.weight
