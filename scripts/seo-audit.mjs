import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = new URL('../', import.meta.url).pathname.replace(/^\/(?:[A-Za-z]:)/, (match) => match.slice(1));
const dist = join(root, 'dist');
const failures = [];

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function capture(html, pattern) {
  return html.match(pattern)?.[1]?.trim() ?? '';
}

function fail(page, message) {
  failures.push(`${page}: ${message}`);
}

const pages = walk(dist).filter((file) => file.endsWith(`${sep}index.html`));
const titles = new Map();
const descriptions = new Map();
const canonicals = new Set();

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const page = `/${relative(dist, file).split(sep).join('/').replace(/index\.html$/, '')}`;
  const title = capture(html, /<title>(.*?)<\/title>/is);
  const description = capture(html, /<meta name="description" content="([^"]+)"/i);
  const canonical = capture(html, /<link rel="canonical" href="([^"]+)"/i);
  const robots = capture(html, /<meta name="robots" content="([^"]+)"/i);
  const lang = capture(html, /<html lang="([^"]+)"/i);
  const h1Count = (html.match(/<h1(?:\s|>)/gi) ?? []).length;
  const schemaText = capture(html, /<script type="application\/ld\+json">(.*?)<\/script>/is);

  if (!title) fail(page, 'falta <title>');
  if (!description) fail(page, 'falta meta description');
  if (!canonical.startsWith('https://klassia.lat/')) fail(page, `canonical inválido: ${canonical || 'vacío'}`);
  if (!robots.includes('index,follow')) fail(page, `robots no indexable: ${robots || 'vacío'}`);
  if (lang !== 'es-PE') fail(page, `idioma inesperado: ${lang || 'vacío'}`);
  if (h1Count !== 1) fail(page, `se esperaban 1 H1 y hay ${h1Count}`);

  if (titles.has(title)) fail(page, `título duplicado con ${titles.get(title)}`);
  if (descriptions.has(description)) fail(page, `descripción duplicada con ${descriptions.get(description)}`);
  if (canonicals.has(canonical)) fail(page, `canonical duplicado: ${canonical}`);
  titles.set(title, page);
  descriptions.set(description, page);
  canonicals.add(canonical);

  try {
    const schema = JSON.parse(schemaText);
    const types = schema['@graph'].flatMap((node) => node['@type']);
    if (!types.includes('WebPage') && !types.includes('AboutPage')) fail(page, 'falta WebPage en JSON-LD');
    if (page === '/' && (!types.includes('Organization') || !types.includes('WebSite') || !types.includes('SoftwareApplication'))) {
      fail(page, 'faltan entidades principales en JSON-LD');
    }
    if (page !== '/' && !types.includes('BreadcrumbList')) fail(page, 'falta BreadcrumbList en JSON-LD');
  } catch {
    fail(page, 'JSON-LD ausente o inválido');
  }

  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)) {
    const href = match[1];
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const pathname = href.split(/[?#]/, 1)[0];
    if (!pathname) continue;
    const target = pathname.endsWith('/')
      ? join(dist, pathname.slice(1), 'index.html')
      : join(dist, pathname.slice(1));
    if (!existsSync(target)) fail(page, `enlace interno roto: ${href}`);
  }
}

const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
if (!robots.includes('https://klassia.lat/sitemap-index.xml')) fail('/robots.txt', 'no referencia el sitemap index');

const sitemap = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
if (sitemapUrls.length !== pages.length) fail('/sitemap-0.xml', `incluye ${sitemapUrls.length} URLs y existen ${pages.length} páginas`);
for (const canonical of canonicals) {
  if (!sitemapUrls.includes(canonical)) fail('/sitemap-0.xml', `falta ${canonical}`);
}

if (failures.length) {
  console.error(`SEO audit failed with ${failures.length} issue(s):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`SEO audit passed: ${pages.length} páginas indexables, únicas y enlazadas correctamente.`);
