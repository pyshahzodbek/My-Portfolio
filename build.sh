#!/bin/bash

# Render.com build script
echo "Building Portfolio Backend..."

cd backend

# pip upgrade
pip install --upgrade pip

# Kutubxonalarni o'rnatish
pip install -r requirements.txt

# Static fayllarni yig'ish
python manage.py collectstatic --noinput

# Migration
python manage.py migrate --noinput

echo "Build complete!"
