const phones = [
  {
    id: 'APL-IP15P',
    brand: 'Apple',
    name: 'iPhone 15 Pro',
    basePrice: 1219,
    imageUrl: 'https://api.e2e.test/images/iphone-15-pro.png',
  },
  {
    id: 'SMG-S24U',
    brand: 'Samsung',
    name: 'Galaxy S24 Ultra',
    basePrice: 1329,
    imageUrl: 'https://api.e2e.test/images/galaxy-s24-ultra.png',
  },
  {
    id: 'XMI-14',
    brand: 'Xiaomi',
    name: 'Xiaomi 14',
    basePrice: 899,
    imageUrl: 'https://api.e2e.test/images/xiaomi-14.png',
  },
];

const phoneDetail = {
  ...phones[1],
  description: 'Samsung flagship smartphone',
  rating: 4.6,
  specs: {
    screen: '6.8" Dynamic AMOLED 2X',
    resolution: '3120 x 1440 pixels',
    processor: 'Snapdragon 8 Gen 3',
    mainCamera: '200 MP',
    selfieCamera: '12 MP',
    battery: '5000 mAh',
    os: 'Android 14',
    screenRefreshRate: '120 Hz',
  },
  colorOptions: [
    {
      name: 'Titanium Black',
      hexCode: '#000000',
      imageUrl: 'https://api.e2e.test/images/galaxy-s24-ultra-black.png',
    },
    {
      name: 'Titanium Violet',
      hexCode: '#8E7CC3',
      imageUrl: 'https://api.e2e.test/images/galaxy-s24-ultra-violet.png',
    },
  ],
  storageOptions: [
    { capacity: '256 GB', price: 1329 },
    { capacity: '512 GB', price: 1459 },
  ],
  similarProducts: [phones[0], phones[2]],
};

// 1x1 transparent PNG so product images load without network access
const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

/**
 * Intercepts every call to the fake API host and answers like the real API:
 * `GET /products?search=` filters by name or brand, `GET /products/:id` returns the detail.
 * Returns the list of requested URLs so tests can assert on them.
 */
async function mockApi(page) {
  const requests = [];

  await page.route('https://api.e2e.test/**', async (route) => {
    const url = new URL(route.request().url());

    if (url.pathname.startsWith('/images/')) {
      return route.fulfill({ contentType: 'image/png', body: PIXEL });
    }

    requests.push(url);

    if (route.request().headers()['x-api-key'] !== 'e2e-api-key') {
      return route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
    }

    if (url.pathname === '/products') {
      const search = (url.searchParams.get('search') ?? '').toLowerCase();
      const result = phones.filter(
        (p) => p.name.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search)
      );
      return route.fulfill({ json: result });
    }

    if (url.pathname === `/products/${phoneDetail.id}`) {
      return route.fulfill({ json: phoneDetail });
    }

    return route.fulfill({ status: 404, json: { error: 'Not found' } });
  });

  return requests;
}

module.exports = { mockApi, phones, phoneDetail };
