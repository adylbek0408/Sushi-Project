# Sushiya — премиум доставка суши

Production-ready сайт доставки суши: **Next.js 15** (App Router, TS, Tailwind,
Zustand, React Query) + **Django / DRF / PostgreSQL** + админка на **Jazzmin**,
запакованные в **Docker** за **Nginx**. Оформление заказа завершается
формированием текста и переходом в **WhatsApp**.

## Возможности

- Каталог: категории и товары (цена, вес, состав, фото, популярные).
- Корзина (Zustand + persist в `localStorage`): mobile bottom-sheet + desktop right-rail.
- Оформление заказа:
  - **Доставка** — пользователь вводит адрес.
  - **Самовывоз** — имя + телефон.
  - Комментарий к заказу.
- Сумма заказа считается **на сервере** (защита от подмены цен).
- WhatsApp deep-link с готовым текстом заказа.
- Локальная история заказов (вкладка «Заказы»), поиск по меню.
- SEO: ISR, метаданные, Open Graph, JSON-LD, `sitemap.xml`, `robots.txt`.
- Mobile-first, дизайн-токены «Epicurean Modern».

## Структура

```
Sushi-Project/
├── docker-compose.yml          # db + api + web + nginx
├── .env.example                # переменные для compose
├── nginx/nginx.conf            # reverse-proxy + раздача static/media
├── backend/                    # Django + DRF
│   ├── config/                 # settings, urls, wsgi/asgi
│   └── apps/
│       ├── core/               # base-модели, ShopSettings, health
│       ├── catalog/            # Category, Product, seed_demo
│       └── orders/             # Order, OrderItem, сервис-слой
└── frontend/                   # Next.js 15
    └── src/
        ├── app/                # маршруты (App Router)
        ├── components/         # layout / home / cart / orders / search / ui
        ├── hooks/              # React Query + хелперы
        ├── lib/                # api-клиент, whatsapp, format, config
        ├── store/              # Zustand: cart, ui, orderHistory
        └── types/
```

## Быстрый старт (Docker, всё за Nginx :80)

```bash
cp .env.example .env
cp backend/.env.example backend/.env
# отредактируйте секреты в обоих .env (SECRET_KEY, пароли, WhatsApp-номер)

docker compose up --build -d
```

После старта:

- Витрина: <http://localhost>
- Админка: <http://localhost/admin/>
- API-доки (Swagger): <http://localhost/api/docs/>

При первом запуске entrypoint применит миграции, соберёт static,
(опционально) создаст суперпользователя и засеет демо-каталог
(`DJANGO_SEED_DEMO=true`).

## Локальная разработка (без Docker)

**Backend**

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# поднимите PostgreSQL и задайте DATABASE_URL (см. .env.example)
python manage.py migrate
python manage.py seed_demo          # демо-каталог (опционально)
python manage.py createsuperuser
python manage.py runserver
```

**Frontend**

```bash
cd frontend
npm install
# .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Витрина: <http://localhost:3000>, API: <http://localhost:8000>.

## API (`/api/v1`)

| Метод | Путь | Назначение |
|------|------|------------|
| GET | `/categories/` | Список активных категорий |
| GET | `/products/?category=&search=` | Список товаров (фильтр/поиск) |
| GET | `/products/{slug}/` | Карточка товара |
| POST | `/orders/` | Создание заказа |
| GET | `/orders/{id}/` | Заказ по UUID |
| GET | `/settings/` | Настройки магазина |
| GET | `/health/` | Healthcheck |

## Тесты

```bash
cd backend && python manage.py test
```

## Продуктовые решения (где дизайн не уточнял)

- **Покупатели без регистрации.** История заказов хранится локально в браузере.
- **Доставка бесплатна** по умолчанию (флаг в `ShopSettings`, можно включить плату).
- **Цены/названия фиксируются** в позициях заказа (снимок на момент покупки).
- Чекаут на десктопе открывается модалкой из правой корзины (нужно собрать адрес/контакты).
- «Акции/Отзывы» в MVP не реализованы (не было контента в дизайне);
  навигация сведена к «Меню / Поиск / Заказы / Корзина».

## Безопасность / Production

- `DEBUG=False`, HSTS, secure cookies, SSL-redirect, nosniff, `X-Frame-Options`.
- Throttling DRF (общий + отдельный лимит на создание заказов).
- Whitenoise для static, Nginx для media и проксирования.
- Next.js standalone-сборка, security-заголовки в `next.config.ts`.
- Секреты — только в `.env` (в git не попадают, см. `.gitignore`).
