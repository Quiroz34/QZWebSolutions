// script.js - Optimizado para páginas web de profesionales y negocios
'use strict';

// Estado global de la aplicación
const AppState = {
    isMenuOpen: false,
    isFormSubmitting: false,
    currentYear: new Date().getFullYear()
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Console log de bienvenida
    console.log(
        `%cQZ Web Solutions%c\nPáginas web para profesionales y negocios\nhttps://qzwebsolutions.com`,
        'color: #2563eb; font-size: 18px; font-weight: bold;',
        'color: #94a3b8; font-size: 14px;'
    );
});

// Navegación móvil
function initMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const siteNav = document.getElementById('siteNav');
    
    if (!navToggle || !siteNav) return;
    
    const toggleMenu = () => {
        AppState.isMenuOpen = !AppState.isMenuOpen;
        navToggle.setAttribute('aria-expanded', String(AppState.isMenuOpen));
        siteNav.classList.toggle('active', AppState.isMenuOpen);
        document.body.style.overflow = AppState.isMenuOpen ? 'hidden' : '';
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

// Scroll suave
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
        anchor.addEventListener('click', function(e) {
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
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

// Formulario de contacto
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Elementos del formulario
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const profesionSelect = document.getElementById('profesion');
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
    
    // Envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (AppState.isFormSubmitting) return;
        
        // Validar todos los campos
        const isNameValid = validateName();
        const isPhoneValid = validatePhone();
        const isMessageValid = validateMessage();
        const isProfesionValid = validateProfesion();
        
        if (!isNameValid || !isPhoneValid || !isMessageValid || !isProfesionValid) {
            showStatus('Por favor, corrige los errores en el formulario.', 'error');
            return;
        }
        
        // Datos del formulario
        const formData = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            profesion: profesionSelect.value,
            message: messageInput.value.trim(),
            date: new Date().toLocaleString('es-MX'),
            source: 'Landing Page Profesionales'
        };
        
        // Cambiar estado del formulario
        setFormSubmitting(true);
        
        try {
            // Enviar a WhatsApp
            await sendToWhatsApp(formData);
            
            // Éxito
            showStatus(`¡Gracias ${formData.name}! Hemos recibido tu solicitud. Te contactaremos por WhatsApp en menos de 24 horas.`, 'success');
            
            // Resetear formulario
            form.reset();
            
            // Guardar en localStorage como backup
            saveToLocalStorage(formData);
            
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            showStatus('No se pudo enviar tu solicitud. Por favor, contáctanos directamente al 722 896 4383', 'error');
        } finally {
            // Restaurar estado del formulario
            setFormSubmitting(false);
        }
    });
    
    // Funciones de validación
    function validateName() {
        const value = nameInput.value.trim();
        if (!value) {
            nameError.textContent = 'Tu nombre es obligatorio.';
            nameInput.style.borderColor = '#ef4444';
            return false;
        }
        if (value.length < 2) {
            nameError.textContent = 'El nombre debe tener al menos 2 caracteres.';
            nameInput.style.borderColor = '#ef4444';
            return false;
        }
        nameError.textContent = '';
        nameInput.style.borderColor = '';
        return true;
    }
    
    function validatePhone() {
        const value = phoneInput.value.trim();
        const phoneRegex = /^[0-9\s\-\(\)]{10,15}$/;
        
        if (!value) {
            phoneError.textContent = 'Tu teléfono es obligatorio.';
            phoneInput.style.borderColor = '#ef4444';
            return false;
        }
        
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            phoneError.textContent = 'Por favor, introduce un teléfono válido (10 dígitos).';
            phoneInput.style.borderColor = '#ef4444';
            return false;
        }
        
        phoneError.textContent = '';
        phoneInput.style.borderColor = '';
        return true;
    }
    
    function validateMessage() {
        const value = messageInput.value.trim();
        if (!value) {
            messageError.textContent = 'Por favor, describe lo que necesitas.';
            messageInput.style.borderColor = '#ef4444';
            return false;
        }
        if (value.length < 10) {
            messageError.textContent = 'Describe mejor lo que necesitas (mínimo 10 caracteres).';
            messageInput.style.borderColor = '#ef4444';
            return false;
        }
        messageError.textContent = '';
        messageInput.style.borderColor = '';
        return true;
    }
    
    function validateProfesion() {
        const value = profesionSelect.value;
        if (!value) {
            // No hay elemento de error para select, mostramos en status
            return false;
        }
        return true;
    }
    
    function setFormSubmitting(isSubmitting) {
        AppState.isFormSubmitting = isSubmitting;
        submitBtn.disabled = isSubmitting;
        
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (btnText) btnText.style.display = isSubmitting ? 'none' : 'inline';
        if (btnLoading) btnLoading.style.display = isSubmitting ? 'inline-flex' : 'none';
    }
    
    function showStatus(message, type) {
        if (!statusElement) return;
        
        statusElement.textContent = message;
        statusElement.className = 'status-text';
        
        if (type === 'success') {
            statusElement.classList.add('success');
        } else if (type === 'error') {
            statusElement.classList.add('error');
        }
        
        // Auto-ocultar mensaje de éxito después de 8 segundos
        if (type === 'success') {
            setTimeout(() => {
                statusElement.textContent = '';
                statusElement.className = 'status-text';
            }, 8000);
        }
    }
    
    function getProfesionName(value) {
        const profesiones = {
            'medico': 'Médico / Doctor',
            'dentista': 'Dentista / Odontólogo',
            'terapeuta': 'Terapeuta / Psicólogo',
            'arquitecto': 'Arquitecto / Ingeniero',
            'abogado': 'Abogado / Notario',
            'negocio': 'Negocio Local',
            'otro': 'Otra Profesión'
        };
        return profesiones[value] || value;
    }
    
    async function sendToWhatsApp(data) {
        return new Promise((resolve, reject) => {
            try {
                // Formatear el mensaje para WhatsApp
                const message = `*Nueva Solicitud de Página Web*%0A%0A` +
                               `*Nombre:* ${encodeURIComponent(data.name)}%0A` +
                               `*Teléfono:* ${encodeURIComponent(data.phone)}%0A` +
                               `*Profesión/Negocio:* ${encodeURIComponent(getProfesionName(data.profesion))}%0A` +
                               `*Mensaje:*%0A${encodeURIComponent(data.message)}%0A%0A` +
                               `*Fecha:* ${encodeURIComponent(data.date)}%0A` +
                               `*Origen:* ${encodeURIComponent(data.source)}`;

                const phoneNumber = '527228964383';
                const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
                
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
    
    function saveToLocalStorage(data) {
        try {
            const submissions = JSON.parse(localStorage.getItem('webSubmissions') || '[]');
            submissions.push({
                ...data,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('webSubmissions', JSON.stringify(submissions));
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }
}

// Animaciones
function initAnimations() {
    // Observer para elementos animables
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos con animación
    const animatableElements = document.querySelectorAll(
        '.service-card, .project-card, .benefit-item, .pricing-card, .testimonial-card'
    );
    
    animatableElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Animación de estadísticas
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

// Efectos de scroll
function initScrollEffects() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
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
    });
    
    // Efecto parallax en elementos flotantes
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 20;
        const yPos = (clientY / window.innerHeight - 0.5) * 20;
        
        document.querySelectorAll('.floating-card, .floating-element').forEach((el, index) => {
            const speed = 0.5 + (index * 0.1);
            el.style.transform = `translate(${xPos * speed}px, ${yPos * speed}px)`;
        });
    });
}