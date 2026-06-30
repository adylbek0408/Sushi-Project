"""Public endpoints for shop configuration and health checks."""
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ShopSettings
from .serializers import ShopSettingsSerializer


class ShopSettingsView(APIView):
    """Return the single storefront configuration row."""

    permission_classes = [AllowAny]

    @extend_schema(responses=ShopSettingsSerializer, tags=["settings"])
    def get(self, request: Request) -> Response:
        settings_obj = ShopSettings.load()
        return Response(ShopSettingsSerializer(settings_obj).data)


class HealthView(APIView):
    """Lightweight liveness probe for Docker / load balancers."""

    permission_classes = [AllowAny]
    throttle_classes = []

    @extend_schema(responses={200: None}, tags=["ops"])
    def get(self, request: Request) -> Response:
        return Response({"status": "ok"}, status=status.HTTP_200_OK)
