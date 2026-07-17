# Portfolio - Junior Developer

Junior dasturchi uchun portfolio sayt + DevOps o'rganish loyihasi.

## 🎯 Loyiha Maqsadi

1. **Portfolio sayt yaratish** — Junior dasturchi sifatida ko'rsatish
2. **DevOps o'rganish** — CI/CD, Docker, Deploy
3. **GitHub Integration** — Loyihalarni avtomatik olish
4. **Contact Form** — Kompaniyalar uchun bog'lanish
5. **Internationalization** — 3 til (uz, ru, en)

## 🛠 Tech Stack

### Backend (Junior Level)
- **Python** — Asosiy til
- **Django REST Framework** — API yaratish
- **PostgreSQL** — Ma'lumotlar bazasi
- **Docker** — Konteynerizatsiya

### Frontend (Senior Level)
- **HTML5** — Struktura
- **CSS3** — Dizayn (CSS Variables, Grid, Flexbox)
- **JavaScript** — Interaktivlik (ES6+, Classes, Async/Await)
- **Lucide Icons** — Ikonkalar

### DevOps
- **GitHub Actions** — CI/CD pipeline
- **Docker** — Konteynerizatsiya
- **Nginx** — Frontend server
- **Gunicorn** — Backend server

## 📁 Loyiha Tuzilishi

```
PortfolioProjcts/
├── backend/                    # Django REST Framework
│   ├── portfolio_project/     # Django project
│   │   ├── settings.py       # Sozlamalar
│   │   ├── urls.py           # URL routing
│   │   └── wsgi.py           # WSGI
│   ├── api/                   # REST API
│   │   ├── models.py         # Modellar
│   │   ├── serializers.py    # Serializers
│   │   ├── views.py          # Views
│   │   ├── urls.py           # API URLs
│   │   ├── admin.py          # Admin panel
│   │   ├── github_service.py # GitHub API
│   │   └── notifications.py  # Email/Telegram
│   ├── locale/                # Tarjimalar
│   ├── requirements.txt      # Kutubxonalar
│   ├── Dockerfile            # Docker
│   └── .env                  # Environment variables
├── frontend/                  # HTML/CSS/JS
│   ├── index.html            # Asosiy sahifa
│   ├── css/style.css         # Dizayn
│   └── js/
│       ├── main.js           # Asosiy JS
│       ├── i18n.js           # Tarjimalar
│       └── lang/
│           ├── uz.json       # O'zbek
│           ├── ru.json       # Rus
│           └── en.json       # Ingliz
├── .github/workflows/         # CI/CD
│   ├── ci.yml                # CI pipeline
│   └── deploy.yml            # CD pipeline
├── docker-compose.yml        # Docker Compose
├── nginx.conf                # Nginx sozlamalari
└── README.md                 # Hujjatlar
```

## 🚀 O'rnatish

### 1. Backend o'rnatish

```bash
# Papkaga o'tish
cd backend

# Virtual muhit yaratish
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Kutubxonalarni o'rnatish
pip install -r requirements.txt

# .env faylini yaratish
cp .env.example .env
# .env faylini tahrirlang

# Migration ishga tushirish
python manage.py migrate

# Admin panel yaratish
python manage.py createsuperuser

# Serverni ishga tushirish
python manage.py runserver
```

### 2. Frontend ishga tushirish

```bash
# Oddiy HTTP server
cd frontend
python -m http.server 5500

# Yoki VS Code Live Server
```

### 3. Docker bilan ishga tushirish

```bash
# Docker Compose
docker-compose up --build

# Yoki alohida
cd backend
docker build -t portfolio-backend .
docker run -p 8000:8000 portfolio-backend
```

## 🌐 API Endpointlari

| Method | Endpoint | Maqsad |
|--------|----------|--------|
| GET | `/api/profil/` | Profil ma'lumotlari |
| GET | `/api/kategoriyalar/` | Ko'nikma kategoriyalari |
| GET | `/api/konikmalar/` | Ko'nikmalar |
| GET | `/api/loyihalar/` | Loyihalar |
| GET | `/api/loyihalar/{id}/` | Bitta loyiha |
| GET | `/api/github-loyihalar/` | GitHub loyihalari |
| GET | `/api/github-statistika/` | GitHub statistikasi |
| POST | `/api/xabar/` | Xabar yuborish |
| GET | `/api/sozlamalar/` | Sayt sozlamalari |
| GET | `/api/tillar/` | Tillar |

## 🔧 Sozlamalar

### Environment Variables (.env)

```bash
# Django
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# PostgreSQL
DB_NAME=portfolio_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Telegram
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id

# GitHub
GITHUB_USERNAME=your-username
GITHUB_API_TOKEN=your-token
```

## 📧 Gmail Sozlash

1. **Google Account** ga kiring
2. **Two-Factor Authentication** yoqing
3. **App Password** yarating
4. App Password ni `.env` faylga qo'shing

## 🤖 Telegram Bot Yaratish

1. **@BotFather** ga `/newbot` yozing
2. Bot nomini kiriting
3. Bot username kiriting
4. Token ni `.env` faylga qo'shing
5. **@userinfobot** orqali Chat ID ni toping

## 🚀 Deploy

### Render.com (Bepul)

1. **Render.com** da ro'yxatdan o'ting
2. **New Web Service** yarating
3. GitHub repo ni ulang
4. Settings:
   - Build Command: `cd backend && pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - Start Command: `cd backend && gunicorn portfolio_project.wsgi:application`

### Oracle Cloud (Bepul VPS)

1. **Oracle Cloud Free Tier** da ro'yxatdan o'ting
2. **VM Instance** yarating
3. Docker o'rnating
4. Loyihani clone qiling
5. `docker-compose up --build` ishga tushiring

## 📚 DevOps O'rganiladiganlar

1. **Git** — Version control
2. **Docker** — Konteynerizatsiya
3. **GitHub Actions** — CI/CD
4. **PostgreSQL** — Database
5. **Nginx** — Web server
6. **Gunicorn** — WSGI server
7. **Environment Variables** — Xavfsizlik
8. **API Integration** — GitHub API
9. **Email Service** — SMTP
10. **Telegram Bot** — Bot API

## 🤝 Qo'shilish

1. Fork qiling
2. Branch yarating (`git checkout -b feature/amazing-feature`)
3. O'zgarishlarni commit qiling (`git commit -m 'Add amazing feature'`)
4. Push qiling (`git push origin feature/amazing-feature`)
5. Pull Request yarating

## 📄 Litsenziya

MIT Litsenziyasi - batafsil [LICENSE](LICENSE) faylida.

---

**Junior Developer** — DevOps o'rganish loyihasi 🚀
