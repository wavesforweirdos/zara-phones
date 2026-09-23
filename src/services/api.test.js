import { fetchProducts, fetchProductById } from './api';

describe('api service', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
  });

  afterEach(() => jest.restoreAllMocks());

  it('builds the products url and api key header from environment variables', async () => {
    await fetchProducts('galaxy s24');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test/products?search=galaxy%20s24',
      expect.objectContaining({ headers: { 'x-api-key': 'test-api-key' } })
    );
  });

  it('builds the product detail url from environment variables', async () => {
    await fetchProductById('SMG-S24U');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test/products/SMG-S24U',
      expect.objectContaining({ headers: { 'x-api-key': 'test-api-key' } })
    );
  });

  it('throws when the response is not ok', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 401, statusText: 'Unauthorized' });

    await expect(fetchProducts()).rejects.toThrow('HTTP 401: Unauthorized');
  });
});
