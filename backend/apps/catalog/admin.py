from django.contrib import admin
from django.utils.html import format_html

from .models import Banner, Category, Product


class ProductInline(admin.TabularInline):
    model = Product
    extra = 0
    fields = ("name", "price", "weight", "is_active", "is_popular", "sort_order")
    show_change_link = True


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "preview", "sort_order", "product_count", "is_active")
    list_editable = ("sort_order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductInline]

    @admin.display(description="Превью")
    def preview(self, obj: Category):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:40px;width:40px;border-radius:8px;object-fit:cover;" />',
                obj.image.url,
            )
        return "—"

    @admin.display(description="Товаров")
    def product_count(self, obj: Category) -> int:
        return obj.products.count()


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "preview",
        "category",
        "price",
        "weight",
        "is_active",
        "is_popular",
        "sort_order",
    )
    list_editable = ("price", "is_active", "is_popular", "sort_order")
    list_filter = ("category", "is_active", "is_popular")
    search_fields = ("name", "description")
    autocomplete_fields = ("category",)
    prepopulated_fields = {"slug": ("name",)}
    list_select_related = ("category",)

    @admin.display(description="Фото")
    def preview(self, obj: Product):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:48px;width:48px;border-radius:8px;object-fit:cover;" />',
                obj.image.url,
            )
        return "—"


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ("title", "preview", "category", "sort_order", "is_active")
    list_editable = ("sort_order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("title", "subtitle")
    autocomplete_fields = ("category",)
    list_select_related = ("category",)
    fields = ("title", "subtitle", "button_text", "image", "category", "sort_order", "is_active")

    @admin.display(description="Превью")
    def preview(self, obj: Banner):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:48px;width:96px;border-radius:8px;object-fit:cover;" />',
                obj.image.url,
            )
        return "—"
