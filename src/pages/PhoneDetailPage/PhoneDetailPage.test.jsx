import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PhoneDetailPage from './PhoneDetailPage';

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

jest.mock('../../hooks/usePhone', () => jest.fn());
jest.mock('../../context/CartContext', () => ({
  useCart: () => ({ dispatch: mockDispatch }),
}));

import usePhone from '../../hooks/usePhone';

const mockPhone = {
  id: '1',
  name: 'Galaxy S24 Ultra',
  brand: 'Samsung',
  basePrice: 1299,
  description: 'Flagship smartphone',
  colorOptions: [
    { name: 'Titanium Black', hexCode: '#000000', imageUrl: 'black.jpg' },
    { name: 'Titanium Gray', hexCode: '#808080', imageUrl: 'gray.jpg' },
  ],
  storageOptions: [
    { capacity: '256 GB', price: 1299 },
    { capacity: '512 GB', price: 1419 },
  ],
  specs: {
    screen: '6.8"',
    resolution: '3088x1440',
    processor: 'Snapdragon 8 Gen 3',
    mainCamera: '200 MP',
    selfieCamera: '12 MP',
    battery: '5000 mAh',
    os: 'Android 14',
    screenRefreshRate: '120 Hz',
  },
  similarProducts: [
    { id: '2', name: 'Pixel 8', brand: 'Google', basePrice: 799, imageUrl: 'pixel.jpg' },
  ],
};

describe('PhoneDetailPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockDispatch.mockClear();
    usePhone.mockReturnValue({ phone: mockPhone, loading: false, error: null });
  });

  it('renderiza el nombre del teléfono', () => {
    render(
      <MemoryRouter>
        <PhoneDetailPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Galaxy S24 Ultra');
  });

  it('renderiza la marca del teléfono', () => {
    render(
      <MemoryRouter>
        <PhoneDetailPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Samsung')).toBeInTheDocument();
  });

  it('el botón AÑADIR está deshabilitado sin selección de color y storage', () => {
    render(
      <MemoryRouter>
        <PhoneDetailPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: 'AÑADIR' })).toBeDisabled();
  });

  it('el botón AÑADIR se habilita al seleccionar storage y color', () => {
    render(
      <MemoryRouter>
        <PhoneDetailPage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('radio', { name: '256 GB' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Color: Titanium Black' }));
    expect(screen.getByRole('button', { name: 'AÑADIR' })).not.toBeDisabled();
  });

  it('al hacer clic en AÑADIR despacha ADD_ITEM y navega a /', () => {
    render(
      <MemoryRouter>
        <PhoneDetailPage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('radio', { name: '256 GB' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Color: Titanium Black' }));
    fireEvent.click(screen.getByRole('button', { name: 'AÑADIR' }));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ADD_ITEM',
      payload: expect.objectContaining({
        id: '1',
        name: 'Galaxy S24 Ultra',
        brand: 'Samsung',
        storage: '256 GB',
        color: 'Titanium Black',
        price: 1299,
        imageUrl: 'black.jpg',
      }),
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renderiza SpecsTable con las especificaciones', () => {
    render(
      <MemoryRouter>
        <PhoneDetailPage />
      </MemoryRouter>
    );
    expect(screen.getByText('SPECIFICATIONS')).toBeInTheDocument();
    expect(screen.getByText('Snapdragon 8 Gen 3')).toBeInTheDocument();
  });

  it('renderiza SimilarPhones', () => {
    render(
      <MemoryRouter>
        <PhoneDetailPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Similar items')).toBeInTheDocument();
    expect(screen.getByText('Pixel 8')).toBeInTheDocument();
  });

  it('con loading: true muestra estado de carga', () => {
    usePhone.mockReturnValue({ phone: null, loading: true, error: null });
    render(
      <MemoryRouter>
        <PhoneDetailPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('con error muestra mensaje de error en pantalla', () => {
    usePhone.mockReturnValue({ phone: null, loading: false, error: 'Not found' });
    render(
      <MemoryRouter>
        <PhoneDetailPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Error al cargar el teléfono.')).toBeInTheDocument();
  });

  it('el botón de volver llama a navigate(-1) cuando hay historial previo', () => {
    window.history.pushState({}, '', '/previous');
    window.history.pushState({}, '', '/current');
    render(
      <MemoryRouter>
        <PhoneDetailPage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: 'BACK' }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('con phone null y loading false el componente no renderiza contenido', () => {
    usePhone.mockReturnValue({ phone: null, loading: false, error: null });
    const { container } = render(
      <MemoryRouter>
        <PhoneDetailPage />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('el botón de volver navega a / cuando window.history no tiene historial previo', () => {
    const historySpy = jest.spyOn(window, 'history', 'get').mockReturnValue({ length: 1 });
    render(
      <MemoryRouter>
        <PhoneDetailPage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: 'BACK' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
    historySpy.mockRestore();
  });
});
