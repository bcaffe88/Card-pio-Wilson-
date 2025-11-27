import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = 'pending' | 'confirmed' | 'production' | 'ready' | 'sent' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: string[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  paymentMethod: string;
}

interface AdminState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;

  // Settings
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone: string;
  restaurantLogo: string | null;
  
  supabaseUrl: string;
  supabaseKey: string;
  
  webhookUrl: string;
  whatsappNotification: boolean;

  updateSettings: (settings: Partial<AdminState>) => void;

  // Orders
  orders: Order[];
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

// Mock Initial Orders
const initialOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'João Silva',
    customerPhone: '5587999999999',
    items: ['1x Pizza G Calabresa', '1x Pizza M Frango c/ Catupiry'],
    total: 89.00,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    paymentMethod: 'Pix'
  },
  {
    id: 'ORD-002',
    customerName: 'Maria Oliveira',
    customerPhone: '5587988888888',
    items: ['1x Pizza Super 4 Queijos'],
    total: 72.00,
    status: 'production',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    paymentMethod: 'Cartão'
  },
  {
    id: 'ORD-003',
    customerName: 'Pedro Santos',
    customerPhone: '5587977777777',
    items: ['2x Pizza P Portuguesa'],
    total: 60.00,
    status: 'ready',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    paymentMethod: 'Dinheiro'
  }
];

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),

      restaurantName: 'Wilson Pizza',
      restaurantAddress: 'Rua Principal, 123, Centro',
      restaurantPhone: '5587999480699',
      restaurantLogo: null,

      supabaseUrl: '',
      supabaseKey: '',

      webhookUrl: '',
      whatsappNotification: true,

      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),

      orders: initialOrders,
      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
      })),
    }),
    {
      name: 'admin-storage',
    }
  )
);
