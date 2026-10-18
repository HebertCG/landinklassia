import assert from 'node:assert/strict';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const baseURL = process.env.UI_AUDIT_URL || 'http://127.0.0.1:4322';
const failures = [];
const results = [];
await mkdir('screenshots', { recursive: true });
const files = await readdir('dist', { recursive: true });
const routes = files.filter((file) => /(^|[/\\])index.html$/.test(file)).map((file) => '/' + file.replaceAll('\\', '/').replace(/index.html$/, ''));
assert.equal(routes.length, 17, 'Build must be complete before the UI audit starts');
const browser = await chromium.launch({ channel: process.env.UI_AUDIT_BROWSER || 'msedge', headless: true });

class LandingPage {
  constructor(page) { this.page = page; }
  async open() {
    await this.page.goto(baseURL);
    await this.page.getByRole('tab', { name: 'Administración' }).waitFor();
  }
  async dismissConsent() { await this.page.getByRole('button', { name: 'Solo necesarias', exact: true }).click(); }
  tab(name) { return this.page.getByRole('tab', { name }); }
  panel(name) { return this.page.getByRole('tabpanel', { name }); }
}

async function check(name, action) {
  try { await action(); results.push(name); console.log(`PASS ${name}`); }
  catch (error) { failures.push(`${name}: ${error.message}`); console.error(`FAIL ${name}: ${error.message}`); }
}

try {
  await Promise.all([1440, 390].map(async (width) => {
    const context = await browser.newContext({ viewport: { width, height: 960 }, reducedMotion: 'reduce' });
    await context.tracing.start({ screenshots: true, snapshots: true });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const landing = new LandingPage(page);
    await check(`Role tabs, keyboard and pagination (${width}px)`, async () => {
      await landing.open();
      await landing.dismissConsent();
      await landing.tab('Docentes').click();
      assert.equal(await landing.panel('Docentes').isVisible(), true);
      assert.equal(await landing.panel('Administración').isVisible(), false);
      await landing.tab('Docentes').press('End');
      assert.equal(await landing.tab('Estudiantes').getAttribute('aria-selected'), 'true');
      await landing.tab('Estudiantes').press('ArrowRight');
      assert.equal(await landing.tab('Administración').getAttribute('aria-selected'), 'true');
      await page.getByRole('button', { name: 'Experiencia anterior' }).click();
      assert.equal(await landing.panel('Estudiantes').isVisible(), true);
      await page.getByRole('button', { name: 'Experiencia siguiente' }).click();
      assert.equal(await landing.panel('Administración').isVisible(), true);
    });
    await check(`Screenshot viewer, Escape and focus restoration (${width}px)`, async () => {
      const zoom = landing.panel('Administración').getByRole('button', { name: /Ampliar captura/ });
      await zoom.click();
      const dialog = page.getByRole('dialog', { name: 'Vista ampliada del sistema' });
      await dialog.waitFor();
      await dialog.getByRole('img').evaluate((img) => img.decode());
      assert.match(await dialog.getByRole('img').getAttribute('src'), /dashboard-admin.webp$/);
      await page.keyboard.press('Escape');
      assert.equal(await dialog.isVisible(), false);
      assert.equal(await zoom.evaluate((button) => button === document.activeElement), true);
      await page.getByRole('button', { name: /Ampliar captura: Vista móvil real/ }).click();
      await dialog.getByRole('img').evaluate((img) => img.decode());
      assert.equal(await dialog.getAttribute('data-portrait'), 'true');
      assert.equal(await dialog.getByRole('img').evaluate((img) => img.getBoundingClientRect().width <= innerWidth), true);
      await dialog.getByRole('button', { name: 'Cerrar captura ampliada' }).click();
    });
    await check(`Navigation and privacy settings (${width}px)`, async () => {
      await page.evaluate(() => window.scrollTo(0, 0));
      if (width < 981) await page.getByRole('button', { name: 'Abrir menú', exact: true }).click();
      const platform = page.getByRole('button', { name: 'Plataforma', exact: true });
      await platform.focus();
      await platform.press('Enter');
      assert.equal(await platform.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await platform.getAttribute('aria-expanded'), 'false');
      if (width < 981) {
        await page.keyboard.press('Escape');
        assert.equal(await page.getByRole('button', { name: 'Abrir menú', exact: true }).getAttribute('aria-expanded'), 'false');
      }
      await page.getByRole('button', { name: 'Preferencias de cookies' }).click();
      await page.getByRole('dialog', { name: 'Configura tus cookies' }).waitFor();
      await page.getByRole('button', { name: 'Cerrar preferencias' }).click();
    });
    await check(`Explore modules with mouse and keyboard (${width}px)`, async () => {
      const modules = page.getByRole('region', { name: 'Módulos de Klassia' });
      const schedule = modules.getByText('Horarios y asistencia', { exact: true });
      await schedule.click();
      const link = modules.getByRole('link', { name: 'Explorar horarios y asistencia' });
      assert.equal(await link.isVisible(), true);
      const summary = modules.locator('summary').filter({ has: page.getByRole('heading', { name: 'Horarios y asistencia', exact: true }) });
      await summary.focus();
      await summary.press('Space');
      assert.equal(await link.isVisible(), false);
      await summary.press('Enter');
      assert.equal(await link.isVisible(), true);
    });
    for (const route of routes) {
      await check(`${route} content, images and layout (${width}px)`, async () => {
        const response = await page.goto(baseURL + route);
        assert.equal(response.status(), 200);
        assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1);
        await page.evaluate(async () => {
          await document.fonts.ready;
          for (const img of document.images) { if (!img.getAttribute('src')) continue; img.loading = 'eager'; await img.decode(); }
        });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, 'Page overflows horizontally');
        assert.equal(await page.getByRole('link', { name: 'Klassia, inicio', exact: true }).count(), 1);
        if (route === '/' || route === '/nosotros/' || route === '/plataforma/gestion-academica/') {
          await page.screenshot({ path: `screenshots/${route === '/' ? 'home' : route.split('/')[1] === 'nosotros' ? 'about' : 'module'}-${width}.png`, fullPage: true });
        }
        if (route === '/') {
          await page.screenshot({ path: `screenshots/cover-${width}.png` });
          await page.locator('[data-product-tour]').screenshot({ path: `screenshots/tour-${width}.png` });
        }
      });
    }
    await check(`Module numbered pagination (${width}px)`, async () => {
      await page.goto(baseURL + '/plataforma/gestion-academica/');
      const pager = page.getByRole('navigation', { name: 'Páginas de módulos' });
      assert.equal(await pager.getByRole('link').count(), 6);
      await pager.getByRole('link', { name: /Módulo 6:/ }).click();
      await page.waitForURL('**/plataforma/reportes/');
      assert.equal(await page.getByRole('link', { name: /Módulo 6:/ }).getAttribute('aria-current'), 'page');
    });
    await check(`No browser errors (${width}px)`, async () => assert.deepEqual(errors, []));
    await check(`Missing page recovery (${width}px)`, async () => {
      const response = await page.goto(baseURL + '/pagina-inexistente/');
      assert.equal(response.status(), 404);
      await page.getByRole('link', { name: 'Volver al inicio', exact: true }).click();
      await page.waitForURL(baseURL + '/');
    });
    await context.tracing.stop({ path: `screenshots/ui-audit-${width}.zip` });
    await context.close();
  }));
  await check('No JavaScript: all three role experiences remain readable', async () => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(baseURL);
    for (const title of ['La academia completa, sin perder el pulso.', 'Menos fricción entre enseñar y evaluar.', 'Todo lo importante, sin tener que buscarlo.']) {
      assert.equal(await page.getByRole('heading', { name: title, exact: true }).isVisible(), true);
    }
    await context.close();
  });
  await check('Normal motion: scroll reveals and live reduced-motion preference', async () => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
    const page = await context.newPage();
    await page.goto(baseURL);
    await page.getByRole('button', { name: 'Solo necesarias', exact: true }).click();
    await page.getByRole('heading', { name: /Cada persona/ }).scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('[data-reveal]')].filter((el) => { const r=el.getBoundingClientRect(); return r.top>=100 && r.bottom<innerHeight; }).every((el) => el.dataset.revealed === 'true'));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => [...document.querySelectorAll('[data-reveal]')].every((el) => el.dataset.revealed === 'true'));
    await context.close();
  });
  await check('Scroll story changes product view and preserves manual navigation', async () => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
    const page = await context.newPage();
    const landing = new LandingPage(page);
    await landing.open(); await landing.dismissConsent();
    await page.evaluate(() => {
      const runway = document.querySelector('[data-tour-runway]');
      window.scrollTo({ top: runway.getBoundingClientRect().top + scrollY + (runway.offsetHeight - innerHeight) * .5, behavior: 'instant' });
    });
    await page.waitForFunction(() => document.querySelector('[data-product-tour]').dataset.active === '1');
    assert.equal(await landing.panel('Docentes').isVisible(), true);
    await landing.tab('Estudiantes').click();
    assert.equal(await landing.panel('Estudiantes').isVisible(), true);
    await landing.panel('Estudiantes').evaluate(async (panel) => {
      await Promise.all([...panel.querySelectorAll('img')].map((img) => img.decode()));
      await Promise.all(panel.getAnimations({ subtree: true }).map((animation) => animation.finished));
    });
    await page.screenshot({ path: 'screenshots/scroll-story-desktop.png' });
    await context.close();
  });
  for (const width of [320, 768, 1024]) {
    await check(`Additional viewport ${width}px`, async () => {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.goto(baseURL);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
      await context.close();
    });
  }
} finally {
  await browser.close();
  await writeFile('screenshots/ui-audit-results.json', JSON.stringify({ passed: results.length, failures, results }, null, 2));
}
console.log(`${results.length} checks passed; ${failures.length} failures.`);
if (failures.length) process.exitCode = 1;
