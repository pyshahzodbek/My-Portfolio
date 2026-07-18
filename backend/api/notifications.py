"""
Xabarnomalar xizmati

Gmail va Telegram orqali xabar yuborish
"""

import logging
import requests
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)


def email_xabar_yuborish(mavzu, matn, qabul_quvchi=None):
    """
    Email xabar yuborish
    
    Args:
        mavzu: Xabar mavzusi
        matn: Xabar matni
        qabul_quvchi: Qabul qiluvchi email (agar None bo'lsa, settings dan oladi)
    
    Returns:
        bool: Muvaffaqiyatli yuborildimi
    """
    if qabul_quvchi is None:
        qabul_quvchi = settings.EMAIL_HOST_USER
    
    if not qabul_quvchi:
        logger.warning("Email manzil sozlanmagan")
        return False
    
    try:
        send_mail(
            subject=mavzu,
            message=matn,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[qabul_quvchi],
            fail_silently=False,
        )
        logger.info(f"Email yuborildi: {mavzu}")
        return True
        
    except Exception as e:
        logger.error(f"Email yuborishda xato: {e}")
        return False


def kontakt_xabar_email(ism, email, kompaniya, mavzu, xabar):
    """
    Kontakt xabari uchun email yuborish
    
    Args:
        ism: Yuboruvchi ismi
        email: Yuboruvchi email
        kompaniya: Kompaniya nomi
        mavzu: Xabar mavzusi
        xabar: Xabar matni
    
    Returns:
        bool: Muvaffaqiyatli yuborildimi
    """
    template_mavzu = f"Yangi kontakt xabari: {ism}"
    template_matn = f"""
    Yangi xabar qabul qilindi!
    
    Kimdan: {ism}
    Email: {email}
    Kompaniya: {kompaniya}
    
    Mavzu: {mavzu}
    
    Xabar:
    {xabar}
    
    ---
    Portfolio saytidan yuborildi
    """
    
    return email_xabar_yuborish(template_mavzu, template_matn)


def telegram_xabar_yuborish(matn):
    """
    Telegram orqali xabar yuborish
    
    Args:
        matn: Xabar matni
    
    Returns:
        bool: Muvaffaqiyatli yuborildimi
    """
    token = settings.TELEGRAM_BOT_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID
    
    if not token or not chat_id:
        logger.warning("Telegram bot sozlanmagan")
        return False
    
    try:
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        data = {
            'chat_id': chat_id,
            'text': matn,
            'parse_mode': 'HTML'
        }
        
        response = requests.post(url, data=data, timeout=10)
        response.raise_for_status()
        
        logger.info("Telegram xabar yuborildi")
        return True
        
    except requests.RequestException as e:
        logger.error(f"Telegram xabar yuborishda xato: {e}")
        return False


def kontakt_xabar_telegram(ism, email, kompaniya, mavzu, xabar):
    """
    Kontakt xabari uchun Telegram yuborish
    
    Args:
        ism: Yuboruvchi ismi
        email: Yuboruvchi email
        kompaniya: Kompaniya nomi
        mavzu: Xabar mavzusi
        xabar: Xabar matni
    
    Returns:
        bool: Muvaffaqiyatli yuborildimi
    """
    telegram_matn = f"""
🔔 <b>Yangi kontakt xabari!</b>

👤 <b>Kimdan:</b> {ism}
📧 <b>Email:</b> {email}
🏢 <b>Kompaniya:</b> {kompaniya if kompaniya else "Ko'rsatilmagan"}

📝 <b>Mavzu:</b> {mavzu}

💬 <b>Xabar:</b>
{xabar}

---
Portfolio saytidan yuborildi
    """
    
    return telegram_xabar_yuborish(telegram_matn)


def loyaltyha_xabar_telegram(loyiha_nomi, github_link):
    """
    Yangi loyiha qo'shilganda Telegram ga xabar
    
    Args:
        loyiha_nomi: Loyiha nomi
        github_link: GitHub havolasi
    
    Returns:
        bool: Muvaffaqiyatli yuborildimi
    """
    telegram_matn = f"""
🚀 <b>Yangi loyiha qo'shildi!</b>

📦 <b>Loyiha:</b> {loyiha_nomi}
🔗 <b>GitHub:</b> {github_link}

---
Portfolio saytidagi loyihalar yangilandi
    """
    
    return telegram_xabar_yuborish(telegram_matn)
