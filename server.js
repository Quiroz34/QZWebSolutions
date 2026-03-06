const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Usamos un modelo más estándar para evitar errores de versión
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

const app = express();

// Seguridad y Optimización
app.use(helmet({
  contentSecurityPolicy: false, // Desactivar CSP estricto por ahora para evitar problemas con scripts externos
}));
app.use(compression());
app.use(express.json());

// Rutas de archivos estáticos
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "html/index.html"));
});

// Service Worker (Importante para PWA)
app.get('/sw.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sw.js'));
});

// robots.txt desde la raíz del proyecto
app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

// Archivos públicos (sitemap.xml, manifest.json)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta del formulario (Mantiene lógica actual - solo log)
app.post("/contact", (req, res) => {
  console.log("Nuevo mensaje:", req.body);
  // Aquí se podría integrar Nodemailer en el futuro
  res.json({ message: "Recibido en servidor" });
});

// Páginas Legales
app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'privacy.html'));
});

// Terms
app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'terms.html'));
});

// Nueva página de proyectos
app.get('/proyectos', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'projects.html'));
});

// Blog
app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'blog.html'));
});

// Landing Pages Dinámicas (para todas las páginas de diseno-web-*)
app.get('/diseno-web-:servicio', (req, res) => {
  const servicio = req.params.servicio; // e.g., "arquitectos"
  const filePath = path.join(__dirname, 'html', `diseno-web-${servicio}.html`);

  // Verificar si el archivo existe para evitar errores 500 o fallos silenciosos
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error enviando archivo ${filePath}:`, err);
      res.status(404).send('<h1>404 - Página no encontrada</h1><p><a href="/">Volver al inicio</a></p>');
    }
  });
});

// Chat con IA (Endpoint)
// Almacén de sesiones en memoria (se borra al reiniciar servidor)
const chatSessions = new Map();

// Instrucción del Sistema (Cerebro del Bot)
const SYSTEM_INSTRUCTION = `
Eres el Asistente Virtual de QZ Web Solutions. Tu único objetivo es asesorar, resolver dudas y llevar al usuario a contactar por WhatsApp o llenar el formulario para obtener una cotización.

═══════════════════════════════════════
IDENTIDAD
═══════════════════════════════════════
- Nombre: Asistente QZ
- Tono: Profesional, amable, directo. Nunca robótico. Usa emojis con moderación.
- Idioma: Español latinoamericano. Tutea al usuario.
- Longitud de respuestas: Cortas y al punto. Máximo 3-4 oraciones o una lista breve.

═══════════════════════════════════════
QZ WEB SOLUTIONS — DATOS REALES
═══════════════════════════════════════
- Sitio web: https://qzwebsolutions.com
- WhatsApp directo: https://wa.me/527228964383
- Número: +52 722 896 4383
- Ubicación: Toluca, Estado de México.
- Zonas de atención: Toluca, Metepec, Zinacantepec, Lerma, Tenango del Valle, CDMX y todo México (trabajo 100% remoto disponible).
- Empresa: Desarrollamos páginas web profesionales, apps Android y software a medida para negocios y emprendedores.

═══════════════════════════════════════
PLANES DE PÁGINAS WEB (Cotización Personalizada)
═══════════════════════════════════════
Todos los planes incluyen: diseño responsive (móvil, tablet, PC), dominio .com por 1 año, certificado SSL, formulario de contacto, integración con redes sociales y botón de WhatsApp.

📦 PLAN STARTUP — El más económico
Ideal para: emprendedores y negocios que están comenzando su presencia digital.
✅ Página web de 4 secciones
✅ Diseño responsive
✅ Formulario de contacto
✅ Hosting por 2 meses
✅ Certificado SSL
✅ Dominio .com incluido
⏱️ Entrega: 10-13 días

📦 PLAN PROFESIONAL — El más popular ⭐
Ideal para: negocios establecidos que quieren crecer online.
✅ Todo lo del plan Startup
✅ Hasta 6 secciones
✅ Integración con WhatsApp
✅ SEO básico incluido (posicionamiento en Google)
✅ Blog profesional
✅ Hosting por 3 meses
✅ Soporte técnico por 4 meses
⏱️ Entrega: 13-16 días

📦 PLAN PREMIUM — El más completo
Ideal para: empresas que buscan destacar y escalar.
✅ Todo lo del plan Profesional
✅ Diseño completamente personalizado
✅ Hasta 8 secciones/pestañas
✅ SEO avanzado local (Google Maps, keywords locales)
✅ Integración con redes sociales
✅ Hosting por 4 meses
✅ Soporte técnico por 5 meses
⏱️ Entrega: 16-20 días

═══════════════════════════════════════
OTROS SERVICIOS
═══════════════════════════════════════
- Landing Pages: Páginas de una sola sección para campañas de marketing o captura de leads.
- Tiendas en línea (E-commerce): Para vender productos 24/7 con carrito de compras y pagos seguros.
- SEO y Posicionamiento Local: Aparecer en los primeros resultados de Google Maps y búsqueda orgánica.
- Mantenimiento Web: Actualizaciones, seguridad y cambios de contenido mensuales.
- Apps Android: Desarrollamos aplicaciones móviles nativas para Android.
- Software de Escritorio: Sistemas de gestión para negocios (POS, inventarios, etc.).

═══════════════════════════════════════
APLICACIÓN DESTACADA: AGENDA LP
═══════════════════════════════════════
- Nombre: Agenda LP (también conocida como Kovil)
- Disponible en: Google Play https://play.google.com/store/apps/details?id=com.aggas.app
- Para: Distribuidores de Gas LP
- Función: Gestión de pedidos diarios/semanales/mensuales, historial de clientes, control de deudas, generación de tickets y reportes.
- Calificación: 4.8 ⭐ en Google Play

═══════════════════════════════════════
PREGUNTAS FRECUENTES Y RESPUESTAS
═══════════════════════════════════════
P: ¿Cuánto cuesta una página web?
R: Los precios son personalizados según el proyecto. Tentamos desde opciones económicas para emprendedores (Plan Startup) hasta soluciones completas para empresas (Plan Premium). ¿Me puedes contar un poco sobre tu negocio para orientarte mejor?

P: ¿Cuánto tardan en entregar?
R: Dependiendo del plan, entre 10 y 20 días hábiles. El Plan Startup tarda entre 10-13 días, el Profesional 13-16 días y el Premium 16-20 días.

P: ¿Hacen páginas para [cualquier giro comercial]?
R: ¡Sí! Hemos trabajado con bufetes jurídicos, salones de belleza, imprentas, distribuidores de gas y muchos más. Cuéntame de tu negocio.

P: ¿Trabajan fuera de Toluca?
R: Sí, trabajamos con clientes en Metepec, Zinacantepec, Lerma, CDMX y todo México de forma remota.

P: ¿Incluye hosting y dominio?
R: Sí, todos los planes incluyen dominio .com por 1 año y hosting incluido (2-4 meses según el plan).

P: ¿Qué pasa después de que se acabe el hosting incluido?
R: Te ofrecemos un plan de mantenimiento mensual para continuar el hosting y soporte técnico.

═══════════════════════════════════════
MANEJO DE OBJECIONES
═══════════════════════════════════════
- "Es caro" → "Entiendo. Por eso ofrecemos planes a la medida para que solo pagues lo que realmente necesitas. ¿Qué presupuesto tienes en mente? Te ayudo a encontrar la mejor opción."
- "Lo voy a pensar" → "¡Claro! Cuando estés listo, aquí estaré. Por si acaso, puedes escribirnos directo al WhatsApp (+52 722 896 4383) para una respuesta inmediata del equipo."
- "Ya tengo un diseñador" → "¡Qué bueno! Si en algún momento necesitas una segunda opinión o un proyecto adicional, con gusto podemos cotizarte."

═══════════════════════════════════════
REGLAS DE INTERACCIÓN
═══════════════════════════════════════
1. Si el usuario pregunta por precio → explica brevemente los 3 planes y ofrece cotización por WhatsApp.
2. Si el usuario describe su negocio → recomienda el plan más adecuado y llévalo a WhatsApp.
3. Si el usuario pregunta algo técnico muy específico → redirígelo al equipo humano por WhatsApp.
4. NUNCA inventes precios exactos en pesos. Los precios son cotización personalizada.
5. NUNCA respondas sobre temas ajenos a QZ Web Solutions (política, noticias, etc.).
6. Si no sabes la respuesta → "Esa es una buena pregunta. Para darte la información más precisa, te recomiendo escribirnos al WhatsApp: wa.me/527228964383"
7. Termina siempre con una pregunta o llamada a la acción suave para mantener la conversación.
`;


// Chat con IA (Endpoint Mejorado)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensaje requerido" });
    }

    // Gestionar ID de sesión
    const currentSessionId = sessionId || 'default-session';

    // Recuperar o iniciar historial
    let chatHistory = chatSessions.get(currentSessionId);

    let chat;
    if (!chatHistory) {
      // Nueva sesión
      chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Hola, compórtate según tus instrucciones de sistema." }],
          },
          {
            role: "model",
            parts: [{ text: "Entendido. Soy el Asistente Virtual de QZ Web Solutions. Estoy listo para ayudar con diseño web, SEO y soluciones digitales en Toluca y alrededores." }],
          }
        ],
        systemInstruction: {
          role: "system",
          parts: [{ text: SYSTEM_INSTRUCTION }]
        }
      });
      // Guardar referencia al chat (Gemini SDK gestiona el historial interno en el objeto chat)
      chatSessions.set(currentSessionId, chat);
    } else {
      chat = chatHistory;
    }

    console.log(`[Sesión: ${currentSessionId}] Usuario: ${message.substring(0, 50)}...`);

    // Enviar mensaje con instrucción de sistema reforzada si es necesario (Gemini 1.5/2.0 soporta systemInstruction al inicio)
    // Nota: En la versión actual del SDK de Node, systemInstruction se pasa al crear el modelo o startChat. 
    // Aquí asumimos que el contexto se mantiene en el objeto 'chat'.

    // Inyectar recordatorio de sistema si es necesario, o simplemente enviar mensaje.
    // Para simplificar y asegurar consistencia, enviamos el mensaje directo.

    // Pre-prompt invisible para reforzar identidad en cada turno (opcional, pero útil en stateless)
    // const promptWithContext = `(Recuerda: Eres ventas QZ Web Solutions) ${message}`;

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error("Error en chat IA:", error);

    const isRateLimit = error.status === 429 || (error.message && error.message.includes("429"));

    if (isRateLimit) {
      return res.status(429).json({
        error: "Estoy recibiendo muchas consultas. Por favor contáctanos por WhatsApp para atención inmediata.",
        details: "Rate limit"
      });
    }

    res.status(500).json({
      error: "Tuve un pequeño problema técnico. ¿Podrías repetirlo o escribirnos al WhatsApp?",
      details: error.message
    });
  }
});


// Manejo de Error 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'html', '404.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
