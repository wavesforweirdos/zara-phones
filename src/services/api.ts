import type { PhoneDetail, PhoneSummary } from '../types/phone';

// Injected at build time by webpack DefinePlugin from .env (see .env.example)
const BASE_URL = process.env.API_BASE_URL;
const HEADERS = { 'x-api-key': process.env.API_KEY };

interface RequestOptions {
  signal?: AbortSignal;
}

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
};

// `signal` (AbortController) lets callers cancel requests that are no longer needed
export const fetchProducts = (
  search = '',
  { signal }: RequestOptions = {}
): Promise<PhoneSummary[]> =>
  fetch(`${BASE_URL}/products${search ? `?search=${encodeURIComponent(search)}` : ''}`, {
    headers: HEADERS,
    signal,
  }).then((res) => handleResponse<PhoneSummary[]>(res));

export const fetchProductById = (
  id: string,
  { signal }: RequestOptions = {}
): Promise<PhoneDetail> =>
  fetch(`${BASE_URL}/products/${id}`, { headers: HEADERS, signal }).then((res) =>
    handleResponse<PhoneDetail>(res)
  );
