import { create } from 'zustand';
import { PizzaFlavor, Size, MENU_ITEMS } from '@/data/menu';

export interface CartItem {
  id: string; // Unique ID for cart item
  size: Size;
  flavors: PizzaFlavor[];
  quantity: number;
  price: number;
  notes?: string;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  isBuilderOpen: boolean;
  currentBuilderItem: PizzaFlavor | null; // The pizza that started the build
  
  // Actions
  openBuilder: (flavor: PizzaFlavor) => void;
  closeBuilder: () => void;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  toggleCart: (isOpen?: boolean) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isCartOpen: false,
  isBuilderOpen: false,
  currentBuilderItem: null,

  openBuilder: (flavor) => set({ isBuilderOpen: true, currentBuilderItem: flavor }),
  closeBuilder: () => set({ isBuilderOpen: false, currentBuilderItem: null }),

  addToCart: (item) => set((state) => {
    const id = Math.random().toString(36).substring(7);
    return { 
      items: [...state.items, { ...item, id }],
      isBuilderOpen: false,
      currentBuilderItem: null,
      isCartOpen: true // Auto open cart to show confirmation
    };
  }),

  removeFromCart: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),

  updateQuantity: (id, delta) => set((state) => ({
    items: state.items.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }),
  })),

  clearCart: () => set({ items: [] }),
  
  toggleCart: (isOpen) => set((state) => ({ 
    isCartOpen: isOpen !== undefined ? isOpen : !state.isCartOpen 
  })),
}));
