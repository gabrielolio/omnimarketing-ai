import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/src/lib/supabase';

export interface AgentData {
  id: string;
  client_id?: string;
  name: string;
  role: string;
  context: string;
  status: 'online' | 'offline';
  tokens: string;
  tokens_used?: number;
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
  loading: boolean;
  error: string | null;
  fetchAgents: () => Promise<void>;
  add: (agent: Partial<AgentData>) => Promise<void>;
  update: (id: string, data: Partial<AgentData>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => AgentData | undefined;
  addChatMessage: (agentId: string, msg: ChatMessage) => void;
  clearChat: (agentId: string) => void;
  addSource: (agentId: string, source: { url: string; type: 'web' | 'file' }) => void;
  removeSource: (agentId: string, url: string) => void;
}

const mockResponses = [
  'Com base na analise dos dados recentes, sugiro focar em conteudo de video curto. A taxa de engajamento para Reels tem sido 3x maior que posts estaticos.',
  'Entendido! Vou ajustar a estrategia de comunicacao. Recomendo usar gatilhos de urgencia combinados com prova social para maximizar conversoes.',
  'Analisando o perfil do lead, ele se encaixa no segmento premium. Sugiro abordagem consultiva com foco nos beneficios exclusivos.',
  'Os dados mostram que o melhor horario de postagem para este nicho e entre 18h-20h nos dias uteis.',
  'Perfeito! Vou gerar 3 opcoes de copy para o post. Cada uma com um angulo diferente: educativo, emocional e promocional.',
  'A taxa de abertura dos emails esta em 28%, acima da media do setor. Sugiro manter o tom atual e testar subject lines com emojis.',
];

function formatTokens(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

export const useAgentsStore = create<AgentsState>()(
  persist(
    (set, get) => ({
      agents: [],
      chatMessages: {},
      loading: false,
      error: null,

      fetchAgents: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('agents')
            .select('*')
            .order('created_at', { ascending: false });
          if (error) throw error;
          if (data) {
            const mapped = data.map((a: any) => ({
              ...a,
              tokens: formatTokens(a.tokens_used || 0),
              accuracy: a.accuracy ? a.accuracy + '%' : 'N/A',
              temperature: Number(a.temperature) || 0.7,
              sources: a.sources || [],
            }));
            set({ agents: mapped, loading: false });
          }
        } catch (err: any) {
          console.warn('Supabase agents fetch failed:', err.message);
          set({ loading: false, error: err.message });
        }
      },

      add: async (agent) => {
        try {
          const { data, error } = await supabase
            .from('agents')
            .insert({
              client_id: agent.client_id,
              name: agent.name || '',
              role: agent.role || '',
              context: agent.context || '',
              status: 'offline',
              model: agent.model || 'Gemini 3 Flash',
              temperature: agent.temperature || 0.7,
              sources: agent.sources || [],
            })
            .select()
            .single();
          if (error) throw error;
          if (data) {
            set((state) => ({
              agents: [{ ...data, tokens: '0', accuracy: 'N/A', sources: data.sources || [] }, ...state.agents],
            }));
          }
        } catch (err: any) {
          const newAgent: AgentData = {
            id: 'agent-' + Date.now(),
            name: agent.name || '',
            role: agent.role || '',
            context: agent.context || '',
            status: 'offline',
            tokens: '0',
            accuracy: 'N/A',
            model: agent.model || 'Gemini 3 Flash',
            temperature: agent.temperature || 0.7,
            sources: [],
          };
          set((state) => ({ agents: [newAgent, ...state.agents] }));
        }
      },

      update: async (id, data) => {
        try {
          const updateData: any = { ...data };
          delete updateData.tokens;
          delete updateData.accuracy;
          const { error } = await supabase.from('agents').update(updateData).eq('id', id);
          if (error) throw error;
        } catch (err: any) {
          console.warn('Supabase agent update failed:', err.message);
        }
        set((state) => ({
          agents: state.agents.map((a) => (a.id === id ? { ...a, ...data } : a)),
        }));
      },

      remove: async (id) => {
        try {
          const { error } = await supabase.from('agents').delete().eq('id', id);
          if (error) throw error;
        } catch (err: any) {
          console.warn('Supabase agent delete failed:', err.message);
        }
        set((state) => ({ agents: state.agents.filter((a) => a.id !== id) }));
      },

      getById: (id) => get().agents.find((a) => a.id === id),

      addChatMessage: (agentId, msg) =>
        set((state) => {
          const current = state.chatMessages[agentId] || [];
          return { chatMessages: { ...state.chatMessages, [agentId]: [...current, msg] } };
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
