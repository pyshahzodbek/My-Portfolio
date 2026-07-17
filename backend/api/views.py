"""
API Views - Portfolio loyihasi

Views:
- ProfilView: Profil ma'lumotlari
- SkillCategoryView: Ko'nikma kategoriyalari
- SkillView: Ko'nikmalar
- ProjectView: Loyihalar
- GitHubProjectsView: GitHub loyihalari
- ContactMessageView: Xabar yuborish
- SiteSettingsView: Sayt sozlamalari
- GitHubStatsView: GitHub statistikasi
"""

import logging
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Profile, Skill, SkillCategory, Project, ContactMessage, SiteSettings
from .serializers import (
    ProfileSerializer,
    SkillSerializer,
    SkillCategorySerializer,
    ProjectSerializer,
    ContactMessageSerializer,
    SiteSettingsSerializer,
)
from .github_service import get_github_repos, get_github_stats
from .notifications import (
    kontakt_xabar_email,
    kontakt_xabar_telegram,
)

logger = logging.getLogger(__name__)


class ProfilView(APIView):
    """
    Profil ma'lumotlari API view
    GET: Profilni qaytaradi
    """
    
    def get(self, request):
        profil = Profile.objects.first()
        if not profil:
            return Response(
                {'xato': 'Profil topilmadi'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProfileSerializer(profil)
        return Response(serializer.data)


class SkillCategoryView(APIView):
    """
    Ko'nikma kategoriyalari API view
    GET: Barcha kategoriyalarni qaytaradi
    """
    
    def get(self, request):
        kategoriyalar = SkillCategory.objects.all()
        serializer = SkillCategorySerializer(kategoriyalar, many=True)
        return Response(serializer.data)


class SkillView(APIView):
    """
    Ko'nikmalar API view
    GET: Barcha ko'nikmalarni qaytaradi
    """
    
    def get(self, request):
        kategoriya = request.query_params.get('kategoriya')
        
        if kategoriya:
            skills = Skill.objects.filter(kategoriya_id=kategoriya)
        else:
            skills = Skill.objects.all()
        
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data)


class ProjectView(APIView):
    """
    Loyihalar API view
    GET: Barcha loyihalarni qaytaradi
    """
    
    def get(self, request):
        manba = request.query_params.get('manba')
        faol = request.query_params.get('faol')
        
        loyihalar = Project.objects.all()
        
        if manba:
            loyihalar = loyihalar.filter(manba=manba)
        
        if faol is not None:
            loyihalar = loyihalar.filter(faol=faol.lower() == 'true')
        
        serializer = ProjectSerializer(loyihalar, many=True)
        return Response(serializer.data)


class LoyihaDetailView(APIView):
    """
    Bitta loyiha API view
    GET: Bitta loyihani qaytaradi
    """
    
    def get(self, request, pk):
        try:
            loyiha = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return Response(
                {'xato': 'Loyiha topilmadi'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProjectSerializer(loyiha)
        return Response(serializer.data)


class GitHubProjectsView(APIView):
    """
    GitHub loyihalari API view
    GET: GitHub dan loyihalarni oladi
    """
    
    def get(self, request):
        username = request.query_params.get('username')
        
        loyihalar = get_github_repos(username)
        
        # Bazaga saqlash (agar yo'q bo'lsa)
        for loyiha_data in loyihalar:
            github_id = loyiha_data.get('github_id')
            if github_id and not Project.objects.filter(github_id=github_id).exists():
                Project.objects.create(**loyiha_data)
        
        return Response(loyihalar)


class GitHubStatsView(APIView):
    """
    GitHub statistikasi API view
    GET: GitHub statistikasini qaytaradi
    """
    
    def get(self, request):
        username = request.query_params.get('username')
        
        statistika = get_github_stats(username)
        
        if not statistika:
            return Response(
                {'xato': 'GitHub ma\'lumotlari topilmadi'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(statistika)


class ContactMessageView(APIView):
    """
    Xabar yuborish API view
    POST: Xabar yuborish
    """
    
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        
        if serializer.is_valid():
            # Xabarni saqlash
            xabar = serializer.save()
            
            # Email yuborish
            try:
                email_yuborildi = kontakt_xabar_email(
                    ism=xabar.ism,
                    email=xabar.email,
                    kompaniya=xabar.kompaniya,
                    mavzu=xabar.mavzu,
                    xabar=xabar.xabar,
                )
                xabar.email_yuborildi = email_yuborildi
            except Exception as e:
                logger.error(f"Email xatosi: {e}")
            
            # Telegram yuborish
            try:
                telegram_yuborildi = kontakt_xabar_telegram(
                    ism=xabar.ism,
                    email=xabar.email,
                    kompaniya=xabar.kompaniya,
                    mavzu=xabar.mavzu,
                    xabar=xabar.xabar,
                )
                xabar.telegram_yuborildi = telegram_yuborildi
            except Exception as e:
                logger.error(f"Telegram xatosi: {e}")
            
            xabar.save()
            
            return Response(
                {
                    'muvaqqatli': True,
                    'xabar': 'Xabaringiz muvaffaqiyatli yuborildi!',
                    'id': xabar.id,
                },
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class SiteSettingsView(APIView):
    """
    Sayt sozlamalari API view
    GET: Sayt sozlamalarini qaytaradi
    """
    
    def get(self, request):
        sozlamalar = SiteSettings.objects.first()
        
        if not sozlamalar:
            # Default sozlamalar
            sozlamalar = SiteSettings.objects.create(
                sayt_nomi='Portfolio',
                sayt_tavsifi='Junior Developer Portfolio',
                copyright_matni='© 2024 Portfolio. Barcha huquqlar himoyalangan.',
            )
        
        serializer = SiteSettingsSerializer(sozlamalar)
        return Response(serializer.data)


@api_view(['GET'])
def til_ozgartirish(request):
    """
    Tilni o'zgartirish uchun endpoint
    GET: Qo'llab-quvvatlanadigan tillarni qaytaradi
    """
    from django.conf import settings
    
    tillar = [
        {'kod': 'uz', 'nomi': "O'zbek"},
        {'kod': 'ru', 'nomi': 'Русский'},
        {'kod': 'en', 'nomi': 'English'},
    ]
    
    return Response({
        'tillar': tillar,
        'joriy_til': request.LANGUAGE_CODE,
    })
