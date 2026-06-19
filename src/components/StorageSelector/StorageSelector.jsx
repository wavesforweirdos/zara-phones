import './StorageSelector.scss';

function StorageSelector({ options, selected, onChange }) {
  return (
    <div className="storage-selector">
      <p className="storage-selector__label">STORAGE ¿HOW MUCH SPACE DO YOU NEED?</p>
      <div className="storage-selector__options" role="radiogroup" aria-label="Capacidad de almacenamiento">
        {options.map((option) => {
          const isSelected = selected?.capacity === option.capacity;
          return (
            <button
              key={option.capacity}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`storage-selector__chip${isSelected ? ' storage-selector__chip--selected' : ''}`}
              onClick={() => onChange(option)}
            >
              {option.capacity}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StorageSelector;
