"""Order serializers: input validation + output representation."""
from rest_framework import serializers

from .models import DeliveryType, Order, OrderItem
from .services import OrderInput, OrderItemInput


class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1, max_value=99)


class OrderCreateSerializer(serializers.Serializer):
    """Validates the request shape; domain rules live in the service."""

    delivery_type = serializers.ChoiceField(choices=DeliveryType.choices)
    items = OrderItemInputSerializer(many=True)
    customer_name = serializers.CharField(required=False, allow_blank=True, max_length=120)
    phone = serializers.CharField(required=False, allow_blank=True, max_length=32)
    address = serializers.CharField(required=False, allow_blank=True, max_length=255)
    comment = serializers.CharField(required=False, allow_blank=True, max_length=1000)

    def to_domain(self) -> OrderInput:
        data = self.validated_data
        return OrderInput(
            delivery_type=data["delivery_type"],
            items=[
                OrderItemInput(product_id=str(i["product_id"]), quantity=i["quantity"])
                for i in data["items"]
            ],
            customer_name=data.get("customer_name", ""),
            phone=data.get("phone", ""),
            address=data.get("address", ""),
            comment=data.get("comment", ""),
        )


class OrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ["product_name", "price", "quantity", "line_total"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "number",
            "delivery_type",
            "status",
            "customer_name",
            "phone",
            "address",
            "comment",
            "total_amount",
            "items",
            "created_at",
        ]
        read_only_fields = fields
