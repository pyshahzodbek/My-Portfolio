"""
Admin panel sozlamalari - Portfolio loyihasi

Admin panel orqali barcha modellarni boshqarish mumkin
"""

from django.contrib import admin
from .models import Profile, Skill, SkillCategory, Project, ContactMessage, SiteSettings


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    """
    Profil admin sozlamalari
    """
    list_display = ['ism', 'familiya', 'email', 'telefon', 'yaratilgan']
    search_fields = ['ism', 'familiya', 'email']
    list_filter = ['yaratilgan']
    readonly_fields = ['yaratilgan', 'yangilangan']
    
    fieldsets = (
        ('Shaxsiy ma\'lumotlar', {
            'fields': ('ism', 'familiya', 'email', 'telefon', 'tugilgan_sana', 'rasm')
        }),
        ('Qo\'shimcha ma\'lumotlar', {
            'fields': ('haqida', 'malaka', 'joylashuv')
        }),
        ('Ijtimoiy tarmoqlar', {
            'fields': ('github_username', 'linkedin_url', 'telegram_username')
        }),
        ('Timestamps', {
            'fields': ('yaratilgan', 'yangilangan'),
            'classes': ('collapse',)
        }),
    )


@admin.register(SkillCategory)
class SkillCategoryAdmin(admin.ModelAdmin):
    """
    Ko'nikma kategoriyasi admin sozlamalari
    """
    list_display = ['nomi', 'tartib_raqam', 'yaratilgan']
    search_fields = ['nomi']
    ordering = ['tartib_raqam']


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    """
    Ko'nikma admin sozlamalari
    """
    list_display = ['nomi', 'kategoriya', 'daraja', 'foiz', 'tartib_raqam']
    search_fields = ['nomi']
    list_filter = ['kategoriya', 'daraja']
    ordering = ['kategoriya', 'tartib_raqam']
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('nomi', 'kategoriya', 'daraja', 'foiz')
        }),
        ('Qo\'shimcha', {
            'fields': ('logo', 'tartib_raqam')
        }),
    )


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """
    Loyiha admin sozlamalari
    """
    list_display = ['nomi', 'manba', 'til', 'stars', 'forks', 'faol', 'yaratilgan']
    search_fields = ['nomi', 'tavsif', 'tech_stack']
    list_filter = ['manba', 'kategoriya', 'faol', 'yaratilgan']
    readonly_fields = ['github_id', 'stars', 'forks', 'yaratilgan', 'yangilangan']
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('nomi', 'tavsif', 'qisqa_tavsif', 'rasm')
        }),
        ('Havolalar', {
            'fields': ('github_link', 'live_link')
        }),
        ('Texnologiyalar', {
            'fields': ('tech_stack', 'kategoriya', 'til')
        }),
        ('GitHub', {
            'fields': ('manba', 'github_id', 'stars', 'forks'),
            'classes': ('collapse',)
        }),
        ('Boshqaruv', {
            'fields': ('faol', 'tartib_raqam')
        }),
        ('Timestamps', {
            'fields': ('yaratilgan', 'yangilangan'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    """
    Xabar admin sozlamalari
    """
    list_display = ['ism', 'email', 'kompaniya', 'mavzu', 'holat', 'yaratilgan']
    search_fields = ['ism', 'email', 'kompaniya', 'mavzu', 'xabar']
    list_filter = ['holat', 'email_yuborildi', 'telegram_yuborildi', 'yaratilgan']
    readonly_fields = ['email_yuborildi', 'telegram_yuborildi', 'yaratilgan', 'yangilangan']
    
    fieldsets = (
        ('Yuboruvchi', {
            'fields': ('ism', 'email', 'kompaniya')
        }),
        ('Xabar', {
            'fields': ('mavzu', 'xabar')
        }),
        ('Holat', {
            'fields': ('holat', 'email_yuborildi', 'telegram_yuborildi')
        }),
        ('Timestamps', {
            'fields': ('yaratilgan', 'yangilangan'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['email_yuborildi_belgi', 'telegram_yuborildi_belgi']
    
    def email_yuborildi_belgi(self, request, queryset):
        """Email yuborildi deb belgilash"""
        queryset.update(email_yuborildi=True)
    email_yuborildi_belgi.short_description = "Email yuborildi deb belgilash"
    
    def telegram_yuborildi_belgi(self, request, queryset):
        """Telegram yuborildi deb belgilash"""
        queryset.update(telegram_yuborildi=True)
    telegram_yuborildi_belgi.short_description = "Telegram yuborildi deb belgilash"


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    """
    Sayt sozlamalari admin sozlamalari
    """
    list_display = ['sayt_nomi', 'Aktiv', 'yaratilgan']
    readonly_fields = ['yaratilgan', 'yangilangan']
    
    def has_add_permission(self, request):
        # Faqat bitta yozuv bo'lishi kerak
        if SiteSettings.objects.exists():
            return False
        return super().has_add_permission(request)


# Admin panel sozlamalari
admin.site.site_header = "Portfolio Admin"
admin.site.site_title = "Portfolio Boshqaruvi"
admin.site.index_title = "Boshqaruv paneli"
