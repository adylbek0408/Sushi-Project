import uuid

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("created_at", models.DateTimeField(auto_now_add=True, db_index=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=120, verbose_name="Название")),
                ("slug", models.SlugField(blank=True, max_length=140, unique=True, verbose_name="Слаг")),
                ("image", models.ImageField(blank=True, upload_to="categories/", verbose_name="Изображение")),
                ("sort_order", models.PositiveIntegerField(db_index=True, default=0, verbose_name="Порядок")),
                ("is_active", models.BooleanField(default=True, verbose_name="Активна")),
            ],
            options={
                "verbose_name": "Категория",
                "verbose_name_plural": "Категории",
                "ordering": ["sort_order", "name"],
            },
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("created_at", models.DateTimeField(auto_now_add=True, db_index=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=160, verbose_name="Название")),
                ("slug", models.SlugField(blank=True, max_length=180, unique=True, verbose_name="Слаг")),
                ("description", models.TextField(blank=True, verbose_name="Состав / описание")),
                ("price", models.DecimalField(decimal_places=2, max_digits=10, verbose_name="Цена")),
                (
                    "weight",
                    models.PositiveIntegerField(blank=True, help_text="Граммовка порции.", null=True, verbose_name="Вес, г"),
                ),
                ("image", models.ImageField(blank=True, upload_to="products/", verbose_name="Изображение")),
                ("is_active", models.BooleanField(default=True, verbose_name="В продаже")),
                ("is_popular", models.BooleanField(default=False, verbose_name="Популярный")),
                ("sort_order", models.PositiveIntegerField(db_index=True, default=0, verbose_name="Порядок")),
                (
                    "category",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="products",
                        to="catalog.category",
                        verbose_name="Категория",
                    ),
                ),
            ],
            options={
                "verbose_name": "Товар",
                "verbose_name_plural": "Товары",
                "ordering": ["sort_order", "name"],
            },
        ),
        migrations.AddIndex(
            model_name="product",
            index=models.Index(fields=["is_active", "is_popular"], name="catalog_pro_is_acti_69cecf_idx"),
        ),
    ]
