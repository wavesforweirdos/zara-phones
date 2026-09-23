import { useState, useEffect } from 'react';
import { fetchProductById } from '../services/api';
import type { PhoneDetail } from '../types/phone';

interface UsePhoneResult {
  phone: PhoneDetail | null;
  loading: boolean;
  error: string | null;
}

function usePhone(id: string | undefined): UsePhoneResult {
  const [phone, setPhone] = useState<PhoneDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // Aborts the in-flight request when the id changes or the component unmounts
    const controller = new AbortController();

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
        const data = await fetchProductById(id, { signal: controller.signal });
        setPhone(data);
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, [id]);

  return { phone, loading, error };
}

export default usePhone;
