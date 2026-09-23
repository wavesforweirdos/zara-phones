import type { StorageOption } from '../../types/phone';
import './StorageSelector.scss';

interface StorageSelectorProps {
  options: StorageOption[];
  selected?: StorageOption | null;
  onChange: (option: StorageOption) => void;
}

function StorageSelector({ options, selected = null, onChange }: StorageSelectorProps) {
  return (
    <div className="storage-selector">
      <p className="storage-selector__label">STORAGE ¿HOW MUCH SPACE DO YOU NEED?</p>
      <div
        className="storage-selector__options"
        role="radiogroup"
        aria-label="Capacidad de almacenamiento"
      >
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
