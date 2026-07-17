"""
Serializers - Ma'lumotlarni JSON formatga o'girish

Serializers:
- ProfileSerializer: Profil ma'lumotlari
- SkillSerializer: Ko'nikmalar
- SkillCategorySerializer: Ko'nikma kategoriyalari
- ProjectSerializer: Loyihalar
- ContactMessageSerializer: Xabarlar
- SiteSettingsSerializer: Sayt sozlamalari
"""

from rest_framework import serializers
from .models import (
    Profile, Skill, SkillCategory, Project,
    ContactMessage, SiteSettings
)


class ProfileSerializer(serializers.ModelSerializer):
    """
    Profil serializer
    To'liq ismni qo'shimcha maydon sifatida qaytaradi
    """
    toza_ism = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = '__all__'

    def get_toza_ism(self, obj):
        return obj.toza_ism()


class SkillCategorySerializer(serializers.ModelSerializer):
    """
    Ko'nikma kategoriyasi serializer
    Ichidagi ko'nikmalarni ham qaytaradi
    """
    skills = serializers.SerializerMethodField()

    class Meta:
        model = SkillCategory
        fields = '__all__'

    def get_skills(self, obj):
        skills = obj.skills.all()
        return SkillSerializer(skills, many=True).data


class SkillSerializer(serializers.ModelSerializer):
    """
    Ko'nikma serializer
    Daraja display ni qo'shimcha qaytaradi
    """
    daraja_display = serializers.CharField(source='get_daraja_display', read_only=True)
    kategoriya_nomi = serializers.CharField(source='kategoriya.nomi', read_only=True)

    class Meta:
        model = Skill
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    """
    Loyiha serializer
    Tech stack ni ro'yxat sifatida qaytaradi
    """
    tech_list = serializers.SerializerMethodField()
    manba_display = serializers.CharField(source='get_manba_display', read_only=True)

    class Meta:
        model = Project
        fields = '__all__'

    def get_tech_list(self, obj):
        return obj.tech_list()


class ContactMessageSerializer(serializers.ModelSerializer):
    """
    Xabar serializer
    Yuborish uchun (faqat o'qish emas)
    """
    class Meta:
        model = ContactMessage
        fields = ['id', 'ism', 'email', 'kompaniya', 'mavzu', 'xabar']
        read_only_fields = ['id', 'holat', 'email_yuborildi', 'telegram_yuborildi']


class ContactMessageAdminSerializer(serializers.ModelSerializer):
    """
    Xabar serializer (admin uchun)
    Barcha maydonlarni ko'rsatadi
    """
    holat_display = serializers.CharField(source='get_holat_display', read_only=True)

    class Meta:
        model = ContactMessage
        fields = '__all__'


class SiteSettingsSerializer(serializers.ModelSerializer):
    """
    Sayt sozlamalari serializer
    """
    class Meta:
        model = SiteSettings
        fields = '__all__'
