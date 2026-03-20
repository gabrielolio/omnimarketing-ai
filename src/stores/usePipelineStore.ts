import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/src/lib/supabase';

export type PipelineColumn = 'novo' | 'qualificado' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';

const stageToColumn: Record<string, PipelineColumn> = {
  new: 'novo', qualified: 'qualificado', proposal: 'proposta',
  negotiation: 'negociacao', closed: 'fechado', lost: 'perdido',
};
const columnToStage: Record<PipelineColumn, string> = {
  novo: 'new', qualificado: 'qualified', proposta: 'proposal',
  negociacao: 'negotiation', fechado: 'closed', perdido: 'lost',
};

export interface LeadData {
  id: string;
  client_id?: string;
  name: string;
  value: string;
  date: string;
  lastContact: string;
  last_contact?: string;
  email: string;
  contact?: string;
  column: PipelineColumn;
  source?: string;
}

interface PipelineState {
  leads: LeadData[];
  loading: boolean;
  error: string | null;
  fetchLeads: () => Promise<void>;
  add: (lead: Partial<LeadData>) => Promise<void>;
  update: (id: string, data: Partial<LeadData>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => LeadData | undefined;
  moveToColumn: (id: string, column: PipelineColumn) => Promise<void>;
}

function formatLastContact(ts: string | null): string {
  if (!ts) return 'N/A';
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return 'Ha ' + mins + ' min';
  const hours = Math.floor(mins / 60);
  if (hours < 24) return 'Ha ' + hours + ' horas';
  const days = Math.floor(hours / 24);
  if (days < 7) return 'Ha ' + days + ' dias';
  return 'Ha ' + Math.floor(days / 7) + ' semanas';
}

export const usePipelineStore = create<PipelineState>()(
  persist(
    (set, get) => ({
      leads: [],
      loading: false,
      error: null,

      fetchLeads: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('pipeline_leads')
            .select('*')
            .order('created_at', { ascending: false });
          if (error) throw error;
          if (data) {
            const mapped = data.map((l: any) => ({
              ...l,
              value: 'R$ ' + Number(l.value).toLocaleString('pt-BR'),
              date: l.created_at?.substring(0, 10) || '',
              lastContact: formatLastContact(l.last_contact),
              email: l.contact || '',
              column: stageToColumn[l.stage] || 'novo',
            }));
            set({ leads: mapped, loading: false });
          }
        } catch (err: any) {
          console.warn('Supabase leads fetch failed:', err.message);
          set({ loading: false, error: err.message });
        }
      },

      add: async (lead) => {
        try {
          const numValue = typeof lead.value === 'string'
            ? parseFloat(lead.value.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0
            : Number(lead.value) || 0;
          const { data, error } = await supabase
            .from('pipeline_leads')
            .insert({
              client_id: lead.client_id,
              name: lead.name || '',
              value: numValue,
              stage: columnToStage[lead.column || 'novo'] || 'new',
              contact: lead.email || lead.contact || '',
              source: lead.source || '',
            })
            .select()
            .single();
          if (error) throw error;
          if (data) {
            const mapped = {
              ...data,
              value: 'R$ ' + Number(data.value).toLocaleString('pt-BR'),
              date: data.created_at?.substring(0, 10) || '',
              lastContact: 'Agora',
              email: data.contact || '',
              column: stageToColumn[data.stage] || 'novo',
            };
            set((state) => ({ leads: [mapped, ...state.leads] }));
          }
        } catch (err: any) {
          const val = lead.value && !String(lead.value).startsWith('R$') ? 'R$ ' + lead.value : lead.value || 'R$ 0';
          const newLead: LeadData = {
            id: 'lead-' + Date.now(),
            name: lead.name || '',
            value: String(val),
            email: lead.email || '',
            date: new Date().toISOString().substring(0, 10),
            lastContact: 'Agora',
            column: lead.column || 'novo',
          };
          set((state) => ({ leads: [newLead, ...state.leads] }));
        }
      },

      update: async (id, data) => {
        try {
          const { error } = await supabase.from('pipeline_leads').update(data).eq('id', id);
          if (error) throw error;
        } catch (err: any) {
          console.warn('Supabase lead update failed:', err.message);
        }
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, ...data } : l)),
        }));
      },

      remove: async (id) => {
        try {
          const { error } = await supabase.from('pipeline_leads').delete().eq('id', id);
          if (error) throw error;
        } catch (err: any) {
          console.warn('Supabase lead delete failed:', err.message);
        }
        set((state) => ({ leads: state.leads.filter((l) => l.id !== id) }));
      },

      getById: (id) => get().leads.find((l) => l.id === id),

      moveToColumn: async (id, column) => {
        try {
          const stage = columnToStage[column] || 'new';
          const { error } = await supabase.from('pipeline_leads').update({ stage }).eq('id', id);
          if (error) throw error;
        } catch (err: any) {
          console.warn('Supabase lead move failed:', err.message);
        }
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, column } : l)),
        }));
      },
    }),
    { name: 'omni-pipeline-store' }
  )
);
