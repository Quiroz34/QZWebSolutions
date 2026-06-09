const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://qzwebsolutions.com';
const ROOT = path.join(__dirname, '..');
const HTML_DIR = path.join(ROOT, 'html');
const BLOG_DIR = path.join(HTML_DIR, 'blog');
const SITEMAP_PATH = path.join(ROOT, 'public', 'sitemap.xml');

const today = new Date().toISOString().slice(0, 10);

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function getHtmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((file) => file.endsWith('.html'))
    .sort();
}

function routeForTopLevelFile(file) {
  const slug = file.replace(/\.html$/, '');
  const routes = {
    index: '/',
    blog: '/blog',
    projects: '/proyectos',
    proceso: '/proceso',
    privacy: '/privacy',
    terms: '/terms'
  };

  if (slug === '404') return null;
  if (routes[slug]) return routes[slug];
  if (slug.startsWith('diseno-web-')) return `/${slug}`;
  return null;
}

function priorityFor(route) {
  if (route === '/') return '1.0';
  if (route === '/blog' || route === '/proceso') return '0.9';
  if (route.startsWith('/blog/') || route.startsWith('/diseno-web-')) return '0.8';
  return '0.6';
}

function changefreqFor(route) {
  if (route === '/' || route === '/blog') return 'weekly';
  return 'monthly';
}

const routes = [];

for (const file of getHtmlFiles(HTML_DIR)) {
  const route = routeForTopLevelFile(file);
  if (route && fileExists(path.join(HTML_DIR, file))) routes.push(route);
}

for (const file of getHtmlFiles(BLOG_DIR)) {
  routes.push(`/blog/${file.replace(/\.html$/, '')}`);
}

const uniqueRoutes = Array.from(new Set(routes)).sort((a, b) => {
  if (a === '/') return -1;
  if (b === '/') return 1;
  return a.localeCompare(b);
});

const urls = uniqueRoutes.map((route) => `    <url>
        <loc>${SITE_URL}${route === '/' ? '/' : route}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${changefreqFor(route)}</changefreq>
        <priority>${priorityFor(route)}</priority>
    </url>`).join('\n\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');
console.log(`Sitemap generated with ${uniqueRoutes.length} URLs at ${SITEMAP_PATH}`);
