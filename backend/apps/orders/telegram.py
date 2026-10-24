"""Best-effort Telegram notifications for new orders.

A missing/invalid token must never break order creation, so failures here
are only logged, never raised.
"""
from __future__ import annotations

import logging

import requests
from django.conf import settings

from .models import DeliveryType, Order

logger = logging.getLogger(__name__)

TELEGRAM_API_URL = "https://api.telegram.org/bot{token}/sendMessage"
REQUEST_TIMEOUT = 5


def build_order_message(order: Order) -> str:
    lines = [f"Новый заказ №{order.number}", "", "Что заказал:"]
    for item in order.items.all():
        lines.append(f"- {item.product_name} ×{item.quantity} — {item.line_total} сом")

    lines += ["", f"Итого: {order.total_amount} сом", ""]

    if order.customer_name:
        lines.append(f"Имя: {order.customer_name}")
    if order.phone:
        lines.append(f"Телефон: {order.phone}")
    if order.delivery_type == DeliveryType.DELIVERY and order.address:
        lines.append(f"Адрес: {order.address}")
    if order.comment:
        lines.append(f"Комментарий: {order.comment}")

    return "\n".join(lines)


def notify_new_order(order: Order) -> None:
    token = settings.TELEGRAM_BOT_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID
    if not token or not chat_id:
        logger.info("Telegram notifications are not configured, skipping order #%s", order.number)
        return

    try:
        response = requests.post(
            TELEGRAM_API_URL.format(token=token),
            json={"chat_id": chat_id, "text": build_order_message(order)},
            timeout=REQUEST_TIMEOUT,
        )
        response.raise_for_status()
    except requests.RequestException:
        logger.exception("Failed to send Telegram notification for order #%s", order.number)
