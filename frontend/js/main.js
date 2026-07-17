/**
 * main.js - Portfolio asosiy JavaScript fayli
 * 
 * Funksiyalar:
 * - API dan ma'lumot olish
 * - Sahifa animatsiyalari
 * - Forma yuborish
 * - Til almashtirish
 * - Mavzu almashtirish
 */

// ===================================
// Configuration
// ===================================
const CONFIG = {
    API_BASE_URL: 'http://localhost:8000/api',
    TYPING_SPEED: 100,
    TYPING_DELETE_SPEED: 50,
    TYPING_PAUSE: 2000,
    SCROLL_OFFSET: 80,
    ANIMATION_THRESHOLD: 0.1,
};

// ===================================
// State Management
// ===================================
const state = {
    profile: null,
    skills: [],
    projects: [],
    categories: [],
    githubStats: {},
    currentFilter: 'all',
    isTyping: false,
};

// ===================================
// API Service
// ===================================
class ApiService {
    static async fetch(endpoint) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`);
            
            if (!response.ok) {
                throw new Error(`HTTP xato: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error(`API xatosi (${endpoint}):`, error);
            return null;
        }
    }
    
    static async getProfile() {
        return this.fetch('/profil/');
    }
    
    static async getSkills() {
        return this.fetch('/konikmalar/');
    }
    
    static async getCategories() {
        return this.fetch('/kategoriyalar/');
    }
    
    static async getProjects(filter = null) {
        const params = filter && filter !== 'all' ? `?manba=${filter}` : '';
        return this.fetch(`/loyihalar/${params}`);
    }
    
    static async getGitHubProjects() {
        return this.fetch('/github-loyihalar/');
    }
    
    static async getGitHubStats() {
        return this.fetch('/github-statistika/');
    }
    
    static async sendContactForm(data) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/xabar/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            return await response.json();
            
        } catch (error) {
            console.error('Forma yuborishda xato:', error);
            return { xato: 'Tarmoq xatosi' };
        }
    }
}

// ===================================
// DOM Utilities
// ===================================
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function createElement(tag, className, innerHTML) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

// ===================================
// Loading Screen
// ===================================
function hideLoadingScreen() {
    const loadingScreen = $('#loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500);
    }
}

// ===================================
// Navbar
// ===================================
function initNavbar() {
    const navbar = $('#navbar');
    const navToggle = $('#nav-toggle');
    const navMenu = $('#nav-menu');
    const navLinks = $$('.nav-link');
    
    // Scroll effects
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Nav link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Active class ni yangilash
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Mobile menuni yopish
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Active section ni aniqlash
    const sections = $$('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + CONFIG.SCROLL_OFFSET;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ===================================
// Language Switcher
// ===================================
function initLanguageSwitcher() {
    const langBtn = $('#lang-btn');
    const langDropdown = $('#lang-dropdown');
    const langOptions = $$('.lang-option');
    
    // Dropdown toggle
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });
    }
    
    // Til tanlash
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            i18n.setLanguage(lang);
            langDropdown.classList.remove('active');
            
            // Sahifani qayta yuklash (kerak bo'lsa)
            // location.reload();
        });
    });
    
    // Dropdown ni yopish (tashqarida bosish)
    document.addEventListener('click', () => {
        langDropdown.classList.remove('active');
    });
    
    // Joriy tilni ko'rsatish
    i18n.updateLanguageButtons();
}

// ===================================
// Theme Toggle
// ===================================
function initThemeToggle() {
    const themeToggle = $('#theme-toggle');
    const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
    
    // Saqlangan mavzuni qo'llash
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio_theme', newTheme);
        });
    }
}

// ===================================
// Typing Animation
// ===================================
function initTypingAnimation() {
    const typedTextElement = $('#typed-text');
    
    if (!typedTextElement) return;
    
    const texts = [
        'Full-stack Developer',
        'Python Developer',
        'JavaScript Enthusiast',
        'DevOps Learner',
        'Problem Solver',
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typedTextElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? CONFIG.TYPING_DELETE_SPEED : CONFIG.TYPING_SPEED;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = CONFIG.TYPING_PAUSE;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

// ===================================
// Skills Section
// ===================================
function renderSkills(skills) {
    const skillsGrid = $('#skills-grid');
    
    if (!skillsGrid || !skills.length) return;
    
    skillsGrid.innerHTML = skills.map(skill => `
        <div class="skill-card fade-in" data-category="${skill.kategoriya}">
            <div class="skill-header">
                <div class="skill-icon">
                    ${skill.nomi.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 class="skill-name">${skill.nomi}</h3>
                    <span class="skill-level">${skill.daraja_display}</span>
                </div>
            </div>
            <div class="skill-bar">
                <div class="skill-progress" style="width: ${skill.foiz}%"></div>
            </div>
        </div>
    `).join('');
}

function renderCategories(categories) {
    const filterContainer = $('.skills-filter');
    
    if (!filterContainer || !categories.length) return;
    
    // "Hammasi" tugmasi
    const allBtn = filterContainer.querySelector('[data-filter="all"]');
    
    // Kategoriyalarni qo'shish
    categories.forEach(category => {
        const btn = createElement('button', 'filter-btn', category.nomi);
        btn.setAttribute('data-filter', category.id);
        filterContainer.appendChild(btn);
    });
    
    // Filter tugmalarini ishga tushirish
    initSkillsFilter();
}

function initSkillsFilter() {
    const filterBtns = $$('.skills-filter .filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Active class ni yangilash
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Ko'nikmalarni filtrlash
            filterSkills(filter);
        });
    });
}

function filterSkills(category) {
    const skillCards = $$('.skill-card');
    
    skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory == category) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });
}

// ===================================
// Projects Section
// ===================================
function renderProjects(projects) {
    const projectsGrid = $('#projects-grid');
    
    if (!projectsGrid || !projects.length) {
        if (projectsGrid) {
            projectsGrid.innerHTML = '<p class="text-center">Loyihalar topilmadi</p>';
        }
        return;
    }
    
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card fade-in" data-manba="${project.manba}">
            <div class="project-image">
                ${project.rasm 
                    ? `<img src="${project.rasm}" alt="${project.nomi}">` 
                    : '<i data-lucide="folder" class="icon icon-xl"></i>'
                }
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.nomi}</h3>
                <p class="project-description">${project.tavsif || project.qisqa_tavsif || ''}</p>
                <div class="project-tech">
                    ${project.tech_list && project.tech_list.length 
                        ? project.tech_list.map(tech => 
                            `<span class="tech-tag">${tech}</span>`
                        ).join('') 
                        : project.til 
                            ? `<span class="tech-tag">${project.til}</span>` 
                            : ''
                    }
                </div>
                <div class="project-stats">
                    <span class="project-stat">
                        <i data-lucide="star" class="icon icon-sm"></i>
                        ${project.stars || 0}
                    </span>
                    <span class="project-stat">
                        <i data-lucide="git-fork" class="icon icon-sm"></i>
                        ${project.forks || 0}
                    </span>
                </div>
                <div class="project-links">
                    ${project.github_link 
                        ? `<a href="${project.github_link}" class="project-link" target="_blank">
                            <i data-lucide="github" class="icon icon-sm"></i>
                            GitHub
                           </a>` 
                        : ''
                    }
                    ${project.live_link 
                        ? `<a href="${project.live_link}" class="project-link" target="_blank">
                            <i data-lucide="external-link" class="icon icon-sm"></i>
                            Live
                           </a>` 
                        : ''
                    }
                </div>
            </div>
        </div>
    `).join('');
    
    // Iconlarni qayta yuklash
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function initProjectsFilter() {
    const filterBtns = $$('.projects-filter .filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const filter = btn.getAttribute('data-filter');
            
            // Active class ni yangilash
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Loyihalarni yuklash
            const projects = await ApiService.getProjects(filter);
            if (projects) {
                state.projects = projects.results || projects;
                renderProjects(state.projects);
            }
        });
    });
}

// ===================================
// Contact Form
// ===================================
function initContactForm() {
    const form = $('#contact-form');
    const formStatus = $('#form-status');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Loading holati
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Yuborilmoqda...</span>';
        submitBtn.disabled = true;
        
        try {
            const result = await ApiService.sendContactForm(data);
            
            if (result.muvaqqatli) {
                formStatus.className = 'form-status success';
                formStatus.textContent = result.xabar || 'Xabar muvaffaqiyatli yuborildi!';
                form.reset();
            } else {
                formStatus.className = 'form-status error';
                formStatus.textContent = result.xato || 'Xabar yuborishda xatolik yuz berdi';
            }
        } catch (error) {
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Tarmoq xatosi. Qaytadan urinib ko\'ring.';
        }
        
        // Tugmani qayta tiklash
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Status xabarini yo'qotish
        setTimeout(() => {
            formStatus.className = 'form-status';
            formStatus.textContent = '';
        }, 5000);
    });
}

// ===================================
// Scroll Animations
// ===================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: CONFIG.ANIMATION_THRESHOLD,
    });
    
    $$('.fade-in').forEach(element => {
        observer.observe(element);
    });
}

// ===================================
// Back to Top
// ===================================
function initBackToTop() {
    const backToTop = $('#back-to-top');
    
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });
}

// ===================================
// Profile Data
// ===================================
function updateProfileData(profile) {
    if (!profile) return;
    
    // Asosiy ma'lumotlar
    const heroName = $('#hero-name');
    const aboutDescription = $('#about-description');
    const location = $('#location');
    const email = $('#email');
    const contactEmail = $('#contact-email');
    const contactTelegram = $('#contact-telegram');
    const contactLocation = $('#contact-location');
    
    if (heroName) heroName.textContent = profile.ism || 'Developer';
    if (aboutDescription) aboutDescription.textContent = profile.haqida || '';
    if (location) location.textContent = profile.joylashuv || 'Toshkent, O\'zbekiston';
    if (email) email.textContent = profile.email || 'example@email.com';
    if (contactEmail) contactEmail.textContent = profile.email || 'example@email.com';
    if (contactTelegram) contactTelegram.textContent = `@${profile.telegram_username || 'username'}`;
    if (contactLocation) contactLocation.textContent = profile.joylashuv || 'Toshkent, O\'zbekiston';
    
    // Havolalar
    const githubLink = $('#github-link');
    const linkedinLink = $('#linkedin-link');
    const telegramLink = $('#telegram-link');
    const githubProfile = $('#github-profile');
    const footerGithub = $('#footer-github');
    const footerLinkedin = $('#footer-linkedin');
    const footerTelegram = $('#footer-telegram');
    
    if (githubLink && profile.github_username) {
        githubLink.href = `https://github.com/${profile.github_username}`;
        if (githubProfile) githubProfile.href = `https://github.com/${profile.github_username}`;
        if (footerGithub) footerGithub.href = `https://github.com/${profile.github_username}`;
    }
    
    if (linkedinLink && profile.linkedin_url) {
        linkedinLink.href = profile.linkedin_url;
        if (footerLinkedin) footerLinkedin.href = profile.linkedin_url;
    }
    
    if (telegramLink && profile.telegram_username) {
        telegramLink.href = `https://t.me/${profile.telegram_username}`;
        if (footerTelegram) footerTelegram.href = `https://t.me/${profile.telegram_username}`;
    }
    
    // Profil rasmi
    const profileImage = $('#profile-image');
    if (profileImage && profile.rasm) {
        profileImage.innerHTML = `<img src="${profile.rasm}" alt="${profile.ism}">`;
    }
}

function updateGitHubStats(stats) {
    if (!stats) return;
    
    const statNumbers = $$('.stat-number');
    
    if (statNumbers.length >= 3) {
        animateCounter(statNumbers[0], stats.jami_loyihalar || 0);
        animateCounter(statNumbers[1], stats.jami_yulduzlar || 0);
        animateCounter(statNumbers[2], stats.obunachilar || 0);
    }
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// ===================================
// Footer Year
// ===================================
function updateFooterYear() {
    const yearElement = $('#current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ===================================
// Initialize
// ===================================
async function init() {
    console.log('🚀 Portfolio ishga tushirildi');
    
    // Mavzu va til
    initThemeToggle();
    initLanguageSwitcher();
    
    // Navigatsiya
    initNavbar();
    initBackToTop();
    
    // Typing animatsiya
    initTypingAnimation();
    
    // API dan ma'lumot olish
    try {
        // Profil
        const profile = await ApiService.getProfile();
        if (profile) {
            state.profile = profile;
            updateProfileData(profile);
        }
        
        // Ko'nikmalar
        const skills = await ApiService.getSkills();
        if (skills) {
            state.skills = skills.results || skills;
            renderSkills(state.skills);
        }
        
        // Kategoriyalar
        const categories = await ApiService.getCategories();
        if (categories) {
            state.categories = categories.results || categories;
            renderCategories(state.categories);
        }
        
        // Loyihalar
        const projects = await ApiService.getProjects();
        if (projects) {
            state.projects = projects.results || projects;
            renderProjects(state.projects);
        }
        
        // GitHub statistikasi
        const githubStats = await ApiService.getGitHubStats();
        if (githubStats) {
            state.githubStats = githubStats;
            updateGitHubStats(githubStats);
        }
        
    } catch (error) {
        console.error('❌ Ma\'lumotlarni yuklashda xato:', error);
    }
    
    // Filterlar
    initProjectsFilter();
    
    // Animatsiyalar
    initScrollAnimations();
    
    // Forma
    initContactForm();
    
    // Footer
    updateFooterYear();
    
    // Loading screen ni yashirish
    hideLoadingScreen();
    
    console.log('✅ Portfolio tayyor');
}

// DOM yuklangandan keyin ishga tushirish
document.addEventListener('DOMContentLoaded', init);
