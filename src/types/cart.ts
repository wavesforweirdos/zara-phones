export interface CartItem {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  color: string;
  storage: string;
  price: number;
  quantity: number;
}

// A cart line is identified by the product and the chosen variant
export type CartItemKey = Pick<CartItem, 'id' | 'color' | 'storage'>;

export type CartAction =
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: CartItemKey };
