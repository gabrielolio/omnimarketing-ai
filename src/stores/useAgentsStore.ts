import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AgentData {
  id: string;
  name: string;
  role: string;
  context: string;
  status: 'online' | 'offline';
  tokens: string;
  accuracy: string;
  model: string;
  temperature: number;
  sources: { url: string; type: 'web' | 'file'; synced: boolean }[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AgentsState {
  agents: AgentData[];
  chatMessages: Record<string, ChatMessage[]>;
  add: (agent: Omit<AgentData, 'id'>) => void;
  update: (id: string, data: Partial<AgentData>) => void;
  remove: (id: string) => void;
  getById: (id: string) => AgentData | undefined;
  addChatMessage: (agentId: string, msg: ChatMessage) => void;
  clearChat: (agentId: string) => void;
  addSource: (agentId: string, source: { url: string; type: 'web' | 'file' }) => void;
  removeSource: (agentId: string, url: string) => void;
}

const mockResponses = [
  'Com base na analise dos dados recentes, sugiro focar em conteudo de video curto. A taxa de engajamento para Reels tem sido 3x maior que posts estaticos.',
  'Entendido! Vou ajustar a estrategia de comunicacao. Recomendo usar gatilhos de urgencia combinados com prova social para maximizar conversoes.',
  'Analisando o perfil do lead, ele se encaixa no segmento premium. Sugiro abordagem consultiva com foco nos beneficios exclusivos do plano Enterprise.',
  'Os dados mostram que o melhor horario de postagem para este nicho e entre 18h-20h nos dias uteis. Vamos ajustar o calendario?',
  'Perfeito! Vou gerar 3 opcoes de copy para o post. Cada uma com um angulo diferente: educativo, emocional e promocional.',
  'A taxa de abertura dos emails esta em 28%, acima da media do setor. Sugiro manter o tom atual e testar subject lines com emojis.',
];

const initialAgents: AgentData[] = [
  {
    id: 'agent-1',
    name: 'Vendas Pro',
    role: 'Especialista em Conversao',
    context: 'Focado em fechar vendas via Direct no Instagram, usando gatilhos mentais e urgencia.',
    status: 'online',
    tokens: '45.2k',
    accuracy: '94%',
    model: 'Gemini 3 Flash',
    temperature: 0.7,
    sources: [
      { url: 'https://meusite.com/blog', type: 'web', synced: true },
      { url: 'catalogo_produtos_v2.pdf', type: 'file', synced: true },
    ],
  },
  {
    id: 'agent-2',
    name: 'Suporte Website',
    role: 'Atendimento ao Cliente',
    context: 'Conhece todo o catalogo de produtos e politicas de entrega. Responde duvidas no chat do site.',
    status: 'online',
    tokens: '12.8k',
    accuracy: '98%',
    model: 'Gemini 3 Flash',
    temperature: 0.3,
    sources: [
      { url: 'https://meusite.com/faq', type: 'web', synced: true },
    ],
  },
  {
    id: 'agent-3',
    name: 'Copywriter Social',
    role: 'Criador de Conteudo',
    context: 'Gera legendas e roteiros para Reels baseados nas tendencias do nicho de marketing.',
    status: 'offline',
    tokens: '0',
    accuracy: 'N/A',
    model: 'Gemini 3 Pro',
    temperature: 0.9,
    sources: [],
  },
];

export const useAgentsStore = create<AgentsState>()(
  persist(
    (set, get) => ({
      agents: initialAgents,
      chatMessages: {},
      add: (agent) =>
        set((state) => ({
          agents: [...state.agents, { ...agent, id: `agent-${Date.now()}` }],
        })),
      update: (id, data) =>
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === id ? { ...a, ...data } : a
          ),
        })),
      remove: (id) =>
        set((state) => ({
          agents: state.agents.filter((a) => a.id !== id),
        })),
      getById: (id) => get().agents.find((a) => a.id === id),
      addChatMessage: (agentId, msg) =>
        set((state) => {
          const current = state.chatMessages[agentId] || [];
          const updated = [...current, msg];
          // if user message, add mock response after delay (handled in component)
          return { chatMessages: { ...state.chatMessages, [agentId]: updated } };
        }),
      clearChat: (agentId) =>
        set((state) => ({
          chatMessages: { ...state.chatMessages, [agentId]: [] },
        })),
      addSource: (agentId, source) =>
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === agentId
              ? { ...a, sources: [...a.sources, { ...source, synced: true }] }
              : a
          ),
        })),
      removeSource: (agentId, url) =>
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === agentId
              ? { ...a, sources: a.sources.filter((s) => s.url !== url) }
              : a
          ),
        })),
    }),
    { name: 'omni-agents-store' }
  )
);

export { mockResponses };
