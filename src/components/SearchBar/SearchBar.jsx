import './SearchBar.scss';

function SearchBar({ value, onChange, count }) {
  return (
    <section className="search-bar" aria-label="Buscador de smartphones">
      <input
        type="search"
        className="search-bar__input"
        placeholder="Search for a smartphone..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Buscar smartphone"
      />
      <p className="search-bar__count" aria-live="polite" aria-atomic="true">
        {count} RESULTS
      </p>
    </section>
  );
}

export default SearchBar;
