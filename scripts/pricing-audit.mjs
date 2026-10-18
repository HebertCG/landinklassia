import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const baseURL = process.env.UI_AUDIT_URL || 'http://127.0.0.1:4321';
const results = [], failures = [];
await mkdir('screenshots', { recursive: true });
const browser = await chromium.launch({ channel: process.env.UI_AUDIT_BROWSER || 'msedge', headless: true });
async function check(name, action) {
  try { await action(); results.push(name); console.log(`PASS ${name}`); }
  catch (error) { failures.push(`${name}: ${error.message}`); console.error(`FAIL ${name}: ${error.message}`); }
}
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${baseURL}/planes/`);
  await page.getByRole('button', { name: 'Solo necesarias', exact: true }).click();
  await check('Four plans, capacities, prices and accessible details', async () => {
    const cards = page.locator('.plan-card');
    assert.equal(await cards.count(), 4);
    const expected = [
      ['Inicial', '149', '100', '100 GB', 'Backups incluidos'],
      ['Básico', '299', '250', '300 GB', 'Importación inicial de alumnos'],
      ['Profesional', '499', '500', '500 GB', 'Historial académico completo'],
      ['Institucional', '999', '1,000', '1 TB', 'Integraciones mediante API'],
    ];
    for (const [i, [name, price, students, storage, feature]] of expected.entries()) {
      const card = cards.nth(i);
      assert.equal(await card.locator('h3').innerText(), name);
      assert.equal(await card.locator('.plan-price strong').innerText(), `S/${price}`);
      assert.match(await card.locator('.plan-limits').innerText(), new RegExp(`Hasta ${students} alumnos activos`));
      assert.ok((await card.locator('.plan-limits').innerText()).includes(storage));
      await card.locator('summary').press('Enter');
      assert.equal(await card.locator('.plan-details').getByText(feature, { exact: true }).isVisible(), true);
      await card.locator('summary').press('Space');
      assert.equal(await card.locator('.plan-details').getByText(feature, { exact: true }).isVisible(), false);
    }
    assert.equal(await cards.nth(3).locator('.price-prefix').innerText(), 'Desde');
  });
  // Explicit commercial expectations, independent of the implementation's plan data.
  const selections = [
    ['inicial', '100', ['S/149', 'S/174', 'S/248'], ['100 GB', '200 GB', '600 GB']],
    ['basico', '250', ['S/299', 'S/324', 'S/398'], ['300 GB', '400 GB', '800 GB']],
    ['profesional', '500', ['S/499', 'S/524', 'S/598'], ['500 GB', '600 GB', '1 TB']],
    ['institucional', '1,000', ['Desde S/999', 'Desde S/1,024', 'Desde S/1,098'], ['1 TB', '1,100 GB', '1,500 GB']],
  ];
  for (const [plan, students, totals, capacities] of selections) {
    for (const [i, storage] of ['incluido', '100gb', '500gb'].entries()) {
      await check(`${plan} + ${storage}: total, storage, student limit and contact`, async () => {
        await page.locator('#config-plan').selectOption(plan);
        await page.locator(`input[value="${storage}"]`).check();
        assert.equal(await page.locator('[data-config-total]').innerText(), `${totals[i]}/mes`);
        assert.equal(await page.locator('[data-config-storage]').innerText(), `${capacities[i]} de almacenamiento total`);
        assert.ok((await page.locator('[data-config-description]').innerText()).includes(`Hasta ${students} alumnos activos`));
        const contact = new URL(await page.locator('[data-config-contact]').getAttribute('href'));
        assert.equal(contact.hostname, 'wa.me');
        assert.ok(contact.searchParams.get('text').includes(`Total mensual: ${totals[i]}.`));
      });
    }
  }
  await check('Card selection, focus and keyboard storage selection', async () => {
    await page.getByRole('link', { name: 'Elegir Básico' }).click();
    assert.equal(await page.locator('#config-plan').inputValue(), 'basico');
    assert.equal(await page.locator('#config-plan').evaluate(el => el === document.activeElement), true);
    await page.locator('input[value="incluido"]').check();
    await page.locator('input[value="incluido"]').press('ArrowDown');
    assert.equal(await page.locator('[data-config-total]').innerText(), 'S/324/mes');
  });
  await check('Plus and combos show prices and coming soon without purchase controls', async () => {
    const offers = page.locator('.plus-card, .combo-card');
    assert.equal(await offers.count(), 5);
    for (const [i, price] of [169, 169, 199, 299, 349].entries()) {
      const offer = offers.nth(i);
      assert.equal(await offer.locator('.coming-soon').innerText(), 'Próximamente');
      assert.equal(await offer.locator('.plus-price strong').innerText(), `S/${price}`);
      assert.equal(await offer.locator('a, button, input, select').count(), 0);
      await offer.locator('summary').click();
      assert.equal(await offer.locator('details ul').isVisible(), true);
    }
    assert.equal(await page.getByText('El precio se mantiene si el proveedor cuesta hasta S/99 por academia.', { exact: true }).isVisible(), true);
    assert.equal(await page.getByText('Las comisiones bancarias o de pasarela no están incluidas.', { exact: true }).isVisible(), true);
  });
  await check('Home summary links preserve plan selection and navigation is active', async () => {
    await page.goto(baseURL);
    assert.equal(await page.locator('.pricing-preview .plan-card').count(), 4);
    await page.locator('.pricing-preview').getByRole('link', { name: 'Elegir Profesional' }).click();
    await page.waitForURL('**/planes/?plan=profesional#configura');
    assert.equal(await page.locator('#config-plan').inputValue(), 'profesional');
    assert.equal(await page.locator('.main-nav').getByRole('link', { name: 'Planes', exact: true }).getAttribute('aria-current'), 'page');
    await page.goto(`${baseURL}/planes/?plan=invalid`);
    assert.equal(await page.locator('#config-plan').inputValue(), 'inicial');
  });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await check(`Pricing responsive layout and expanded details (${width}px)`, async () => {
      await page.setViewportSize({ width, height: 960 });
      await page.goto(`${baseURL}/planes/`);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
      await page.screenshot({ path: `screenshots/pricing-cover-${width}.png` });
      await page.locator('.plan-card').first().screenshot({ path: `screenshots/pricing-card-${width}.png` });
      await page.locator('#configura').screenshot({ path: `screenshots/pricing-config-${width}.png` });
      await page.locator('details').evaluateAll(items => items.forEach(item => item.open = true));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    });
  }
  await check('No browser errors', () => assert.deepEqual(errors, []));
  await context.close();
  await check('No JavaScript: prices, details and contact remain usable', async () => {
    const fallback = await browser.newContext({ javaScriptEnabled: false });
    const page = await fallback.newPage();
    await page.goto(`${baseURL}/planes/`);
    assert.equal(await page.locator('.plan-card').count(), 4);
    assert.equal(await page.locator('[data-plan-config]').isVisible(), false);
    assert.equal(await page.getByRole('link', { name: 'Consultar plan y almacenamiento' }).isVisible(), true);
    await page.locator('.plan-details summary').first().click();
    assert.equal(await page.getByText('Backups incluidos', { exact: true }).isVisible(), true);
    await fallback.close();
  });
} finally {
  await browser.close();
  await writeFile('screenshots/pricing-audit-results.json', JSON.stringify({ passed: results.length, failures, results }, null, 2));
}
console.log(`${results.length} checks passed; ${failures.length} failures.`);
if (failures.length) process.exitCode = 1;
