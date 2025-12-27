const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());

// Rutas de archivos estáticos
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "html/index.html"));
});

app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

// Servir robots.txt para indexación
app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

// Servir manifest.json para PWA
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

// Ruta del formulario
app.post("/contact", (req, res) => {
  console.log("Nuevo mensaje:", req.body);
  res.json({ message: "¡Gracias por contactarnos! Te responderemos pronto." });
});

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
