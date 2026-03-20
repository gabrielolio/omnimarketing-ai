import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AutomationData {
  id: string;
  name: string;
  type: 'instagram' | 'website' | 'general';
  status: 'active' | 'paused' | 'draft';
  lastRun: string;
  runs: number;
  description: string;
  successRate: number;
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
  add: (automation: Omit<AutomationData, 'id'>) => void;
  update: (id: string, data: Partial<AutomationData>) => void;
  remove: (id: string) => void;
  getById: (id: string) => AutomationData | undefined;
  toggleStatus: (id: string) => void;
  setBuilderSteps: (steps: BuilderStep[]) => void;
  addBuilderStep: (step: Omit<BuilderStep, 'id'>) => void;
  removeBuilderStep: (id: string) => void;
  resetBuilder: () => void;
}

const initialAutomations: AutomationData[] = [
  {
    id: 'auto-1',
    name: 'Auto-Reply Welcome DM',
    type: 'instagram',
    status: 'active',
    lastRun: 'Ha 5 minutos',
    runs: 1240,
    description: 'Envia uma mensagem de boas-vindas para novos seguidores.',
    successRate: 99.2,
  },
  {
    id: 'auto-2',
    name: 'Website Context Sync',
    type: 'website',
    status: 'active',
    lastRun: 'Ha 2 horas',
    runs: 450,
    description: 'Alimenta o agente de IA com novos dados do blog automaticamente.',
    successRate: 99.8,
  },
  {
    id: 'auto-3',
    name: 'Lead Capture Instagram',
    type: 'instagram',
    status: 'paused',
    lastRun: 'Ha 1 dia',
    runs: 89,
    description: 'Captura e-mails de usuarios que comentam "QUERO" nos posts.',
    successRate: 95.5,
  },
  {
    id: 'auto-4',
    name: 'Smart Comment Filter',
    type: 'instagram',
    status: 'draft',
    lastRun: 'Nunca executado',
    runs: 0,
    description: 'Filtra comentarios ofensivos usando IA antes de notificar a equipe.',
    successRate: 0,
  },
];

const defaultBuilderSteps: BuilderStep[] = [
  { id: 'bs-1', type: 'trigger', title: 'Gatilho (Trigger)', subtitle: 'Novo Comentario no Instagram', color: 'emerald', iconType: 'zap' },
  { id: 'bs-2', type: 'condition', title: 'Condicao (Filter)', subtitle: 'Contem "QUERO"', color: 'amber', iconType: 'filter' },
  { id: 'bs-3', type: 'action', title: 'Acao IA (Action)', subtitle: 'Responder com Gemini', color: 'blue', iconType: 'bot' },
];

export const useAutomationsStore = create<AutomationsState>()(
  persist(
    (set, get) => ({
      automations: initialAutomations,
      builderSteps: defaultBuilderSteps,
      add: (automation) =>
        set((state) => ({
          automations: [...state.automations, { ...automation, id: `auto-${Date.now()}` }],
        })),
      update: (id, data) =>
        set((state) => ({
          automations: state.automations.map((a) =>
            a.id === id ? { ...a, ...data } : a
          ),
        })),
      remove: (id) =>
        set((state) => ({
          automations: state.automations.filter((a) => a.id !== id),
        })),
      getById: (id) => get().automations.find((a) => a.id === id),
      toggleStatus: (id) =>
        set((state) => ({
          automations: state.automations.map((a) => {
            if (a.id !== id) return a;
            const newStatus = a.status === 'active' ? 'paused' : 'active';
            return { ...a, status: newStatus };
          }),
        })),
      setBuilderSteps: (steps) => set({ builderSteps: steps }),
      addBuilderStep: (step) =>
        set((state) => ({
          builderSteps: [...state.builderSteps, { ...step, id: `bs-${Date.now()}` }],
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
