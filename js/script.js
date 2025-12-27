// script.js - QZ Web Solutions - Versión Profesional Mejorada
'use strict';

// Estado global de la aplicación
const AppState = {
    isMenuOpen: false,
    isFormSubmitting: false,
    currentYear: new Date().getFullYear(),
    whatsappNumber: '527228964383',
    phoneNumber: '722 896 4383',
    email: 'info@qzwebsolutions.com'
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function () {
    // Configurar año actual en el footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = AppState.currentYear;
    }

    // Inicializar navegación móvil
    initMobileNavigation();

    // Inicializar scroll suave
    initSmoothScroll();

    // Inicializar formulario de contacto
    initContactForm();

    // Inicializar animaciones
    initAnimations();

    // Inicializar efectos de scroll
    initScrollEffects();

    // Inicializar efectos visuales
    initVisualEffects();
});

// Navegación móvil mejorada
function initMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const siteNav = document.getElementById('siteNav');

    if (!navToggle || !siteNav) return;

    const toggleMenu = () => {
        AppState.isMenuOpen = !AppState.isMenuOpen;
        navToggle.setAttribute('aria-expanded', String(AppState.isMenuOpen));
        siteNav.classList.toggle('active', AppState.isMenuOpen);
        document.body.style.overflow = AppState.isMenuOpen ? 'hidden' : '';

        // Animar el botón hamburguesa
        navToggle.classList.toggle('active', AppState.isMenuOpen);
    };

    // Evento del botón de menú
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Cerrar menú al hacer clic en enlaces
    document.querySelectorAll('#siteNav a').forEach(link => {
        link.addEventListener('click', () => {
            if (AppState.isMenuOpen) {
                toggleMenu();
            }
        });
    });

    // Cerrar menú al hacer clic fuera (solo móvil)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && AppState.isMenuOpen) {
            if (!siteNav.contains(e.target) && !navToggle.contains(e.target)) {
                toggleMenu();
            }
        }
    });

    // Cerrar menú al redimensionar (si se cambia a desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && AppState.isMenuOpen) {
            toggleMenu();
        }
    });

    // Cerrar menú con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && AppState.isMenuOpen) {
            toggleMenu();
        }
    });
}

// Scroll suave mejorado
function initSmoothScroll() {
    // Scroll desde botón del hero
    const btnContact = document.getElementById('btnContact');
    if (btnContact) {
        btnContact.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSection('contacto');
        });
    }

    // Scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const targetId = href.slice(1);
                scrollToSection(targetId);
            }
        });
    });
}

function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        const headerOffset = document.querySelector('header').offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

// Funciones para WhatsApp (globales para uso en HTML)
function sendPlanToWhatsApp(planName, price) {
    const message = `*Solicitud de Información sobre Plan*%0A%0A` +
        `*Plan de Interés:* ${encodeURIComponent(planName)}%0A` +
        `*Precio:* ${encodeURIComponent(price)}%0A` +
        `*Mensaje:* Hola, estoy interesado en el plan ${planName} de ${price}. Me gustaría recibir más información y un presupuesto detallado.%0A%0A` +
        `*Fecha:* ${encodeURIComponent(new Date().toLocaleString('es-MX'))}%0A` +
        `*Origen:* Página Web QZ Web Solutions`;

    const whatsappURL = `https://wa.me/${AppState.whatsappNumber}?text=${message}`;

    window.open(whatsappURL, '_blank', 'noopener,noreferrer');
}

function sendServiceToWhatsApp(serviceName) {
    const message = `*Solicitud de Información sobre Servicio*%0A%0A` +
        `*Servicio de Interés:* ${encodeURIComponent(serviceName)}%0A` +
        `*Mensaje:* Hola, estoy interesado en el servicio de ${serviceName}. Me gustaría recibir más información y un presupuesto personalizado.%0A%0A` +
        `*Fecha:* ${encodeURIComponent(new Date().toLocaleString('es-MX'))}%0A` +
        `*Origen:* Página Web QZ Web Solutions`;

    const whatsappURL = `https://wa.me/${AppState.whatsappNumber}?text=${message}`;

    window.open(whatsappURL, '_blank', 'noopener,noreferrer');
}

// Función para enviar a WhatsApp desde formulario
async function sendToWhatsApp(formData) {
    return new Promise((resolve, reject) => {
        try {
            // Formatear el mensaje para WhatsApp
            const message = `*Nueva Solicitud de Página Web*%0A%0A` +
                `*Nombre:* ${encodeURIComponent(formData.name)}%0A` +
                `*Teléfono:* ${encodeURIComponent(formData.phone)}%0A` +
                `*Tipo de Negocio:* ${encodeURIComponent(getTipoNegocioName(formData.tipo_negocio))}%0A` +
                `*Mensaje:*%0A${encodeURIComponent(formData.message)}%0A%0A` +
                `*Fecha:* ${encodeURIComponent(formData.date)}%0A` +
                `*Origen:* Formulario Web QZ Web Solutions`;

            const whatsappURL = `https://wa.me/${AppState.whatsappNumber}?text=${message}`;

            // Abrir WhatsApp en nueva ventana
            const newWindow = window.open(whatsappURL, '_blank', 'noopener,noreferrer');

            // Cerrar ventana después de 5 segundos (opcional)
            setTimeout(() => {
                if (newWindow && !newWindow.closed) {
                    newWindow.close();
                }
            }, 5000);

            resolve({ success: true });

        } catch (error) {
            reject(error);
        }
    });
}

function getTipoNegocioName(value) {
    const tipos = {
        'tienda': 'Tienda o Comercio',
        'restaurante': 'Restaurante o Cafetería',
        'servicio': 'Servicio Técnico',
        'consultor': 'Consultor o Profesional',
        'educacion': 'Educación o Capacitación',
        'salud': 'Salud o Bienestar',
        'otro': 'Otro tipo de negocio'
    };
    return tipos[value] || value;
}

// Formulario de contacto mejorado
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Elementos del formulario
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const tipoNegocioSelect = document.getElementById('tipo_negocio');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    const statusElement = document.getElementById('status');

    // Elementos de error
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const messageError = document.getElementById('messageError');

    // Validación en tiempo real
    if (nameInput) nameInput.addEventListener('input', () => validateName());
    if (phoneInput) phoneInput.addEventListener('input', () => validatePhone());
    if (messageInput) messageInput.addEventListener('input', () => validateMessage());
    if (tipoNegocioSelect) tipoNegocioSelect.addEventListener('change', () => validateTipoNegocio());

    // Envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (AppState.isFormSubmitting) return;

        // Validar todos los campos
        const isNameValid = validateName();
        const isPhoneValid = validatePhone();
        const isMessageValid = validateMessage();
        const isTipoNegocioValid = validateTipoNegocio();

        if (!isNameValid || !isPhoneValid || !isMessageValid || !isTipoNegocioValid) {
            showStatus('Por favor, corrige los errores en el formulario antes de enviar.', 'error');
            scrollToSection('contacto');
            return;
        }

        // Datos del formulario
        const formData = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            tipo_negocio: tipoNegocioSelect.value,
            message: messageInput.value.trim(),
            date: new Date().toLocaleString('es-MX'),
            source: 'Formulario Web QZ Web Solutions'
        };

        // Cambiar estado del formulario
        setFormSubmitting(true);

        try {
            // Enviar a WhatsApp
            await sendToWhatsApp(formData);

            // Éxito
            showStatus(`¡Perfecto ${formData.name}! Tu solicitud ha sido enviada correctamente. Te contactaremos por WhatsApp en menos de 24 horas.`, 'success');

            // Resetear formulario
            form.reset();

            // Guardar en localStorage como backup
            saveToLocalStorage(formData);

            // Mostrar confeti (efecto visual)
            showConfetti();

        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            showStatus('No se pudo enviar tu solicitud. Por favor, contáctanos directamente al ' + AppState.phoneNumber, 'error');
        } finally {
            // Restaurar estado del formulario
            setFormSubmitting(false);
        }
    });

    // Funciones de validación mejoradas
    function validateName() {
        const value = nameInput.value.trim();
        const nameError = document.getElementById('nameError');

        if (!value) {
            nameError.textContent = 'Tu nombre es obligatorio.';
            nameInput.parentElement.style.borderColor = 'var(--error)';
            return false;
        }
        if (value.length < 2) {
            nameError.textContent = 'El nombre debe tener al menos 2 caracteres.';
            nameInput.parentElement.style.borderColor = 'var(--error)';
            return false;
        }
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
            nameError.textContent = 'El nombre solo debe contener letras.';
            nameInput.parentElement.style.borderColor = 'var(--error)';
            return false;
        }
        nameError.textContent = '';
        nameInput.parentElement.style.borderColor = '';
        return true;
    }

    function validatePhone() {
        const value = phoneInput.value.trim();
        const phoneError = document.getElementById('phoneError');
        const phoneRegex = /^[0-9\s\-\(\)]{10,15}$/;

        if (!value) {
            phoneError.textContent = 'Tu teléfono es obligatorio.';
            phoneInput.parentElement.style.borderColor = 'var(--error)';
            return false;
        }

        const cleanValue = value.replace(/\s/g, '');
        if (!phoneRegex.test(cleanValue) || cleanValue.length !== 10) {
            phoneError.textContent = 'Por favor, introduce un teléfono válido (10 dígitos). Ej: 7221234567';
            phoneInput.parentElement.style.borderColor = 'var(--error)';
            return false;
        }

        phoneError.textContent = '';
        phoneInput.parentElement.style.borderColor = '';
        return true;
    }

    function validateMessage() {
        const value = messageInput.value.trim();
        const messageError = document.getElementById('messageError');

        if (!value) {
            messageError.textContent = 'Por favor, describe lo que necesitas.';
            messageInput.parentElement.style.borderColor = 'var(--error)';
            return false;
        }
        if (value.length < 10) {
            messageError.textContent = 'Describe mejor lo que necesitas (mínimo 10 caracteres).';
            messageInput.parentElement.style.borderColor = 'var(--error)';
            return false;
        }
        if (value.length > 1000) {
            messageError.textContent = 'El mensaje es demasiado largo (máximo 1000 caracteres).';
            messageInput.parentElement.style.borderColor = 'var(--error)';
            return false;
        }
        messageError.textContent = '';
        messageInput.parentElement.style.borderColor = '';
        return true;
    }

    function validateTipoNegocio() {
        const value = tipoNegocioSelect.value;
        if (!value) {
            return false;
        }
        return true;
    }

    function setFormSubmitting(isSubmitting) {
        AppState.isFormSubmitting = isSubmitting;
        submitBtn.disabled = isSubmitting;

        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        if (btnText) btnText.style.display = isSubmitting ? 'none' : 'inline-flex';
        if (btnLoading) btnLoading.style.display = isSubmitting ? 'inline-flex' : 'none';
    }

    function showStatus(message, type) {
        if (!statusElement) return;

        statusElement.textContent = message;
        statusElement.className = 'status-text';

        if (type === 'success') {
            statusElement.classList.add('success');
            statusElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        } else if (type === 'error') {
            statusElement.classList.add('error');
            statusElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        }

        // Scroll al mensaje
        statusElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Auto-ocultar mensaje de éxito después de 8 segundos
        if (type === 'success') {
            setTimeout(() => {
                statusElement.textContent = '';
                statusElement.className = 'status-text';
            }, 8000);
        }
    }

    function saveToLocalStorage(data) {
        try {
            const submissions = JSON.parse(localStorage.getItem('qzWebSubmissions') || '[]');
            submissions.push({
                ...data,
                timestamp: new Date().toISOString(),
                id: Date.now()
            });

            // Mantener solo los últimos 50 envíos
            if (submissions.length > 50) {
                submissions.shift();
            }

            localStorage.setItem('qzWebSubmissions', JSON.stringify(submissions));
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }

    function showConfetti() {
        // Efecto simple de confeti
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.top = '0';
        confetti.style.left = '0';
        confetti.style.width = '100%';
        confetti.style.height = '100%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        document.body.appendChild(confetti);

        // Crear partículas de confeti
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '10px';
            particle.style.height = '10px';
            particle.style.background = getRandomColor();
            particle.style.borderRadius = '50%';
            particle.style.top = '-20px';
            particle.style.left = `${Math.random() * 100}%`;

            confetti.appendChild(particle);

            // Animación
            const animation = particle.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 1000,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            });

            animation.onfinish = () => {
                particle.remove();
            };
        }

        // Remover contenedor después de la animación
        setTimeout(() => {
            confetti.remove();
        }, 2000);
    }

    function getRandomColor() {
        const colors = ['#2d5bff', '#00c9ff', '#00ff9d', '#ff6b6b', '#ffd93d', '#6b5b95'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Animaciones mejoradas
function initAnimations() {
    // Observer para elementos animables
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos con animación
    const animatableElements = document.querySelectorAll(
        '.service-card, .portfolio-card, .benefit-item, .pricing-card, .stat'
    );

    animatableElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Animación de estadísticas en círculos
    const circleProgresses = document.querySelectorAll('.circle-progress');
    if (circleProgresses.length > 0) {
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const value = entry.target.getAttribute('data-value');
                    animateCircleProgress(entry.target, value);
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        circleProgresses.forEach(circle => progressObserver.observe(circle));
    }

    // Animación de números
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length > 0) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => statObserver.observe(stat));
    }
}

function animateCircleProgress(element, value) {
    const progressValue = element.querySelector('.progress-value');
    const circumference = 2 * Math.PI * 60; // Radio del círculo

    // Animar el círculo
    element.style.background = `conic-gradient(var(--primary) ${value * 3.6}deg, rgba(45, 91, 255, 0.1) 0deg)`;

    // Animar el número
    let current = 0;
    const target = parseInt(value);
    const duration = 1500;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            progressValue.textContent = target + '%';
            clearInterval(timer);
        } else {
            progressValue.textContent = Math.floor(current) + '%';
        }
    }, 16);
}

function animateCounter(element) {
    const text = element.textContent;
    const isPercentage = text.includes('%');
    const isPlus = text.includes('+');
    const target = parseInt(text.replace(/[^0-9]/g, ''));

    if (isNaN(target)) return;

    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target + (isPercentage ? '%' : isPlus ? '+' : '');
            clearInterval(timer);
        } else {
            const value = Math.floor(current);
            element.textContent = value + (isPercentage ? '%' : isPlus ? '+' : '');
        }
    }, 16);
}

// Efectos de scroll mejorados
function initScrollEffects() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
        // Cambiar fondo del header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Ocultar/mostrar header (solo desktop)
        if (window.innerWidth > 768) {
            if (window.scrollY > lastScrollY && window.scrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }

        lastScrollY = window.scrollY;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // Efecto parallax en elementos flotantes
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 20;
        const yPos = (clientY / window.innerHeight - 0.5) * 20;

        document.querySelectorAll('.floating-card').forEach((el, index) => {
            const speed = 0.5 + (index * 0.1);
            el.style.transform = `translate(${xPos * speed}px, ${yPos * speed}px)`;
        });
    });
}

// Efectos visuales adicionales
function initVisualEffects() {
    // Efecto de partículas en el hero
    if (window.innerWidth > 768) {
        createParticles();
    }

    // Efecto de hover en tarjetas de precios
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('featured')) {
                card.style.transform = 'translateY(-10px)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('featured')) {
                card.style.transform = 'translateY(0)';
            }
        });
    });

    // Efecto de carga en imágenes del portafolio
    const portfolioImages = document.querySelectorAll('.portfolio-image');
    portfolioImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.6s ease';

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(img);
    });
}

function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(45, 91, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.zIndex = '1';

        hero.appendChild(particle);

        // Animación
        animateParticle(particle);
    }
}

function animateParticle(element) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;

    const animation = element.animate([
        { transform: `translate(${x}%, ${y}%)`, opacity: 0 },
        { transform: `translate(${x + 10}%, ${y - 10}%)`, opacity: 0.8 },
        { transform: `translate(${x}%, ${y}%)`, opacity: 0 }
    ], {
        duration: 3000 + Math.random() * 2000,
        iterations: Infinity
    });
}

// Mejoras adicionales para SEO y rendimiento
window.addEventListener('load', () => {
    // Precargar imágenes importantes
    const logo = new Image();
    logo.src = '/assets/logofv2.jpg';

    // Lazy loading para imágenes fuera del viewport
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Funcionalidad Scroll To Top
    initScrollToTop();
});

// Función Scroll To Top
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (!scrollTopBtn) return;

    // Mostrar/ocultar botón al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Click para volver arriba
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Formateo automático de teléfono mejorado
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Solo números

            // Limitar a 10 dígitos
            if (value.length > 10) {
                value = value.slice(0, 10);
            }

            // Formatear: 722 123 4567
            if (value.length > 6) {
                value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
            } else if (value.length > 3) {
                value = value.slice(0, 3) + ' ' + value.slice(3);
            }

            e.target.value = value;
        });
    }
});

// =========================================
// NEWSLETTER FUNCIONAL
// =========================================
function initNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;

    const emailInput = document.getElementById('newsletterEmail');
    const statusDiv = document.getElementById('newsletterStatus');

    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();

        // Validación básica
        if (!email || !isValidEmail(email)) {
            showNewsletterStatus('Por favor, introduce un correo válido.', 'error');
            return;
        }

        try {
            // Guardar en localStorage
            saveNewsletterEmail(email);

            // Enviar notificación por WhatsApp
            const message = `*Nueva Suscripción al Newsletter*%0A%0A` +
                `*Email:* ${encodeURIComponent(email)}%0A` +
                `*Fecha:* ${encodeURIComponent(new Date().toLocaleString('es-MX'))}%0A` +
                `*Origen:* Newsletter Footer`;

            const whatsappURL = `https://wa.me/${AppState.whatsappNumber}?text=${message}`;
            window.open(whatsappURL, '_blank', 'noopener,noreferrer');

            // Mostrar mensaje de éxito
            showNewsletterStatus('¡Gracias por suscribirte! Te enviaremos tips útiles pronto 🎉', 'success');

            // Limpiar formulario
            emailInput.value = '';

        } catch (error) {
            console.error('Error en newsletter:', error);
            showNewsletterStatus('Hubo un problema. Intenta de nuevo.', 'error');
        }
    });

    function showNewsletterStatus(message, type) {
        if (!statusDiv) return;

        statusDiv.textContent = message;
        statusDiv.className = `newsletter-status ${type} show`;

        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            statusDiv.classList.remove('show');
        }, 5000);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function saveNewsletterEmail(email) {
        try {
            const newsletters = JSON.parse(localStorage.getItem('qzNewsletters') || '[]');
            newsletters.push({
                email: email,
                date: new Date().toISOString(),
                timestamp: Date.now()
            });
            localStorage.setItem('qzNewsletters', JSON.stringify(newsletters));
        } catch (error) {
            console.error('Error guardando email:', error);
        }
    }
}

// Inicializar newsletter cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initNewsletter);

// =========================================
// DARK MODE TOGGLE
// =========================================
function initDarkModeToggle() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;

    // Verificar preferencia guardada
    const savedMode = localStorage.getItem('qzDarkMode');
    if (savedMode === 'light') {
        document.body.classList.add('light-mode');
    }

    // Toggle al hacer click
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');

        // Guardar preferencia
        const isLightMode = document.body.classList.contains('light-mode');
        localStorage.setItem('qzDarkMode', isLightMode ? 'light' : 'dark');

        // Animación de feedback
        darkModeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            darkModeToggle.style.transform = '';
        }, 300);
    });
}

// Inicializar dark mode cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initDarkModeToggle);

// =========================================
// GOOGLE ANALYTICS PLACEHOLDER
// =========================================
// Descomenta y configura con tu ID cuando estés listo
/*
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX');
*/