import { TrendingUp, Users, Instagram, Globe, ArrowUpRight, ArrowDownRight, Zap, Bot, ChevronRight, DollarSign, FileText, Activity, Calendar, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { motion } from "motion/react";
import { cn } from "@/src/types";
import { useAppStore, TabId } from "@/src/stores/useAppStore";
import { useClientsStore } from "@/src/stores/useClientsStore";
import { useContractsStore } from "@/src/stores/useContractsStore";
import { useAutomationsStore } from "@/src/stores/useAutomationsStore";
import { useAgentsStore } from "@/src/stores/useAgentsStore";
import { useCalendarStore } from "@/src/stores/useCalendarStore";
import { usePipelineStore } from "@/src/stores/usePipelineStore";
import { useState } from "react";

const StatCard = ({ title, value, change, icon: Icon, trend, onClick }: any) => (
  <motion.div whileHover={{ y: -4 }} onClick={onClick} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl cursor-pointer hover:border-zinc-700 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-zinc-800 rounded-xl text-emerald-400"><Icon size={24} /></div>
      <div className={cn("flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full", trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
        {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{change}
      </div>
    </div>
    <p className="text-zinc-500 text-sm mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-zinc-100">{value}</h3>
  </motion.div>
);

export const Dashboard = () => {
  const { setActiveTab, notifications } = useAppStore();
  const { clients, loading: clientsLoading } = useClientsStore();
  const { contracts } = useContractsStore();
  const { automations } = useAutomationsStore();
  const { agents } = useAgentsStore();
  const { posts } = useCalendarStore();
  const { leads } = usePipelineStore();
  const [showFullLog, setShowFullLog] = useState(false);

  // Calculate real MRR from contracts
  const activeContracts = contracts.filter(c => c.status === 'signed');
  const mrr = activeContracts.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const mrrFormatted = `R$ ${mrr.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;

  // Active automations
  const activeAutomations = automations.filter(a => a.status === 'active');
  const totalRuns = automations.reduce((sum, a) => sum + (a.runs_count || 0), 0);

  // Online agents
  const onlineAgents = agents.filter(a => a.status === 'online');

  // Leads stats
  const closedLeads = leads.filter(l => l.stage === 'closed');
  const newLeads = leads.filter(l => l.stage === 'new' || l.stage === 'qualified');

  // Upcoming posts
  const upcomingPosts = posts.filter(p => p.status === 'scheduled' || p.status === 'approved');

  // Build financial chart from contracts (show per-client revenue)
  const clientRevenue = clients.map(c => {
    const clientContracts = contracts.filter(ct => ct.client_id === c.id && ct.status === 'signed');
    const revenue = clientContracts.reduce((sum, ct) => sum + (Number(ct.amount) || 0), 0);
    return { name: c.name.split(' ')[0], mrr: revenue };
  });

  // Build agent performance from real data
  const agentPerf = agents.filter(a => a.status === 'online').slice(0, 4).map((a, i) => ({
    name: a.name,
    performance: Number(a.accuracy) || 0,
    color: ['#10b981', '#6366f1', '#f59e0b', '#3b82f6'][i % 4],
  }));

  // Build activity feed from notifications
  const feedItems = notifications.slice(0, 8).map(n => ({
    type: n.type || 'system',
    title: n.title,
    user: n.message?.slice(0, 40) || '',
    time: getTimeAgo(n.created_at),
    tab: (n.type === 'automation' ? 'automations' : n.type === 'contract' ? 'contracts' : n.type === 'lead' ? 'pipeline' : n.type === 'agent' ? 'agents' : 'dashboard') as TabId,
  }));

  // Automations per type for bar chart
  const automationsByType = [
    { name: 'WhatsApp', count: automations.filter(a => a.type === 'whatsapp').length },
    { name: 'Instagram', count: automations.filter(a => a.type === 'instagram').length },
    { name: 'General', count: automations.filter(a => a.type === 'general').length },
    { name: 'Website', count: automations.filter(a => a.type === 'website').length },
  ].filter(a => a.count > 0);

  if (clientsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="MRR (Mensal)" value={mrrFormatted} change={`${activeContracts.length} contratos`} icon={DollarSign} trend="up" onClick={() => setActiveTab("contracts")} />
        <StatCard title="Automacoes Ativas" value={activeAutomations.length.toString()} change={`${totalRuns.toLocaleString()} execucoes`} icon={Zap} trend="up" onClick={() => setActiveTab("automations")} />
        <StatCard title="Agentes Online" value={`${onlineAgents.length}/${agents.length}`} change={`${agents.length} total`} icon={Bot} trend="up" onClick={() => setActiveTab("agents")} />
        <StatCard title="Leads no Pipeline" value={leads.length.toString()} change={`${closedLeads.length} fechados`} icon={Users} trend={closedLeads.length > 0 ? "up" : "down"} onClick={() => setActiveTab("pipeline")} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-8">
              <div><h3 className="text-lg font-semibold text-zinc-100">Receita por Cliente</h3><p className="text-sm text-zinc-500">MRR de cada cliente ativo</p></div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg"><TrendingUp size={14} />MRR: {mrrFormatted}</div>
            </div>
            <div className="h-[300px] w-full">
              {clientRevenue.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clientRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value/1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} itemStyle={{ color: "#e4e4e7" }} formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, "MRR"]} />
                    <Bar dataKey="mrr" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-500">Nenhum contrato ativo</div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-zinc-100 mb-6 flex items-center gap-2 uppercase tracking-widest"><Bot size={18} className="text-emerald-400" />Performance dos Agentes</h3>
              {agentPerf.length > 0 ? (
                <div className="space-y-4">
                  {agentPerf.map((agent) => (
                    <div key={agent.name} className="space-y-2 cursor-pointer" onClick={() => setActiveTab("agents")}>
                      <div className="flex justify-between text-sm"><span className="text-zinc-300">{agent.name}</span><span className="text-zinc-500">{agent.performance}%</span></div>
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${agent.performance}%` }} className="h-full" style={{ backgroundColor: agent.color }} /></div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 text-sm">Nenhum agente online</p>
              )}
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-zinc-100 mb-6 flex items-center gap-2 uppercase tracking-widest"><Zap size={18} className="text-purple-400" />Automacoes por Tipo</h3>
              {automationsByType.length > 0 ? (
                <>
                  <div className="h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={automationsByType}><Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} /><Tooltip cursor={{ fill: "transparent" }} contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} /></BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    {automationsByType.map(a => (
                      <div key={a.name} className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500" /><span className="text-[10px] text-zinc-500 uppercase font-bold">{a.name} ({a.count})</span></div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-zinc-500 text-sm">Nenhuma automacao cadastrada</p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-semibold text-zinc-100 mb-6 flex items-center gap-2"><Activity size={18} className="text-emerald-400" />Feed de Operacoes</h3>
          <div className="space-y-6 flex-1">
            {feedItems.length > 0 ? (
              (showFullLog ? feedItems : feedItems.slice(0, 4)).map((activity, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer" onClick={() => setActiveTab(activity.tab)}>
                  <div className={cn("w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all",
                    activity.type === "automation" ? "text-emerald-400" : activity.type === "contract" ? "text-blue-400" : activity.type === "lead" ? "text-amber-400" : "text-zinc-400")}>
                    {activity.type === "automation" ? <Zap size={18} /> : activity.type === "contract" ? <FileText size={18} /> : activity.type === "lead" ? <Users size={18} /> : <Activity size={18} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start"><p className="text-sm text-zinc-200 font-medium">{activity.title}</p><span className="text-[10px] text-zinc-600 font-mono">{activity.time}</span></div>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">{activity.user}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-sm">Nenhuma atividade recente</p>
            )}
          </div>
          {feedItems.length > 4 && (
            <button onClick={() => setShowFullLog(!showFullLog)} className="w-full mt-8 py-3 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors border border-emerald-500/20 rounded-xl hover:bg-emerald-500/5 flex items-center justify-center gap-2">
              {showFullLog ? "Recolher" : "Ver Log Completo"}<ChevronRight size={16} className={cn("transition-transform", showFullLog && "rotate-90")} />
            </button>
          )}
        </div>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl cursor-pointer hover:border-zinc-700 transition-all" onClick={() => setActiveTab("clients")}>
          <h3 className="text-sm font-bold text-zinc-100 mb-4 flex items-center gap-2 uppercase tracking-widest"><Users size={16} className="text-blue-400" />Clientes</h3>
          <div className="space-y-3">
            {clients.slice(0, 3).map(c => (
              <div key={c.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", c.health === 'green' ? "bg-emerald-500" : c.health === 'yellow' ? "bg-amber-500" : "bg-rose-500")} />
                  <span className="text-sm text-zinc-300">{c.name}</span>
                </div>
                <span className="text-xs text-zinc-500">{c.city}/{c.state}</span>
              </div>
            ))}
            {clients.length === 0 && <p className="text-zinc-500 text-sm">Nenhum cliente</p>}
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl cursor-pointer hover:border-zinc-700 transition-all" onClick={() => setActiveTab("calendar")}>
          <h3 className="text-sm font-bold text-zinc-100 mb-4 flex items-center gap-2 uppercase tracking-widest"><Calendar size={16} className="text-emerald-400" />Proximos Posts</h3>
          <div className="space-y-3">
            {upcomingPosts.slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {p.platform === 'instagram' ? <Instagram size={14} className="text-pink-400" /> : <Globe size={14} className="text-blue-400" />}
                  <span className="text-sm text-zinc-300 truncate max-w-[180px]">{p.title}</span>
                </div>
                <span className="text-[10px] text-zinc-500">{p.client}</span>
              </div>
            ))}
            {upcomingPosts.length === 0 && <p className="text-zinc-500 text-sm">Nenhum post agendado</p>}
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl cursor-pointer hover:border-zinc-700 transition-all" onClick={() => setActiveTab("pipeline")}>
          <h3 className="text-sm font-bold text-zinc-100 mb-4 flex items-center gap-2 uppercase tracking-widest"><TrendingUp size={16} className="text-amber-400" />Pipeline</h3>
          <div className="space-y-3">
            {leads.slice(0, 3).map(l => (
              <div key={l.id} className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">{l.name}</span>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                  l.stage === 'closed' ? "bg-emerald-500/10 text-emerald-400" :
                  l.stage === 'negotiation' ? "bg-blue-500/10 text-blue-400" :
                  "bg-zinc-800 text-zinc-400"
                )}>{l.stage}</span>
              </div>
            ))}
            {leads.length === 0 && <p className="text-zinc-500 text-sm">Nenhum lead</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

function getTimeAgo(dateStr: string | undefined): string {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
}
