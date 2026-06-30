from django.contrib import admin
from django.http import HttpRequest

from .models import ShopSettings


@admin.register(ShopSettings)
class ShopSettingsAdmin(admin.ModelAdmin):
    """Singleton admin — no add/delete, just edit the one row."""

    fieldsets = (
        ("Основное", {"fields": ("shop_name", "city", "working_hours", "is_accepting_orders")}),
        ("Контакты", {"fields": ("whatsapp_number", "pickup_address")}),
        (
            "Заказы и доставка",
            {"fields": ("currency", "min_order_amount", "delivery_is_free", "delivery_fee")},
        ),
    )

    def has_add_permission(self, request: HttpRequest) -> bool:
        return not ShopSettings.objects.exists()

    def has_delete_permission(self, request: HttpRequest, obj=None) -> bool:
        return False
