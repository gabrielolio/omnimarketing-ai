import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PipelineColumn = 'novo' | 'qualificado' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';

export interface LeadData {
  id: string;
  name: string;
  value: string;
  date: string;
  lastContact: string;
  email: string;
  column: PipelineColumn;
}

interface PipelineState {
  leads: LeadData[];
  add: (lead: Omit<LeadData, 'id'>) => void;
  update: (id: string, data: Partial<LeadData>) => void;
  remove: (id: string) => void;
  getById: (id: string) => LeadData | undefined;
  moveToColumn: (id: string, column: PipelineColumn) => void;
}

const initialLeads: LeadData[] = [
  { id: 'lead-1', name: 'Ana Paula Silva', value: 'R$ 5.000', date: '2026-03-18', lastContact: 'Ha 1 hora', email: 'ana@email.com', column: 'novo' },
  { id: 'lead-2', name: 'Carlos Mendes', value: 'R$ 12.000', date: '2026-03-15', lastContact: 'Ha 3 horas', email: 'carlos@empresa.com', column: 'novo' },
  { id: 'lead-3', name: 'Maria Oliveira', value: 'R$ 8.500', date: '2026-03-14', lastContact: 'Ha 1 dia', email: 'maria@loja.com', column: 'qualificado' },
  { id: 'lead-4', name: 'Pedro Santos', value: 'R$ 20.000', date: '2026-03-10', lastContact: 'Ha 2 dias', email: 'pedro@tech.io', column: 'proposta' },
  { id: 'lead-5', name: 'Julia Costa', value: 'R$ 15.000', date: '2026-03-08', lastContact: 'Ha 4 dias', email: 'julia@startup.com', column: 'negociacao' },
  { id: 'lead-6', name: 'Rafael Lima', value: 'R$ 9.800', date: '2026-03-05', lastContact: 'Ha 1 semana', email: 'rafael@agencia.com', column: 'fechado' },
  { id: 'lead-7', name: 'Fernanda Alves', value: 'R$ 3.200', date: '2026-03-12', lastContact: 'Ha 5 dias', email: 'fernanda@shop.com', column: 'perdido' },
  { id: 'lead-8', name: 'Bruno Ferreira', value: 'R$ 7.500', date: '2026-03-17', lastContact: 'Ha 6 horas', email: 'bruno@digital.com', column: 'qualificado' },
];

export const usePipelineStore = create<PipelineState>()(
  persist(
    (set, get) => ({
      leads: initialLeads,
      add: (lead) =>
        set((state) => ({
          leads: [...state.leads, { ...lead, id: `lead-${Date.now()}` }],
        })),
      update: (id, data) =>
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id ? { ...l, ...data } : l
          ),
        })),
      remove: (id) =>
        set((state) => ({
          leads: state.leads.filter((l) => l.id !== id),
        })),
      getById: (id) => get().leads.find((l) => l.id === id),
      moveToColumn: (id, column) =>
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id ? { ...l, column } : l
          ),
        })),
    }),
    { name: 'omni-pipeline-store' }
  )
);
