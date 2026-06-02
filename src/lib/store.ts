import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'ADMIN' | 'CLIENT';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export type OrderStatus = 'En attente' | 'Partiellement payé' | 'Payé' | 'En préparation' | 'Livré' | 'Annulé';
export type BagWeight = '10kg' | '25kg' | '50kg';

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  bags: number;
  weight: BagWeight;
  type: 'Livraison' | 'Retrait';
  date: string;
  totalPrice: number;
  deposit: number;
  status: OrderStatus;
  createdAt: string;
}

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
  type: 'PRODUCT' | 'MATERIAL';
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
}

interface AppState {
  user: User | null;
  orders: Order[];
  stocks: StockItem[];
  logs: ActivityLog[];
  setUser: (user: User | null) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  updateStock: (id: string, quantityChange: number) => void;
  addLog: (action: string) => void;
  logout: () => void;
}

const initialStocks: StockItem[] = [
  { id: 'charcoal-10', name: 'Sacs 10kg', quantity: 15, unit: 'Sacs', threshold: 10, type: 'PRODUCT' },
  { id: 'charcoal-25', name: 'Sacs 25kg', quantity: 8, unit: 'Sacs', threshold: 10, type: 'PRODUCT' },
  { id: 'charcoal-50', name: 'Sacs 50kg', quantity: 20, unit: 'Sacs', threshold: 10, type: 'PRODUCT' },
  { id: 'mat-wood', name: 'Bois (Matière)', quantity: 100, unit: 'kg', threshold: 50, type: 'MATERIAL' },
  { id: 'mat-bags', name: 'Sacs Écologiques', quantity: 200, unit: 'Unités', threshold: 50, type: 'MATERIAL' },
  { id: 'mat-labels', name: 'Étiquettes', quantity: 500, unit: 'Unités', threshold: 100, type: 'MATERIAL' },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      orders: [],
      stocks: initialStocks,
      logs: [],
      setUser: (user) => set({ user }),
      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }));
        get().addLog(`Nouvelle commande créée: ${order.id}`);
      },
      updateOrder: (id, updates) => set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
      })),
      updateStock: (id, quantityChange) => set((state) => ({
        stocks: state.stocks.map((s) => (s.id === id ? { ...s, quantity: Math.max(0, s.quantity + quantityChange) } : s)),
      })),
      addLog: (action) => set((state) => ({
        logs: [
          {
            id: Math.random().toString(36).substr(2, 9),
            userId: state.user?.id || 'system',
            userName: state.user?.name || 'Système',
            action,
            timestamp: new Date().toISOString(),
          },
          ...state.logs,
        ],
      })),
      logout: () => set({ user: null }),
    }),
    { name: 'smartbraise-storage' }
  )
);