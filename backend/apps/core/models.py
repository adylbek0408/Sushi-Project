"""Shared base models and singleton shop configuration."""
from __future__ import annotations

import uuid

from django.core.exceptions import ValidationError
from django.db import models


class TimeStampedModel(models.Model):
    """Abstract base: UUID primary key + created/updated timestamps.

    All domain models inherit this so the API never exposes guessable
    sequential identifiers and rows carry an audit trail.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ["-created_at"]


class SingletonModel(models.Model):
    """Abstract base enforcing a single row (configuration objects)."""

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):  # pragma: no cover - guarded singleton
        raise ValidationError("Настройки магазина нельзя удалить.")

    @classmethod
    def load(cls) -> "SingletonModel":
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class ShopSettings(SingletonModel):
    """Operator-editable storefront configuration (single row)."""

    id = models.PositiveSmallIntegerField(primary_key=True, default=1, editable=False)

    shop_name = models.CharField("Название", max_length=120, default="Sushiya")
    whatsapp_number = models.CharField(
        "WhatsApp номер",
        max_length=20,
        help_text="В международном формате без '+', например 996700123456.",
        default="996700000000",
    )
    currency = models.CharField("Валюта", max_length=10, default="сом")
    city = models.CharField("Город", max_length=80, default="Бишкек")
    pickup_address = models.CharField(
        "Адрес самовывоза", max_length=255, default="ул. Киевская 49А"
    )
    min_order_amount = models.DecimalField(
        "Минимальная сумма заказа",
        max_digits=10,
        decimal_places=2,
        default=0,
    )
    delivery_is_free = models.BooleanField("Бесплатная доставка", default=True)
    delivery_fee = models.DecimalField(
        "Стоимость доставки",
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Используется только если бесплатная доставка выключена.",
    )
    working_hours = models.CharField(
        "Часы работы", max_length=120, default="10:00 – 23:00"
    )
    is_accepting_orders = models.BooleanField("Принимаем заказы", default=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Настройки магазина"
        verbose_name_plural = "Настройки магазина"

    def __str__(self) -> str:
        return "Настройки магазина"
