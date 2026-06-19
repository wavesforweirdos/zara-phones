import { useState, useEffect } from 'react';
import { fetchProductById } from '../services/api';

function usePhone(id) {
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const cacheKey = `phone_cache_${id}`;
      const cached = sessionStorage.getItem(cacheKey);

      if (cached) {
        setPhone(JSON.parse(cached));
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchProductById(id);
        setPhone(data);
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  return { phone, loading, error };
}

export default usePhone;
