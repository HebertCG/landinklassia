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
      ['Básico', '299', '250', '300 GB', 'Importación masiva de alumnos'],
      ['Profesional', '499', '500', '500 GB', 'Las mismas funciones del Plan Básico'],
      ['Institucional', '999', '1,000', '1 TB', 'Las mismas funciones del Plan Profesional'],
    ];
    for (const [i, [name, price, students, storage, feature]] of expected.entries()) {
      const card = cards.nth(i);
      assert.equal(await card.locator('h3').innerText(), name);
      assert.equal(await card.locator('.plan-price strong').innerText(), `S/${price}`);
      assert.match(await card.locator('.plan-limits').innerText(), new RegExp(`Hasta ${students} alumnos activos`));
      assert.ok((await card.locator('.plan-limits').innerText()).includes(storage));
      assert.equal(await card.locator('.price-prefix').innerText(), 'IGV incluido');
      assert.equal(await card.locator('.plan-subdomain').innerText(), 'Subdominio propio para tu academia');
      await card.locator('summary').press('Enter');
      assert.equal(await card.locator('.plan-details').getByText(feature, { exact: true }).isVisible(), true);
      await card.locator('summary').press('Space');
      assert.equal(await card.locator('.plan-details').getByText(feature, { exact: true }).isVisible(), false);
    }
    assert.equal(await cards.nth(3).locator('.plan-ribbon').innerText(), 'Próximamente');
    assert.equal(await cards.nth(3).getByRole('link').count(), 0);
    assert.equal(await cards.first().getByText(/Importación masiva/).count(), 0);
    assert.equal(await page.locator('.plan-grid').getByText('Dominio personalizado', { exact: true }).count(), 0);
    assert.equal(await page.locator('#config-plan option').count(), 3);
  });
  // Explicit commercial expectations, independent of the implementation's plan data.
  const selections = [
    ['inicial', '100', ['S/149', 'S/174', 'S/248'], ['100 GB', '200 GB', '600 GB']],
    ['basico', '250', ['S/299', 'S/324', 'S/398'], ['300 GB', '400 GB', '800 GB']],
    ['profesional', '500', ['S/499', 'S/524', 'S/598'], ['500 GB', '600 GB', '1 TB']],
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
        assert.ok(contact.searchParams.get('text').includes(`Total mensual: ${totals[i]} (IGV incluido).`));
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
    for (const [i, price] of [99, 45, 69, 129, 149].entries()) {
      const offer = offers.nth(i);
      assert.equal(await offer.locator('.coming-soon').innerText(), 'Próximamente');
      assert.equal(await offer.locator('.plus-price strong').innerText(), `S/${price}`);
      assert.equal(await offer.locator('a, button, input, select').count(), 0);
      await offer.locator('summary').click();
      assert.equal(await offer.locator('details ul').isVisible(), true);
    }
    assert.deepEqual(await page.locator('.combo-saving').allInnerTexts(), ['Ahorra S/15/mes', 'Ahorra S/19/mes']);
    assert.equal(await page.getByText('El precio se mantiene si el proveedor cuesta hasta S/99 por academia.', { exact: true }).count(), 0);
    assert.equal(await page.getByText('Las comisiones bancarias o de pasarela no están incluidas.', { exact: true }).isVisible(), true);
  });
  await check('Home summary links preserve plan selection and navigation is active', async () => {
    await page.goto(baseURL);
    assert.equal(await page.locator('.pricing-preview .plan-card').count(), 4);
    assert.equal(await page.locator('.pricing-preview .plan-ribbon').innerText(), 'Próximamente');
    await page.locator('.pricing-preview').getByRole('link', { name: 'Elegir Profesional' }).click();
    await page.waitForURL('**/planes/?plan=profesional#configura');
    assert.equal(await page.locator('#config-plan').inputValue(), 'profesional');
    assert.equal(await page.locator('.main-nav').getByRole('link', { name: 'Planes', exact: true }).getAttribute('aria-current'), 'page');
    await page.goto(`${baseURL}/planes/?plan=invalid`);
    assert.equal(await page.locator('#config-plan').inputValue(), 'inicial');
  });
  await check('Institutional query cannot select an upcoming plan', async () => {
    await page.goto(`${baseURL}/planes/?plan=institucional#configura`);
    assert.equal(await page.locator('#config-plan').inputValue(), 'inicial');
    assert.equal(await page.locator('[data-config-total]').innerText(), 'S/149/mes');
    assert.equal(await page.locator('#config-plan option[value="institucional"]').count(), 0);
  });
  await check('Upcoming arrow navigates to the Plus section; old beta is removed', async () => {
    await page.goto(`${baseURL}/planes/`);
    await page.getByRole('link', { name: 'Conoce lo próximo que llegará a Klassia' }).click();
    await page.waitForURL('**/planes/#proximamente');
    assert.equal(await page.locator('#proximamente').evaluate(el => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.top < innerHeight; }), true);
    assert.equal(await page.getByText('Conoce Klassia en beta.', { exact: true }).count(), 0);
    assert.equal(await page.locator('[data-promotion] time').getAttribute('datetime'), '2026-12-31');
  });
  await check('Promotion counts days, hours, minutes and seconds against Peru deadline', async () => {
    const timed = await browser.newContext({ timezoneId: 'Asia/Tokyo', reducedMotion: 'reduce' });
    try {
      const page = await timed.newPage();
      await page.clock.install({ time: new Date('2026-12-30T22:58:57-05:00') });
      await page.clock.pauseAt(new Date('2026-12-30T22:58:57-05:00'));
      await page.goto(`${baseURL}/planes/`);
      assert.deepEqual(await page.locator('.promo-digits dd').allTextContents(), ['01', '01', '01', '03']);
      assert.equal(await page.locator('[data-promo-active]').isVisible(), true);
      assert.equal(await page.getByRole('timer').getAttribute('aria-live'), 'off');
      await page.clock.runFor(2000);
      assert.deepEqual(await page.locator('.promo-digits dd').allTextContents(), ['01', '01', '01', '01']);
      await page.clock.runFor(1000);
      assert.deepEqual(await page.locator('.promo-digits dd').allTextContents(), ['01', '01', '01', '00']);
      await page.clock.runFor(1000);
      assert.deepEqual(await page.locator('.promo-digits dd').allTextContents(), ['01', '01', '00', '59']);
    } finally { await timed.close(); }
  });
  await check('Promotion expires at midnight after December 31 and never goes negative', async () => {
    const timed = await browser.newContext({ reducedMotion: 'reduce' });
    try {
      const page = await timed.newPage();
      await page.clock.install({ time: new Date('2026-12-31T23:59:59-05:00') });
      await page.clock.pauseAt(new Date('2026-12-31T23:59:59-05:00'));
      await page.goto(`${baseURL}/planes/`);
      assert.deepEqual(await page.locator('.promo-digits dd').allTextContents(), ['00', '00', '00', '01']);
      await page.clock.runFor(1000);
      assert.deepEqual(await page.locator('.promo-digits dd').allTextContents(), ['00', '00', '00', '00']);
      assert.equal(await page.locator('[data-promo-active]').isVisible(), false);
      assert.equal(await page.locator('[data-promo-ended]').isVisible(), true);
      assert.equal(await page.getByRole('link', { name: 'Quiero dar el salto' }).isVisible(), false);
      await page.clock.runFor(60000);
      assert.deepEqual(await page.locator('.promo-digits dd').allTextContents(), ['00', '00', '00', '00']);
      await page.reload();
      assert.equal(await page.locator('[data-promo-ended]').isVisible(), true);
    } finally { await timed.close(); }
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
      await page.locator('[data-promotion]').screenshot({ path: `screenshots/promotion-${width}.png` });
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
    assert.equal(await page.locator('[data-promo-fallback]').isVisible(), true);
    assert.equal(await page.locator('[data-promo-clock]').isVisible(), false);
    assert.equal(await page.locator('[data-promo-active]').isVisible(), false);
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
