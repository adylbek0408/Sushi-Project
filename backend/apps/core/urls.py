from django.urls import path

from .views import HealthView, ShopSettingsView

urlpatterns = [
    path("settings/", ShopSettingsView.as_view(), name="shop-settings"),
    path("health/", HealthView.as_view(), name="health"),
]
