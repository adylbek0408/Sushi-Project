"""Catalog serializers (read-only public API)."""
from rest_framework import serializers

from .models import Banner, Category, Product


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


class ProductSerializer(RelativeImageMixin, serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="slug", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)

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
        ]
        read_only_fields = fields
