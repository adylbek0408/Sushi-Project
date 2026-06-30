"""Idempotent demo-content seeder with real photography.

Populates categories and a full menu, downloading high-quality images and
attaching them to each record. Safe to re-run (get_or_create); pass
``--refresh-images`` to re-download images for existing records.

Run with:
    python manage.py seed_demo
    python manage.py seed_demo --refresh-images
"""
from __future__ import annotations

from decimal import Decimal
from urllib.request import Request, urlopen

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.catalog.models import Banner, Category, Product
from apps.core.models import ShopSettings

# Image host + identifiers (high-fidelity food photography from the design).
IMG = "https://lh3.googleusercontent.com/aida-public/"

IMAGES = {
    "rolls": "AB6AXuCiscErIEGpXobK7DtDH1HNxbhidCKExEhs-pF8zdyrqU1ZXZrYnWDZ49J626DXJuYUVWfXF2tTKa2HafrzbRAMH4_IAYiKqCOEx1EDXiVn5aaLEqP8PKvND9gIutRNXpFG-u2cgIdXEnSWEF8rGJ4odZBCJV6ojRwkZycTg8Q4LcL-lj1dMgsBWhGQ_k5AQdqXFyATu3WVi0iF_qCwEZY82V7NiHEi7sBnYoXbuftQKlehBSqRGjvVSGFDQFdoWadnV6iDIuEf498",
    "philadelphia": "AB6AXuDe-_sxU9fU7m7UeGmAK-BLcGdo2-7ESzV9Y8dk8v5Xly6ApbY0bTYbvGGLwA2ndkhqoUYFsA9N0rL5V0LN_q41XUygdIdJM7MqPqZspKK1at89GMi04NEq5RdRNKPJYpYafb-I1fNs7VKNnM5U1IR5Jn2SNyfIDGjpNDugjC_xwjYOJRSwbv8n0mTQ90h8UYsSpvG0w3Af4Pvpv-Z-8Ck00KkEqHrmCpzi-a1PIw2M7zFDqF5Ry3DaiUv5Y_PLjYasmiv2HSiqd0Q",
    "california": "AB6AXuDJTn4jRhciC-jVyUWCMSOBnrHkIbukyNmX37T2Y8FDip5sT5vTOc-rN8GqfGBzYXpoOxTuFL7o5gfUGpuaKSqITswKj96gZQmt3_P5AH_oMFpNK-dOZmUohaIXXHX3K8sHp0HAvgrRwx7PawXc9KjLzrWEh5xctKQu07WkBV5dbEFF5I4NudGohwr7d7JU-u8yqppno6Vqpt9V_0uzoUatkoQRGDBUab_qVjGNmO_e4uTuDGXMPF9GTkigRJJC9Q9jAZ57pnzivVs",
    "dragon": "AB6AXuBdt5TKyz0AXaneYtZa74ABZ1kq3GH1KSFdZtLS16JK8Zi6TCwsiqQn2oCmy0Vq4y-PXOzPHc9SQ_HgaGeoLxxe9b3hNvW7-vY85iRUyQSH_lIq7CSOWc7DIrSrwvmAwPY7Md2wat-3uhUfukUXUBH_CBFQQvfRk_x84Ns7QaW7ukX_GWudydQlBJcbQVDYQFweCfi9HGx7fQj3MY6OucGc-pEnEKw9-EbPoZ33P1crmw2beS3BiNYljipiFIsj4wR-HWi_4S4V1Tk",
    "tempura": "AB6AXuApGQJ87MzQ5FeT9GxXGBNR6qujdJHvAGlkd-hpaKWlgXpeMzoCaoKCo45lg20L4Cwct35Q1w_j7e5oZ0LL7_3-uoE37vMHySQCpf8W7-zpTtpDz5hyC3vzHIf0OH_dgGasrgJo8m8r_eQ_N-ipK9s1srxrI-G0_bwLdUiDmVBQ-8RzcBQPIfmyzVpiZ0fceskgETBpha91eXx1s0EPIj5AM3Ky083ax89jucPqdmVMCiQmUD7y0f7KTbthHhzoBGqxOTUeWQgtiC8",
    "baked": "AB6AXuByhCkWOD9DuMTqOSerEoWQFMGkMpSuhP4X0itQKfmBNLe_0hoA4sb4vI3450OstcwdcycLi-sQnOcYQtEEk1YAm9u-4UKkTz3n-P-O4jSkbqq9IC49QSX7NT7AS-vmiyqlUgPRza2fgsJChGwkYL2t6UkuoXVIz_pFSyQkEuHcEAGUbLMhT9jf3iOrSuYSuX3s2IsViXVkAq8-JfLvpDVEEbmoqMBBnZyR0284e_tNbJnZFuLQtaeIzsK1etOhCmlwBN8fIQ5z12E",
    "baked_salmon": "AB6AXuDKE8f-eTyUIMA5YGLtaHl6-vY31aaLN8PUfSkfa33ZPaV2hZrve5O0rC5vMU3gNBjGpKc9becDwI6uPVG7sfsPcx7DT1C9LQ6ru4cw93xWTM2lVIMwBo3qVaMCWtMeNCpTUP-4Y3KADlJVr2JfuIA2Y0WLc-e2AreFsS6hfXTS6P3H2QvSvxtwX0B_SZZ5GWAOv1w6XmLg8A5KOvBUuVbmdUmUld1vNrrMIG20wyMJQU0dk9benSnaFirDcLQeqKOxxbazmthawBY",
    "platter": "AB6AXuBAz5CY4VBqCSucln3F0fGruopYvvOg8DD_Ppw1DHJ21gy9L4XpzKrhsFDntRbJ_dAXAQ4j8qdPYZcnEE9xBBZQrUQkrwtCgIHm0_hdf0GFuJygYNzGN2lrvrslV8LydrH90O-wwfsfpV3tAZkIFxH8Z1X3p5S3UXcb9a6KU6OiSsEbN28reoBpc9mhxPSy_WhRjpgCNsnBaKMYIziDwdxPN2CcyeeQJS1y_7v5Xr8vfAxftq55PzqHee-S52DSO47nKepJBHB9Ffc",
    "lemonade": "AB6AXuAQY3oOlkY4ICDwU2zNMVmR1SHYFJ9m1mSu163mZyBi9pGmJPfdhWa0KvHJqPy-tSjuMYU2TlEo17nlwtLugIMQnFOAgO4RV4G_PRdEXl89RAjIILNHUD8m9ytkssqip6zZ3U21wflz3s2OIf-pXnp0ZOf_miqL7wUGjxMxIIHe8V_0p-dYCOhdzIWoHrcZlhuGMc3AODzJHX9KCQe6zEEaydvxOiWvkXXmf6Y6-ZHEkig_XO_28ll8DDOdTL4tvhzylo9Kshhix90",
    "hero": "AB6AXuDzRw8AfyHDDOS8cXmF2qk4R95CgcEmvs2uTA9gFc1zPNQYsgcgf03kWtl8JY-iE0EnxF5Grrsa_ZRcEtViIAYpAfD_rkk3gdFq44DDaxarnjy2Y6DZpZoRK5FjQV3Sqr4CAEFmuzDhWXbxZh6vsbJxvJM7hIyp1ECwi_F0Bu8FUMyGM8lSKDsciK8xmTNO5__EcHQkWlx0jwX_U8RdN3bp6j8EeZzmFeT-iDyUOXNUxZFltwgoKIr-MF0ayRvOkgfPYg4yz5Gz7rw",
}


def img(key: str) -> str:
    return IMG + IMAGES[key]


CATEGORIES = [
    {"name": "Суши", "sort_order": 1, "image": "philadelphia"},
    {"name": "Роллы", "sort_order": 2, "image": "rolls"},
    {"name": "Сеты", "sort_order": 3, "image": "platter"},
    {"name": "Запечённые", "sort_order": 4, "image": "baked"},
    {"name": "Напитки", "sort_order": 5, "image": "lemonade"},
]

PRODUCTS = [
    # --- Роллы ---
    {"category": "Роллы", "name": "Филадельфия Классик", "image": "philadelphia",
     "description": "Лосось, сливочный сыр, огурец, рис, нори", "price": "450", "weight": 240, "popular": True},
    {"category": "Роллы", "name": "Калифорния", "image": "california",
     "description": "Краб, авокадо, огурец, тобико, рис, нори", "price": "380", "weight": 210, "popular": True},
    {"category": "Роллы", "name": "Грин Дракон", "image": "dragon",
     "description": "Угорь, сливочный сыр, авокадо, унаги соус, кунжут", "price": "520", "weight": 220, "popular": True},
    {"category": "Роллы", "name": "Канада", "image": "dragon",
     "description": "Копчёный лосось, угорь, авокадо, унаги соус", "price": "540", "weight": 250, "popular": False},
    {"category": "Роллы", "name": "Спайси Лосось", "image": "california",
     "description": "Лосось, спайси соус, огурец, кунжут", "price": "430", "weight": 215, "popular": False},
    {"category": "Роллы", "name": "Бонито", "image": "philadelphia",
     "description": "Лосось, сливочный сыр, стружка тунца, унаги соус", "price": "470", "weight": 230, "popular": False},

    # --- Суши (нигири) ---
    {"category": "Суши", "name": "Нигири с лососем", "image": "philadelphia",
     "description": "Свежий лосось, рис, васаби", "price": "180", "weight": 60, "popular": False},
    {"category": "Суши", "name": "Нигири с угрём", "image": "dragon",
     "description": "Угорь, рис, унаги соус, кунжут", "price": "210", "weight": 60, "popular": False},
    {"category": "Суши", "name": "Нигири с креветкой", "image": "tempura",
     "description": "Тигровая креветка, рис, васаби", "price": "190", "weight": 55, "popular": False},
    {"category": "Суши", "name": "Гункан Спайси", "image": "california",
     "description": "Лосось, спайси соус, тобико, рис, нори", "price": "160", "weight": 50, "popular": False},

    # --- Сеты ---
    {"category": "Сеты", "name": "Сет Филадельфия", "image": "platter",
     "description": "32 кусочка: Филадельфия, Калифорния, Запечённый", "price": "1290", "weight": 980, "popular": True},
    {"category": "Сеты", "name": "Сет Токио", "image": "platter",
     "description": "40 кусочков: ассорти роллов и запечённых", "price": "1690", "weight": 1250, "popular": True},
    {"category": "Сеты", "name": "Сет Дракон", "image": "platter",
     "description": "36 кусочков: Дракон, Канада, Спайси лосось", "price": "1490", "weight": 1100, "popular": False},

    # --- Запечённые ---
    {"category": "Запечённые", "name": "Запечённый с лососем", "image": "baked_salmon",
     "description": "Лосось, сливочный сыр, спайси соус, сырная шапка", "price": "480", "weight": 260, "popular": True},
    {"category": "Запечённые", "name": "Хот Темпура", "image": "tempura",
     "description": "Креветка, спайси майонез, хрустящая панировка", "price": "490", "weight": 260, "popular": True},
    {"category": "Запечённые", "name": "Запечённый Краб", "image": "baked",
     "description": "Краб, сливочный сыр, унаги соус, сырная шапка", "price": "460", "weight": 250, "popular": False},

    # --- Напитки ---
    {"category": "Напитки", "name": "Домашний лимонад", "image": "lemonade",
     "description": "Лимон, мята, лёд", "price": "150", "weight": 400, "popular": False},
    {"category": "Напитки", "name": "Морс ягодный", "image": "lemonade",
     "description": "Клюква, брусника, лёд", "price": "140", "weight": 400, "popular": False},
    {"category": "Напитки", "name": "Зелёный чай", "image": "lemonade",
     "description": "Сенча, свежезаваренный", "price": "130", "weight": 400, "popular": False},
]

# Hero slider — one slide per category, with matching photography.
BANNERS = [
    {"category": "Роллы", "image": "dragon", "button_text": "Смотреть роллы",
     "title": "Свежие роллы за 30 минут",
     "subtitle": "Премиальные ингредиенты, быстрая доставка"},
    {"category": "Сеты", "image": "platter", "button_text": "Выбрать сет",
     "title": "Большие сеты для компании",
     "subtitle": "Выгодно и вкусно — хватит на всех"},
    {"category": "Запечённые", "image": "baked_salmon", "button_text": "Попробовать",
     "title": "Горячие запечённые роллы",
     "subtitle": "С хрустящей сырной шапкой и спайси соусом"},
    {"category": "Напитки", "image": "lemonade", "button_text": "К напиткам",
     "title": "Освежающие напитки",
     "subtitle": "Домашние лимонады и ягодные морсы"},
]


class Command(BaseCommand):
    help = "Seed demo catalog content with images (idempotent)."

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--refresh-images",
            action="store_true",
            help="Re-download images even if records already have one.",
        )

    @transaction.atomic
    def handle(self, *args, **options) -> None:
        refresh = options["refresh_images"]
        ShopSettings.load()

        downloaded = 0
        failed = 0

        categories: dict[str, Category] = {}
        for data in CATEGORIES:
            category, _ = Category.objects.get_or_create(
                name=data["name"],
                defaults={"sort_order": data["sort_order"], "is_active": True},
            )
            if not category.sort_order:
                category.sort_order = data["sort_order"]
                category.save(update_fields=["sort_order"])
            ok = self._attach_image(category, img(data["image"]), refresh)
            downloaded += int(ok is True)
            failed += int(ok is False)
            categories[data["name"]] = category

        created = 0
        for index, data in enumerate(PRODUCTS, start=1):
            product, was_created = Product.objects.get_or_create(
                name=data["name"],
                defaults={
                    "category": categories[data["category"]],
                    "description": data["description"],
                    "price": Decimal(data["price"]),
                    "weight": data["weight"],
                    "is_popular": data["popular"],
                    "sort_order": index,
                    "is_active": True,
                },
            )
            created += int(was_created)
            ok = self._attach_image(product, img(data["image"]), refresh)
            downloaded += int(ok is True)
            failed += int(ok is False)

        banners_created = 0
        for index, data in enumerate(BANNERS, start=1):
            banner, was_created = Banner.objects.get_or_create(
                title=data["title"],
                defaults={
                    "subtitle": data["subtitle"],
                    "button_text": data["button_text"],
                    "category": categories.get(data["category"]),
                    "sort_order": index,
                    "is_active": True,
                },
            )
            banners_created += int(was_created)
            ok = self._attach_image(banner, img(data["image"]), refresh)
            downloaded += int(ok is True)
            failed += int(ok is False)

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed complete: {len(categories)} categories, "
                f"{Product.objects.count()} products ({created} new), "
                f"{Banner.objects.count()} banners ({banners_created} new). "
                f"Images downloaded: {downloaded}, failed: {failed}."
            )
        )

    def _attach_image(self, obj, url: str, refresh: bool) -> bool | None:
        """Returns True if downloaded, False on failure, None if skipped."""
        if obj.image and not refresh:
            return None
        try:
            request = Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urlopen(request, timeout=30) as response:
                data = response.read()
        except Exception as exc:  # noqa: BLE001 - network is best-effort
            self.stderr.write(self.style.WARNING(f"  image failed for {obj}: {exc}"))
            return False

        ext = "png" if data[:4] == b"\x89PNG" else "jpg"
        stem = getattr(obj, "slug", None) or str(obj.pk)
        obj.image.save(f"{stem}.{ext}", ContentFile(data), save=True)
        return True
