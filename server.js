const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
require('dotenv').config();

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

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'terms.html'));
});


// Manejo de Error 404
app.use((req, res) => {
  res.status(404).send('<h1>404 - Página no encontrada</h1><p><a href="/">Volver al inicio</a></p>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
