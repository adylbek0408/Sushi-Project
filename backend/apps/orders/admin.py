from django.contrib import admin
from django.utils.html import format_html

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False
    readonly_fields = ("product_name", "price", "quantity", "line_total")
    fields = ("product_name", "price", "quantity", "line_total")

    @admin.display(description="Сумма")
    def line_total(self, obj: OrderItem):
        return obj.line_total

    def has_add_permission(self, request, obj=None) -> bool:
        return False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "number",
        "status_badge",
        "delivery_type",
        "recipient",
        "total_amount",
        "created_at",
    )
    list_filter = ("status", "delivery_type", "created_at")
    search_fields = ("number", "customer_name", "phone", "address")
    readonly_fields = (
        "number",
        "delivery_type",
        "customer_name",
        "phone",
        "address",
        "comment",
        "total_amount",
        "created_at",
        "updated_at",
    )
    fields = (
        "number",
        "status",
        "delivery_type",
        "customer_name",
        "phone",
        "address",
        "comment",
        "total_amount",
        "created_at",
    )
    inlines = [OrderItemInline]
    date_hierarchy = "created_at"

    _STATUS_COLORS = {
        "new": "#b41f00",
        "confirmed": "#0a7d28",
        "delivering": "#9a6b00",
        "done": "#5f5e5e",
        "canceled": "#ba1a1a",
    }

    @admin.display(description="Статус")
    def status_badge(self, obj: Order):
        color = self._STATUS_COLORS.get(obj.status, "#5f5e5e")
        return format_html(
            '<span style="background:{};color:#fff;padding:2px 10px;'
            'border-radius:999px;font-size:12px;">{}</span>',
            color,
            obj.get_status_display(),
        )

    @admin.display(description="Получатель")
    def recipient(self, obj: Order):
        if obj.delivery_type == "delivery":
            return obj.address or "—"
        return f"{obj.customer_name} ({obj.phone})"

    def has_add_permission(self, request) -> bool:
        return False
