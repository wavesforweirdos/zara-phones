const { test, expect } = require('@playwright/test');
const { mockApi, phones } = require('./fixtures/api');

const catalogCards = (page) =>
  page.getByRole('list', { name: 'Catálogo de teléfonos' }).getByRole('link');

test.describe('Phone list search', () => {
  test('shows the full catalog and filters it through the API', async ({ page }) => {
    const requests = await mockApi(page);
    await page.goto('/');

    await expect(catalogCards(page)).toHaveCount(phones.length);
    await expect(page.getByText(`${phones.length} RESULTS`)).toBeVisible();

    // Typed key by key faster than the 300 ms debounce
    await page
      .getByRole('searchbox', { name: 'Buscar smartphone' })
      .pressSequentially('samsung', { delay: 50 });

    await expect(catalogCards(page)).toHaveCount(1);
    await expect(catalogCards(page).first()).toContainText('Galaxy S24 Ultra');
    await expect(page.getByText('1 RESULTS')).toBeVisible();
    await expect(page).toHaveURL(/\?search=samsung/);

    // Search is delegated to the API, and debounced: partial terms never reach it
    // (a Set because StrictMode in dev mounts twice and repeats the initial request)
    const searches = requests.filter((u) => u.pathname === '/products').map((u) => u.search);
    expect(new Set(searches)).toEqual(new Set(['', '?search=samsung']));
  });

  test('clearing the search restores the full catalog', async ({ page }) => {
    await mockApi(page);
    await page.goto('/?search=xiaomi');

    await expect(catalogCards(page)).toHaveCount(1);

    await page.getByRole('button', { name: 'Limpiar búsqueda' }).click();

    await expect(catalogCards(page)).toHaveCount(phones.length);
    await expect(page).toHaveURL('/');
  });

  test('opens the detail page when clicking a card', async ({ page }) => {
    await mockApi(page);
    await page.goto('/');

    await catalogCards(page).filter({ hasText: 'Galaxy S24 Ultra' }).click();

    await expect(page).toHaveURL('/phone/SMG-S24U');
    await expect(page.getByRole('heading', { level: 1, name: 'Galaxy S24 Ultra' })).toBeVisible();
  });
});
