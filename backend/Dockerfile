# Python versiyasi
FROM python:3.11-slim

# Muhit o'zgaruvchilari
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Ish papkasini yaratish
WORKDIR /app

# Tizim paketlarini o'rnatish
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Python kutubxonalarini o'rnatish
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Loyiha fayllarini ko'chirish
COPY . .

# Media papkasini yaratish
RUN mkdir -p media/projects media/profile media/skills

# Static fayllarni yig'ish
RUN python manage.py collectstatic --noinput

# Portni ochish
EXPOSE 8000

# Serverni ishga tushirish
CMD ["gunicorn", "portfolio_project.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
