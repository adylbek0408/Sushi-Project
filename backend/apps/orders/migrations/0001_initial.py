import uuid

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("catalog", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Order",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("created_at", models.DateTimeField(auto_now_add=True, db_index=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("number", models.PositiveIntegerField(editable=False, unique=True, verbose_name="Номер")),
                (
                    "delivery_type",
                    models.CharField(
                        choices=[("delivery", "Доставка"), ("pickup", "Самовывоз")],
                        max_length=16,
                        verbose_name="Способ получения",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("new", "Новый"),
                            ("confirmed", "Подтверждён"),
                            ("delivering", "Доставляется"),
                            ("done", "Выполнен"),
                            ("canceled", "Отменён"),
                        ],
                        db_index=True,
                        default="new",
                        max_length=16,
                        verbose_name="Статус",
                    ),
                ),
                ("customer_name", models.CharField(blank=True, max_length=120, verbose_name="Имя")),
                ("phone", models.CharField(blank=True, max_length=32, verbose_name="Телефон")),
                ("address", models.CharField(blank=True, max_length=255, verbose_name="Адрес доставки")),
                ("comment", models.TextField(blank=True, verbose_name="Комментарий")),
                ("total_amount", models.DecimalField(decimal_places=2, default=0, max_digits=10, verbose_name="Сумма")),
            ],
            options={
                "verbose_name": "Заказ",
                "verbose_name_plural": "Заказы",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("created_at", models.DateTimeField(auto_now_add=True, db_index=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("product_name", models.CharField(max_length=160, verbose_name="Название")),
                ("price", models.DecimalField(decimal_places=2, max_digits=10, verbose_name="Цена")),
                ("quantity", models.PositiveIntegerField(verbose_name="Количество")),
                (
                    "order",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="items",
                        to="orders.order",
                        verbose_name="Заказ",
                    ),
                ),
                (
                    "product",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="order_items",
                        to="catalog.product",
                        verbose_name="Товар",
                    ),
                ),
            ],
            options={
                "verbose_name": "Позиция заказа",
                "verbose_name_plural": "Позиции заказа",
                "ordering": ["created_at"],
            },
        ),
    ]
