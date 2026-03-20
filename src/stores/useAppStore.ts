import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/src/lib/supabase';

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
  fetchNotifications: () => Promise<void>;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  unreadCount: () => number;
  logActivity: (action: string, entityType: string, entityId?: string, details?: any) => Promise<void>;
}

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
      notifications: [],
      setActiveTab: (tab) => set({ activeTab: tab, mobileSidebarOpen: false }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setSearchOpen: (open) => set({ searchOpen: open }),
      setNotificationsOpen: (open) => set({ notificationsOpen: open }),
      setChatOpen: (open) => set({ chatOpen: open }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

      fetchNotifications: async () => {
        try {
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);
          if (error) throw error;
          if (data) {
            const mapped: Notification[] = data.map((n: any) => ({
              id: n.id,
              type: n.type || 'system',
              title: n.title,
              message: n.message || '',
              timestamp: n.created_at,
              read: n.read || false,
            }));
            set({ notifications: mapped });
          }
        } catch (err: any) {
          console.warn('Supabase notifications fetch failed:', err.message);
        }
      },

      addNotification: (n) => {
        const newNotif: Notification = {
          ...n,
          id: 'n-' + Date.now(),
          timestamp: new Date().toISOString(),
          read: false,
        };
        set((state) => ({
          notifications: [newNotif, ...state.notifications],
        }));
        // Also try to persist to Supabase
        supabase.from('notifications').insert({
          type: n.type,
          title: n.title,
          message: n.message,
          read: false,
        }).then(function(){}, function(){});
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
        supabase.from('notifications').update({ read: true }).eq('id', id).then(function(){}, function(){});
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
        supabase.from('notifications').update({ read: true }).neq('read', true).then(function(){}, function(){});
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
        supabase.from('notifications').delete().eq('id', id).then(function(){}, function(){});
      },

      unreadCount: () => get().notifications.filter((n) => !n.read).length,

      logActivity: async (action, entityType, entityId, details) => {
        try {
          await supabase.from('activity_log').insert({
            action,
            entity_type: entityType,
            entity_id: entityId || null,
            details: details || {},
          });
        } catch (err: any) {
          console.warn('Activity log failed:', err.message);
        }
      },
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
