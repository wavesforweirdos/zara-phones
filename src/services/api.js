// Injected at build time by webpack DefinePlugin from .env (see .env.example)
const BASE_URL = process.env.API_BASE_URL;
const HEADERS = { 'x-api-key': process.env.API_KEY };

const handleResponse = async (res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
};

export const fetchProducts = (search = '') =>
  fetch(`${BASE_URL}/products${search ? `?search=${encodeURIComponent(search)}` : ''}`, {
    headers: HEADERS,
  }).then(handleResponse);

export const fetchProductById = (id) =>
  fetch(`${BASE_URL}/products/${id}`, { headers: HEADERS }).then(handleResponse);
