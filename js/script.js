// script.js - manejo de interacciones y envío de formulario

document.addEventListener('DOMContentLoaded', function() {
    // Helpers
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));
    
    // Estado de la aplicación
    const appState = {
        isMenuOpen: false,
        isFormSubmitting: false
    };
    
    // Navegación móvil
    const navToggle = $('#navToggle');
    const siteNav = $('#siteNav');
    
    if (navToggle && siteNav) {
        // Función para alternar menú
        const toggleMenu = () => {
            appState.isMenuOpen = !appState.isMenuOpen;
            navToggle.setAttribute('aria-expanded', String(appState.isMenuOpen));
            siteNav.classList.toggle('active', appState.isMenuOpen);
            
            // Prevenir scroll del body cuando el menú está abierto
            document.body.style.overflow = appState.isMenuOpen ? 'hidden' : '';
        };
        
        // Event listeners
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
        
        // Cerrar menú al hacer clic en un enlace
        $$('#siteNav a').forEach(link => {
            link.addEventListener('click', () => {
                if (appState.isMenuOpen) {
                    toggleMenu();
                }
            });
        });
        
        // Cerrar menú al hacer clic fuera en mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && appState.isMenuOpen) {
                if (!siteNav.contains(e.target) && !navToggle.contains(e.target)) {
                    toggleMenu();
                }
            }
        });
        
        // Cerrar menú al cambiar el tamaño de la ventana
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && appState.isMenuOpen) {
                toggleMenu();
            }
        });
        
        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && appState.isMenuOpen) {
                toggleMenu();
            }
        });
    }
    
    // Scroll al contacto desde el botón del hero
    const btnContact = $('#btnContact');
    if (btnContact) {
        btnContact.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSection('contacto');
        });
    }
    
    // Navegación suave con offset para header fijo
    $$('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Solo procesar enlaces internos
            if (href !== '#') {
                e.preventDefault();
                const targetId = href.slice(1);
                scrollToSection(targetId);
            }
        });
    });
    
    // Función para scroll suave a sección
    function scrollToSection(sectionId) {
        const targetEl = document.getElementById(sectionId);
        if (targetEl) {
            const headerOffset = 80;
            const elementPosition = targetEl.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    }
    
    // Formulario de contacto
    const form = $('#contactForm');
    const status = $('#status');
    const submitBtn = $('#submitBtn');
    const btnText = $('.btn-text');
    const btnLoading = $('.btn-loading');
    
    if (form) {
        // Elementos del formulario
        const nameInput = $('#name');
        const emailInput = $('#email');
        const serviceSelect = $('#service');
        const messageInput = $('#message');
        
        // Elementos de error
        const nameError = $('#nameError');
        const emailError = $('#emailError');
        const messageError = $('#messageError');
        
        // Validación en tiempo real
        nameInput.addEventListener('input', () => validateField(nameInput, nameError, 'nombre'));
        emailInput.addEventListener('input', () => validateEmailField(emailInput, emailError));
        messageInput.addEventListener('input', () => validateField(messageInput, messageError, 'mensaje'));
        
        // Envío del formulario
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (appState.isFormSubmitting) return;
            
            // Validar todos los campos
            const isNameValid = validateField(nameInput, nameError, 'nombre');
            const isEmailValid = validateEmailField(emailInput, emailError);
            const isMessageValid = validateField(messageInput, messageError, 'mensaje');
            
            if (!isNameValid || !isEmailValid || !isMessageValid) {
                showStatus('Por favor, corrige los errores en el formulario.', 'error');
                return;
            }
            
            // Datos del formulario
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                service: serviceSelect.value,
                message: messageInput.value.trim(),
                timestamp: new Date().toISOString()
            };
            
            // Cambiar estado del formulario
            setFormState(true);
            
            try {
                // Enviar a WhatsApp
                await submitToWhatsApp(formData);
                
                // Éxito
                showStatus(`¡Gracias ${formData.name}! Tu mensaje ha sido enviado correctamente. Te contactaremos en un plazo de 24 horas.`, 'success');
                form.reset();
                
            } catch (error) {
                // Error
                console.error('Error al enviar el formulario:', error);
                showStatus('No se pudo enviar el mensaje. Por favor, intenta nuevamente o contáctanos directamente a info@qzwebsolutions.com', 'error');
            } finally {
                // Restaurar estado del formulario
                setFormState(false);
            }
        });
        
        // Función para validar campo genérico
        function validateField(field, errorElement, fieldName) {
            const value = field.value.trim();
            
            if (!value) {
                errorElement.textContent = `El ${fieldName} es obligatorio.`;
                field.style.borderColor = '#ef4444';
                return false;
            }
            
            if (fieldName === 'nombre' && value.length < 2) {
                errorElement.textContent = 'El nombre debe tener al menos 2 caracteres.';
                field.style.borderColor = '#ef4444';
                return false;
            }
            
            if (fieldName === 'mensaje' && value.length < 10) {
                errorElement.textContent = 'El mensaje debe tener al menos 10 caracteres.';
                field.style.borderColor = '#ef4444';
                return false;
            }
            
            errorElement.textContent = '';
            field.style.borderColor = '';
            return true;
        }
        
        // Función para validar email
        function validateEmailField(field, errorElement) {
            const value = field.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!value) {
                errorElement.textContent = 'El email es obligatorio.';
                field.style.borderColor = '#ef4444';
                return false;
            }
            
            if (!emailRegex.test(value)) {
                errorElement.textContent = 'Por favor, introduce un email válido.';
                field.style.borderColor = '#ef4444';
                return false;
            }
            
            errorElement.textContent = '';
            field.style.borderColor = '';
            return true;
        }
        
        // Función para mostrar estado del envío
        function showStatus(message, type) {
            status.textContent = message;
            status.className = 'status-text';
            
            if (type === 'success') {
                status.classList.add('success');
            } else if (type === 'error') {
                status.classList.add('error');
            }
            
            // Auto-ocultar mensaje de éxito después de 5 segundos
            if (type === 'success') {
                setTimeout(() => {
                    status.textContent = '';
                    status.className = 'status-text';
                }, 5000);
            }
        }
        
        // Función para cambiar estado del formulario
        function setFormState(isSubmitting) {
            appState.isFormSubmitting = isSubmitting;
            
            if (isSubmitting) {
                submitBtn.disabled = true;
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline-flex';
            } else {
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        }
        
        // Función auxiliar para obtener el nombre del servicio
        function getServiceName(serviceValue) {
            const services = {
                'web': 'Desarrollo Web',
                'ecommerce': 'Tienda Online',
                'system': 'Sistema Empresarial',
                'other': 'Otro'
            };
            return services[serviceValue] || serviceValue;
        }
        
        // Función para enviar datos del formulario a WhatsApp
        function submitToWhatsApp(data) {
            return new Promise((resolve, reject) => {
                try {
                    // Formatear el mensaje para WhatsApp
                    const message = `*Nuevo contacto desde QZ Web Solutions*%0A%0A` +
                                   `*Nombre:* ${encodeURIComponent(data.name)}%0A` +
                                   `*Email:* ${encodeURIComponent(data.email)}%0A` +
                                   `*Servicio de interés:* ${encodeURIComponent(getServiceName(data.service))}%0A` +
                                   `*Mensaje:*%0A${encodeURIComponent(data.message)}%0A%0A` +
                                   `*Fecha:* ${encodeURIComponent(new Date().toLocaleString('es-MX'))}`;

                    // Tu número de WhatsApp (reemplaza con tu número)
                    const phoneNumber = '527228964383'; // Código de país + número sin espacios ni símbolos

                    // Crear el enlace de WhatsApp
                    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
                    
                    // Abrir WhatsApp en una nueva pestaña/vista
                    const newWindow = window.open(whatsappURL, '_blank', 'width=600,height=700,noopener,noreferrer');
                    
                    // Guardar en localStorage como respaldo
                    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
                    submissions.push(data);
                    localStorage.setItem('formSubmissions', JSON.stringify(submissions));
                    
                    // Cerrar la ventana después de 3 segundos (opcional)
                    setTimeout(() => {
                        if (newWindow && !newWindow.closed) {
                            newWindow.close();
                        }
                    }, 3000);
                    
                    resolve({ success: true, message: 'Mensaje enviado correctamente' });
                    
                } catch (error) {
                    console.error('Error al enviar a WhatsApp:', error);
                    reject(new Error('Error al enviar el mensaje'));
                }
            });
        }
    }
    
    // Animación de elementos al hacer scroll
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
    
    // Observar elementos animables
    const animatableElements = [
        ...$$('.service-card'),
        ...$$('.project-card'),
        ...$$('.benefit-item'),
        ...$$('.floating-card'),
        ...$$('.floating-element')
    ];
    
    animatableElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Efecto de header al hacer scroll
    let lastScrollY = window.scrollY;
    const header = $('header');
    
    window.addEventListener('scroll', () => {
        // Cambiar fondo del header al hacer scroll
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Ocultar/mostrar header al hacer scroll (solo en desktop)
        if (window.innerWidth > 768) {
            if (window.scrollY > lastScrollY && window.scrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = window.scrollY;
    });
    
    // Efecto de parallax en elementos flotantes
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 20;
        const yPos = (clientY / window.innerHeight - 0.5) * 20;
        
        $$('.floating-card, .floating-element').forEach((el, index) => {
            const speed = 0.5 + (index * 0.1);
            el.style.transform = `translate(${xPos * speed}px, ${yPos * speed}px)`;
        });
    });
    
    // Inicialización de estadísticas animadas
    const stats = $$('.stat-number');
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
        
        function animateCounter(element) {
            const target = parseInt(element.textContent);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : '+');
                }
            }, 16);
        }
    }
    
    // Mejora de accesibilidad: manejo de foco en modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && appState.isMenuOpen) {
            const focusableElements = $$('#siteNav a, #siteNav button');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
    
    // Mejora de rendimiento: carga diferida de imágenes
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        $$('img[data-src]').forEach(img => imageObserver.observe(img));
    }
    
    // Console log de bienvenida
    console.log(
        `%cQZ Web Solutions%c\nDesarrollo web profesional\nhttps://qzwebsolutions.com`,
        'color: #6366f1; font-size: 18px; font-weight: bold;',
        'color: #94a3b8; font-size: 14px;'
    );
});