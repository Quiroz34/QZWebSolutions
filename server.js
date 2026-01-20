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

// Archivos públicos (robots.txt, sitemap.xml, manifest.json)
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

// Chat con IA (Endpoint)
// Almacén de sesiones en memoria (se borra al reiniciar servidor)
const chatSessions = new Map();

// Instrucción del Sistema (Cerebro del Bot)
const SYSTEM_INSTRUCTION = `
Eres el Asistente Virtual Experto de QZ Web Solutions. Tu objetivo es asesorar a clientes potenciales y guiarlos para que agenden una cotización o contacto.

**TU IDENTIDAD:**
- Nombre: Asistente QZ.
- Tono: Profesional, amable, sofisticado ("Clean Luxury"), conciso y persuasivo.
- Idioma: Español (neutro/latinoamericano).

**SOBRE QZ WEB SOLUTIONS:**
- Ubicación: Toluca, Estado de México. Atendemos Metepec, Zinacantepec, Lerma, CDMX y todo México.
- Especialidad: Diseño Web Profesional, Tiendas en Línea (E-commerce), Landing Pages, SEO y Mantenimiento Web.
- Estilo de Diseño: "Clean Luxury" (Minimalismo lujoso, moderno, alta velocidad).
- Diferenciadores: Soporte técnico 24/7, optimización para móviles, enfoque en ventas (conversión).

**SERVICIOS Y PRECIOS (Estimados):**
- Landing Page (Básica): Ideal para campañas o perfiles profesionales.
- Sitio Web Corporativo: Para empresas que buscan presencia sólida.
- Tienda en Línea: Para vender productos 24/7 con pagos seguros.
- *NOTA IMPORTANTÍSIMA*: No des precios fijos exactos. Di que "ofrecemos paquetes a la medida" y sugiere cotizar. Puedes dar rangos si el usuario insiste mucho (ej. "Desde inversiones accesibles para emprendedores hasta soluciones corporativas robustas").

**REGLAS DE INTERACCIÓN:**
1. **Memoria**: Recuerda el nombre del usuario si te lo dice.
2. **Objetivo**: Trata siempre de llevar la conversación a que el usuario presione el botón de "WhatsApp" o llene el formulario.
3. **Respuestas**: Sé breve. No escribas párrafos gigantes. Usa listas si es necesario.
4. **Si no sabes algo**: No inventes. Di "Esa es una excelente pregunta técnica. Te recomiendo contactar directamente a nuestro equipo humano por WhatsApp para una respuesta precisa".

**EJEMPLOS DE RESPUESTA:**
- Usuario: "Hola" -> "¡Hola! Bienvenido a QZ Web Solutions. ¿En qué puedo ayudarte a digitalizar tu negocio hoy?"
- Usuario: "¿Hacen tiendas online?" -> "¡Claro que sí! Desarrollamos tiendas en línea seguras y rápidas, listas para vender 24/7. ¿Qué tipo de productos deseas vender?"
- Usuario: "¿Precio?" -> "Nuestros precios se adaptan a tus necesidades específicas para no cobrarte de más. ¿Te gustaría una cotización rápida personalizada por WhatsApp?"
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
  res.status(404).send('<h1>404 - Página no encontrada</h1><p><a href="/">Volver al inicio</a></p>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
