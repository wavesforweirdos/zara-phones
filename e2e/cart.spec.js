const { test, expect } = require('@playwright/test');
const { mockApi, phoneDetail } = require('./fixtures/api');

const addPhoneToCart = async (page, { storage, color }) => {
  await page.goto(`/phone/${phoneDetail.id}`);
  await expect(page.getByRole('heading', { level: 1, name: phoneDetail.name })).toBeVisible();

  const addButton = page.getByRole('button', { name: 'AÑADIR' });
  await expect(addButton).toBeDisabled();

  await page.getByRole('radio', { name: storage.capacity }).click();
  await expect(page.getByText(`${storage.price} EUR`)).toBeVisible();
  await expect(addButton).toBeDisabled();

  await page.getByRole('radio', { name: `Color: ${color.name}` }).click();
  await expect(addButton).toBeEnabled();

  await addButton.click();
};

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
  });

  test('adds a phone from the detail page and shows it in the cart', async ({ page }) => {
    const [, storage] = phoneDetail.storageOptions;
    const [, color] = phoneDetail.colorOptions;

    await addPhoneToCart(page, { storage, color });

    await expect(page).toHaveURL('/');
    const cartLink = page.getByRole('link', { name: 'Carrito, 1 productos' });
    await expect(cartLink).toBeVisible();

    await cartLink.click();

    await expect(page.getByRole('heading', { name: 'CART (1)' })).toBeVisible();
    await expect(page.getByText(`${storage.capacity} | ${color.name}`)).toBeVisible();
    await expect(page.getByText(`${storage.price} EUR`).first()).toBeVisible();
  });

  test('keeps the cart after reloading the page', async ({ page }) => {
    const [storage] = phoneDetail.storageOptions;
    const [color] = phoneDetail.colorOptions;

    await addPhoneToCart(page, { storage, color });
    await page.goto('/cart');
    await page.reload();

    await expect(page.getByRole('heading', { name: 'CART (1)' })).toBeVisible();
  });

  test('removes a phone from the cart and updates the total', async ({ page }) => {
    const [storage] = phoneDetail.storageOptions;
    const [color] = phoneDetail.colorOptions;

    await addPhoneToCart(page, { storage, color });
    await page.goto('/cart');

    await expect(page.getByText('TOTAL')).toBeVisible();

    await page
      .getByRole('button', { name: `Eliminar ${phoneDetail.brand} ${phoneDetail.name}` })
      .click();

    await expect(page.getByRole('heading', { name: 'CART (0)' })).toBeVisible();
    await expect(page.getByText('TOTAL')).toBeHidden();

    await page.getByRole('link', { name: 'CONTINUE SHOPPING' }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('link', { name: 'Carrito, 0 productos' })).toBeVisible();
  });
});
