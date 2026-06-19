import { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import useDebounce from './useDebounce';

function usePhones() {
  const [query, setQuery] = useState('');
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const load = async () => {
      const cacheKey = `phones_cache_${debouncedQuery}`;
      const cached = sessionStorage.getItem(cacheKey);

      if (cached) {
        setPhones(JSON.parse(cached));
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchProducts(debouncedQuery);
        setPhones(Array.isArray(data) ? data : []);
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [debouncedQuery]);

  return { phones, loading, error, query, setQuery };
}

export default usePhones;
