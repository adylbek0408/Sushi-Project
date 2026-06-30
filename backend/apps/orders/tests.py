"""Tests for the order service — the core business logic."""
from decimal import Decimal

from django.test import TestCase

from apps.catalog.models import Category, Product
from apps.core.models import ShopSettings

from .models import DeliveryType, Order
from .services import OrderInput, OrderItemInput, OrderService, OrderValidationError


class OrderServiceTests(TestCase):
    def setUp(self) -> None:
        self.settings = ShopSettings.load()
        category = Category.objects.create(name="Роллы", sort_order=1)
        self.philadelphia = Product.objects.create(
            category=category, name="Филадельфия", price=Decimal("450"), weight=240
        )
        self.california = Product.objects.create(
            category=category, name="Калифорния", price=Decimal("380"), weight=210
        )

    def _delivery_input(self, **overrides) -> OrderInput:
        base = dict(
            delivery_type=DeliveryType.DELIVERY,
            items=[
                OrderItemInput(product_id=str(self.philadelphia.id), quantity=2),
                OrderItemInput(product_id=str(self.california.id), quantity=1),
            ],
            address="Киевская 49А",
        )
        base.update(overrides)
        return OrderInput(**base)

    def test_creates_order_with_server_computed_total(self) -> None:
        order = OrderService(self.settings).create_order(self._delivery_input())
        self.assertEqual(order.total_amount, Decimal("1280"))  # 450*2 + 380
        self.assertEqual(order.items.count(), 2)
        self.assertEqual(order.status, "new")

    def test_delivery_requires_address(self) -> None:
        with self.assertRaises(OrderValidationError) as ctx:
            OrderService(self.settings).create_order(self._delivery_input(address=""))
        self.assertIn("address", ctx.exception.errors)

    def test_pickup_requires_name_and_phone(self) -> None:
        data = OrderInput(
            delivery_type=DeliveryType.PICKUP,
            items=[OrderItemInput(product_id=str(self.philadelphia.id), quantity=1)],
        )
        with self.assertRaises(OrderValidationError) as ctx:
            OrderService(self.settings).create_order(data)
        self.assertIn("customer_name", ctx.exception.errors)
        self.assertIn("phone", ctx.exception.errors)

    def test_minimum_order_amount_enforced(self) -> None:
        self.settings.min_order_amount = Decimal("2000")
        self.settings.save()
        with self.assertRaises(OrderValidationError):
            OrderService(self.settings).create_order(self._delivery_input())

    def test_order_numbers_increment(self) -> None:
        service = OrderService(self.settings)
        first = service.create_order(self._delivery_input())
        second = service.create_order(self._delivery_input())
        self.assertEqual(second.number, first.number + 1)
        self.assertTrue(Order.objects.filter(number=first.number).exists())
