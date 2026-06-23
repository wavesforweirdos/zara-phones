import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';
import CartPage from './CartPage';

jest.mock('../../assets/close.svg', () => 'close-icon.svg');

const mockItem = {
  id: '1',
  name: 'Galaxy S24 Ultra',
  brand: 'Samsung',
  imageUrl: 'https://example.com/img.jpg',
  color: 'Violet Titanium',
  storage: '512 GB',
  price: 1199,
  quantity: 2, // total = 2398 EUR — distinct from item price line
};

function renderWithCart(cartItems = []) {
  localStorage.setItem('zara_cart', JSON.stringify(cartItems));
  return render(
    <MemoryRouter>
      <CartProvider>
        <CartPage />
      </CartProvider>
    </MemoryRouter>
  );
}

describe('CartPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('with empty cart shows CART (0) and the CONTINUE SHOPPING button', () => {
    renderWithCart([]);
    expect(screen.getByText('CART (0)')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /continue shopping/i })).toBeInTheDocument();
  });

  it('with items shows the phone name and the correct total', () => {
    renderWithCart([mockItem]);
    expect(screen.getByText('Galaxy S24 Ultra')).toBeInTheDocument();
    expect(screen.getByText('2398 EUR')).toBeInTheDocument(); // cartTotal = 1199 × 2
  });

  it('Eliminar button dispatches REMOVE_ITEM and removes the item', async () => {
    const user = userEvent.setup();
    renderWithCart([mockItem]);
    await user.click(screen.getByRole('button', { name: /eliminar/i }));
    expect(screen.queryByText('Galaxy S24 Ultra')).not.toBeInTheDocument();
  });
});
