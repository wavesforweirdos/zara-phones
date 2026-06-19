import './ColorSelector.scss';

function ColorSelector({ options, selected, onChange }) {
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
            />
          );
        })}
      </div>
      {selected && <p className="color-selector__name">{selected.name}</p>}
    </div>
  );
}

export default ColorSelector;
