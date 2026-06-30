"""Orders domain: orders and their line items."""
from __future__ import annotations

from decimal import Decimal

from django.db import models

from apps.catalog.models import Product
from apps.core.models import TimeStampedModel


class DeliveryType(models.TextChoices):
    DELIVERY = "delivery", "Доставка"
    PICKUP = "pickup", "Самовывоз"


class OrderStatus(models.TextChoices):
    NEW = "new", "Новый"
    CONFIRMED = "confirmed", "Подтверждён"
    DELIVERING = "delivering", "Доставляется"
    DONE = "done", "Выполнен"
    CANCELED = "canceled", "Отменён"


class Order(TimeStampedModel):
    number = models.PositiveIntegerField("Номер", unique=True, editable=False)
    delivery_type = models.CharField(
        "Способ получения", max_length=16, choices=DeliveryType.choices
    )
    status = models.CharField(
        "Статус",
        max_length=16,
        choices=OrderStatus.choices,
        default=OrderStatus.NEW,
        db_index=True,
    )

    # Customer details (conditionally required, see service layer).
    customer_name = models.CharField("Имя", max_length=120, blank=True)
    phone = models.CharField("Телефон", max_length=32, blank=True)
    address = models.CharField("Адрес доставки", max_length=255, blank=True)
    comment = models.TextField("Комментарий", blank=True)

    total_amount = models.DecimalField(
        "Сумма", max_digits=10, decimal_places=2, default=Decimal("0")
    )

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Заказ #{self.number}"

    def save(self, *args, **kwargs):
        if not self.number:
            self.number = self._next_number()
        super().save(*args, **kwargs)

    @staticmethod
    def _next_number() -> int:
        last = Order.objects.order_by("-number").values_list("number", flat=True).first()
        return (last or 1000) + 1


class OrderItem(TimeStampedModel):
    order = models.ForeignKey(
        Order, related_name="items", on_delete=models.CASCADE, verbose_name="Заказ"
    )
    product = models.ForeignKey(
        Product,
        related_name="order_items",
        on_delete=models.SET_NULL,
        null=True,
        verbose_name="Товар",
    )
    # Snapshots — keep history stable even if the product later changes.
    product_name = models.CharField("Название", max_length=160)
    price = models.DecimalField("Цена", max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField("Количество")

    class Meta:
        verbose_name = "Позиция заказа"
        verbose_name_plural = "Позиции заказа"
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"{self.product_name} ×{self.quantity}"

    @property
    def line_total(self) -> Decimal:
        return self.price * self.quantity
