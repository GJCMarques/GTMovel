/**
 * GT Móvel - Main JavaScript
 * Modern ES6+ Vanilla JavaScript
 * Author: GT Móvel
 * Year: 2026
 */

// =================================
// DOM Content Loaded
// =================================
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollEffects();
    initScrollToTop();
    initHeroSwiper();
    initScrollReveal();
    initActiveNavLink();
});

// =================================
// Mobile Menu Toggle
// =================================
// =================================
// Mobile Menu Toggle
// =================================
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuContent = document.getElementById('mobile-menu-content');

    if (!menuBtn || !mobileMenuContent || !mobileMenuOverlay) return;

    function toggleMenu() {
        const isOpen = menuBtn.classList.contains('open');

        if (isOpen) {
            // Close
            menuBtn.classList.remove('open');
            mobileMenuOverlay.classList.remove('active');
            mobileMenuContent.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            document.body.style.position = '';
            document.body.style.width = '';
            document.documentElement.style.overflow = '';
        } else {
            // Open
            menuBtn.classList.add('open');
            mobileMenuOverlay.classList.add('active');
            mobileMenuContent.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scrolling
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.documentElement.style.overflow = 'hidden';
        }
    }

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close on backdrop click
    mobileMenuOverlay.addEventListener('click', toggleMenu);

    // Close Button Action
    const closeBtn = document.getElementById('mobile-menu-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking on a link
    const menuLinks = mobileMenuContent.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Close
            menuBtn.classList.remove('open');
            mobileMenuOverlay.classList.remove('active');
            mobileMenuContent.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.documentElement.style.overflow = '';
        });
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuBtn.classList.contains('open')) {
            toggleMenu();
        }
    });
}

// =================================
// Scroll Effects for Header
// =================================
function initScrollEffects() {
    const header = document.getElementById('main-header');
    if (!header) return;

    let lastScroll = 0;
    const nav = header.querySelector('nav');

    // Altura da viewport para determinar quando o hero termina
    // Subtraímos 50px para uma transição um pouco antes do fim exato
    const heroHeight = window.innerHeight - 50;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // 1. Lógica de Fundo (Branco vs Transparente)
        // Aplica a classe 'scrolled' APENAS quando passa da altura do Hero
        if (currentScroll > heroHeight) {
            nav.classList.add('scrolled');
            nav.classList.remove('bg-transparent'); // Remove transparência, fica branco pelo CSS .scrolled
        } else {
            nav.classList.remove('scrolled');
            nav.classList.add('bg-transparent'); // Volta a ser transparente no topo
        }

        // 2. Lógica de Esconder/Mostrar (Scroll Up/Down)
        // Só esconde o header se estivermos ABAIXO do Hero
        // Isso garante que o header está sempre visível sobre a imagem principal
        if (currentScroll > heroHeight && currentScroll > lastScroll) {
            // Rolar para baixo E passou do Hero -> Esconde Header
            header.classList.add('hide');
        } else {
            // Rolar para cima OU ainda no Hero -> Mostra Header
            header.classList.remove('hide');
        }

        lastScroll = currentScroll;
    });
}

// =================================
// Scroll to Top with Progress Ring
// =================================
function initScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    const progressRing = document.getElementById('progress-ring');

    if (!scrollBtn || !progressRing) return;

    const radius = 45;
    const circumference = 2 * Math.PI * radius;

    progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
    progressRing.style.strokeDashoffset = circumference;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;

        // Update progress ring
        const offset = circumference - (scrollPercent * circumference);
        progressRing.style.strokeDashoffset = offset;

        // Show/hide button
        if (scrollTop > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });

    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =================================
// Hero Swiper Initialization
// =================================
function initHeroSwiper() {
    try {
        // Check if Swiper is defined
        if (typeof Swiper === 'undefined') {
            // Swiper not loaded, but don't show warning - it's optional
            return;
        }

        const heroContainer = document.querySelector('.hero-swiper');
        if (!heroContainer) return;

        const heroSwiper = new Swiper('.hero-swiper', {
            loop: true,

            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },

            speed: 1000,

            // Autoplay configurado para parar quando há interação manual
            autoplay: {
                delay: 5000,
                disableOnInteraction: true, // Para quando clicas nos botões
                pauseOnMouseEnter: false,
            },

            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },

            navigation: {
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
            },

            // Desabilitar navegação por arrastar/swipe para permitir seleção de texto
            simulateTouch: false,
            allowTouchMove: false,

            // Controlos de teclado removidos para evitar conflitos

            on: {
                init: function () {
                    animateSlideContent(this.slides[this.activeIndex]);
                },
                slideChange: function () {
                    animateSlideContent(this.slides[this.activeIndex]);
                },
                // Reinicia o autoplay após interação manual
                slideChangeTransitionEnd: function () {
                    if (this.autoplay && !this.autoplay.running) {
                        this.autoplay.start();
                    }
                }
            }
        });
    } catch (error) {
        // Swiper initialization failed silently - no console errors
        // This prevents errors on pages without hero swiper
        return;
    }
}

// =================================
// Helper: Animar Texto do Slide
// =================================
function animateSlideContent(slide) {
    try {
        if (!slide) return;

        // Procura todos os elementos com a classe de animação no slide atual
        const animatedElements = slide.querySelectorAll('.animate-fade-in-up');

        animatedElements.forEach(el => {
            // Truque para reiniciar animação CSS:
            // 1. Remove a animação
            el.style.animation = 'none';
            // 2. Força o navegador a recalcular o layout (Reflow)
            el.offsetHeight;
            // 3. Limpa a propriedade para que o CSS original (animation) volte a funcionar
            el.style.animation = '';
        });
    } catch (error) {
        // Animation failed silently
        return;
    }
}

// Executar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initHeroSwiper);

// =================================
// Scroll Reveal Animation (AOS-style)
// =================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-on-scroll');

    if (revealElements.length === 0) return;

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
                element.classList.add('is-visible'); // Support for new CSS
            }
        });
    };

    // Initial check
    revealOnScroll();

    // On scroll
    window.addEventListener('scroll', revealOnScroll);
}

// =================================
// Active Navigation Link
// =================================
function initActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;

        // Remove active class from all
        link.classList.remove('active');

        // Add active to current page
        if (linkPath === currentPath ||
            (currentPath === '/' && linkPath === '/') ||
            (currentPath.includes(linkPath) && linkPath !== '/')) {
            link.classList.add('active');
        }
    });
}

// =================================
// Parallax Effect (Optional)
// =================================
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');

    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// =================================
// Lightbox Functionality
// =================================
function initLightbox() {
    // Create lightbox container if it doesn't exist
    let lightbox = document.querySelector('.lightbox');

    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-close" aria-label="Fechar">×</div>
            <img src="" alt="Imagem ampliada">
        `;
        document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    // Add click event to all gallery images
    const galleryImages = document.querySelectorAll('.masonry-item img');

    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.documentElement.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.documentElement.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Initialize lightbox if masonry grid exists
if (document.querySelector('.masonry-grid')) {
    document.addEventListener('DOMContentLoaded', initLightbox);
}

// =================================
// Toast Notification
// =================================
function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success'
        ? `<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
           </svg>`
        : `<svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
           </svg>`;

    toast.innerHTML = `
        <div class="flex items-center space-x-3">
            ${icon}
            <span class="font-medium text-slate-800">${message}</span>
        </div>
    `;

    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Export for use in other scripts
window.showToast = showToast;

// =================================
// Iframe Auto-Height (For Tien21 page)
// =================================
function initIframeAutoHeight() {
    const iframe = document.querySelector('.iframe-container iframe');
    if (!iframe) return;

    const setIframeHeight = () => {
        const headerHeight = document.getElementById('main-header')?.offsetHeight || 80;
        const viewportHeight = window.innerHeight;
        const iframeHeight = viewportHeight - headerHeight - 40; // 40px padding

        iframe.style.height = `${iframeHeight}px`;
    };

    setIframeHeight();
    window.addEventListener('resize', setIframeHeight);
}

// Initialize iframe if it exists
if (document.querySelector('.iframe-container iframe')) {
    document.addEventListener('DOMContentLoaded', initIframeAutoHeight);
}

// =================================
// Performance: Lazy Loading Images
// =================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// =================================
// Utility: Debounce Function
// =================================
function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =================================
// Console Branding
// =================================
console.log(
    '%cGT Móvel',
    'color: #F97316; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);'
);
console.log(
    '%cWebsite desenvolvido com as mais recentes tecnologias web de 2026',
    'color: #64748B; font-size: 12px;'
);