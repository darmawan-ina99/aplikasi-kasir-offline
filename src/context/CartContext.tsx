import React, { createContext, useContext, useState } from 'react';
import { CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const exists = prev.find(i => i.productId === item.productId);
      if (exists) {
        return prev.map(i => i.productId === item.productId
          ? { ...i, quantity: i.quantity + item.quantity, subtotal: (i.quantity + item.quantity) * i.price }
          : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string) => setItems(prev => prev.filter(i => i.productId !== productId));

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) return removeItem(productId);
    setItems(prev => prev.map(i => i.productId === productId
      ? { ...i, quantity: qty, subtotal: qty * i.price } : i
    ));
  };

  const clearCart = () => setItems([]);
  const total = items.reduce((sum, i) => sum + i.subtotal, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
