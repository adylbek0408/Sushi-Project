"""Order business logic.

The service layer keeps domain rules (validation, server-side pricing,
atomic persistence) out of views and serializers, following SOLID's
single-responsibility principle.
"""
from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal
from typing import Iterable

from django.db import transaction

from apps.catalog.models import Product, ProductVariant
from apps.core.models import ShopSettings

from .models import DeliveryType, Order, OrderItem
from .telegram import notify_new_order


class OrderValidationError(Exception):
    """Domain-level validation error (maps to HTTP 400)."""

    def __init__(self, errors: dict):
        self.errors = errors
        super().__init__(str(errors))


@dataclass(frozen=True)
class OrderItemInput:
    product_id: str
    quantity: int
    variant_id: str | None = None


@dataclass(frozen=True)
class OrderInput:
    delivery_type: str
    items: list[OrderItemInput]
    customer_name: str = ""
    phone: str = ""
    address: str = ""
    comment: str = ""


class OrderService:
    """Creates orders with server-authoritative pricing and validation."""

    def __init__(self, settings: ShopSettings | None = None):
        self._settings = settings or ShopSettings.load()

    @transaction.atomic
    def create_order(self, data: OrderInput) -> Order:
        if not self._settings.is_accepting_orders:
            raise OrderValidationError({"detail": "Магазин временно не принимает заказы."})

        self._validate_contact(data)
        products = self._load_products(data.items)
        variants = self._load_variants(data.items, products)
        total = self._compute_total(data.items, products, variants)
        self._validate_minimum(total)

        order = Order.objects.create(
            delivery_type=data.delivery_type,
            customer_name=data.customer_name.strip(),
            phone=data.phone.strip(),
            address=data.address.strip(),
            comment=data.comment.strip(),
            total_amount=total,
        )
        self._create_items(order, data.items, products, variants)
        transaction.on_commit(lambda: notify_new_order(order))
        return order

    # ----------------------------------------------------------------- #
    # Internal helpers
    # ----------------------------------------------------------------- #
    def _validate_contact(self, data: OrderInput) -> None:
        errors: dict[str, str] = {}
        if data.delivery_type == DeliveryType.DELIVERY:
            if not data.address.strip():
                errors["address"] = "Укажите адрес доставки."
            if not data.customer_name.strip():
                errors["customer_name"] = "Укажите имя."
            if not data.phone.strip():
                errors["phone"] = "Укажите телефон."
        elif data.delivery_type == DeliveryType.PICKUP:
            if not data.customer_name.strip():
                errors["customer_name"] = "Укажите имя."
            if not data.phone.strip():
                errors["phone"] = "Укажите телефон."
        else:
            errors["delivery_type"] = "Неверный способ получения."

        if not data.items:
            errors["items"] = "Корзина пуста."

        if errors:
            raise OrderValidationError(errors)

    def _load_products(self, items: Iterable[OrderItemInput]) -> dict[str, Product]:
        ids = {item.product_id for item in items}
        products = {
            str(p.id): p
            for p in Product.objects.active().prefetch_related("variants").filter(id__in=ids)
        }
        missing = ids - set(products)
        if missing:
            raise OrderValidationError(
                {"items": f"Некоторые товары недоступны: {', '.join(sorted(missing))}."}
            )
        return products

    def _load_variants(
        self, items: Iterable[OrderItemInput], products: dict[str, Product]
    ) -> dict[str, ProductVariant]:
        """Validates variant selection and returns {variant_id: variant}.

        A product with active variants *requires* one to be picked; a
        product with none must not be given one (nothing to pick from).
        """
        variant_ids = {item.variant_id for item in items if item.variant_id}
        variants = {
            str(v.id): v
            for v in ProductVariant.objects.filter(id__in=variant_ids, is_active=True)
        }
        missing = variant_ids - set(variants)
        if missing:
            raise OrderValidationError(
                {"items": f"Некоторые варианты порций недоступны: {', '.join(sorted(missing))}."}
            )

        errors: dict[str, str] = {}
        for item in items:
            product = products[item.product_id]
            has_variants = any(v.is_active for v in product.variants.all())
            if has_variants and not item.variant_id:
                errors["items"] = f"Выберите размер порции для «{product.name}»."
            elif item.variant_id and variants[item.variant_id].product_id != product.id:
                errors["items"] = f"Вариант порции не относится к «{product.name}»."
        if errors:
            raise OrderValidationError(errors)

        return variants

    def _compute_total(
        self,
        items: Iterable[OrderItemInput],
        products: dict[str, Product],
        variants: dict[str, ProductVariant],
    ) -> Decimal:
        total = Decimal("0")
        for item in items:
            unit_price = (
                variants[item.variant_id].price
                if item.variant_id
                else products[item.product_id].price
            )
            total += unit_price * item.quantity
        if not self._settings.delivery_is_free:
            total += self._settings.delivery_fee
        return total

    def _validate_minimum(self, total: Decimal) -> None:
        if self._settings.min_order_amount and total < self._settings.min_order_amount:
            raise OrderValidationError(
                {
                    "detail": (
                        f"Минимальная сумма заказа — "
                        f"{self._settings.min_order_amount} {self._settings.currency}."
                    )
                }
            )

    def _create_items(
        self,
        order: Order,
        items: Iterable[OrderItemInput],
        products: dict[str, Product],
        variants: dict[str, ProductVariant],
    ) -> None:
        def build(item: OrderItemInput) -> OrderItem:
            product = products[item.product_id]
            variant = variants[item.variant_id] if item.variant_id else None
            name = f"{product.name} ({variant.label})" if variant else product.name
            price = variant.price if variant else product.price
            return OrderItem(
                order=order,
                product=product,
                variant=variant,
                product_name=name,
                price=price,
                quantity=item.quantity,
            )

        OrderItem.objects.bulk_create([build(item) for item in items])
