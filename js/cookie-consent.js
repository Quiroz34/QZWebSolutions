/**
 * Advanced Cookie Consent Manager
 * Maneja la lógica del banner, modal de preferencias y eventos GTM
 */

document.addEventListener('DOMContentLoaded', function () {
    // Referencias al DOM
    const cookieBanner = document.getElementById('cookieConsent');
    const cookieModal = document.getElementById('cookieSettingsModal');
    const btnAcceptAll = document.getElementById('btnCookieAccept'); // Botón en banner y modal (si hubiera)
    const btnRejectAll = document.getElementById('btnCookieReject');
    const btnSettings = document.getElementById('btnCookieSettings');
    const btnSavePreferences = document.getElementById('btnSavePreferences'); // Botón en modal
    const btnCloseModal = document.getElementById('btnCloseModal');

    // Checkboxes
    const checkAnalytics = document.getElementById('cookieAnalytics');
    const checkMarketing = document.getElementById('cookieMarketing');

    // Clave y Estado
    const COOKIE_CONSENT_KEY = 'qz_cookie_consent_v2';

    // 1. Inicialización
    init();

    function init() {
        const savedConsent = getConsent();

        if (!savedConsent) {
            // Si no hay consentimiento, mostrar banner después de un momento
            setTimeout(() => {
                showBanner();
            }, 1000);
        } else {
            // Si ya hay consentimiento, aplicar configuración (GTM)
            applyConsent(savedConsent);
        }
    }

    // 2. Funciones de UI
    function showBanner() {
        if (cookieBanner) cookieBanner.classList.add('show');
    }

    function hideBanner() {
        if (cookieBanner) cookieBanner.classList.remove('show');
    }

    function showModal() {
        if (cookieModal) {
            cookieModal.classList.add('show');
            cookieModal.setAttribute('aria-hidden', 'false');
        }
    }

    function hideModal() {
        if (cookieModal) {
            cookieModal.classList.remove('show');
            cookieModal.setAttribute('aria-hidden', 'true');
        }
    }

    // 3. Manejadores de Eventos

    // Aceptar Todo
    if (btnAcceptAll) {
        btnAcceptAll.addEventListener('click', () => {
            const consent = {
                necessary: true,
                analytics: true,
                marketing: true,
                timestamp: new Date().toISOString()
            };
            saveConsent(consent);
            hideBanner();
        });
    }

    // Rechazar Todo (excepto necesarias)
    if (btnRejectAll) {
        btnRejectAll.addEventListener('click', () => {
            const consent = {
                necessary: true,
                analytics: false,
                marketing: false,
                timestamp: new Date().toISOString()
            };
            saveConsent(consent);
            hideBanner();
        });
    }

    // Abrir Configuración
    if (btnSettings) {
        btnSettings.addEventListener('click', () => {
            // Cargar estado actual en los checkbox
            const current = getConsent();
            if (checkAnalytics) checkAnalytics.checked = current ? current.analytics : false;
            if (checkMarketing) checkMarketing.checked = current ? current.marketing : false;

            showModal();
        });
    }

    // Cerrar Modal
    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', hideModal);
    }

    // Guardar Preferencias desde Modal
    if (btnSavePreferences) {
        btnSavePreferences.addEventListener('click', () => {
            const consent = {
                necessary: true,
                analytics: checkAnalytics ? checkAnalytics.checked : false,
                marketing: checkMarketing ? checkMarketing.checked : false,
                timestamp: new Date().toISOString()
            };
            saveConsent(consent);
            hideModal();
            hideBanner();
        });
    }

    // Cerrar modal al hacer clic fuera (overlay)
    if (cookieModal) {
        cookieModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('cookie-modal-overlay')) {
                hideModal();
            }
        });
    }

    // 4. Lógica de Negocio

    function saveConsent(consentData) {
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
        applyConsent(consentData);
        console.log('Consentimiento guardado:', consentData);
    }

    function getConsent() {
        const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
        return stored ? JSON.parse(stored) : null;
    }

    function applyConsent(consent) {
        // Objeto GTM
        window.dataLayer = window.dataLayer || [];

        // Función gtag segura
        function gtag() { dataLayer.push(arguments); }

        // 1. Actualizar estado de consentimiento de Google (Consent Mode v2)
        const statusAnalytics = consent.analytics ? 'granted' : 'denied';
        const statusMarketing = consent.marketing ? 'granted' : 'denied';

        gtag('consent', 'update', {
            'analytics_storage': statusAnalytics,
            'ad_storage': statusMarketing,
            'ad_user_data': statusMarketing,
            'ad_personalization': statusMarketing
        });

        console.log('Consentimiento GTM actualizado:', { analytics: statusAnalytics, marketing: statusMarketing });

        // 2. Eventos personalizados para triggers adicionales (compatibilidad)
        window.dataLayer.push({
            'event': 'consent_update',
            'consent_necessary': 'granted',
            'consent_analytics': statusAnalytics,
            'consent_marketing': statusMarketing
        });

        // Eventos específicos para cargar scripts legacy
        if (consent.analytics) {
            window.dataLayer.push({ 'event': 'analytics_authorized' });
        }
        if (consent.marketing) {
            window.dataLayer.push({ 'event': 'marketing_authorized' });
        }
    }
});
