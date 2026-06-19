import closeIcon from '../../assets/close.svg';
import './SearchBar.scss';

function SearchBar({ value, onChange, count }) {
  return (
    <section className="search-bar" aria-label="Buscador de smartphones">
      <div className="search-bar__input-wrapper">
        <input
          type="search"
          className="search-bar__input"
          placeholder="Search for a smartphone..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Buscar smartphone"
        />
        {value.length > 0 && (
          <button
            type="button"
            className="search-bar__clear"
            aria-label="Limpiar búsqueda"
            onClick={() => onChange('')}
          >
            <img src={closeIcon} alt="" aria-hidden="true" />
          </button>
        )}
      </div>
      <p className="search-bar__count" aria-live="polite" aria-atomic="true">
        {count} RESULTS
      </p>
    </section>
  );
}

export default SearchBar;
