import { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import useDebounce from './useDebounce';

function usePhones(query = '') {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const dedupe = (arr) =>
      Array.isArray(arr) ? arr.filter((p, i, a) => a.findIndex((x) => x.id === p.id) === i) : [];

    const load = async () => {
      const cacheKey = `phones_cache_${debouncedQuery}`;
      const cached = sessionStorage.getItem(cacheKey);

      if (cached) {
        setPhones(dedupe(JSON.parse(cached)));
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchProducts(debouncedQuery);
        const unique = dedupe(data);
        setPhones(unique);
        sessionStorage.setItem(cacheKey, JSON.stringify(unique));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [debouncedQuery]);

  return { phones, loading, error };
}

export default usePhones;
