const BASE_URL = 'https://prueba-tecnica-api-tienda-moviles.onrender.com';
const HEADERS = { 'x-api-key': '87909682e6cd74208f41a6ef39fe4191' };

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
