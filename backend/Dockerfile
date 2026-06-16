FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
        libpq5 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

RUN chmod +x docker/entrypoint.sh

RUN groupadd --system django && useradd --system --gid django django \
    && chown -R django:django /app
USER django

EXPOSE 8000

ENTRYPOINT ["/bin/sh", "./docker/entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
