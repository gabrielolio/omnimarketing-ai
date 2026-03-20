import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ClientData {
  id: string;
  name: string;
  email: string;
  projects: number;
  status: 'active' | 'inactive';
  revenue: string;
  avatar: string;
  phone: string;
  joined: string;
  lastActive: string;
  notes: string;
}

interface ClientsState {
  clients: ClientData[];
  add: (client: Omit<ClientData, 'id'>) => void;
  update: (id: string, data: Partial<ClientData>) => void;
  remove: (id: string) => void;
  getById: (id: string) => ClientData | undefined;
}

const initialClients: ClientData[] = [
  {
    id: 'cli-1',
    name: 'TechFlow Solutions',
    email: 'contact@techflow.com',
    projects: 3,
    status: 'active',
    revenue: 'R$ 15.400',
    avatar: 'https://picsum.photos/seed/tech/100/100',
    phone: '+55 11 99999-9999',
    joined: 'Jan 2026',
    lastActive: 'Ha 2 horas',
    notes: 'Cliente focado em ROI imediato. Prefere relatorios quinzenais via WhatsApp.',
  },
  {
    id: 'cli-2',
    name: 'Gourmet Garden',
    email: 'marketing@gourmet.io',
    projects: 1,
    status: 'active',
    revenue: 'R$ 4.200',
    avatar: 'https://picsum.photos/seed/food/100/100',
    phone: '+55 11 88888-8888',
    joined: 'Fev 2026',
    lastActive: 'Ha 5 horas',
    notes: '',
  },
  {
    id: 'cli-3',
    name: 'Blue Horizon Travel',
    email: 'info@bluehorizon.com',
    projects: 5,
    status: 'inactive',
    revenue: 'R$ 0',
    avatar: 'https://picsum.photos/seed/travel/100/100',
    phone: '+55 11 77777-7777',
    joined: 'Mar 2026',
    lastActive: 'Ha 2 dias',
    notes: '',
  },
  {
    id: 'cli-4',
    name: 'FitLife Academy',
    email: 'admin@fitlife.br',
    projects: 2,
    status: 'active',
    revenue: 'R$ 8.900',
    avatar: 'https://picsum.photos/seed/fit/100/100',
    phone: '+55 11 66666-6666',
    joined: 'Jan 2026',
    lastActive: 'Ha 12 horas',
    notes: '',
  },
];

export const useClientsStore = create<ClientsState>()(
  persist(
    (set, get) => ({
      clients: initialClients,
      add: (client) =>
        set((state) => ({
          clients: [...state.clients, { ...client, id: `cli-${Date.now()}` }],
        })),
      update: (id, data) =>
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),
      remove: (id) =>
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        })),
      getById: (id) => get().clients.find((c) => c.id === id),
    }),
    { name: 'omni-clients-store' }
  )
);
