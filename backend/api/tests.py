"""
API testlari - Portfolio loyihasi
pytest bilan ishlaydi
"""

import pytest
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from .models import Profile, Skill, Project


class ProfileAPITest(TestCase):
    """Profil API testlari"""
    
    def setUp(self):
        self.client = APIClient()
        self.profile = Profile.objects.create(
            ism='Test',
            familiya='Developer',
            email='test@example.com',
            haqida='Test bio',
            joylashuv='Toshkent',
        )
    
    def test_profil_olish(self):
        """Profil ma'lumotlarini olish"""
        response = self.client.get('/api/profil/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['ism'], 'Test')
        self.assertEqual(response.data['familiya'], 'Developer')


class SkillAPITest(TestCase):
    """Ko'nikma API testlari"""
    
    def setUp(self):
        self.client = APIClient()
        self.skill = Skill.objects.create(
            nomi='Python',
            daraja='yukori',
            foiz=85,
        )
    
    def test_konikmalar_olish(self):
        """Ko'nikmalar ro'yxatini olish"""
        response = self.client.get('/api/konikmalar/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ProjectAPITest(TestCase):
    """Loyiha API testlari"""
    
    def setUp(self):
        self.client = APIClient()
        self.project = Project.objects.create(
            nomi='Test Loyiha',
            tavsif='Test tavsif',
            tech_stack='Python, Django',
            github_link='https://github.com/test/project',
        )
    
    def test_loyihalar_olish(self):
        """Loyihalar ro'yxatini olish"""
        response = self.client.get('/api/loyihalar/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_loyiha_detail(self):
        """Bitta loyiha ma'lumotlarini olish"""
        response = self.client.get(f'/api/loyihalar/{self.project.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nomi'], 'Test Loyiha')


class ContactAPITest(TestCase):
    """Kontakt API testlari"""
    
    def setUp(self):
        self.client = APIClient()
    
    def test_xabar_yuborish(self):
        """Xabar yuborish"""
        data = {
            'ism': 'Test User',
            'email': 'test@example.com',
            'mavzu': 'Test mavzu',
            'xabar': 'Test xabar',
        }
        response = self.client.post('/api/xabar/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['muvaqqatli'])
