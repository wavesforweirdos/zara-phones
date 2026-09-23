import { renderHook, waitFor } from '@testing-library/react';
import usePhones from './usePhones';
import { jsonResponse, pendingUntilAborted, signalOfCall } from '../test-utils/fetch';
import type { FetchSpy } from '../test-utils/fetch';

// Bypass the 300 ms debounce so the hook fires synchronously in tests
jest.mock('./useDebounce', () => (value: unknown) => value);

const mockPhones = [
  { id: '1', name: 'iPhone 15 Pro', brand: 'Apple', basePrice: 1199 },
  { id: '2', name: 'Galaxy S24', brand: 'Samsung', basePrice: 999 },
];

describe('usePhones', () => {
  let fetchSpy: FetchSpy;

  beforeEach(() => {
    sessionStorage.clear();
    fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(mockPhones));
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('with empty query returns the full list', async () => {
    const { result } = renderHook(() => usePhones(''));
    await waitFor(() => expect(result.current.phones).toHaveLength(2));
    expect(result.current.phones[0].brand).toBe('Apple');
    expect(result.current.phones[1].brand).toBe('Samsung');
  });

  it('with query calls the API with the search param and returns filtered results', async () => {
    const samsungPhones = [{ id: '2', name: 'Galaxy S24', brand: 'Samsung', basePrice: 999 }];
    fetchSpy.mockResolvedValueOnce(jsonResponse(samsungPhones));

    const { result } = renderHook(() => usePhones('samsung'));
    await waitFor(() => expect(result.current.phones).toHaveLength(1));
    expect(result.current.phones[0].brand).toBe('Samsung');
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('search=samsung'),
      expect.any(Object)
    );
  });

  it('second call with same query uses sessionStorage instead of fetch', async () => {
    // First render — populates sessionStorage cache
    const { result, unmount } = renderHook(() => usePhones(''));
    await waitFor(() => expect(result.current.phones).toHaveLength(2));
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    unmount();

    // Second render with the same query — must hit cache, not fetch
    const { result: result2 } = renderHook(() => usePhones(''));
    await waitFor(() => expect(result2.current.phones).toHaveLength(2));
    expect(fetchSpy).toHaveBeenCalledTimes(1); // no additional call
  });

  it('aborts the stale request when the query changes', async () => {
    const samsungPhones = [{ id: '2', name: 'Galaxy S24', brand: 'Samsung', basePrice: 999 }];
    // First request never resolves on its own: it only rejects when aborted
    fetchSpy.mockImplementationOnce(pendingUntilAborted);
    fetchSpy.mockResolvedValueOnce(jsonResponse(samsungPhones));

    const { result, rerender } = renderHook(({ query }) => usePhones(query), {
      initialProps: { query: 'apple' },
    });
    const firstSignal = signalOfCall(fetchSpy);

    rerender({ query: 'samsung' });

    await waitFor(() => expect(result.current.phones).toEqual(samsungPhones));
    expect(firstSignal.aborted).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('aborts the pending request on unmount', () => {
    fetchSpy.mockImplementationOnce(() => new Promise(() => {}));

    const { unmount } = renderHook(() => usePhones(''));
    const signal = signalOfCall(fetchSpy);
    expect(signal.aborted).toBe(false);

    unmount();

    expect(signal.aborted).toBe(true);
  });
});
