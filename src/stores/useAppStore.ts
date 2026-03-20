import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TabId = 'dashboard' | 'calendar' | 'automations' | 'agents' | 'contracts' | 'clients' | 'settings' | 'pipeline' | 'reports';

export interface Notification {
  id: string;
  type: 'automation' | 'lead' | 'contract' | 'agent' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface AppState {
  activeTab: TabId;
  searchQuery: string;
  searchOpen: boolean;
  notificationsOpen: boolean;
  chatOpen: boolean;
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  notifications: Notification[];
  setActiveTab: (tab: TabId) => void;
  setSearchQuery: (q: string) => void;
  setSearchOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  setChatOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  unreadCount: () => number;
}

const initialNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'automation',
    title: 'Automacao executada',
    message: 'Welcome DM enviou 45 mensagens nas ultimas 2 horas.',
    timestamp: '2026-03-19T10:30:00',
    read: false,
  },
  {
    id: 'n2',
    type: 'contract',
    title: 'Contrato assinado',
    message: 'TechFlow Solutions assinou o contrato CTR-2026-001.',
    timestamp: '2026-03-19T09:15:00',
    read: false,
  },
  {
    id: 'n3',
    type: 'lead',
    title: 'Novo lead qualificado',
    message: 'Ana Paula demonstrou interesse via Instagram DM.',
    timestamp: '2026-03-19T08:00:00',
    read: false,
  },
  {
    id: 'n4',
    type: 'agent',
    title: 'Treinamento concluido',
    message: 'Agente Vendas Pro finalizou re-treinamento com 94% precisao.',
    timestamp: '2026-03-18T22:00:00',
    read: true,
  },
  {
    id: 'n5',
    type: 'system',
    title: 'Atualizacao do sistema',
    message: 'Nova versao do OmniMarketing disponivel.',
    timestamp: '2026-03-18T18:00:00',
    read: true,
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeTab: 'dashboard',
      searchQuery: '',
      searchOpen: false,
      notificationsOpen: false,
      chatOpen: false,
      sidebarOpen: true,
      mobileSidebarOpen: false,
      notifications: initialNotifications,
      setActiveTab: (tab) => set({ activeTab: tab, mobileSidebarOpen: false }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setSearchOpen: (open) => set({ searchOpen: open }),
      setNotificationsOpen: (open) => set({ notificationsOpen: open }),
      setChatOpen: (open) => set({ chatOpen: open }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
      addNotification: (n) => set((state) => ({
        notifications: [
          {
            ...n,
            id: `n-${Date.now()}`,
            timestamp: new Date().toISOString(),
            read: false,
          },
          ...state.notifications,
        ],
      })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      })),
      deleteNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),
      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    {
      name: 'omni-app-store',
      partialize: (state) => ({
        notifications: state.notifications,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
