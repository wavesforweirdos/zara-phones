import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';
import Navbar from './Navbar';

function renderNavbar(cartItems = [], path = '/') {
  localStorage.setItem('zara_cart', JSON.stringify(cartItems));
  return render(
    <MemoryRouter initialEntries={[path]}>
      <CartProvider>
        <Navbar />
      </CartProvider>
    </MemoryRouter>
  );
}

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the logo', () => {
    renderNavbar();
    expect(screen.getByAltText('Zara Challenge')).toBeInTheDocument();
  });

  it('badge shows 0 when cart is empty', () => {
    renderNavbar([]);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('badge shows the correct count when there are items in the cart', () => {
    const items = [
      {
        id: '1',
        name: 'Galaxy S24 Ultra',
        brand: 'Samsung',
        imageUrl: '',
        color: 'Black',
        storage: '512 GB',
        price: 1199,
        quantity: 3,
      },
    ];
    renderNavbar(items);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
