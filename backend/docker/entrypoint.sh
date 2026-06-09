#!/bin/sh
set -e

echo "==> Aguardando Postgres em ${DB_HOST}:${DB_PORT}..."
until pg_isready -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" >/dev/null 2>&1; do
  sleep 1
done
echo "==> Postgres pronto."

echo "==> Aplicando migrations..."
python manage.py migrate --noinput

if [ "${DEBUG}" = "False" ]; then
  echo "==> Coletando estaticos..."
  python manage.py collectstatic --noinput
fi

echo "==> Iniciando: $@"
exec "$@"
