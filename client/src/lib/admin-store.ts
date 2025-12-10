import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = 'pending' | 'confirmed' | 'production' | 'ready' | 'sent' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  numero_pedido?: number;
  customerName: string;
  cliente_nome?: string;
  customerPhone: string;
  cliente_telefone?: string;
  items: string[];
  itens?: any[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  created_at?: string;
  paymentMethod: string;
  forma_pagamento?: string;
  viewed: boolean;
  viewed_?: boolean;
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
  loadOrdersFromAPI: () => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  markOrderAsViewed: (id: string) => void;
  getUnviewedOrdersCount: () => number;
}

// Mock Initial Orders (fallback apenas se API falhar)
const initialOrders: Order[] = [];

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),

      restaurantName: 'Wilson Pizzas',
      restaurantAddress: 'Av. Antônio Pedro da Silva, 555, Centro, Ouricuri-PE',
      restaurantPhone: '5587999480699',
      restaurantLogo: null as string | null,

      supabaseUrl: '',
      supabaseKey: '',

      webhookUrl: '',
      whatsappNotification: true,

      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),

      // ✅ Carregar pedidos do API
      orders: initialOrders,
      loadOrdersFromAPI: async () => {
        try {
          const response = await fetch('/api/pedidos');
          if (response.ok) {
            const apiOrders = await response.json();
            // Transformar dados do banco para formato do store
            const transformedOrders = (Array.isArray(apiOrders) ? apiOrders : []).map((order: any) => ({
              id: order.id,
              numero_pedido: order.numero_pedido,
              customerName: order.cliente_nome || 'Cliente',
              customerPhone: order.cliente_telefone || '',
              items: order.itens?.map((item: any) => 
                `${item.quantidade}x ${item.produto_nome}${item.tamanho ? ` (${item.tamanho})` : ''}`
              ) || [],
              total: parseFloat(order.total) || 0,
              status: order.status || 'pending',
              createdAt: order.created_at || new Date().toISOString(),
              paymentMethod: order.forma_pagamento || 'Indefinido',
              viewed: order.viewed || false
            }));
            set({ orders: transformedOrders });
            console.log(`✅ Carregados ${transformedOrders.length} pedidos da API`);
          }
        } catch (error) {
          console.error('Erro ao carregar pedidos da API:', error);
          // Continuar com orders existentes
        }
      },

      orders: initialOrders,
      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
      })),
      markOrderAsViewed: (id) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, viewed: true } : o)
      })),
      getUnviewedOrdersCount: (): number => {
        const state = get();
        return state.orders.filter((o: Order) => !o.viewed && o.status !== 'delivered' && o.status !== 'cancelled').length;
      },
    }),
    {
      name: 'admin-storage',
    }
  )
);
