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
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Mensaje requerido" });
    }

    console.log("Generando respuesta para:", message.substring(0, 50) + "...");

    // Configurar un timeout para la solicitud de la IA
    const result = await model.generateContent([
      "Eres el asistente de QZ Web Solutions. Responde de forma profesional y concisa. " + message
    ]);

    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error("Error en chat IA:", error);

    // Manejo específico de errores comunes de la API
    if (error.status === 429 || error.message.includes("429") || error.message.includes("Too Many Requests")) {
      return res.status(429).json({
        error: "La IA está un poco ocupada en este momento debido al alto tráfico. Por favor, intenta de nuevo en unos segundos.",
        details: "Rate limit reached"
      });
    }

    if (error.status === 404 || error.message.includes("404")) {
      return res.status(404).json({
        error: "Modelo de IA no encontrado. Por favor, contacta a soporte.",
        details: error.message
      });
    }

    res.status(500).json({
      error: "Error interno al procesar el mensaje. Inténtalo más tarde.",
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
