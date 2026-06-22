import { useState } from 'react';
import './ColorSelector.scss';

function ColorSelector({ options, selected, onChange }) {
  const [hovered, setHovered] = useState(null);

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
