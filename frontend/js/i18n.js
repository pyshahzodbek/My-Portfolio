/**
 * i18n.js - Xalqaro tillar xizmati
 * 
 * Funksiyalar:
 * - Tillarni yuklash
 * - Tarjima qilish
 * - Tilni almashtirish
 * - localStorage da saqlash
 */

class I18n {
    constructor(defaultLang = 'uz') {
        // Joriy til (localStorage dan yoki default)
        this.currentLang = localStorage.getItem('portfolio_lang') || defaultLang;
        
        // Tarjimalar saqlash
        this.translations = {};
        
        // Qo'llab-quvvatlanadigan tillar
        this.supportedLanguages = ['uz', 'ru', 'en'];
        
        // Default til tekshirish
        if (!this.supportedLanguages.includes(this.currentLang)) {
            this.currentLang = defaultLang;
        }
    }
    
    /**
     * Tarjimalarni JSON fayldan yuklash
     * @param {string} lang - Til kodi (uz, ru, en)
     * @returns {Promise} Yuklash natijasi
     */
    async loadTranslations(lang) {
        try {
            const response = await fetch(`./js/lang/${lang}.json`);
            
            if (!response.ok) {
                throw new Error(`HTTP xato: ${response.status}`);
            }
            
            this.translations[lang] = await response.json();
            console.log(`✅ ${lang} tarjimalari yuklandi`);
            
        } catch (error) {
            console.error(`❌ ${lang} tarjimalarini yuklashda xato:`, error);
            
            // Fallback: default tarjimalar
            this.translations[lang] = this.getDefaultTranslations(lang);
        }
    }
    
    /**
     * Barcha tillarni yuklash
     * @returns {Promise} Yuklash natijasi
     */
    async loadAllTranslations() {
        const promises = this.supportedLanguages.map(lang => 
            this.loadTranslations(lang)
        );
        
        await Promise.all(promises);
    }
    
    /**
     * Tarjimani olish
     * @param {string} key - Kalit (masalan: 'nav.home')
     * @param {string} lang - Til kodi (ixtiyoriy)
     * @returns {string} Tarjima matni
     */
    t(key, lang = null) {
        const targetLang = lang || this.currentLang;
        const translations = this.translations[targetLang];
        
        if (!translations) {
            return key;
        }
        
        // Punktatsiya bilan ajratish (nav.home -> nav['home'])
        const keys = key.split('.');
        let value = translations;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key;
            }
        }
        
        return typeof value === 'string' ? value : key;
    }
    
    /**
     * Tilni o'zgartirish
     * @param {string} lang - Til kodi
     */
    setLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.warn(`⚠️ ${lang} tili qo'llab-quvvatlanmaydi`);
            return;
        }
        
        this.currentLang = lang;
        localStorage.setItem('portfolio_lang', lang);
        
        // HTML lang atributini yangilash
        document.documentElement.lang = lang;
        
        // Sahifadagi barcha tarjimalarni yangilash
        this.updateUI();
        
        console.log(`🌐 Til o'zgartirildi: ${lang}`);
    }
    
    /**
     * Sahifadagi barcha tarjimalarni yangilash
     */
    updateUI() {
        // data-i18n atributiga ega barcha elementlarni topish
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (translation !== key) {
                element.textContent = translation;
            }
        });
        
        // Placeholder larni yangilash
        const inputs = document.querySelectorAll('[data-i18n-placeholder]');
        inputs.forEach(input => {
            const key = input.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            
            if (translation !== key) {
                input.placeholder = translation;
            }
        });
        
        // Titillarni yangilash
        this.updateLanguageButtons();
    }
    
    /**
     * Til tugmalarini yangilash
     */
    updateLanguageButtons() {
        // Active tilni belgilash
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            option.classList.toggle('active', lang === this.currentLang);
        });
        
        // Joriy til ko'rsatkichini yangilash
        const currentLangSpan = document.getElementById('current-lang');
        if (currentLangSpan) {
            currentLangSpan.textContent = this.currentLang.toUpperCase();
        }
    }
    
    /**
     * Brauzer tilini aniqlash
     * @returns {string} Aniqlangan til kodi
     */
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        if (this.supportedLanguages.includes(langCode)) {
            return langCode;
        }
        
        return 'uz'; // Default
    }
    
    /**
     * Tilni avtomatik aniqlash va qo'llash
     */
    autoDetectLanguage() {
        // localStorage da til saqlanganmi?
        const savedLang = localStorage.getItem('portfolio_lang');
        
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            return savedLang;
        }
        
        // Brauzer tilini aniqlash
        return this.detectBrowserLanguage();
    }
    
    /**
     * Default tarjimalar (fallback)
     * @param {string} lang - Til kodi
     * @returns {object} Tarjimalar
     */
    getDefaultTranslations(lang) {
        const defaults = {
            uz: {
                loading: 'Yuklanmoqda...',
                nav: {
                    home: 'Bosh sahifa',
                    about: 'Men haqimda',
                    skills: "Ko'nikmalar",
                    projects: 'Loyihalar',
                    contact: 'Aloqa'
                }
            },
            ru: {
                loading: 'Загрузка...',
                nav: {
                    home: 'Главная',
                    about: 'Обо мне',
                    skills: 'Навыки',
                    projects: 'Проекты',
                    contact: 'Контакт'
                }
            },
            en: {
                loading: 'Loading...',
                nav: {
                    home: 'Home',
                    about: 'About',
                    skills: 'Skills',
                    projects: 'Projects',
                    contact: 'Contact'
                }
            }
        };
        
        return defaults[lang] || defaults.uz;
    }
}

// Global instance yaratish
const i18n = new I18n();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}
