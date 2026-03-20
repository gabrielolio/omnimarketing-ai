import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/src/lib/supabase';

export interface ContractData {
  id: string;
  client_id: string;
  client?: string; // legacy: client name for display
  service: string;
  amount: number | string;
  start_date: string;
  end_date: string;
  status: 'signed' | 'pending' | 'expired' | 'cancelled';
  description: string;
  terms: string;
  // legacy compat
  date?: string;
}

interface ContractsState {
  contracts: ContractData[];
  loading: boolean;
  error: string | null;
  fetchContracts: () => Promise<void>;
  add: (contract: Partial<ContractData>) => Promise<void>;
  update: (id: string, data: Partial<ContractData>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => ContractData | undefined;
}

export const useContractsStore = create<ContractsState>()(
  persist(
    (set, get) => ({
      contracts: [],
      loading: false,
      error: null,

      fetchContracts: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('contracts')
            .select('*, clients(name)')
            .order('created_at', { ascending: false });
          if (error) throw error;
          if (data) {
            const mapped = data.map((c: any) => ({
              ...c,
              client: c.clients?.name || 'N/A',
              date: c.start_date,
              amount: typeof c.amount === 'number' ? 'R$ ' + c.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : c.amount,
            }));
            set({ contracts: mapped, loading: false });
          }
        } catch (err: any) {
          console.warn('Supabase contracts fetch failed:', err.message);
          set({ loading: false, error: err.message });
        }
      },

      add: async (contract) => {
        try {
          const { data, error } = await supabase
            .from('contracts')
            .insert({
              client_id: contract.client_id,
              service: contract.service || '',
              amount: typeof contract.amount === 'string'
                ? parseFloat(contract.amount.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0
                : contract.amount || 0,
              start_date: contract.start_date || new Date().toISOString().substring(0, 10),
              end_date: contract.end_date,
              status: contract.status || 'pending',
              description: contract.description || '',
              terms: contract.terms || '',
            })
            .select('*, clients(name)')
            .single();
          if (error) throw error;
          if (data) {
            const mapped = {
              ...data,
              client: data.clients?.name || contract.client || 'N/A',
              date: data.start_date,
              amount: 'R$ ' + Number(data.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
            };
            set((state) => ({ contracts: [mapped, ...state.contracts] }));
          }
        } catch (err: any) {
          const newContract: ContractData = {
            id: 'CTR-' + Date.now(),
            client_id: contract.client_id || '',
            client: contract.client || '',
            service: contract.service || '',
            amount: contract.amount || 'R$ 0,00',
            start_date: contract.start_date || new Date().toISOString().substring(0, 10),
            end_date: contract.end_date || '',
            status: (contract.status as any) || 'pending',
            description: contract.description || '',
            terms: contract.terms || '',
            date: contract.start_date || new Date().toLocaleDateString('pt-BR'),
          };
          set((state) => ({ contracts: [newContract, ...state.contracts] }));
          console.warn('Added contract locally:', err.message);
        }
      },

      update: async (id, data) => {
        try {
          const updateData: any = { ...data };
          delete updateData.client;
          delete updateData.date;
          if (typeof updateData.amount === 'string') {
            updateData.amount = parseFloat(updateData.amount.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
          }
          const { error } = await supabase.from('contracts').update(updateData).eq('id', id);
          if (error) throw error;
        } catch (err: any) {
          console.warn('Supabase contract update failed:', err.message);
        }
        set((state) => ({
          contracts: state.contracts.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }));
      },

      remove: async (id) => {
        try {
          const { error } = await supabase.from('contracts').delete().eq('id', id);
          if (error) throw error;
        } catch (err: any) {
          console.warn('Supabase contract delete failed:', err.message);
        }
        set((state) => ({ contracts: state.contracts.filter((c) => c.id !== id) }));
      },

      getById: (id) => get().contracts.find((c) => c.id === id),
    }),
    { name: 'omni-contracts-store' }
  )
);
