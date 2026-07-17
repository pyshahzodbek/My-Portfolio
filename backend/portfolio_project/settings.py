"""
Django sozlamalari - Portfolio loyihasi
Junior dasturchi uchun tushuntirilgan
"""

import os
from pathlib import Path
from decouple import config

# Loyiha ildiz papkasi
BASE_DIR = Path(__file__).resolve().parent.parent

# Xavfsizlik kaliti (production uchun o'zgartiring!)
SECRET_KEY = config('SECRET_KEY', default='django-insecure-change-me-in-production')

# Debug rejimi (production da False qiling)
DEBUG = config('DEBUG', default=True, cast=bool)

# Ruxsat etilgan hostlar
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='*', cast=lambda v: [s.strip() for s in v.split(',')])

# Qo'shilgan ilovalar
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Uchinchi tomon ilovalari
    'rest_framework',
    'corsheaders',
    
    # Bizning ilovalar
    'api',
]

# Middleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # Til aniqlash middleware
    'django.middleware.locale.LocaleMiddleware',
]

ROOT_URLCONF = 'portfolio_project.urls'

# Shablonlar
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'portfolio_project.wsgi.application'

# Ma'lumotlar bazasi
# Agar DB_ENGINE sozlanmagan bo'lsa, SQLite ishlatiladi (rivojlantirish uchun)
# Agar PostgreSQL kerak bo'lsa, .env faylida DB_ENGINE=django.db.backends.postgresql qiling
DB_ENGINE = config('DB_ENGINE', default='django.db.backends.sqlite3')

if DB_ENGINE == 'django.db.backends.postgresql':
    # PostgreSQL (production uchun)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': config('DB_NAME', default='portfolio_db'),
            'USER': config('DB_USER', default='postgres'),
            'PASSWORD': config('DB_PASSWORD', default='postgres'),
            'HOST': config('DB_HOST', default='localhost'),
            'PORT': config('DB_PORT', default='5432'),
        }
    }
else:
    # SQLite (rivojlantirish uchun - o'rnatish shart emas)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Parol validatsiyasi
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Xalqaro tillar (i18n)
LANGUAGE_CODE = 'uz'

LANGUAGES = [
    ('uz', "O'zbek"),
    ('ru', 'Русский'),
    ('en', 'English'),
]

# Tarjima fayllari manzili
LOCALE_PATHS = [
    BASE_DIR / 'locale',
]

USE_I18N = True
USE_L10N = True

# Vaqt mintaqasi
TIME_ZONE = 'Asia/Tashkent'
USE_TZ = True

# Static fayllar
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

# Media fayllar (rasmlar)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default avtorizatsiya modeli
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS sozlamalari (Frontend bilan ishlash uchun)
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:3000,http://localhost:5500',
    cast=lambda v: [s.strip() for s in v.split(',')]
)

CORS_ALLOW_ALL_ORIGINS = DEBUG

# REST Framework sozlamalari
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
}

# Email sozlamalari (Gmail uchun)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='Portfolio <noreply@portfolio.com>')

# Telegram bot sozlamalari
TELEGRAM_BOT_TOKEN = config('TELEGRAM_BOT_TOKEN', default='')
TELEGRAM_CHAT_ID = config('TELEGRAM_CHAT_ID', default='')

# GitHub API sozlamalari
GITHUB_USERNAME = config('GITHUB_USERNAME', default '')
GITHUB_API_TOKEN = config('GITHUB_API_TOKEN', default='')

# Logging sozlamalari
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
