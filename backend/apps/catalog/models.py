"""Catalog domain: categories and products."""
from __future__ import annotations

from django.db import models
from django.utils.text import slugify

from apps.core.models import TimeStampedModel


class CategoryQuerySet(models.QuerySet):
    def active(self) -> "CategoryQuerySet":
        return self.filter(is_active=True)


class Category(TimeStampedModel):
    name = models.CharField("Название", max_length=120)
    slug = models.SlugField("Слаг", max_length=140, unique=True, blank=True)
    image = models.ImageField("Изображение", upload_to="categories/", blank=True)
    sort_order = models.PositiveIntegerField("Порядок", default=0, db_index=True)
    is_active = models.BooleanField("Активна", default=True)

    objects = CategoryQuerySet.as_manager()

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
        ordering = ["sort_order", "name"]

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self._unique_slug()
        super().save(*args, **kwargs)

    def _unique_slug(self) -> str:
        base = slugify(self.name, allow_unicode=False) or "category"
        slug = base
        index = 1
        while Category.objects.exclude(pk=self.pk).filter(slug=slug).exists():
            index += 1
            slug = f"{base}-{index}"
        return slug


class ProductQuerySet(models.QuerySet):
    def active(self) -> "ProductQuerySet":
        return self.filter(is_active=True, category__is_active=True)

    def popular(self) -> "ProductQuerySet":
        return self.active().filter(is_popular=True)


class Product(TimeStampedModel):
    category = models.ForeignKey(
        Category,
        verbose_name="Категория",
        related_name="products",
        on_delete=models.PROTECT,
    )
    name = models.CharField("Название", max_length=160)
    slug = models.SlugField("Слаг", max_length=180, unique=True, blank=True)
    description = models.TextField("Состав / описание", blank=True)
    price = models.DecimalField("Цена", max_digits=10, decimal_places=2)
    weight = models.PositiveIntegerField(
        "Вес, г", null=True, blank=True, help_text="Граммовка порции."
    )
    image = models.ImageField("Изображение", upload_to="products/", blank=True)
    is_active = models.BooleanField("В продаже", default=True)
    is_popular = models.BooleanField("Популярный", default=False)
    sort_order = models.PositiveIntegerField("Порядок", default=0, db_index=True)

    objects = ProductQuerySet.as_manager()

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"
        ordering = ["sort_order", "name"]
        indexes = [
            models.Index(fields=["is_active", "is_popular"]),
        ]

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self._unique_slug()
        super().save(*args, **kwargs)

    def _unique_slug(self) -> str:
        base = slugify(self.name, allow_unicode=False) or "product"
        slug = base
        index = 1
        while Product.objects.exclude(pk=self.pk).filter(slug=slug).exists():
            index += 1
            slug = f"{base}-{index}"
        return slug


class BannerQuerySet(models.QuerySet):
    def active(self) -> "BannerQuerySet":
        return self.filter(is_active=True)


class Banner(TimeStampedModel):
    """Promotional hero slide. Optionally linked to a category so the CTA
    can scroll the storefront straight to that category."""

    title = models.CharField("Заголовок", max_length=120, blank=True)
    subtitle = models.CharField("Подзаголовок", max_length=200, blank=True)
    button_text = models.CharField("Текст кнопки", max_length=40, default="Смотреть")
    image = models.ImageField("Изображение", upload_to="banners/", blank=True)
    category = models.ForeignKey(
        Category,
        verbose_name="Категория (куда ведёт кнопка)",
        related_name="banners",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    sort_order = models.PositiveIntegerField("Порядок", default=0, db_index=True)
    is_active = models.BooleanField("Активен", default=True)

    objects = BannerQuerySet.as_manager()

    class Meta:
        verbose_name = "Баннер"
        verbose_name_plural = "Баннеры"
        ordering = ["sort_order", "-created_at"]

    def __str__(self) -> str:
        return self.title or f"Баннер {self.pk}"
