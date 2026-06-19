import usePhones from '../../hooks/usePhones';
import SearchBar from '../../components/SearchBar/SearchBar';
import PhoneCard from '../../components/PhoneCard/PhoneCard';
import './PhoneListPage.scss';

function PhoneListPage() {
  const { phones, loading, error, query, setQuery } = usePhones();

  return (
    <main className="phone-list-page container container--xl">
      <SearchBar value={query} onChange={setQuery} count={phones.length} />

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
          {phones.map((phone) => (
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
