// script.js - QZ Web Solutions - VersiÃ³n Profesional Mejorada
'use strict';

// Estado global de la aplicaciÃ³n
const AppState = {
    isMenuOpen: false,
    isFormSubmitting: false,
    currentYear: new Date().getFullYear(),
    whatsappNumber: '527228964383',
    phoneNumber: '722 896 4383',
    email: 'info@qzwebsolutions.com'
};

// InicializaciÃ³n cuando el DOM estÃ¡ listo
document.addEventListener('DOMContentLoaded', function () {
    // Configurar aÃ±o actual en el footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = AppState.currentYear;
    }

    // Inicializar navegaciÃ³n mÃ³vil
    initMobileNavigation();

    // Inicializar scroll suave
    initSmoothScroll();

    // Inicializar formulario de contacto
    initContactForm();

    // Inicializar newsletter
    initNewsletter();

    // Inicializar animaciones
    initAnimations();

    // Inicializar efectos de scroll
    initScrollEffects();

    // Inicializar efectos visuales
    initVisualEffects();
});

// NavegaciÃ³n mÃ³vil mejorada
function initMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const siteNav = document.getElementById('siteNav');

    if (!navToggle || !siteNav) return;

    const toggleMenu = () => {
        AppState.isMenuOpen = !AppState.isMenuOpen;
        navToggle.setAttribute('aria-expanded', String(AppState.isMenuOpen));
        siteNav.classList.toggle('active', AppState.isMenuOpen);
        document.body.style.overflow = AppState.isMenuOpen ? 'hidden' : '';

        // Animar el botÃ³n hamburguesa
        navToggle.classList.toggle('active', AppState.isMenuOpen);
    };

    // Evento del botÃ³n de menÃº
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Cerrar menÃº al hacer clic en enlaces
    document.querySelectorAll('#siteNav a').forEach(link => {
        link.addEventListener('click', () => {
            if (AppState.isMenuOpen) {
                toggleMenu();
            }
        });
    });

    // Cerrar menÃº al hacer clic fuera (solo mÃ³vil)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && AppState.isMenuOpen) {
            if (!siteNav.contains(e.target) && !navToggle.contains(e.target)) {
                toggleMenu();
            }
        }
    });

    // Cerrar menÃº al redimensionar (si se cambia a desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && AppState.isMenuOpen) {
            toggleMenu();
        }
    });

    // Cerrar menÃº con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && AppState.isMenuOpen) {
            toggleMenu();
        }
    });
}

// Scroll suave mejorado
function initSmoothScroll() {
    // Scroll desde botÃ³n del hero
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
    const message = `*Solicitud de InformaciÃ³n sobre Plan*%0A%0A` +
        `*Plan de InterÃ©s:* ${encodeURIComponent(planName)}%0A` +
        `*Precio:* ${encodeURIComponent(price)}%0A` +
        `*Mensaje:* Hola, estoy interesado en el plan ${planName} de ${price}. Me gustarÃ­a recibir mÃ¡s informaciÃ³n y un presupuesto detallado.%0A%0A` +
        `*Fecha:* ${encodeURIComponent(new Date().toLocaleString('es-MX'))}%0A` +
        `*Origen:* PÃ¡gina Web QZ Web Solutions`;

    const whatsappURL = `https://wa.me/${AppState.whatsappNumber}?text=${message}`;

    window.open(whatsappURL, '_blank', 'noopener,noreferrer');
}

function sendServiceToWhatsApp(serviceName) {
    const message = `*Solicitud de InformaciÃ³n sobre Servicio*%0A%0A` +
        `*Servicio de InterÃ©s:* ${encodeURIComponent(serviceName)}%0A` +
        `*Mensaje:* Hola, estoy interesado en el servicio de ${serviceName}. Me gustarÃ­a recibir mÃ¡s informaciÃ³n y un presupuesto personalizado.%0A%0A` +
        `*Fecha:* ${encodeURIComponent(new Date().toLocaleString('es-MX'))}%0A` +
        `*Origen:* PÃ¡gina Web QZ Web Solutions`;

    const whatsappURL = `https://wa.me/${AppState.whatsappNumber}?text=${message}`;

    window.open(whatsappURL, '_blank', 'noopener,noreferrer');
}

// FunciÃ³n para enviar a WhatsApp desde formulario
async function sendToWhatsApp(formData) {
    return new Promise((resolve, reject) => {
        try {
            // Formatear el mensaje para WhatsApp
            const message = `*Nueva Solicitud de PÃ¡gina Web*%0A%0A` +
                `*Nombre:* ${encodeURIComponent(formData.name)}%0A` +
                `*TelÃ©fono:* ${encodeURIComponent(formData.phone)}%0A` +
                `*Tipo de Negocio:* ${encodeURIComponent(getTipoNegocioName(formData.tipo_negocio))}%0A` +
                `*Mensaje:*%0A${encodeURIComponent(formData.message)}%0A%0A` +
                `*Fecha:* ${encodeURIComponent(formData.date)}%0A` +
                `*Origen:* Formulario Web QZ Web Solutions`;

            const whatsappURL = `https://wa.me/${AppState.whatsappNumber}?text=${message}`;

            // Abrir WhatsApp en nueva ventana
            const newWindow = window.open(whatsappURL, '_blank', 'noopener,noreferrer');

            // Cerrar ventana despuÃ©s de 5 segundos (opcional)
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
        'restaurante': 'Restaurante o CafeterÃ­a',
        'servicio': 'Servicio TÃ©cnico',
        'consultor': 'Consultor o Profesional',
        'educacion': 'EducaciÃ³n o CapacitaciÃ³n',
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

    // ValidaciÃ³n en tiempo real
    if (nameInput) nameInput.addEventListener('input', () => validateName());
    if (phoneInput) phoneInput.addEventListener('input', () => validatePhone());
    if (messageInput) messageInput.addEventListener('input', () => validateMessage());
    if (tipoNegocioSelect) tipoNegocioSelect.addEventListener('change', () => validateTipoNegocio());

    // EnvÃ­o del formulario
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

            // Ã‰xito
            showStatus(`Â¡Perfecto ${formData.name}! Tu solicitud ha sido enviada correctamente. Te contactaremos por WhatsApp en menos de 24 horas.`, 'success');

            // Resetear formulario
            form.reset();

            // Guardar en localStorage como backup
            saveToLocalStorage(formData);

            // Mostrar confeti (efecto visual)
            showConfetti();

        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            showStatus('No se pudo enviar tu solicitud. Por favor, contÃ¡ctanos directamente al ' + AppState.phoneNumber, 'error');
        } finally {
            // Restaurar estado del formulario
            setFormSubmitting(false);
        }
    });

    // Funciones de validaciÃ³n mejoradas
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
        if (!/^[a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃÃ‰ÃÃ“ÃšÃ±Ã‘\s]+$/.test(value)) {
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
            phoneError.textContent = 'Tu telÃ©fono es obligatorio.';
            phoneInput.parentElement.style.borderColor = 'var(--error)';
            return false;
        }

        const cleanValue = value.replace(/\s/g, '');
        if (!phoneRegex.test(cleanValue) || cleanValue.length !== 10) {
            phoneError.textContent = 'Por favor, introduce un telÃ©fono vÃ¡lido (10 dÃ­gitos). Ej: 7221234567';
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
            messageError.textContent = 'Describe mejor lo que necesitas (mÃ­nimo 10 caracteres).';
            messageInput.parentElement.style.borderColor = 'var(--error)';
            return false;
        }
        if (value.length > 1000) {
            messageError.textContent = 'El mensaje es demasiado largo (mÃ¡ximo 1000 caracteres).';
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

        // Auto-ocultar mensaje de Ã©xito despuÃ©s de 8 segundos
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

            // Mantener solo los Ãºltimos 50 envÃ­os
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

        // Crear partÃ­culas de confeti
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

            // AnimaciÃ³n
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

        // Remover contenedor despuÃ©s de la animaciÃ³n
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
    // Observer para elementos animables (Reveal System)
    const revealObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Opcional: dejar de observar si solo queremos que se anime una vez
                // revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    // Observar todos los elementos con clase reveal
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    revealElements.forEach(el => revealObserver.observe(el));

    // Mantener compatibilidad con animaciones antiguas si existen
    const legacyAnimatable = document.querySelectorAll(
        '.service-card:not(.reveal), .portfolio-card:not(.reveal), .benefit-item:not(.reveal), .pricing-card:not(.reveal)'
    );

    legacyAnimatable.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        const legacyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, revealObserverOptions);

        legacyObserver.observe(element);
    });

    // AnimaciÃ³n de estadÃ­sticas en cÃ­rculos
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

    // AnimaciÃ³n de nÃºmeros
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
    const circumference = 2 * Math.PI * 60; // Radio del cÃ­rculo

    // Animar el cÃ­rculo
    element.style.background = `conic-gradient(var(--primary) ${value * 3.6}deg, rgba(45, 91, 255, 0.1) 0deg)`;

    // Animar el nÃºmero
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
    
    // Fix: Don't animate "24/7" or similar non-integer stats
    if (text.includes('/')) return;

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
    // Efecto de partÃ­culas en el hero
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

    // Efecto de carga en imÃ¡genes del portafolio
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

        // AnimaciÃ³n
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
    // Precargar imÃ¡genes importantes
    const logo = new Image();
    logo.src = '/assets/logofv2.jpg';

    // Lazy loading para imÃ¡genes fuera del viewport
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

// FunciÃ³n Scroll To Top
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (!scrollTopBtn) return;

    // Mostrar/ocultar botÃ³n al hacer scroll
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

// Formateo automÃ¡tico de telÃ©fono mejorado
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Solo nÃºmeros

            // Limitar a 10 dÃ­gitos
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

        // ValidaciÃ³n bÃ¡sica
        if (!email || !isValidEmail(email)) {
            showNewsletterStatus('Por favor, introduce un correo vÃ¡lido.', 'error');
            return;
        }

        try {
            // Guardar en localStorage
            saveNewsletterEmail(email);

            // Enviar notificaciÃ³n por WhatsApp
            const message = `*Nueva SuscripciÃ³n al Newsletter*%0A%0A` +
                `*Email:* ${encodeURIComponent(email)}%0A` +
                `*Fecha:* ${encodeURIComponent(new Date().toLocaleString('es-MX'))}%0A` +
                `*Origen:* Newsletter Footer`;

            const whatsappURL = `https://wa.me/${AppState.whatsappNumber}?text=${message}`;
            window.open(whatsappURL, '_blank', 'noopener,noreferrer');

            // Mostrar mensaje de Ã©xito
            showNewsletterStatus('Â¡Gracias por suscribirte! Te enviaremos tips Ãºtiles pronto ðŸŽ‰', 'success');

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

        // Auto-ocultar despuÃ©s de 5 segundos
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

// Inicializar newsletter cuando el DOM estÃ© listo
document.addEventListener('DOMContentLoaded', initNewsletter);



// Google Analytics inicializado en HTML para mejor rendimiento

document.addEventListener('DOMContentLoaded', () => {
    initServiceWorker();
    initCookieBanner();
});

function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registrado exitosamente:', registration.scope);
                })
                .catch(error => {
                    console.log('Fallo registro de SW:', error);
                });

            // Detectar cuando un nuevo Service Worker toma el control
            // Esto sucede porque en el nuevo SW pusimos "clients.claim()"
            let refreshing;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (refreshing) return;
                refreshing = true;
                console.log("Nueva versión detectada. Recargando...");
                window.location.reload();
            });
        });
    }
}

function initCookieBanner() {
    // Verificar si ya aceptó cookies
    if (localStorage.getItem('qz_cookies_accepted') === 'true') {
        return;
    }

    // Crear banner si no existe (aunque idealmente debería estar en HTML)
    // Pero para asegurar que aparezca aunque el usuario no edite HTML:
    const existingBanner = document.getElementById('cookieBanner');
    if (existingBanner) {
        setTimeout(() => existingBanner.classList.add('show'), 2000);
        return;
    }

    // Inserción dinámica si no está en HTML
    const banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <div class='cookie-content'>
            <div class='cookie-text'>
                <p>Utilizamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas nuestra <a href='/privacy'>Política de Privacidad</a>.</p>
            </div>
            <button id='acceptCookies' class='cookie-btn'>Aceptar</button>
        </div>
    `;

    document.body.appendChild(banner);

    // Event Listeners
    setTimeout(() => banner.classList.add('show'), 2000);

    document.getElementById('acceptCookies').addEventListener('click', () => {
        localStorage.setItem('qz_cookies_accepted', 'true');
        banner.classList.remove('show');
    });
}

// Gallery Header Fade Effect

// Gallery Header Fade Effect
document.addEventListener('DOMContentLoaded', function () {
    const headerTitle = document.querySelector('.page-header .container');

    if (headerTitle) {
        window.addEventListener('scroll', function () {
            let scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

            // Calculate opacity: starts at 1, goes to 0 at 300px scroll
            let opacity = 1 - (scrollPosition / 300);

            // Ensure opacity stays between 0 and 1
            if (opacity < 0) opacity = 0;
            if (opacity > 1) opacity = 1;

            headerTitle.style.opacity = opacity;

            // Optional: Add a slight parallax effect for smoother disappearing
            headerTitle.style.transform = 'translateY(' + (scrollPosition * 0.4) + 'px)';
        });
    }
});

// Gallery Scrolling for Projects Page
function scrollGallery(id, direction) {
    const container = document.getElementById(id);
    if (!container) return;
    const scrollAmount = container.clientWidth; // Scroll exact container width

    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// =========================================== 
//           FAQ ACCORDION FUNCTIONALITY      
// =========================================== 

document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle la pregunta actual
            this.setAttribute('aria-expanded', !isExpanded);
        });
    });
});
