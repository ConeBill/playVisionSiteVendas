
"use client"

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/domain/models/product';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => set((state) => {
        const existing = state.items.find((item) => item.id === product.id);
        const currentQuantity = existing ? existing.quantity : 0;
        const nextQuantity = Math.min(
          Math.max(quantity, 0),
          typeof product.stock === 'number' ? Math.max(product.stock - currentQuantity, 0) : quantity
        );

        if (nextQuantity <= 0) {
          return state;
        }

        if (existing) {
          return {
            items: state.items.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + nextQuantity } : item,
            ),
          };
        }

        return { items: [...state.items, { ...product, quantity: nextQuantity }] };
      }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          const item = state.items.find((item) => item.id === productId);
          const stock = item?.stock;
          const max = typeof stock === 'number' ? stock : quantity;

          return {
            items: state.items.map((item) =>
              item.id === productId
                ? { ...item, quantity: Math.min(Math.max(quantity, 1), max) }
                : item,
            ),
          };
        }),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      subtotal: () =>
        get().items.reduce((acc, item) => acc + (item.salePrice || item.price) * item.quantity, 0),
    }),
    {
      name: 'blush-ink-cart'
    }
  )
);
