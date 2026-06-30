from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="ShopSettings",
            fields=[
                (
                    "id",
                    models.PositiveSmallIntegerField(
                        default=1, editable=False, primary_key=True, serialize=False
                    ),
                ),
                ("shop_name", models.CharField(default="Sushiya", max_length=120, verbose_name="Название")),
                (
                    "whatsapp_number",
                    models.CharField(
                        default="996700000000",
                        help_text="В международном формате без '+', например 996700123456.",
                        max_length=20,
                        verbose_name="WhatsApp номер",
                    ),
                ),
                ("currency", models.CharField(default="сом", max_length=10, verbose_name="Валюта")),
                ("city", models.CharField(default="Бишкек", max_length=80, verbose_name="Город")),
                (
                    "pickup_address",
                    models.CharField(default="ул. Киевская 49А", max_length=255, verbose_name="Адрес самовывоза"),
                ),
                (
                    "min_order_amount",
                    models.DecimalField(decimal_places=2, default=0, max_digits=10, verbose_name="Минимальная сумма заказа"),
                ),
                ("delivery_is_free", models.BooleanField(default=True, verbose_name="Бесплатная доставка")),
                (
                    "delivery_fee",
                    models.DecimalField(
                        decimal_places=2,
                        default=0,
                        help_text="Используется только если бесплатная доставка выключена.",
                        max_digits=10,
                        verbose_name="Стоимость доставки",
                    ),
                ),
                ("working_hours", models.CharField(default="10:00 – 23:00", max_length=120, verbose_name="Часы работы")),
                ("is_accepting_orders", models.BooleanField(default=True, verbose_name="Принимаем заказы")),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "Настройки магазина",
                "verbose_name_plural": "Настройки магазина",
            },
        ),
    ]
