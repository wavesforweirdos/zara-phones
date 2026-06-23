import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PhoneListPage from './PhoneListPage';

jest.mock('../../hooks/usePhones', () => jest.fn());
jest.mock('../../services/api', () => ({ fetchProductById: jest.fn() }));

import usePhones from '../../hooks/usePhones';
import { fetchProductById } from '../../services/api';

const mockPhones = [
  { id: '1', name: 'Galaxy S24', brand: 'Samsung', basePrice: 999, imageUrl: 'img1.jpg' },
  { id: '2', name: 'iPhone 15', brand: 'Apple', basePrice: 1099, imageUrl: 'img2.jpg' },
];

describe('PhoneListPage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });
  it('renderiza el SearchBar', () => {
    usePhones.mockReturnValue({ phones: mockPhones, loading: false, error: null });
    render(
      <MemoryRouter>
        <PhoneListPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('muestra el contador de resultados', () => {
    usePhones.mockReturnValue({ phones: mockPhones, loading: false, error: null });
    render(
      <MemoryRouter>
        <PhoneListPage />
      </MemoryRouter>
    );
    expect(screen.getByText('2 RESULTS')).toBeInTheDocument();
  });

  it('renderiza una PhoneCard por cada teléfono del mock', () => {
    usePhones.mockReturnValue({ phones: mockPhones, loading: false, error: null });
    render(
      <MemoryRouter>
        <PhoneListPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Galaxy S24')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
  });

  it('con loading: true muestra estado de carga', () => {
    usePhones.mockReturnValue({ phones: [], loading: true, error: null });
    render(
      <MemoryRouter>
        <PhoneListPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('con error muestra mensaje de error', () => {
    usePhones.mockReturnValue({ phones: [], loading: false, error: 'Network error' });
    render(
      <MemoryRouter>
        <PhoneListPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Error al cargar los teléfonos.')).toBeInTheDocument();
  });

  it('al seleccionar un color filtra los teléfonos y actualiza el contador', async () => {
    const user = userEvent.setup();

    // Phone 1 has Black, phone 2 has only White — only phone 1 should survive the filter
    fetchProductById
      .mockResolvedValueOnce({ id: '1', colorOptions: [{ name: 'Black', hexCode: '#000000' }] })
      .mockResolvedValueOnce({ id: '2', colorOptions: [{ name: 'White', hexCode: '#FFFFFF' }] });

    usePhones.mockReturnValue({ phones: mockPhones, loading: false, error: null });

    render(
      <MemoryRouter>
        <PhoneListPage />
      </MemoryRouter>
    );

    expect(screen.getByText('2 RESULTS')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Color: Black' }));

    await waitFor(() => {
      expect(screen.getByText('1 RESULTS')).toBeInTheDocument();
    });
  });

  it('usa el color map de sessionStorage sin llamar a fetch de nuevo', async () => {
    const user = userEvent.setup();
    fetchProductById.mockClear();

    // Pre-load the color map so the useEffect reads cache instead of fetching
    const cachedMap = [
      ['1', ['#000000']], // phone 1 → Black
      ['2', ['#FFFFFF']], // phone 2 → White
    ];
    sessionStorage.setItem('phone_color_map', JSON.stringify(cachedMap));

    usePhones.mockReturnValue({ phones: mockPhones, loading: false, error: null });

    render(
      <MemoryRouter>
        <PhoneListPage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Color: Black' }));

    await waitFor(() => {
      expect(screen.getByText('1 RESULTS')).toBeInTheDocument();
    });

    expect(fetchProductById).not.toHaveBeenCalled();
  });
});
