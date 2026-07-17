"""
Ma'lumotlar modellari - Portfolio loyihasi

Modellar:
- Profile: Shaxsiy ma'lumotlar
- Skill: Ko'nikmalar
- Project: Loyihalar
- ContactMessage: Xabarlar
"""

from django.db import models
from django.utils.translation import gettext_lazy as _


class Profile(models.Model):
    """
    Shaxsiy profil ma'lumotlari
    """
    ism = models.CharField(_('Ism'), max_length=100)
    familiya = models.CharField(_('Familiya'), max_length=100)
    email = models.EmailField(_('Email manzil'), unique=True)
    telefon = models.CharField(_('Telefon raqam'), max_length=20, blank=True)
    tugilgan_sana = models.DateField(_('Tugilgan sana'), null=True, blank=True)
    haqida = models.TextField(_('Haqida'), blank=True)
    rasm = models.ImageField(_('Profil rasmi'), upload_to='profile/', blank=True, null=True)
    github_username = models.CharField(_('GitHub username'), max_length=100, blank=True)
    linkedin_url = models.URLField(_('LinkedIn URL'), blank=True)
    telegram_username = models.CharField(_('Telegram username'), max_length=100, blank=True)
    joylashuv = models.CharField(_('Joylashuv'), max_length=200, blank=True)
    malaka = models.CharField(_('Malaka'), max_length=200, blank=True)
    yaratilgan = models.DateTimeField(auto_now_add=True)
    yangilangan = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Profil')
        verbose_name_plural = _('Profillar')
        ordering = ['-yaratilgan']

    def __str__(self):
        return f"{self.ism} {self.familiya}"

    def toza_ism(self):
        """Toza ism qaytaradi"""
        return f"{self.ism} {self.familiya}".strip()


class SkillCategory(models.Model):
    """
    Ko'nikma kategoriyalari (masalan: Frontend, Backend, DevOps)
    """
    nomi = models.CharField(_('Kategoriya nomi'), max_length=100)
    tartib_raqam = models.IntegerField(_('Tartib raqami'), default=0)
    yaratilgan = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Ko\'nikma kategoriyasi')
        verbose_name_plural = _('Ko\'nikma kategoriyalari')
        ordering = ['tartib_raqam']

    def __str__(self):
        return self.nomi


class Skill(models.Model):
    """
    Ko'nikmalar (masalan: Python, JavaScript, Docker)
    """
    DARAJA_CHOICES = [
        ('boshlangich', _('Boshlang\'ich')),
        ('orta', _('O\'rta')),
        ('yukori', _('Yuqori')),
        ('expert', _('Ekspert')),
    ]

    nomi = models.CharField(_('Ko\'nikma nomi'), max_length=100)
    kategoriya = models.ForeignKey(
        SkillCategory,
        on_delete=models.CASCADE,
        related_name='skills',
        verbose_name=_('Kategoriya')
    )
    daraja = models.CharField(
        _('Daraja'),
        max_length=20,
        choices=DARAJA_CHOICES,
        default='orta'
    )
    foiz = models.IntegerField(
        _('Daraja foizi'),
        default=50,
        help_text=_('0-100 orasida daraja foizi')
    )
    logo = models.ImageField(_('Logo rasm'), upload_to='skills/', blank=True, null=True)
    tartib_raqam = models.IntegerField(_('Tartib raqami'), default=0)
    yaratilgan = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Ko\'nikma')
        verbose_name_plural = _('Ko\'nikmalar')
        ordering = ['kategoriya', 'tartib_raqam']

    def __str__(self):
        return f"{self.nomi} ({self.get_daraja_display()})"


class Project(models.Model):
    """
    Loyihalar (GitHub dan avtomatik yoki qo'lda qo'shilgan)
    """
    MANBA_CHOICES = [
        ('manual', _('Qo\'lda qo\'shilgan')),
        ('github', _('GitHub API dan')),
    ]

    nomi = models.CharField(_('Loyiha nomi'), max_length=200)
    tavsif = models.TextField(_('Tavsif'))
    qisqa_tavsif = models.CharField(_('Qisqa tavsif'), max_length=300, blank=True)
    rasm = models.ImageField(_('Loyiha rasmi'), upload_to='projects/', blank=True, null=True)
    github_link = models.URLField(_('GitHub link'), blank=True)
    live_link = models.URLField(_('Live demo link'), blank=True)
    tech_stack = models.CharField(
        _('Tech stack'),
        max_length=500,
        help_text=_('Texnologiyalar vergul bilan ajratilgan')
    )
    kategoriya = models.CharField(_('Kategoriya'), max_length=100, blank=True)
    manba = models.CharField(
        _('Manba'),
        max_length=20,
        choices=MANBA_CHOICES,
        default='manual'
    )
    github_id = models.CharField(_('GitHub ID'), max_length=100, blank=True, unique=True)
    stars = models.IntegerField(_('Yulduzlar soni'), default=0)
    forks = models.IntegerField(_('Fork lar soni'), default=0)
    til = models.CharField(_('Asosiy til'), max_length=50, blank=True)
    faol = models.BooleanField(_('Faol loyiha'), default=True)
    tartib_raqam = models.IntegerField(_('Tartib raqami'), default=0)
    yaratilgan = models.DateTimeField(auto_now_add=True)
    yangilangan = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Loyiha')
        verbose_name_plural = _('Loyihalar')
        ordering = ['tartib_raqam', '-yaratilgan']

    def __str__(self):
        return self.nomi

    def tech_list(self):
        """Tech stack ni ro'yxat sifatida qaytaradi"""
        return [t.strip() for t in self.tech_stack.split(',') if t.strip()]


class ContactMessage(models.Model):
    """
    Xabarlar (Kontakt forma orqali)
    """
    HOLAT_CHOICES = [
        ('yangi', _('Yangi')),
        ('o\'qilgan', _('O\'qilgan')),
        ('javob_berildi', _('Javob berildi')),
    ]

    ism = models.CharField(_('Ism'), max_length=100)
    email = models.EmailField(_('Email manzil'))
    kompaniya = models.CharField(_('Kompaniya'), max_length=200, blank=True)
    mavzu = models.CharField(_('Mavzu'), max_length=200)
    xabar = models.TextField(_('Xabar'))
    holat = models.CharField(
        _('Holat'),
        max_length=20,
        choices=HOLAT_CHOICES,
        default='yangi'
    )
    email_yuborildi = models.BooleanField(_('Email yuborildi'), default=False)
    telegram_yuborildi = models.BooleanField(_('Telegram yuborildi'), default=False)
    yaratilgan = models.DateTimeField(auto_now_add=True)
    yangilangan = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Xabar')
        verbose_name_plural = _('Xabarlar')
        ordering = ['-yaratilgan']

    def __str__(self):
        return f"{self.ism} - {self.mavzu}"


class SiteSettings(models.Model):
    """
    Sayt sozlamalari (bitta yozuv bo'lishi kerak)
    """
    sayt_nomi = models.CharField(_('Sayt nomi'), max_length=200, default='Portfolio')
    sayt_tavsifi = models.TextField(_('Sayt tavsifi'), blank=True)
    footer_matni = models.TextField(_('Footer matni'), blank=True)
    copyright_matni = models.CharField(_('Copyright matni'), max_length=200, blank=True)
    Aktiv = models.BooleanField(_('Faol'), default=True)
    yaratilgan = models.DateTimeField(auto_now_add=True)
    yangilangan = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Sayt sozlamasi')
        verbose_name_plural = _('Sayt sozlamalari')

    def __str__(self):
        return self.sayt_nomi

    def save(self, *args, **kwargs):
        # Faqat bitta yozuv bo'lishi kerak
        if not self.pk and SiteSettings.objects.exists():
            raise ValueError("Faqat bitta sayt sozlamasi bo'lishi kerak!")
        super().save(*args, **kwargs)
