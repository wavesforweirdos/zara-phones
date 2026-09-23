// Typed helpers for tests that spy on the global fetch

export type FetchSpy = jest.SpiedFunction<typeof fetch>;

export const jsonResponse = (data: unknown, init: Partial<Response> = {}): Response =>
  ({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve(data),
    ...init,
  }) as Response;

// Never settles on its own: rejects with an AbortError only when the request is aborted
export const pendingUntilAborted = (_input: RequestInfo | URL, init?: RequestInit) =>
  new Promise<Response>((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () =>
      reject(new DOMException('Aborted', 'AbortError'))
    );
  });

export const signalOfCall = (spy: FetchSpy, call = 0): AbortSignal => {
  const signal = spy.mock.calls[call][1]?.signal;
  if (!signal) throw new Error(`fetch call ${call} was made without an AbortSignal`);
  return signal;
};
