import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

jest.mock('../../assets/close.svg', () => 'close-icon.svg');

const defaultProps = {
  value: '',
  onChange: jest.fn(),
  count: 20,
};

describe('SearchBar', () => {
  it('renders the input', () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('does not show the clear button when input is empty', () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.queryByLabelText('Limpiar búsqueda')).not.toBeInTheDocument();
  });

  it('shows the clear button when input has a value and clears on click', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<SearchBar {...defaultProps} value="samsung" onChange={onChange} />);
    const clearBtn = screen.getByLabelText('Limpiar búsqueda');
    expect(clearBtn).toBeInTheDocument();
    await user.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith('');
  });
});

const colorFilterOptions = [
  { name: 'Black', hexCode: '#000000' },
  { name: 'Azul', hexCode: '#0000FF' },
];

describe('SearchBar — filtro de color', () => {
  it('al hacer clic en FILTRAR el botón pasa a aria-expanded true', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        {...defaultProps}
        colorOptions={colorFilterOptions}
        colorFilter={[]}
        onColorFilter={jest.fn()}
      />
    );
    const filterBtn = screen.getByRole('button', { name: 'FILTRAR' });
    expect(filterBtn).toHaveAttribute('aria-expanded', 'false');
    await user.click(filterBtn);
    expect(screen.getByRole('button', { name: 'CERRAR' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('al hacer clic en un color llama a onColorFilter con el nombre correcto', async () => {
    const user = userEvent.setup();
    const onColorFilter = jest.fn();
    render(
      <SearchBar
        {...defaultProps}
        colorOptions={colorFilterOptions}
        colorFilter={[]}
        onColorFilter={onColorFilter}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Color: Black' }));
    expect(onColorFilter).toHaveBeenCalledWith(['Black']);
  });

  it('al hacer clic en CERRAR el botón vuelve a mostrar FILTRAR', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        {...defaultProps}
        colorOptions={colorFilterOptions}
        colorFilter={[]}
        onColorFilter={jest.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: 'FILTRAR' }));
    await user.click(screen.getByRole('button', { name: 'CERRAR' }));
    expect(screen.getByRole('button', { name: 'FILTRAR' })).toBeInTheDocument();
  });

  it('al abrir el panel, la sección recibe la clase search-bar--filter-open', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        {...defaultProps}
        colorOptions={colorFilterOptions}
        colorFilter={[]}
        onColorFilter={jest.fn()}
      />
    );
    const section = screen.getByRole('region', { name: 'Buscador de smartphones' });
    expect(section).not.toHaveClass('search-bar--filter-open');
    await user.click(screen.getByRole('button', { name: 'FILTRAR' }));
    expect(section).toHaveClass('search-bar--filter-open');
  });

  it('al cerrar el panel, la sección pierde la clase search-bar--filter-open', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        {...defaultProps}
        colorOptions={colorFilterOptions}
        colorFilter={[]}
        onColorFilter={jest.fn()}
      />
    );
    const section = screen.getByRole('region', { name: 'Buscador de smartphones' });
    await user.click(screen.getByRole('button', { name: 'FILTRAR' }));
    expect(section).toHaveClass('search-bar--filter-open');
    await user.click(screen.getByRole('button', { name: 'CERRAR' }));
    expect(section).not.toHaveClass('search-bar--filter-open');
  });

  it('con un color activo, el botón de limpiar filtros llama a onColorFilter([]) y detiene la propagación', async () => {
    const user = userEvent.setup();
    const onColorFilter = jest.fn();
    const parentClick = jest.fn();
    render(
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div onClick={parentClick}>
        <SearchBar
          {...defaultProps}
          colorOptions={colorFilterOptions}
          colorFilter={['Black']}
          onColorFilter={onColorFilter}
        />
      </div>
    );
    const clearBtn = screen.getByRole('button', { name: 'Limpiar filtros de color' });
    expect(clearBtn).toBeInTheDocument();
    await user.click(clearBtn);
    expect(onColorFilter).toHaveBeenCalledWith([]);
    expect(parentClick).not.toHaveBeenCalled();
  });
});
