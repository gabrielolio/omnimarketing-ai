import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/src/lib/supabase';
import { toast } from 'sonner';

export interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url: string;
  status: 'active' | 'inactive';
  health: 'green' | 'yellow' | 'red';
  instagram: string;
  city: string;
  state: string;
  contact_name: string;
  notes: string;
  joined_at: string;
  // legacy compat
  avatar?: string;
  projects?: number;
  revenue?: string;
  joined?: string;
  lastActive?: string;
}

interface ClientsState {
  clients: ClientData[];
  loading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  add: (client: Partial<ClientData>) => Promise<void>;
  update: (id: string, data: Partial<ClientData>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => ClientData | undefined;
}

export const useClientsStore = create<ClientsState>()(
  persist(
    (set, get) => ({
      clients: [],
      loading: false,
      error: null,

      fetchClients: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });
          if (error) throw error;
          if (data) set({ clients: data, loading: false });
        } catch (err: any) {
          console.warn('Supabase fetch failed, using local data:', err.message);
          set({ loading: false, error: err.message });
        }
      },

      add: async (client) => {
        try {
          const { data, error } = await supabase
            .from('clients')
            .insert({
              name: client.name || '',
              email: client.email || '',
              phone: client.phone || '',
              avatar_url: client.avatar_url || client.avatar || 'https://picsum.photos/seed/' + Date.now() + '/100/100',
              status: client.status || 'active',
              health: client.health || 'green',
              instagram: client.instagram || '',
              city: client.city || '',
              state: client.state || '',
              contact_name: client.contact_name || '',
              notes: client.notes || '',
            })
            .select()
            .single();
          if (error) throw error;
          if (data) {
            set((state) => ({ clients: [data, ...state.clients] }));
          }
        } catch (err: any) {
          // Fallback: add locally
          const newClient: ClientData = {
            id: 'cli-' + Date.now(),
            name: client.name || '',
            email: client.email || '',
            phone: client.phone || '',
            avatar_url: client.avatar_url || client.avatar || 'https://picsum.photos/seed/' + Date.now() + '/100/100',
            status: (client.status as any) || 'active',
            health: (client.health as any) || 'green',
            instagram: client.instagram || '',
            city: client.city || '',
            state: client.state || '',
            contact_name: client.contact_name || '',
            notes: client.notes || '',
            joined_at: new Date().toISOString(),
          };
          set((state) => ({ clients: [newClient, ...state.clients] }));
          console.warn('Added client locally:', err.message);
        }
      },

      update: async (id, data) => {
        try {
          const { error } = await supabase.from('clients').update(data).eq('id', id);
          if (error) throw error;
        } catch (err: any) {
          console.warn('Supabase update failed, updating locally:', err.message);
        }
        set((state) => ({
          clients: state.clients.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }));
      },

      remove: async (id) => {
        try {
          const { error } = await supabase.from('clients').delete().eq('id', id);
          if (error) throw error;
        } catch (err: any) {
          console.warn('Supabase delete failed, removing locally:', err.message);
        }
        set((state) => ({ clients: state.clients.filter((c) => c.id !== id) }));
      },

      getById: (id) => get().clients.find((c) => c.id === id),
    }),
    { name: 'omni-clients-store' }
  )
);
