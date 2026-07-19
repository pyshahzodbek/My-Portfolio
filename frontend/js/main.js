/**
 * main.js - Portfolio asosiy JavaScript fayli
 */

// ===================================
// Configuration
// ===================================
const CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost'
        ? 'http://localhost:8000/api'
        : 'https://shakhzodravshanov.alwaysdata.net/api',
    GITHUB_API_URL: 'https://api.github.com',
    GITHUB_USERNAME: 'pyshahzodbek',
    TYPING_SPEED: 100,
    TYPING_DELETE_SPEED: 50,
    TYPING_PAUSE: 2000,
    SCROLL_OFFSET: 80,
    ANIMATION_THRESHOLD: 0.1,
};

// ===================================
// State
// ===================================
const state = {
    profile: null,
    skills: [],
    projects: [],
    categories: [],
    githubStats: {},
    currentFilter: 'all',
};

// ===================================
// Utils
// ===================================
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

// ===================================
// Loading Screen
// ===================================
function hideLoadingScreen() {
    const el = $('#loading-screen');
    if (el) {
        setTimeout(() => el.classList.add('hidden'), 500);
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

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            if (navToggle) navToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });

    const sections = $$('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + CONFIG.SCROLL_OFFSET;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
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

    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });
    }

    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            if (typeof i18n !== 'undefined') {
                i18n.setLanguage(lang);
            }
            langDropdown.classList.remove('active');
        });
    });

    document.addEventListener('click', () => {
        if (langDropdown) langDropdown.classList.remove('active');
    });
}

// ===================================
// Theme Toggle
// ===================================
function initThemeToggle() {
    const themeToggle = $('#theme-toggle');
    const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('portfolio_theme', next);
        });
    }
}

// ===================================
// Terminal Animation
// ===================================
function initTerminalAnimation() {
    var termBody = document.getElementById('terminal-body');
    var termCmd = document.getElementById('terminal-cmd');
    if (!termBody || !termCmd) return;

    var sequences = [
        { cmd: 'python manage.py runserver', output: 'Starting development server at http://127.0.0.1:8000/', cls: 'success' },
        { cmd: 'docker compose up -d', output: 'Creating portfolio_db ... done', cls: 'info' },
        { cmd: 'python manage.py migrate', output: 'Applying api.0001_initial... OK', cls: 'success' },
        { cmd: 'git push origin main', output: 'Enumerating objects: 42, done.', cls: 'info' },
        { cmd: 'pytest --tb=short', output: '18 passed in 2.34s', cls: 'success' },
        { cmd: 'python manage.py collectstatic', output: '126 static files copied.', cls: 'info' },
    ];

    var seqIndex = 0;

    function typeCommand(callback) {
        var seq = sequences[seqIndex % sequences.length];
        var i = 0;
        termCmd.textContent = '';

        var interval = setInterval(function() {
            if (i < seq.cmd.length) {
                termCmd.textContent += seq.cmd.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                setTimeout(callback, 400);
            }
        }, CONFIG.TYPING_SPEED);
    }

    function showOutput() {
        var seq = sequences[seqIndex % sequences.length];

        var cmdLine = termBody.querySelector('.terminal-line');
        cmdLine.querySelector('.terminal-cursor').style.display = 'none';

        var out = document.createElement('div');
        out.className = 'terminal-output ' + seq.cls;
        out.textContent = '> ' + seq.output;
        termBody.appendChild(out);

        seqIndex++;

        setTimeout(function() {
            var newLine = document.createElement('div');
            newLine.className = 'terminal-line';
            newLine.innerHTML = '<span class="terminal-prompt">$</span> <span class="terminal-cmd" id="terminal-cmd"></span> <span class="terminal-cursor">|</span>';
            termBody.appendChild(newLine);

            if (termBody.children.length > 9) {
                termBody.removeChild(termBody.children[0]);
                termBody.removeChild(termBody.children[0]);
            }

            termCmd = document.getElementById('terminal-cmd');
            typeCommand(showOutput);
        }, 1500);
    }

    setTimeout(function() { typeCommand(showOutput); }, 1000);
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
        const current = texts[textIndex];

        if (isDeleting) {
            typedTextElement.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextElement.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? CONFIG.TYPING_DELETE_SPEED : CONFIG.TYPING_SPEED;

        if (!isDeleting && charIndex === current.length) {
            speed = CONFIG.TYPING_PAUSE;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    type();
}

// ===================================
// GitHub API (To'g'ridan-to'g'ri)
// ===================================
async function fetchGitHubRepos() {
    // 1) Backend orqali pinned loyihalarni olish (token xavfsiz)
    try {
        var response = await fetch(CONFIG.API_BASE_URL + '/github-pinned/');
        if (response.ok) {
            var data = await response.json();
            if (data && data.length > 0) {
                console.log('Pinned loyihalar:', data.length);
                return data;
            }
        }
    } catch (e) {
        console.log('Backend pinned xatosi, fallback...');
    }

    // 2) Fallback: REST API (pinned emas, lekin eng so'nggi)
    try {
        var response2 = await fetch(
            CONFIG.GITHUB_API_URL + '/users/' + CONFIG.GITHUB_USERNAME + '/repos?sort=updated&per_page=6&type=owner'
        );
        if (!response2.ok) throw new Error('GitHub API xato');
        var repos = await response2.json();

        return repos
            .filter(function(repo) { return !repo.fork; })
            .map(function(repo) {
                return {
                    github_id: String(repo.id),
                    nomi: repo.name,
                    tavsif: repo.description || '',
                    github_link: repo.html_url,
                    live_link: repo.homepage || '',
                    til: repo.language || '',
                    stars: repo.stargazers_count || 0,
                    forks: repo.forks_count || 0,
                    tech_stack: repo.language || '',
                    manba: 'github',
                    faol: !repo.archived,
                };
            });
    } catch (error) {
        console.error('GitHub repos xatosi:', error);
        return [];
    }
}

async function fetchGitHubStats() {
    try {
        var userResp = await fetch(CONFIG.GITHUB_API_URL + '/users/' + CONFIG.GITHUB_USERNAME);
        if (!userResp.ok) throw new Error('GitHub user xato');
        var user = await userResp.json();

        var totalStars = 0;
        state.projects.forEach(function(p) {
            totalStars += p.stars || 0;
        });

        return {
            jami_loyihalar: user.public_repos || 0,
            jami_yulduzlar: totalStars,
            obunachilar: user.followers || 0,
        };
    } catch (error) {
        console.error('GitHub stats xatosi:', error);
        return { jami_loyihalar: 0, jami_yulduzlar: 0, obunachilar: 0 };
    }
}

// ===================================
// Backend API
// ===================================
async function fetchBackend(endpoint) {
    try {
        const response = await fetch(CONFIG.API_BASE_URL + endpoint);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return await response.json();
    } catch (error) {
        console.error('Backend xatosi (' + endpoint + '):', error);
        return null;
    }
}

// ===================================
// Profile
// ===================================
function updateProfileData(profile) {
    if (!profile) return;

    if (profile.ism) {
        var heroName = document.getElementById('hero-name');
        if (heroName) heroName.textContent = profile.ism;
    }
    if (profile.haqida) {
        var aboutDesc = document.getElementById('about-description');
        if (aboutDesc) aboutDesc.textContent = profile.haqida;
    }
    if (profile.joylashuv) {
        var loc = document.getElementById('location');
        if (loc) loc.textContent = profile.joylashuv;
        var cLoc = document.getElementById('contact-location');
        if (cLoc) cLoc.textContent = profile.joylashuv;
    }
    if (profile.email) {
        var em = document.getElementById('email');
        if (em) em.textContent = profile.email;
        var cEm = document.getElementById('contact-email');
        if (cEm) cEm.textContent = profile.email;
    }
    if (profile.telegram_username) {
        var ct = document.getElementById('contact-telegram');
        if (ct) ct.textContent = profile.telegram_username.startsWith('@') ? profile.telegram_username : '@' + profile.telegram_username;
        setLink('telegram-link', 'https://t.me/' + profile.telegram_username);
        setLink('footer-telegram', 'https://t.me/' + profile.telegram_username);
    }
    if (profile.github_username) {
        setLink('github-link', 'https://github.com/' + profile.github_username);
        setLink('github-profile', 'https://github.com/' + profile.github_username + '?tab=repositories');
        setLink('footer-github', 'https://github.com/' + profile.github_username);
    }
    if (profile.linkedin_url) {
        setLink('linkedin-link', profile.linkedin_url);
        setLink('footer-linkedin', profile.linkedin_url);
    }
    if (profile.rasm) {
        var footerImg = document.getElementById('footer-logo-img');
        if (footerImg) footerImg.src = CONFIG.API_BASE_URL.replace('/api', '') + profile.rasm;
    }
}

function setLink(id, url) {
    var el = document.getElementById(id);
    if (el && url) el.href = url;
}

// ===================================
// GitHub Stats
// ===================================
function updateGitHubStats(stats) {
    if (!stats) return;
    const numbers = $$('.stat-number');
    if (numbers.length >= 3) {
        animateCounter(numbers[0], stats.jami_loyihalar || 0);
        animateCounter(numbers[1], stats.jami_yulduzlar || 0);
        animateCounter(numbers[2], stats.obunachilar || 0);
    }
}

function animateCounter(element, target) {
    let current = 0;
    const increment = Math.max(target / 50, 1);
    const stepTime = 40;

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
// Projects
// ===================================
function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    if (!projects || !Array.isArray(projects) || projects.length === 0) {
        grid.innerHTML = '<p class="text-center" style="grid-column:1/-1">Loyihalar topilmadi</p>';
        return;
    }

    grid.innerHTML = projects.map(function(project) {
        var techHtml = '';
        if (project.til) {
            techHtml = '<span class="tech-tag">' + project.til + '</span>';
        }
        if (project.tech_stack && project.tech_stack !== project.til) {
            var techs = project.tech_stack.split(',');
            techs.forEach(function(t) {
                t = t.trim();
                if (t && t !== project.til) {
                    techHtml += '<span class="tech-tag">' + t + '</span>';
                }
            });
        }

        var linksHtml = '';
        if (project.github_link) {
            linksHtml += '<a href="' + project.github_link + '" class="project-link" target="_blank"><i data-lucide="github" class="icon icon-sm"></i> GitHub</a>';
        }
        if (project.live_link) {
            linksHtml += '<a href="' + project.live_link + '" class="project-link" target="_blank"><i data-lucide="external-link" class="icon icon-sm"></i> Live</a>';
        }

        return '<div class="project-card fade-in" data-manba="' + (project.manba || 'manual') + '">' +
            '<div class="project-image"><i data-lucide="folder" class="icon icon-xl"></i></div>' +
            '<div class="project-content">' +
                '<h3 class="project-title">' + (project.nomi || 'Untitled') + '</h3>' +
                '<p class="project-description">' + (project.tavsif || project.qisqa_tavsif || '') + '</p>' +
                '<div class="project-tech">' + techHtml + '</div>' +
                '<div class="project-stats">' +
                    '<span class="project-stat"><i data-lucide="star" class="icon icon-sm"></i> ' + (project.stars || 0) + '</span>' +
                    '<span class="project-stat"><i data-lucide="git-fork" class="icon icon-sm"></i> ' + (project.forks || 0) + '</span>' +
                '</div>' +
                '<div class="project-links">' + linksHtml + '</div>' +
            '</div>' +
        '</div>';
    }).join('');

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    initScrollAnimations();
}

function initProjectsFilter() {
    var filterBtns = $$('.projects-filter .filter-btn');
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var filter = btn.getAttribute('data-filter');
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');

            if (filter === 'all') {
                renderProjects(state.projects);
            } else {
                var filtered = state.projects.filter(function(p) { return p.manba === filter; });
                renderProjects(filtered);
            }
        });
    });
}

// ===================================
// Skills
// ===================================
function renderSkills(skills) {
    var grid = document.getElementById('skills-grid');
    if (!grid || !skills || !skills.length) return;

    grid.innerHTML = skills.map(function(skill) {
        var level = skill.daraja_display || skill.daraja || 'O\'rta';
        return '<div class="skill-card fade-in" data-category="' + (skill.kategoriya || '') + '">' +
            '<div class="skill-header">' +
                '<div class="skill-icon">' + skill.nomi.charAt(0).toUpperCase() + '</div>' +
                '<div>' +
                    '<h3 class="skill-name">' + skill.nomi + '</h3>' +
                    '<span class="skill-level">' + level + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="skill-bar">' +
                '<div class="skill-progress" style="width: ' + (skill.foiz || 50) + '%"></div>' +
            '</div>' +
        '</div>';
    }).join('');

    setTimeout(function() {
        grid.querySelectorAll('.fade-in').forEach(function(el) {
            el.classList.add('visible');
        });
    }, 100);
}

function renderCategories(categories) {
    var container = document.querySelector('.skills-filter');
    if (!container || !categories || !categories.length) return;

    categories.forEach(function(cat) {
        var btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.setAttribute('data-filter', cat.id);
        btn.textContent = cat.nomi;
        container.appendChild(btn);
    });

    var filterBtns = container.querySelectorAll('.filter-btn');
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var filter = btn.getAttribute('data-filter');
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var cards = $$('.skill-card');
            cards.forEach(function(card) {
                var cat = card.getAttribute('data-category');
                if (filter === 'all' || cat == filter) {
                    card.style.display = '';
                    card.classList.add('visible');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===================================
// Contact Form
// ===================================
function initContactForm() {
    var form = document.getElementById('contact-form');
    var formStatus = document.getElementById('form-status');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        var formData = new FormData(form);
        var data = {};
        formData.forEach(function(value, key) { data[key] = value; });

        var submitBtn = form.querySelector('button[type="submit"]');
        var originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Yuborilmoqda...</span>';
        submitBtn.disabled = true;

        try {
            var result = await fetch(CONFIG.API_BASE_URL + '/xabar/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            var json = await result.json();

            if (json.muvaqqatli) {
                formStatus.className = 'form-status success';
                formStatus.textContent = json.xabar || 'Xabar yuborildi!';
                formStatus.style.display = 'block';
                form.reset();
            } else {
                formStatus.className = 'form-status error';
                formStatus.textContent = json.xato || 'Xatolik yuz berdi';
                formStatus.style.display = 'block';
            }
        } catch (err) {
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Tarmoq xatosi';
            formStatus.style.display = 'block';
        }

        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;

        setTimeout(function() {
            formStatus.style.display = 'none';
        }, 5000);
    });
}

// ===================================
// Scroll Animations
// ===================================
function initScrollAnimations() {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: CONFIG.ANIMATION_THRESHOLD });

    $$('.fade-in').forEach(function(el) {
        observer.observe(el);
    });
}

// ===================================
// Back to Top
// ===================================
function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function() {
        btn.classList.toggle('visible', window.scrollY > 500);
    });

    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===================================
// Footer
// ===================================
function updateFooterYear() {
    var el = document.getElementById('current-year');
    if (el) el.textContent = new Date().getFullYear();
}

// ===================================
// Initialize
// ===================================
async function init() {
    console.log('Portfolio ishga tushirildi');

    // Lucide iconlarni darhol yuklash
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Tarjimalarni yuklash
    await i18n.loadAllTranslations();
    i18n.setLanguage(i18n.currentLang);

    initThemeToggle();
    initTerminalAnimation();
    initLanguageSwitcher();
    initNavbar();
    initBackToTop();
    initTypingAnimation();

    // GitHub loyihalari (to'g'ridan)
    console.log('GitHub loyihalari yuklanmoqda...');
    var githubProjects = await fetchGitHubRepos();
    console.log('GitHub loyihalar soni:', githubProjects.length);
    state.projects = githubProjects;
    renderProjects(state.projects);

    // GitHub statistikasi
    var stats = await fetchGitHubStats();
    state.githubStats = stats;
    updateGitHubStats(stats);

    // Backend dan profil (agar server ishlasa)
    try {
        var profile = await fetchBackend('/profil/');
        if (profile && !profile.xato) {
            state.profile = profile;
            updateProfileData(profile);
        }
    } catch (e) {
        console.log('Backend profil topilmadi');
    }

    // Backend dan ko'nikmalar
    try {
        var skills = await fetchBackend('/konikmalar/');
        if (skills && Array.isArray(skills)) {
            state.skills = skills;
            renderSkills(skills);
        } else if (skills && skills.results) {
            state.skills = skills.results;
            renderSkills(skills.results);
        }
    } catch (e) {
        console.log('Backend konikmalar topilmadi');
    }

    // Backend dan kategoriyalar
    try {
        var categories = await fetchBackend('/kategoriyalar/');
        if (categories && Array.isArray(categories)) {
            state.categories = categories;
            renderCategories(categories);
        } else if (categories && categories.results) {
            state.categories = categories.results;
            renderCategories(categories.results);
        }
    } catch (e) {
        console.log('Backend kategoriyalar topilmadi');
    }

    initScrollAnimations();
    initProjectsFilter();
    initContactForm();
    updateFooterYear();
    hideLoadingScreen();

    // Yakunda barcha iconlarni qayta yuklash
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    console.log('Portfolio tayyor');
}

document.addEventListener('DOMContentLoaded', init);
