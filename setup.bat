@echo off
REM Portfolio loyihasini o'rnatish skripti (Windows)
REM Bu skript virtual muhitni yaratadi va barcha kutubxonalarni o'rnadi

echo 🚀 Portfolio loyihasini o'rnatish boshlanmoqda...

REM 1. Backend papkasiga o'tish
echo 📁 Backend papkasiga o'tilmoqda...
cd backend

REM 2. Virtual muhit yaratish
echo 🐍 Virtual muhit yaratilmoqda...
python -m venv venv

REM 3. Virtual muhitni aktivlashtirish
echo ✅ Virtual muhit aktivlashtirilmoqda...
call venv\Scripts\activate.bat

REM 4. Kutubxonalarni o'rnatish
echo 📦 Kutubxonalarni o'rnatish...
pip install --upgrade pip
pip install -r requirements.txt

REM 5. .env faylini yaratish (agar yo'q bo'lsa)
if not exist .env (
    echo 📝 .env fayli yaratilmoqda...
    (
        echo # Django sozlamalari
        echo SECRET_KEY=django-insecure-change-me-in-production
        echo DEBUG=True
        echo ALLOWED_HOSTS=localhost,127.0.0.1
        echo.
        echo # PostgreSQL ma'lumotlari
        echo DB_NAME=portfolio_db
        echo DB_USER=postgres
        echo DB_PASSWORD=postgres
        echo DB_HOST=localhost
        echo DB_PORT=5432
        echo.
        echo # CORS sozlamalari
        echo CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5500
        echo.
        echo # Gmail sozlamalari
        echo EMAIL_HOST=smtp.gmail.com
        echo EMAIL_PORT=587
        echo EMAIL_USE_TLS=True
        echo EMAIL_HOST_USER=your_email@gmail.com
        echo EMAIL_HOST_PASSWORD=your_app_password_here
        echo DEFAULT_FROM_EMAIL=Portfolio ^<noreply@portfolio.com^>
        echo.
        echo # Telegram bot sozlamalari
        echo TELEGRAM_BOT_TOKEN=your_bot_token_here
        echo TELEGRAM_CHAT_ID=your_chat_id_here
        echo.
        echo # GitHub API sozlamalari
        echo GITHUB_USERNAME=your_github_username
        echo GITHUB_API_TOKEN=your_github_token_here
    ) > .env
    echo ⚠️  .env faylini tahrirlang: backend\.env
)

REM 6. Migration ishga tushirish
echo 🔄 Migration ishga tushirilmoqda...
python manage.py makemigrations api
python manage.py migrate

REM 7. Superuser yaratish
echo 👤 Superuser yaratilmoqda...
echo Admin panel uchun login ma'lumotlarini kiriting:
python manage.py createsuperuser

REM 8. Static fayllarni yig'ish
echo 📁 Static fayllar yig'ilmoqda...
python manage.py collectstatic --noinput

echo.
echo ✅ O'rnatish tugadi!
echo.
echo 🚀 Serverni ishga tushirish uchun:
echo    cd backend
echo    venv\Scripts\activate
echo    python manage.py runserver
echo.
echo 🌐 Frontend uchun:
echo    cd frontend
echo    python -m http.server 5500
echo.
echo 🔗 Havolalar:
echo    Backend API: http://localhost:8000/api/
echo    Admin Panel: http://localhost:8000/admin/
echo    Frontend: http://localhost:5500/
echo.
echo 📚 Qo'llanma: README.md faylini o'qing
pause
