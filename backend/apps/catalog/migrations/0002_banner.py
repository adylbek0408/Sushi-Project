import uuid

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Banner",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("created_at", models.DateTimeField(auto_now_add=True, db_index=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("title", models.CharField(blank=True, max_length=120, verbose_name="Заголовок")),
                ("subtitle", models.CharField(blank=True, max_length=200, verbose_name="Подзаголовок")),
                ("button_text", models.CharField(default="Смотреть", max_length=40, verbose_name="Текст кнопки")),
                ("image", models.ImageField(blank=True, upload_to="banners/", verbose_name="Изображение")),
                ("sort_order", models.PositiveIntegerField(db_index=True, default=0, verbose_name="Порядок")),
                ("is_active", models.BooleanField(default=True, verbose_name="Активен")),
                (
                    "category",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="banners",
                        to="catalog.category",
                        verbose_name="Категория (куда ведёт кнопка)",
                    ),
                ),
            ],
            options={
                "verbose_name": "Баннер",
                "verbose_name_plural": "Баннеры",
                "ordering": ["sort_order", "-created_at"],
            },
        ),
    ]
