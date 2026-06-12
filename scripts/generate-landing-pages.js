const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const HTML_DIR = path.join(ROOT, 'html');
const SITE_URL = 'https://qzwebsolutions.com';
const PHONE = '527228964383';

const cityPages = [
  ['mexico', 'México', 'todo el país'],
  ['toluca', 'Toluca', 'Estado de México'],
  ['cancun', 'Cancún', 'Quintana Roo'],
  ['ciudad-de-mexico', 'Ciudad de México', 'CDMX'],
  ['guadalajara', 'Guadalajara', 'Jalisco'],
  ['leon', 'León', 'Guanajuato'],
  ['merida', 'Mérida', 'Yucatán'],
  ['monterrey', 'Monterrey', 'Nuevo León'],
  ['puebla', 'Puebla', 'Puebla'],
  ['queretaro', 'Querétaro', 'Querétaro'],
  ['tijuana', 'Tijuana', 'Baja California']
].map(([slug, city, state]) => ({
  slug,
  type: 'city',
  icon: 'fa-location-dot',
  title: `Diseño Web en ${city} | Páginas Web Profesionales | QZ Web Solutions`,
  description: `Diseño de páginas web profesionales para negocios en ${city}. Sitios rápidos, responsive, SEO local, WhatsApp y estrategia para generar más clientes.`,
  eyebrow: `Diseño web en ${city}`,
  h1: `Páginas web profesionales para negocios en ${city}`,
  lead: `Creamos sitios web modernos, rápidos y preparados para convertir visitas en clientes reales en ${city} y ${state}.`,
  audience: `negocios en ${city}`,
  local: `${city}, ${state}`,
  whatsapp: `Hola, tengo un negocio en ${city} y quiero cotizar mi página web`,
  features: [
    ['fa-magnifying-glass-location', 'SEO local', `Estructura optimizada para búsquedas de clientes en ${city} y zonas cercanas.`],
    ['fa-mobile-screen-button', 'Diseño responsive', 'Experiencia cuidada para celular, tablet y escritorio desde el primer día.'],
    ['fa-message', 'Contacto directo', 'Botones de WhatsApp, formularios y llamadas visibles para reducir fricción.']
  ],
  deliverables: [
    'Arquitectura de contenido enfocada en conversión',
    'Secciones para servicios, beneficios, confianza y contacto',
    'Carga rápida, SSL, dominio y preparación SEO básica',
    'Integración con WhatsApp y redes sociales',
    'Soporte técnico durante el lanzamiento'
  ]
}));

const industryPages = [
  ['abogados', 'Abogados', 'bufetes y despachos jurídicos', 'fa-scale-balanced', 'autoridad, confianza y consultas calificadas', ['Áreas de práctica', 'Perfiles de abogados', 'Formulario para consulta inicial']],
  ['arquitectos', 'Arquitectos', 'estudios de arquitectura', 'fa-drafting-compass', 'portafolio visual y solicitudes de proyecto', ['Portafolio de obras', 'Servicios residenciales/comerciales', 'Galería de renders y planos']],
  ['contadores', 'Contadores', 'despachos contables', 'fa-calculator', 'clientes empresariales y claridad fiscal', ['Servicios contables', 'Declaraciones y asesoría', 'Captura de prospectos']],
  ['dentistas', 'Dentistas', 'clínicas dentales', 'fa-tooth', 'citas constantes y confianza clínica', ['Agenda de citas', 'Tratamientos dentales', 'Testimonios y casos']],
  ['escuelas', 'Escuelas', 'colegios e instituciones educativas', 'fa-school', 'inscripciones y comunicación con familias', ['Oferta académica', 'Inscripciones', 'Calendario y avisos']],
  ['fotografos', 'Fotógrafos', 'fotógrafos profesionales', 'fa-camera-retro', 'portafolio elegante y reservas', ['Galerías por sesión', 'Paquetes', 'Reservas por WhatsApp']],
  ['gimnasios', 'Gimnasios', 'centros fitness', 'fa-dumbbell', 'membresías, clases y visitas', ['Planes y horarios', 'Entrenadores', 'Promociones']],
  ['imprentas', 'Imprentas', 'imprentas y talleres gráficos', 'fa-print', 'cotizaciones rápidas y catálogo', ['Catálogo de productos', 'Cotizador inicial', 'Muestras de trabajos']],
  ['inmobiliarias', 'Inmobiliarias', 'asesores e inmobiliarias', 'fa-house-chimney-window', 'leads para venta y renta', ['Catálogo de propiedades', 'Filtros por zona', 'Captura de compradores']],
  ['medicos', 'Médicos', 'consultorios médicos', 'fa-user-doctor', 'citas y presencia profesional', ['Especialidades', 'Agenda de consulta', 'Información para pacientes']],
  ['panaderias', 'Panaderías', 'panaderías y reposterías', 'fa-bread-slice', 'pedidos, menú y clientes locales', ['Catálogo de productos', 'Pedidos por WhatsApp', 'Promociones de temporada']],
  ['podologos', 'Podólogos', 'consultorios podológicos', 'fa-shoe-prints', 'citas, confianza y servicios claros', ['Servicios podológicos', 'Agenda de citas', 'Indicaciones para pacientes']],
  ['psicologos', 'Psicólogos', 'consultorios psicológicos', 'fa-brain', 'confianza, privacidad y citas', ['Enfoques terapéuticos', 'Citas online', 'Preguntas frecuentes']],
  ['restaurantes', 'Restaurantes', 'restaurantes y cafeterías', 'fa-utensils', 'reservas, menú y pedidos', ['Menú digital', 'Reservaciones', 'Pedidos por WhatsApp']],
  ['salones-belleza', 'Salones de Belleza', 'salones de belleza y estética', 'fa-scissors', 'agenda llena y paquetes visibles', ['Servicios y precios', 'Agenda de citas', 'Galería de resultados']],
  ['spas', 'Spas', 'spas y centros de relajación', 'fa-spa', 'reservas, paquetes y venta de productos', ['Reservas online', 'Paquetes de tratamientos', 'Tienda de productos']],
  ['talleres-mecanicos', 'Talleres Mecánicos', 'talleres mecánicos', 'fa-screwdriver-wrench', 'servicios claros y solicitudes rápidas', ['Servicios automotrices', 'Cotización inicial', 'Ubicación y contacto']],
  ['veterinarias', 'Veterinarias', 'veterinarias y clínicas veterinarias', 'fa-paw', 'citas, productos y confianza local', ['Agenda de citas', 'Servicios veterinarios', 'Tienda de productos']]
].map(([slug, label, audience, icon, outcome, deliverables]) => ({
  slug,
  type: 'industry',
  icon,
  title: `Diseño Web para ${label} en México | QZ Web Solutions`,
  description: `Páginas web profesionales para ${audience} en México. Diseño responsive, SEO local, WhatsApp, formularios y estructura pensada para generar más clientes.`,
  eyebrow: `Especialistas en ${label}`,
  h1: `Páginas web para ${label} que generan clientes`,
  lead: `Diseñamos sitios modernos para ${audience}, con contenido claro, confianza visual y rutas directas para pedir informes o agendar.`,
  audience,
  local: 'Todo México',
  whatsapp: `Hola, tengo un negocio de ${label.toLowerCase()} y quiero cotizar mi sitio web`,
  features: [
    ['fa-calendar-check', deliverables[0], `Mostramos tu oferta de forma clara para que el cliente entienda rápido qué haces y cómo contratarte.`],
    ['fa-ranking-star', 'SEO local', 'Estructura preparada para búsquedas por ciudad, zona y giro comercial en México.'],
    ['fa-comments', 'WhatsApp y formularios', 'Canales de contacto visibles para que cada visita tenga una acción simple.']
  ],
  deliverables: [
    ...deliverables,
    'Diseño responsive y optimizado para celulares',
    'SEO básico, velocidad, SSL y analítica',
    'Botones de WhatsApp, llamadas y formulario'
  ],
  outcome
}));

const pages = [...industryPages, ...cityPages].sort((a, b) => a.slug.localeCompare(b.slug));

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function whatsappUrl(text) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
}

function relatedPages(currentSlug) {
  const preferred = ['mexico', 'toluca', 'medicos', 'abogados', 'restaurantes', 'salones-belleza', 'spas', 'veterinarias', 'ciudad-de-mexico', 'guadalajara', 'queretaro', 'monterrey']
    .filter((slug) => slug !== currentSlug);
  return preferred.slice(0, 6).map((slug) => {
    const page = pages.find((item) => item.slug === slug);
    return page ? `<a href="/diseno-web-${page.slug}">${esc(page.eyebrow)}</a>` : '';
  }).join('\n                        ');
}

function schema(page) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.eyebrow,
    description: page.description,
    provider: {
      '@type': 'Organization',
      name: 'QZ Web Solutions',
      url: SITE_URL
    },
    areaServed: page.type === 'city' ? page.local : 'México',
    serviceType: 'Diseño web profesional',
    url: `${SITE_URL}/diseno-web-${page.slug}`
  }, null, 2);
}

function renderFeature([icon, title, text], index) {
  return `<article class="landing-card reveal delay-${index ? index * 100 : 0}">
                    <div class="landing-card-icon"><i class="fas ${icon}"></i></div>
                    <h3>${esc(title)}</h3>
                    <p>${esc(text)}</p>
                </article>`;
}

function renderDeliverable(item) {
  return `<li><i class="fas fa-check"></i><span>${esc(item)}</span></li>`;
}

function renderPage(page) {
  const canonical = `${SITE_URL}/diseno-web-${page.slug}`;
  const isCity = page.type === 'city';
  const primaryCta = whatsappUrl(page.whatsapp);
  const proofTitle = isCity ? `Diseñado para competir en ${page.local}` : `Diseñado para ${page.outcome}`;
  const proofText = isCity
    ? `Tu sitio debe explicar, convencer y facilitar el contacto en segundos. Por eso construimos landings enfocadas en búsqueda local, confianza y conversión.`
    : `Una buena página para ${page.audience} no solo se ve bien: ordena tus servicios, resuelve dudas y convierte el interés en mensajes, llamadas o citas.`;

  return `<!DOCTYPE html>
<html lang="es-MX">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.description)}">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
    <link rel="canonical" href="${canonical}">
    <meta property="og:title" content="${esc(page.title)}">
    <meta property="og:description" content="${esc(page.description)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${SITE_URL}/assets/logofv2.jpg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="theme-color" content="#00D4FF">
    <link rel="icon" href="/assets/logofv2.jpg" type="image/jpeg">
    <link rel="stylesheet" href="/css/styles.css?v=4.2">
    <link rel="stylesheet" href="/css/theme-v3.css?v=1.1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script type="application/ld+json">
${schema(page).split('\n').map((line) => `    ${line}`).join('\n')}
    </script>
</head>

<body class="landing-page">
    <a class="skip-link" href="#main-content">Saltar al contenido principal</a>

    <header id="header">
        <nav class="navbar">
            <a href="/" class="logo" aria-label="QZ Web Solutions">
                <img src="/assets/logofv2.jpg" alt="QZ Web Solutions" class="logo-img-premium">
                <span class="logo-main">QZ</span><span class="blink-cursor">_</span>
            </a>
            <button id="navToggle" class="nav-toggle" aria-expanded="false" aria-controls="siteNav" aria-label="Menú">
                <span class="hamburger"><span></span><span></span><span></span></span>
            </button>
        </nav>
    </header>

    <ul id="siteNav" class="nav-list">
        <li><a href="/">Inicio</a></li>
        <li><a href="/#servicios">Servicios</a></li>
        <li><a href="/diseno-web-mexico">Diseño web México</a></li>
        <li><a href="/proyectos">Proyectos</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/proceso">Proceso</a></li>
        <li><a href="#contacto" class="nav-cta">Cotizar mi web</a></li>
    </ul>

    <main id="main-content">
        <section class="landing-hero">
            <div class="container landing-hero-grid">
                <div class="landing-hero-copy reveal">
                    <span class="hero-badge"><i class="fas ${page.icon}"></i> ${esc(page.eyebrow)}</span>
                    <h1>${esc(page.h1)}</h1>
                    <p class="hero-description">${esc(page.lead)}</p>
                    <div class="landing-hero-actions">
                        <a href="${primaryCta}" class="btn primary" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-whatsapp"></i> Cotizar mi página
                        </a>
                        <a href="#beneficios" class="btn secondary">
                            <i class="fas fa-arrow-down"></i> Ver beneficios
                        </a>
                    </div>
                    <div class="landing-trust-row" aria-label="Beneficios incluidos">
                        <span><i class="fas fa-bolt"></i> Carga rápida</span>
                        <span><i class="fas fa-mobile-screen"></i> Responsive</span>
                        <span><i class="fas fa-magnifying-glass-chart"></i> SEO local</span>
                    </div>
                </div>

                <div class="landing-visual reveal-right">
                    <div class="landing-browser">
                        <div class="landing-browser-bar">
                            <span></span><span></span><span></span>
                        </div>
                        <div class="landing-browser-body">
                            <div class="landing-preview-hero">
                                <img src="/assets/logofv2.jpg" alt="Vista previa QZ Web Solutions">
                                <div>
                                    <strong>${esc(page.eyebrow)}</strong>
                                    <small>${esc(page.local)}</small>
                                </div>
                            </div>
                            <div class="landing-preview-lines">
                                <span></span><span></span><span></span>
                            </div>
                            <div class="landing-preview-cards">
                                <span><i class="fas fa-calendar-check"></i></span>
                                <span><i class="fas fa-chart-line"></i></span>
                                <span><i class="fas fa-message"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="beneficios" class="section landing-section">
            <div class="container">
                <div class="section-header centered reveal">
                    <span class="section-badge"><i class="fas fa-sparkles"></i> Lo que mejora</span>
                    <h2>Una web clara, rápida y lista para vender</h2>
                    <p>Quitamos ruido visual y construimos una experiencia que guía al visitante hacia la acción correcta.</p>
                </div>
                <div class="landing-card-grid">
                    ${page.features.map(renderFeature).join('\n                    ')}
                </div>
            </div>
        </section>

        <section class="section landing-proof">
            <div class="container landing-proof-grid">
                <div class="landing-proof-copy reveal">
                    <span class="section-badge"><i class="fas fa-compass"></i> Enfoque estratégico</span>
                    <h2>${esc(proofTitle)}</h2>
                    <p>${esc(proofText)}</p>
                    <a href="/proceso" class="btn secondary"><i class="fas fa-diagram-project"></i> Ver proceso</a>
                </div>
                <div class="landing-deliverables reveal-right">
                    <h3>Tu página puede incluir</h3>
                    <ul>
                        ${page.deliverables.map(renderDeliverable).join('\n                        ')}
                    </ul>
                </div>
            </div>
        </section>

        <section class="section landing-process">
            <div class="container">
                <div class="section-header centered reveal">
                    <span class="section-badge"><i class="fas fa-list-check"></i> Método de trabajo</span>
                    <h2>De idea a lanzamiento sin complicarte</h2>
                </div>
                <div class="landing-steps">
                    <article><span>01</span><h3>Diagnóstico</h3><p>Entendemos tu negocio, tus servicios y el tipo de cliente que quieres atraer.</p></article>
                    <article><span>02</span><h3>Diseño y contenido</h3><p>Ordenamos secciones, textos y llamados a la acción con una estética profesional.</p></article>
                    <article><span>03</span><h3>Publicación</h3><p>Entregamos un sitio responsive, optimizado y listo para recibir prospectos.</p></article>
                </div>
            </div>
        </section>

        <section id="contacto" class="landing-cta">
            <div class="container landing-cta-inner">
                <div>
                    <span class="section-badge"><i class="fas fa-paper-plane"></i> Cotización rápida</span>
                    <h2>Hagamos que tu sitio se vea como un negocio serio.</h2>
                    <p>Cuéntanos qué vendes, dónde atiendes y qué objetivo tienes. Te orientamos con el plan más adecuado.</p>
                </div>
                <a href="${primaryCta}" class="btn primary" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-whatsapp"></i> Cotizar mi página web
                </a>
            </div>
        </section>
    </main>

    <footer id="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <a href="/" class="logo">
                        <img src="/assets/logofv2.jpg" alt="QZ Web Solutions" class="logo-img-premium">
                        <span class="logo-main">QZ</span><span class="blink-cursor">_</span>
                    </a>
                    <p class="footer-description">Desarrollo web profesional para negocios que quieren verse mejor, cargar rápido y convertir más visitas en clientes.</p>
                </div>
                <div class="footer-links">
                    <h3>Navegación</h3>
                    <ul>
                        <li><a href="/">Inicio</a></li>
                        <li><a href="/proyectos">Proyectos</a></li>
                        <li><a href="/proceso">Proceso</a></li>
                        <li><a href="/blog">Blog</a></li>
                    </ul>
                </div>
                <div class="footer-links">
                    <h3>Relacionadas</h3>
                    <div class="landing-related">
                        ${relatedPages(page.slug)}
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <div class="copyright">&copy; 2026 QZ Web Solutions. Todos los derechos reservados.</div>
                <div class="footer-legal"><a href="/privacy">Privacidad</a><a href="/terms">Términos</a></div>
                <div class="footer-contact"><a href="tel:+527228964383"><i class="fas fa-phone"></i> 722 896 4383</a></div>
            </div>
        </div>
    </footer>

    <a href="${primaryCta}" class="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Cotizar mi página por WhatsApp">
        <i class="fab fa-whatsapp"></i>
    </a>

    <button id="scrollTopBtn" class="scroll-top-btn" aria-label="Volver arriba">
        <i class="fas fa-arrow-up"></i>
    </button>

    <script src="/js/script.js"></script>
</body>

</html>
`;
}

for (const page of pages) {
  fs.writeFileSync(path.join(HTML_DIR, `diseno-web-${page.slug}.html`), renderPage(page), 'utf8');
}

console.log(`Generated ${pages.length} landing pages.`);
