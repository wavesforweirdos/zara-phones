import { fetchProducts, fetchProductById } from './api';
import { jsonResponse } from '../test-utils/fetch';
import type { FetchSpy } from '../test-utils/fetch';

describe('api service', () => {
  let fetchSpy: FetchSpy;

  beforeEach(() => {
    fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse([]));
  });

  afterEach(() => jest.restoreAllMocks());

  it('builds the products url and api key header from environment variables', async () => {
    await fetchProducts('galaxy s24');

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.test/products?search=galaxy%20s24',
      expect.objectContaining({ headers: { 'x-api-key': 'test-api-key' } })
    );
  });

  it('builds the product detail url from environment variables', async () => {
    await fetchProductById('SMG-S24U');

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.test/products/SMG-S24U',
      expect.objectContaining({ headers: { 'x-api-key': 'test-api-key' } })
    );
  });

  it('throws when the response is not ok', async () => {
    fetchSpy.mockResolvedValue(
      jsonResponse(null, { ok: false, status: 401, statusText: 'Unauthorized' })
    );

    await expect(fetchProducts()).rejects.toThrow('HTTP 401: Unauthorized');
  });
});
