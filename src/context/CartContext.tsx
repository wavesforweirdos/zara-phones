import { createContext, useContext, useReducer, useEffect } from 'react';
import type { Dispatch, ReactNode } from 'react';
import type { CartAction, CartItem } from '../types/cart';

const CART_KEY = 'zara_cart';

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
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
      return state.filter((i) => !(i.id === id && i.color === color && i.storage === storage));
    }

    default:
      return state;
  }
};

interface CartContextValue {
  cart: CartItem[];
  dispatch: Dispatch<CartAction>;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

// Read synchronously as the reducer's initial state: hydrating in an effect let the sync
// effect below overwrite the stored cart with [] before it was loaded (seen under StrictMode)
const loadStoredCart = (): CartItem[] => {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    // corrupted storage — start empty
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, undefined, loadStoredCart);

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

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

export default CartContext;
