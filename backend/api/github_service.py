"""
GitHub API xizmati

GitHub API orqali loyihalarni avtomatik olish
Caching bilan (simple cache)
"""

import requests
import logging
from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger(__name__)

# GitHub API bazasi
GITHUB_API_BASE = 'https://api.github.com'


def get_github_user_info(username=None):
    """
    GitHub foydalanuvchi ma'lumotlarini oladi
    
    Args:
        username: GitHub username (agar None bo'lsa, settings dan oladi)
    
    Returns:
        dict: Foydalanuvchi ma'lumotlari yoki None
    """
    if username is None:
        username = settings.GITHUB_USERNAME
    
    if not username:
        logger.warning("GitHub username sozlanmagan")
        return None
    
    # Cache tekshirish
    cache_key = f'github_user_{username}'
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data
    
    try:
        url = f'{GITHUB_API_BASE}/users/{username}'
        headers = {'Accept': 'application/vnd.github.v3+json'}
        
        # Token bo'lsa, ishlatish
        if settings.GITHUB_API_TOKEN:
            headers['Authorization'] = f'token {settings.GITHUB_API_TOKEN}'
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Saqlash (1 soat)
        cache.set(cache_key, data, 3600)
        
        return data
        
    except requests.RequestException as e:
        logger.error(f"GitHub API xatosi: {e}")
        return None


def get_github_repos(username=None, sort='updated', per_page=30):
    """
    GitHub foydalanuvchining loyihalarini oladi
    
    Args:
        username: GitHub username
        sort: Saralash (updated, created, pushed, full_name)
        per_page: Sahifadagi elementlar soni
    
    Returns:
        list: Loyihalar ro'yxati yoki bo'sh ro'yxat
    """
    if username is None:
        username = settings.GITHUB_USERNAME
    
    if not username:
        logger.warning("GitHub username sozlanmagan")
        return []
    
    # Cache tekshirish
    cache_key = f'github_repos_{username}_{sort}_{per_page}'
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data
    
    try:
        url = f'{GITHUB_API_BASE}/users/{username}/repos'
        headers = {'Accept': 'application/vnd.github.v3+json'}
        params = {
            'sort': sort,
            'per_page': per_page,
            'type': 'owner'  # Faqat o'z loyihalari
        }
        
        # Token bo'lsa, ishlatish
        if settings.GITHUB_API_TOKEN:
            headers['Authorization'] = f'token {settings.GITHUB_API_TOKEN}'
        
        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        
        repos = response.json()
        
        # Faqat kerakli ma'lumotlarni olish
        filtered_repos = []
        for repo in repos:
            # Fork qilingan loyihalarni chiqarib tashlash
            if repo.get('fork'):
                continue
            
            filtered_repos.append({
                'github_id': str(repo['id']),
                'nomi': repo['name'],
                'tavsif': repo.get('description', '') or '',
                'github_link': repo['html_url'],
                'live_link': repo.get('homepage', '') or '',
                'til': repo.get('language', '') or '',
                'stars': repo.get('stargazers_count', 0),
                'forks': repo.get('forks_count', 0),
                'tech_stack': repo.get('language', '') or '',
                'manba': 'github',
                'faol': not repo.get('archived', False),
            })
        
        # Saqlash (30 daqiqa)
        cache.set(cache_key, filtered_repos, 1800)
        
        return filtered_repos
        
    except requests.RequestException as e:
        logger.error(f"GitHub API xatosi: {e}")
        return []


def get_github_languages(username=None):
    """
    GitHub foydalanuvchining ishlatgan tillarini oladi
    
    Args:
        username: GitHub username
    
    Returns:
        dict: Tillar va ularning ishlatilish soni
    """
    repos = get_github_repos(username)
    
    languages = {}
    for repo in repos:
        lang = repo.get('til')
        if lang:
            languages[lang] = languages.get(lang, 0) + 1
    
    return languages


def get_github_stats(username=None):
    """
    GitHub statistikasini oladi
    
    Args:
        username: GitHub username
    
    Returns:
        dict: Statistika
    """
    user_info = get_github_user_info(username)
    repos = get_github_repos(username)
    
    if not user_info:
        return {}
    
    total_stars = sum(repo.get('stars', 0) for repo in repos)
    total_forks = sum(repo.get('forks', 0) for repo in repos)
    
    return {
        'jami_loyihalar': user_info.get('public_repos', 0),
        'jami_yulduzlar': total_stars,
        'jami_fork_lar': total_forks,
        'obunachilar': user_info.get('followers', 0),
        'obuna_bo'lganlar': user_info.get('following', 0),
        'ochilgan_ilovalar': user_info.get('public_gists', 0),
    }
