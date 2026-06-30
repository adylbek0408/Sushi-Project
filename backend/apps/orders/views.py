"""Order endpoints: public create + retrieve-by-id."""
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from .models import Order
from .serializers import OrderCreateSerializer, OrderSerializer
from .services import OrderService, OrderValidationError


class OrderViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    """Create a new order, or fetch one by its UUID for status display."""

    permission_classes = [AllowAny]
    queryset = Order.objects.prefetch_related("items").all()
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "orders"

    def get_serializer_class(self):
        if self.action == "create":
            return OrderCreateSerializer
        return OrderSerializer

    @extend_schema(
        request=OrderCreateSerializer,
        responses={201: OrderSerializer},
        tags=["orders"],
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            order = OrderService().create_order(serializer.to_domain())
        except OrderValidationError as exc:
            return Response(exc.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(
            OrderSerializer(order).data, status=status.HTTP_201_CREATED
        )
