import React from "react";
import { Search, Users, FileText, Zap, Bot, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/types";
import { useClientsStore } from "@/src/stores/useClientsStore";
import { useContractsStore } from "@/src/stores/useContractsStore";
import { useAutomationsStore } from "@/src/stores/useAutomationsStore";
import { useAgentsStore } from "@/src/stores/useAgentsStore";
import { useCalendarStore } from "@/src/stores/useCalendarStore";

interface SearchResult {
  type: "client" | "contract" | "automation" | "agent" | "post";
  title: string;
  subtitle: string;
  tab: string;
}

const iconMap: Record<string, any> = { client: Users, contract: FileText, automation: Zap, agent: Bot, post: Calendar };
const colorMap: Record<string, string> = { client: "text-emerald-400", contract: "text-blue-400", automation: "text-purple-400", agent: "text-amber-400", post: "text-pink-400" };

export const SearchDropdown = ({ query, onNavigate }: { query: string; onNavigate: (tab: string) => void }) => {
  const { clients } = useClientsStore();
  const { contracts } = useContractsStore();
  const { automations } = useAutomationsStore();
  const { agents } = useAgentsStore();
  const { posts } = useCalendarStore();

  if (!query.trim()) return null;

  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  clients.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)).forEach(c => results.push({ type: "client", title: c.name, subtitle: c.email, tab: "clients" }));
  contracts.filter(c => c.client.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)).forEach(c => results.push({ type: "contract", title: c.client, subtitle: c.id + " - " + c.amount, tab: "contracts" }));
  automations.filter(a => a.name.toLowerCase().includes(q)).forEach(a => results.push({ type: "automation", title: a.name, subtitle: a.description, tab: "automations" }));
  agents.filter(a => a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)).forEach(a => results.push({ type: "agent", title: a.name, subtitle: a.role, tab: "agents" }));
  posts.filter(p => p.title.toLowerCase().includes(q) || p.client.toLowerCase().includes(q)).forEach(p => results.push({ type: "post", title: p.title, subtitle: p.client, tab: "calendar" }));

  if (results.length === 0) return (
    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full mt-2 left-0 right-0 bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-2xl z-50">
      <p className="text-sm text-zinc-500 text-center">Nenhum resultado para "{query}"</p>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full mt-2 left-0 right-0 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto custom-scrollbar">
      {results.slice(0, 10).map((r, i) => {
        const Icon = iconMap[r.type];
        return (
          <button key={i} onClick={() => onNavigate(r.tab)} className="w-full flex items-center gap-3 p-3 hover:bg-zinc-800/50 transition-all text-left">
            <Icon size={16} className={colorMap[r.type]} />
            <div className="flex-1 min-w-0"><p className="text-sm text-zinc-200 font-medium truncate">{r.title}</p><p className="text-[10px] text-zinc-500 truncate">{r.subtitle}</p></div>
            <span className="text-[10px] text-zinc-600 uppercase font-bold">{r.type}</span>
          </button>
        );
      })}
    </motion.div>
  );
};
