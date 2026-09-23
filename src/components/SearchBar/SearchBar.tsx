import { useState } from 'react';
import type { MouseEvent } from 'react';
import closeIcon from '../../assets/close.svg';
import type { Swatch } from '../../types/phone';
import './SearchBar.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  count: number;
  colorOptions?: Swatch[];
  colorFilter?: string[];
  onColorFilter: (colorNames: string[]) => void;
}

function SearchBar({
  value,
  onChange,
  count,
  colorOptions = [],
  colorFilter = [],
  onColorFilter,
}: SearchBarProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  const handleSwatchClick = (name: string) => {
    const next = colorFilter.includes(name)
      ? colorFilter.filter((n) => n !== name)
      : [...colorFilter, name];
    onColorFilter(next);
  };

  const handleClearColors = (e: MouseEvent<HTMLButtonElement>) => {
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
          <div
            id="search-color-filter"
            className="search-bar__color-options"
            role="group"
            aria-label="Filtrar por color"
          >
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

export default SearchBar;
