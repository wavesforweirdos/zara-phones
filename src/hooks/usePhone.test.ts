import { renderHook, waitFor } from '@testing-library/react';
import usePhone from './usePhone';
import { jsonResponse, pendingUntilAborted, signalOfCall } from '../test-utils/fetch';
import type { FetchSpy } from '../test-utils/fetch';

const mockPhone = {
  id: 'SMG-S24U',
  name: 'Galaxy S24 Ultra',
  brand: 'Samsung',
  basePrice: 1199,
};

describe('usePhone', () => {
  let fetchSpy: FetchSpy;

  beforeEach(() => {
    sessionStorage.clear();
    fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(mockPhone));
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('returns phone detail by id', async () => {
    const { result } = renderHook(() => usePhone('SMG-S24U'));
    await waitFor(() => expect(result.current.phone).not.toBeNull());
    expect(result.current.phone?.name).toBe('Galaxy S24 Ultra');
    expect(result.current.phone?.brand).toBe('Samsung');
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/products/SMG-S24U'),
      expect.any(Object)
    );
  });

  it('second call with same id uses sessionStorage instead of fetch', async () => {
    // First render — populates sessionStorage cache
    const { result, unmount } = renderHook(() => usePhone('SMG-S24U'));
    await waitFor(() => expect(result.current.phone).not.toBeNull());
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    unmount();

    // Second render with the same id — must hit cache, not fetch
    const { result: result2 } = renderHook(() => usePhone('SMG-S24U'));
    await waitFor(() => expect(result2.current.phone).not.toBeNull());
    expect(fetchSpy).toHaveBeenCalledTimes(1); // no additional call
  });

  it('aborts the pending request on unmount', () => {
    fetchSpy.mockImplementationOnce(() => new Promise(() => {}));

    const { unmount } = renderHook(() => usePhone('SMG-S24U'));
    const signal = signalOfCall(fetchSpy);
    expect(signal.aborted).toBe(false);

    unmount();

    expect(signal.aborted).toBe(true);
  });

  it('aborts the previous request when the id changes', async () => {
    fetchSpy.mockImplementationOnce(pendingUntilAborted);

    const { result, rerender } = renderHook(({ id }) => usePhone(id), {
      initialProps: { id: 'APL-IP15' },
    });
    const firstSignal = signalOfCall(fetchSpy);

    rerender({ id: 'SMG-S24U' });

    await waitFor(() => expect(result.current.phone).not.toBeNull());
    expect(firstSignal.aborted).toBe(true);
    expect(result.current.phone?.name).toBe('Galaxy S24 Ultra');
    expect(result.current.error).toBeNull();
  });
});
