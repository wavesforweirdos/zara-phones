import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import usePhones from '../../hooks/usePhones';
import SearchBar from '../../components/SearchBar/SearchBar';
import PhoneCard from '../../components/PhoneCard/PhoneCard';
import { TOP_COLORS } from '../../constants/filters';
import { fetchProductById } from '../../services/api';
import './PhoneListPage.scss';

const COLOR_MAP_CACHE_KEY = 'phone_color_map';

function PhoneListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('search') ?? '';
  const setQuery = (val) => setSearchParams(val ? { search: val } : {}, { replace: true });

  const { phones, loading, error } = usePhones(query);
  useEffect(() => {
    document.title = 'Catálogo — Zara Phones';
  }, []);

  const [colorFilter, setColorFilter] = useState([]);
  // Map<id, hexCode[]> — built lazily on first color filter, cached in sessionStorage
  const [phoneColorMap, setPhoneColorMap] = useState(null);

  useEffect(() => {
    if (colorFilter.length === 0 || phoneColorMap !== null || phones.length === 0) return;

    const cached = sessionStorage.getItem(COLOR_MAP_CACHE_KEY);
    if (cached) {
      setPhoneColorMap(new Map(JSON.parse(cached)));
      return;
    }

    Promise.all(phones.map((p) => fetchProductById(p.id))).then((details) => {
      const map = new Map(
        details.map((d) => [d.id, (d.colorOptions ?? []).map((c) => c.hexCode.toUpperCase())])
      );
      sessionStorage.setItem(COLOR_MAP_CACHE_KEY, JSON.stringify([...map]));
      setPhoneColorMap(map);
    });
  }, [colorFilter, phones, phoneColorMap]);

  const displayed = useMemo(() => {
    if (colorFilter.length === 0) return phones;
    if (!phoneColorMap) return phones;

    const selectedHex = colorFilter
      .map((name) => TOP_COLORS.find((c) => c.name === name)?.hexCode.toUpperCase())
      .filter(Boolean);

    return phones.filter((p) => {
      const phoneHex = phoneColorMap.get(p.id) ?? [];
      return selectedHex.some((hex) => phoneHex.includes(hex));
    });
  }, [phones, colorFilter, phoneColorMap]);

  return (
    <main id="main-content" className="phone-list-page container container--xl">
      <h1 className="sr-only">Catálogo de teléfonos</h1>
      <SearchBar
        value={query}
        onChange={setQuery}
        count={displayed.length}
        colorOptions={TOP_COLORS}
        colorFilter={colorFilter}
        onColorFilter={setColorFilter}
      />

      {loading && (
        <p className="phone-list-page__status" aria-live="polite">
          Cargando...
        </p>
      )}

      {error && (
        <p className="phone-list-page__status phone-list-page__status--error" role="alert">
          Error al cargar los teléfonos.
        </p>
      )}

      {!loading && !error && (
        <ul className="phone-list-page__grid" aria-label="Catálogo de teléfonos">
          {displayed.map((phone) => (
            <li key={phone.id}>
              <PhoneCard
                id={phone.id}
                name={phone.name}
                brand={phone.brand}
                price={phone.basePrice}
                imageUrl={phone.imageUrl}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default PhoneListPage;
