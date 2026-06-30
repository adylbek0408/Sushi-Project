#!/usr/bin/env bash
set -euo pipefail

DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-5432}"
echo "Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT}..."
until python -c "import socket,sys; s=socket.socket(); s.settimeout(2); sys.exit(0) if not s.connect_ex(('${DB_HOST}', ${DB_PORT})) else sys.exit(1)" 2>/dev/null; do
  sleep 1
done
echo "PostgreSQL is up."

echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

if [ "${DJANGO_SEED_DEMO:-false}" = "true" ]; then
  echo "Seeding demo data..."
  python manage.py seed_demo
fi

if [ -n "${DJANGO_SUPERUSER_USERNAME:-}" ] && [ -n "${DJANGO_SUPERUSER_PASSWORD:-}" ]; then
  echo "Ensuring superuser '${DJANGO_SUPERUSER_USERNAME}' exists..."
  python manage.py createsuperuser --noinput || true
fi

exec "$@"
