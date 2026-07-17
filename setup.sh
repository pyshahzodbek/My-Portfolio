#!/bin/bash
# Portfolio loyihasini o'rnatish skripti
# Bu skript virtual muhitni yaratadi va barcha kutubxonalarni o'rnadi

echo "🚀 Portfolio loyihasini o'rnatish boshlanmoqda..."

# 1. Backend papkasiga o'tish
echo "📁 Backend papkasiga o'tilmoqda..."
cd backend

# 2. Virtual muhit yaratish
echo "🐍 Virtual muhit yaratilmoqda..."
python -m venv venv

# 3. Virtual muhitni aktivlashtirish
echo "✅ Virtual muhit aktivlashtirilmoqda..."
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    source venv/Scripts/activate
else
    # Linux/Mac
    source venv/bin/activate
fi

# 4. Kutubxonalarni o'rnatish
echo "📦 Kutubxonalarni o'rnatish..."
pip install --upgrade pip
pip install -r requirements.txt

# 5. .env faylini yaratish (agar yo'q bo'lsa)
if [ ! -f .env ]; then
    echo "📝 .env fayli yaratilmoqda..."
    cat > .env << 'EOF'
# Django sozlamalari
SECRET_KEY=django-insecure-change-me-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# PostgreSQL ma'lumotlari
DB_NAME=portfolio_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# CORS sozlamalari
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5500

# Gmail sozlamalari
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password_here
DEFAULT_FROM_EMAIL=Portfolio <noreply@portfolio.com>

# Telegram bot sozlamalari
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# GitHub API sozlamalari
GITHUB_USERNAME=your_github_username
GITHUB_API_TOKEN=your_github_token_here
EOF
    echo "⚠️  .env faylini tahrirlang: backend/.env"
fi

# 6. Database yaratish (PostgreSQL bo'lsa)
echo "🗄️  Database tekshirilmoqda..."
if command -v psql &> /dev/null; then
    echo "PostgreSQL topildi. Database yaratilmoqda..."
    psql -U postgres -c "CREATE DATABASE portfolio_db;" 2>/dev/null || echo "Database allaqachon mavjud"
fi

# 7. Migration ishga tushirish
echo "🔄 Migration ishga tushirilmoqda..."
python manage.py makemigrations api
python manage.py migrate

# 8. Superuser yaratish
echo "👤 Superuser yaratilmoqda..."
echo "Admin panel uchun login ma'lumotlarini kiriting:"
python manage.py createsuperuser

# 9. Static fayllarni yig'ish
echo "📁 Static fayllar yig'ilmoqda..."
python manage.py collectstatic --noinput

echo ""
echo "✅ O'rnatish tugadi!"
echo ""
echo "🚀 Serverni ishga tushirish uchun:"
echo "   cd backend"
echo "   venv\\Scripts\\activate  # Windows"
echo "   python manage.py runserver"
echo ""
echo "🌐 Frontend uchun:"
echo "   cd frontend"
echo "   python -m http.server 5500"
echo ""
echo "🔗 Havolalar:"
echo "   Backend API: http://localhost:8000/api/"
echo "   Admin Panel: http://localhost:8000/admin/"
echo "   Frontend: http://localhost:5500/"
echo ""
echo "📚 Qo'llanma: README.md faylini o'qing"
