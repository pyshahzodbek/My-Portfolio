@echo off
REM Portfolio serverni ishga tushirish (Windows)

echo 🚀 Portfolio server ishga tushirilmoqda...

REM Backend
echo 📡 Backend server ishga tushirilmoqda...
start "Backend Server" cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"

REM Frontend
echo 🌐 Frontend server ishga tushirilmoqda...
start "Frontend Server" cmd /k "cd frontend && python -m http.server 5500"

echo.
echo ✅ Serverlar ishga tushdi!
echo.
echo 🔗 Havolalar:
echo    Backend API: http://localhost:8000/api/
echo    Admin Panel: http://localhost:8000/admin/
echo    Frontend: http://localhost:5500/
echo.
echo ⏹️  Serverlarni to'xtatish uchun oynalarni yoping
pause
