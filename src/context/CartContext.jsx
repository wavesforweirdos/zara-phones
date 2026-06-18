import { createContext, useContext, useReducer, useEffect } from 'react';

const CART_KEY = 'zara_cart';

// item shape: { id, name, brand, imageUrl, color, storage, price, quantity }
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return action.payload;

    case 'ADD_ITEM': {
      const item = action.payload;
      const idx = state.findIndex(
        (i) => i.id === item.id && i.color === item.color && i.storage === item.storage
      );
      if (idx >= 0) {
        const next = [...state];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...state, { ...item, quantity: 1 }];
    }

    case 'REMOVE_ITEM': {
      const { id, color, storage } = action.payload;
      return state.filter(
        (i) => !(i.id === id && i.color === color && i.storage === storage)
      );
    }

    default:
      return state;
  }
};

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(stored) });
      }
    } catch {
      // corrupted storage — start empty
    }
  }, []);

  // Sync to localStorage on every change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, dispatch, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

export default CartContext;
