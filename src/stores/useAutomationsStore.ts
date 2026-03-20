import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/src/lib/supabase';

export interface AutomationData {
  id: string;
  client_id?: string;
  name: string;
  type: 'instagram' | 'website' | 'whatsapp' | 'general';
  status: 'active' | 'paused' | 'draft';
  lastRun: string;
  last_run?: string;
  runs: number;
  runs_count?: number;
  description: string;
  successRate: number;
  success_rate?: number;
}

export interface BuilderStep {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  title: string;
  subtitle: string;
  color: 'emerald' | 'amber' | 'blue' | 'pink';
  iconType: 'zap' | 'filter' | 'bot' | 'instagram' | 'globe' | 'clock' | 'share' | 'save';
}

interface AutomationsState {
  automations: AutomationData[];
  builderSteps: BuilderStep[];
  loading: boolean;
  error: string | null;
  fetchAutomations: () => Promise<void>;
  add: (automation: Partial<AutomationData>) => Promise<void>;
  update: (id: string, data: Partial<AutomationData>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => AutomationData | undefined;
  toggleStatus: (id: string) => Promise<void>;
  setBuilderSteps: (steps: BuilderStep[]) => void;
  addBuilderStep: (step: Omit<BuilderStep, 'id'>) => void;
  removeBuilderStep: (id: string) => void;
  resetBuilder: () => void;
}

const defaultBuilderSteps: BuilderStep[] = [
  { id: 'bs-1', type: 'trigger', title: 'Gatilho (Trigger)', subtitle: 'Novo Comentario no Instagram', color: 'emerald', iconType: 'zap' },
  { id: 'bs-2', type: 'condition', title: 'Condicao (Filter)', subtitle: 'Contem "QUERO"', color: 'amber', iconType: 'filter' },
  { id: 'bs-3', type: 'action', title: 'Acao IA (Action)', subtitle: 'Responder com Gemini', color: 'blue', iconType: 'bot' },
];

function formatLastRun(lastRun: string | null): string {
  if (!lastRun) return 'Nunca executado';
  const diff = Date.now() - new Date(lastRun).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return 'Ha ' + mins + ' minutos';
  const hours = Math.floor(mins / 60);
  if (hours < 24) return 'Ha ' + hours + ' horas';
  return 'Ha ' + Math.floor(hours / 24) + ' dias';
}

export const useAutomationsStore = create<AutomationsState>()(
  persist(
    (set, get) => ({
      automations: [],
      builderSteps: defaultBuilderSteps,
      loading: false,
      error: null,

      fetchAutomations: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('automations')
            .select('*')
            .order('created_at', { ascending: false });
          if (error) throw error;
          if (data) {
            const mapped = data.map((a: any) => ({
              ...a,
              lastRun: formatLastRun(a.last_run),
              runs: a.runs_count || 0,
              successRate: Number(a.success_rate) || 0,
            }));
            set({ automations: mapped, loading: false });
          }
        } catch (err: any) {
          console.warn('Supabase automations fetch failed:', err.message);
          set({ loading: false, error: err.message });
        }
      },

      add: async (automation) => {
        try {
          const { data, error } = await supabase
            .from('automations')
            .insert({
              client_id: automation.client_id,
              name: automation.name || '',
              type: automation.type || 'general',
              status: automation.status || 'draft',
              description: automation.description || '',
              runs_count: 0,
              success_rate: 0,
            })
            .select()
            .single();
          if (error) throw error;
          if (data) {
            set((state) => ({
              automations: [{ ...data, lastRun: 'Nunca executado', runs: 0, successRate: 0 }, ...state.automations],
            }));
          }
        } catch (err: any) {
          const newAuto: AutomationData = {
            id: 'auto-' + Date.now(),
            name: automation.name || '',
            type: (automation.type as any) || 'general',
            status: (automation.status as any) || 'draft',
            lastRun: 'Nunca executado',
            runs: 0,
            description: automation.description || '',
            successRate: 0,
          };
          set((state) => ({ automations: [newAuto, ...state.automations] }));
        }
      },

      update: async (id, data) => {
        try {
          const { error } = await supabase.from('automations').update(data).eq('id', id);
          if (error) throw error;
        } catch (err: any) {
          console.warn('Supabase automation update failed:', err.message);
        }
        set((state) => ({
          automations: state.automations.map((a) => (a.id === id ? { ...a, ...data } : a)),
        }));
      },

      remove: async (id) => {
        try {
          const { error } = await supabase.from('automations').delete().eq('id', id);
          if (error) throw error;
        } catch (err: any) {
          console.warn('Supabase automation delete failed:', err.message);
        }
        set((state) => ({ automations: state.automations.filter((a) => a.id !== id) }));
      },

      getById: (id) => get().automations.find((a) => a.id === id),

      toggleStatus: async (id) => {
        const auto = get().automations.find((a) => a.id === id);
        if (!auto) return;
        const newStatus = auto.status === 'active' ? 'paused' : 'active';
        try {
          const { error } = await supabase.from('automations').update({ status: newStatus }).eq('id', id);
          if (error) throw error;
        } catch (err: any) {
          console.warn('Supabase toggle failed:', err.message);
        }
        set((state) => ({
          automations: state.automations.map((a) =>
            a.id === id ? { ...a, status: newStatus } : a
          ),
        }));
        // Cross-module: notify on status change
        try {
          const { useAppStore } = await import('./useAppStore');
          useAppStore.getState().addNotification({
            type: 'automation',
            title: 'Automacao ' + (newStatus === 'active' ? 'ativada' : 'pausada'),
            message: auto.name + ' foi ' + (newStatus === 'active' ? 'ativada' : 'pausada') + '.',
          });
        } catch {}
      },

      setBuilderSteps: (steps) => set({ builderSteps: steps }),
      addBuilderStep: (step) =>
        set((state) => ({
          builderSteps: [...state.builderSteps, { ...step, id: 'bs-' + Date.now() }],
        })),
      removeBuilderStep: (id) =>
        set((state) => ({
          builderSteps: state.builderSteps.filter((s) => s.id !== id),
        })),
      resetBuilder: () => set({ builderSteps: defaultBuilderSteps }),
    }),
    { name: 'omni-automations-store' }
  )
);
