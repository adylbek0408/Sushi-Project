"""Serializers for storefront configuration."""
from rest_framework import serializers

from .models import ShopSettings


class ShopSettingsSerializer(serializers.ModelSerializer):
    """Public, read-only view of the shop configuration."""

    class Meta:
        model = ShopSettings
        fields = [
            "shop_name",
            "whatsapp_number",
            "currency",
            "city",
            "pickup_address",
            "min_order_amount",
            "delivery_is_free",
            "delivery_fee",
            "working_hours",
            "is_accepting_orders",
        ]
        read_only_fields = fields
