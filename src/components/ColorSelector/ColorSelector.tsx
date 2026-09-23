import { useState } from 'react';
import type { Swatch } from '../../types/phone';
import './ColorSelector.scss';

// Generic so onChange hands back the full option type of the caller (e.g. ColorOption with imageUrl)
interface ColorSelectorProps<T extends Swatch> {
  options: T[];
  selected?: T | null;
  onChange: (option: T) => void;
}

function ColorSelector<T extends Swatch>({
  options,
  selected = null,
  onChange,
}: ColorSelectorProps<T>) {
  const [hovered, setHovered] = useState<T | null>(null);

  const displayName = hovered?.name ?? selected?.name ?? null;

  return (
    <div className="color-selector">
      <p className="color-selector__label">COLOR. PICK YOUR FAVOURITE.</p>
      <div className="color-selector__swatches" role="radiogroup" aria-label="Color">
        {options.map((option) => {
          const isSelected = selected?.name === option.name;
          return (
            <button
              key={option.name}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Color: ${option.name}`}
              className={`color-selector__swatch${isSelected ? ' color-selector__swatch--selected' : ''}`}
              style={{ backgroundColor: option.hexCode }}
              onClick={() => onChange(option)}
              onMouseEnter={() => setHovered(option)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}
      </div>
      <p className="color-selector__name">{displayName ?? ' '}</p>
    </div>
  );
}

export default ColorSelector;
