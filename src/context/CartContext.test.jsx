import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from './CartContext';

const item1 = {
  id: '1',
  name: 'Phone A',
  brand: 'Brand A',
  imageUrl: '',
  color: 'Black',
  storage: '128GB',
  price: 500,
};

function TestConsumer() {
  const { cart, dispatch, cartCount, cartTotal } = useCart();
  return (
    <div>
      <span data-testid="count">{cartCount}</span>
      <span data-testid="total">{cartTotal}</span>
      {cart.map((item) => (
        <span key={`${item.id}-${item.color}-${item.storage}`} data-testid="cart-item">
          {item.name}
        </span>
      ))}
      <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: item1 })}>add</button>
      <button
        onClick={() =>
          dispatch({
            type: 'REMOVE_ITEM',
            payload: { id: item1.id, color: item1.color, storage: item1.storage },
          })
        }
      >
        remove
      </button>
    </div>
  );
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('ADD_ITEM adds an item to the cart', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );
    await user.click(screen.getByText('add'));
    expect(screen.getByTestId('cart-item')).toHaveTextContent('Phone A');
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('ADD_ITEM increments quantity if item already exists (same id+color+storage)', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );
    await user.click(screen.getByText('add'));
    await user.click(screen.getByText('add'));
    expect(screen.getAllByTestId('cart-item')).toHaveLength(1);
    expect(screen.getByTestId('count')).toHaveTextContent('2');
  });

  it('REMOVE_ITEM removes the item from the cart', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );
    await user.click(screen.getByText('add'));
    await user.click(screen.getByText('remove'));
    expect(screen.queryByTestId('cart-item')).not.toBeInTheDocument();
  });

  it('cartCount and cartTotal are calculated correctly', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );
    await user.click(screen.getByText('add'));
    await user.click(screen.getByText('add')); // quantity becomes 2
    expect(screen.getByTestId('count')).toHaveTextContent('2');
    expect(screen.getByTestId('total')).toHaveTextContent('1000'); // 500 × 2
  });
});
