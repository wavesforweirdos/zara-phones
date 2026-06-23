import PropTypes from 'prop-types';
import { useState } from 'react';
import closeIcon from '../../assets/close.svg';
import './SearchBar.scss';

function SearchBar({ value, onChange, count, colorOptions = [], colorFilter = [], onColorFilter }) {
  const [filterOpen, setFilterOpen] = useState(false);

  const handleSwatchClick = (name) => {
    const next = colorFilter.includes(name)
      ? colorFilter.filter((n) => n !== name)
      : [...colorFilter, name];
    onColorFilter(next);
  };

  const handleClearColors = (e) => {
    e.stopPropagation();
    onColorFilter([]);
  };

  const activeCount = colorFilter.length;

  return (
    <section
      className={`search-bar${filterOpen ? ' search-bar--filter-open' : ''}`}
      aria-label="Buscador de smartphones"
    >
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

      <div className="search-bar__meta">
        <p className="search-bar__count" aria-live="polite" aria-atomic="true">
          {count} RESULTS
        </p>

        {colorOptions.length > 0 && (
          <div id="search-color-filter" className="search-bar__color-options" role="group" aria-label="Filtrar por color">
            {colorOptions.map((color) => (
              <button
                key={color.hexCode}
                type="button"
                className={`search-bar__color-swatch${colorFilter.includes(color.name) ? ' search-bar__color-swatch--selected' : ''}`}
                style={{ backgroundColor: color.hexCode }}
                aria-label={`Color: ${color.name}`}
                aria-pressed={colorFilter.includes(color.name)}
                onClick={() => handleSwatchClick(color.name)}
              />
            ))}
          </div>
        )}

        {colorOptions.length > 0 && (
          <div className="search-bar__filter-controls">
            <button
              type="button"
              className={`search-bar__filter-btn${activeCount > 0 ? ' search-bar__filter-btn--active' : ''}`}
              aria-expanded={filterOpen}
              aria-controls="search-color-filter"
              onClick={() => setFilterOpen((prev) => !prev)}
            >
              {filterOpen ? 'CERRAR' : `FILTRAR${activeCount > 0 ? ` (${activeCount})` : ''}`}
            </button>
            {!filterOpen && activeCount > 0 && (
              <button
                type="button"
                className="search-bar__filter-clear"
                aria-label="Limpiar filtros de color"
                onClick={handleClearColors}
              >
                <img src={closeIcon} alt="" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

const colorOptionShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  hexCode: PropTypes.string.isRequired,
});

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  colorOptions: PropTypes.arrayOf(colorOptionShape),
  colorFilter: PropTypes.arrayOf(PropTypes.string),
  onColorFilter: PropTypes.func.isRequired,
};

export default SearchBar;
