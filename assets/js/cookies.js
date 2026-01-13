/**
 * GT Móvel - Sistema de Gestão de Cookies
 * Controla o consentimento de cookies e carregamento condicional do Google Maps
 */

(function() {
    'use strict';

    const COOKIE_KEY = 'GT-Cookies';
    const COOKIE_EXPIRY_DAYS = 365;

    // Verificar se o utilizador já aceitou cookies
    function hasAcceptedCookies() {
        try {
            const consent = localStorage.getItem(COOKIE_KEY);
            return consent === 'accepted';
        } catch (e) {
            return false;
        }
    }

    // Guardar consentimento de cookies
    function acceptCookies() {
        try {
            localStorage.setItem(COOKIE_KEY, 'accepted');
            localStorage.setItem(COOKIE_KEY + '_date', new Date().toISOString());
            return true;
        } catch (e) {
            console.error('Erro ao guardar consentimento de cookies:', e);
            return false;
        }
    }

    // Criar HTML do banner de cookies
    function createCookieBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-banner-text">
                    <svg class="cookie-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <div>
                        <p class="cookie-title">Este website utiliza cookies</p>
                        <p class="cookie-description">Utilizamos cookies para melhorar a sua experiência e analisar o tráfego do website. Ao aceitar, permite funcionalidades como mapas e análises.</p>
                    </div>
                </div>
                <div class="cookie-banner-buttons">
                    <a href="/privacidade/" class="cookie-btn cookie-btn-details">Detalhes</a>
                    <button id="accept-cookies-btn" class="cookie-btn cookie-btn-accept">Aceitar</button>
                </div>
            </div>
        `;
        return banner;
    }

    // Adicionar estilos CSS do banner
    function addBannerStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(to right, #1e293b, #334155);
                border-top: 3px solid #F97316;
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
                z-index: 9999;
                animation: slideUp 0.4s ease-out;
            }

            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            .cookie-banner-content {
                max-width: 1400px;
                margin: 0 auto;
                padding: 1.5rem 2rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 2rem;
            }

            .cookie-banner-text {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                flex: 1;
            }

            .cookie-icon {
                width: 2rem;
                height: 2rem;
                color: #F97316;
                flex-shrink: 0;
                margin-top: 0.25rem;
            }

            .cookie-title {
                color: white;
                font-size: 1rem;
                font-weight: 600;
                margin: 0 0 0.25rem 0;
            }

            .cookie-description {
                color: #cbd5e1;
                font-size: 0.875rem;
                margin: 0;
                line-height: 1.5;
            }

            .cookie-banner-buttons {
                display: flex;
                gap: 0.75rem;
                flex-shrink: 0;
            }

            .cookie-btn {
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                font-size: 0.875rem;
                font-weight: 600;
                text-decoration: none;
                cursor: pointer;
                transition: all 0.3s ease;
                border: none;
                white-space: nowrap;
            }

            .cookie-btn-details {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .cookie-btn-details:hover {
                background: rgba(255, 255, 255, 0.15);
                border-color: rgba(255, 255, 255, 0.3);
            }

            .cookie-btn-accept {
                background: linear-gradient(to right, #F97316, #EA580C);
                color: white;
            }

            .cookie-btn-accept:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
            }

            /* Responsive */
            @media (max-width: 768px) {
                .cookie-banner-content {
                    flex-direction: column;
                    align-items: stretch;
                    padding: 1.25rem 1rem;
                    gap: 1rem;
                }

                .cookie-banner-text {
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .cookie-icon {
                    width: 1.5rem;
                    height: 1.5rem;
                }

                .cookie-banner-buttons {
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .cookie-btn {
                    width: 100%;
                    text-align: center;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Mostrar banner de cookies
    function showCookieBanner() {
        // Não mostrar se já aceitou
        if (hasAcceptedCookies()) {
            return;
        }

        addBannerStyles();
        const banner = createCookieBanner();
        document.body.appendChild(banner);

        // Event listener para botão aceitar
        const acceptBtn = document.getElementById('accept-cookies-btn');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', function() {
                if (acceptCookies()) {
                    banner.style.animation = 'slideDown 0.3s ease-out';
                    setTimeout(() => {
                        banner.remove();
                        // Recarregar página para carregar Google Maps
                        window.location.reload();
                    }, 300);
                }
            });
        }
    }

    // Função para carregar Google Maps apenas se cookies aceites
    window.loadGoogleMaps = function() {
        if (!hasAcceptedCookies()) {
            console.log('Google Maps não carregado - cookies não aceites');
            return false;
        }
        return true;
    };

    // Adicionar animação de slide down
    const slideDownStyle = document.createElement('style');
    slideDownStyle.textContent = `
        @keyframes slideDown {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(slideDownStyle);

    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showCookieBanner);
    } else {
        showCookieBanner();
    }

    // Expor função globalmente para verificação
    window.GTCookies = {
        hasAccepted: hasAcceptedCookies,
        accept: acceptCookies
    };
})();
