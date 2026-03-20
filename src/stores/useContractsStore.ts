import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ContractData {
  id: string;
  client: string;
  service: string;
  amount: string;
  date: string;
  status: 'signed' | 'pending' | 'expired' | 'cancelled';
  description: string;
  terms: string;
}

interface ContractsState {
  contracts: ContractData[];
  add: (contract: Omit<ContractData, 'id'>) => void;
  update: (id: string, data: Partial<ContractData>) => void;
  remove: (id: string) => void;
  getById: (id: string) => ContractData | undefined;
}

const initialContracts: ContractData[] = [
  {
    id: 'CTR-2026-001',
    client: 'TechFlow Solutions',
    service: 'Plano Enterprise AI',
    amount: 'R$ 15.400,00',
    date: '12 Mar, 2026',
    status: 'signed',
    description: 'Implementacao completa de agentes de IA para atendimento e automacao de fluxos internos.',
    terms: 'Vigencia de 12 meses com renovacao automatica. Suporte 24/7 incluso.',
  },
  {
    id: 'CTR-2026-002',
    client: 'Gourmet Garden',
    service: 'Social Media Automation',
    amount: 'R$ 4.200,00',
    date: '15 Mar, 2026',
    status: 'pending',
    description: 'Gerenciamento automatizado de redes sociais e resposta inteligente a comentarios.',
    terms: 'Vigencia de 6 meses. Inclui 3 revisoes mensais de estrategia.',
  },
  {
    id: 'CTR-2026-003',
    client: 'FitLife Academy',
    service: 'Full Marketing Stack',
    amount: 'R$ 8.900,00',
    date: '18 Mar, 2026',
    status: 'signed',
    description: 'Pacote completo de marketing digital, automacao de leads e CRM inteligente.',
    terms: 'Vigencia de 12 meses. Bonus de 50k tokens extras por mes.',
  },
];

export const useContractsStore = create<ContractsState>()(
  persist(
    (set, get) => ({
      contracts: initialContracts,
      add: (contract) =>
        set((state) => ({
          contracts: [
            ...state.contracts,
            { ...contract, id: `CTR-2026-${String(state.contracts.length + 1).padStart(3, '0')}` },
          ],
        })),
      update: (id, data) =>
        set((state) => ({
          contracts: state.contracts.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),
      remove: (id) =>
        set((state) => ({
          contracts: state.contracts.filter((c) => c.id !== id),
        })),
      getById: (id) => get().contracts.find((c) => c.id === id),
    }),
    { name: 'omni-contracts-store' }
  )
);
