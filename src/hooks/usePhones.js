import { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import useDebounce from './useDebounce';

function usePhones(query = '') {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    // Aborts the in-flight request when the query changes or the component unmounts,
    // so a slow stale response can never overwrite a newer one
    const controller = new AbortController();

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
        const data = await fetchProducts(debouncedQuery, { signal: controller.signal });
        const unique = dedupe(data);
        setPhones(unique);
        sessionStorage.setItem(cacheKey, JSON.stringify(unique));
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, [debouncedQuery]);

  return { phones, loading, error };
}

export default usePhones;
