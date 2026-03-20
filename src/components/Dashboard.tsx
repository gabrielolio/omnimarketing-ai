import { TrendingUp, Users, Instagram, Globe, ArrowUpRight, ArrowDownRight, Zap, Bot, ChevronRight, DollarSign, FileText, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { motion } from "motion/react";
import { cn } from "@/src/types";
import { useAppStore, TabId } from "@/src/stores/useAppStore";
import { useState } from "react";

const data = [
  { name: "Seg", ig: 4000, web: 2400 },
  { name: "Ter", ig: 3000, web: 1398 },
  { name: "Qua", ig: 2000, web: 9800 },
  { name: "Qui", ig: 2780, web: 3908 },
  { name: "Sex", ig: 1890, web: 4800 },
  { name: "Sab", ig: 2390, web: 3800 },
  { name: "Dom", ig: 3490, web: 4300 },
];

const financialData = [
  { name: "Jan", mrr: 12000 },
  { name: "Fev", mrr: 15000 },
  { name: "Mar", mrr: 18500 },
  { name: "Abr", mrr: 22000 },
  { name: "Mai", mrr: 28000 },
  { name: "Jun", mrr: 32400 },
];

const agentPerf = [
  { name: "Suporte Vendas", performance: 98, color: "#10b981" },
  { name: "Agendador Pro", performance: 92, color: "#6366f1" },
  { name: "Lead Qualifier", performance: 85, color: "#f59e0b" },
];

const feedItems = [
  { type: "automation", title: "Welcome DM", user: "@vitor_gooom", time: "2m", tab: "automations" as TabId },
  { type: "contract", title: "Contrato Assinado", user: "Bamaq GWM", time: "15m", tab: "contracts" as TabId },
  { type: "lead", title: "Novo Lead Qualificado", user: "Ana Paula", time: "1h", tab: "pipeline" as TabId },
  { type: "automation", title: "Lead Score", user: "@user_92", time: "2h", tab: "automations" as TabId },
  { type: "agent", title: "Treinamento Concluido", user: "Vendas Pro", time: "3h", tab: "agents" as TabId },
  { type: "contract", title: "Fatura Gerada", user: "Omni Retail", time: "5h", tab: "contracts" as TabId },
];

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
  const { setActiveTab } = useAppStore();
  const [showFullLog, setShowFullLog] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="MRR (Mensal)" value="R$ 32.400" change="+18.5%" icon={DollarSign} trend="up" onClick={() => setActiveTab("reports")} />
        <StatCard title="Contratos Ativos" value="24" change="+2" icon={FileText} trend="up" onClick={() => setActiveTab("contracts")} />
        <StatCard title="Alcance Instagram" value="124.5k" change="+12.5%" icon={Instagram} trend="up" onClick={() => setActiveTab("automations")} />
        <StatCard title="Novos Leads" value="1,284" change="-2.4%" icon={Users} trend="down" onClick={() => setActiveTab("pipeline")} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-8">
              <div><h3 className="text-lg font-semibold text-zinc-100">Crescimento de Receita</h3><p className="text-sm text-zinc-500">Evolucao do MRR nos ultimos 6 meses</p></div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg"><TrendingUp size={14} />Meta: R$ 40k</div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialData}>
                  <defs><linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} itemStyle={{ color: "#e4e4e7" }} formatter={(value) => [`R$ ${value}`, "MRR"]} />
                  <Area type="monotone" dataKey="mrr" stroke="#10b981" fillOpacity={1} fill="url(#colorMrr)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-zinc-100 mb-6 flex items-center gap-2 uppercase tracking-widest"><Bot size={18} className="text-emerald-400" />Performance dos Agentes</h3>
              <div className="space-y-4">
                {agentPerf.map((agent) => (
                  <div key={agent.name} className="space-y-2 cursor-pointer" onClick={() => setActiveTab("agents")}>
                    <div className="flex justify-between text-sm"><span className="text-zinc-300">{agent.name}</span><span className="text-zinc-500">{agent.performance}%</span></div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${agent.performance}%` }} className="h-full" style={{ backgroundColor: agent.color }} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-zinc-100 mb-6 flex items-center gap-2 uppercase tracking-widest"><Globe size={18} className="text-blue-400" />Trafego por Canal</h3>
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}><Bar dataKey="ig" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} /><Bar dataKey="web" stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} /><Tooltip cursor={{ fill: "transparent" }} contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} /></BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[10px] text-zinc-500 uppercase font-bold">Instagram</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500" /><span className="text-[10px] text-zinc-500 uppercase font-bold">Website</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-semibold text-zinc-100 mb-6 flex items-center gap-2"><Activity size={18} className="text-emerald-400" />Feed de Operacoes</h3>
          <div className="space-y-6 flex-1">
            {(showFullLog ? feedItems : feedItems.slice(0, 4)).map((activity, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer" onClick={() => setActiveTab(activity.tab)}>
                <div className={cn("w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all",
                  activity.type === "automation" ? "text-emerald-400" : activity.type === "contract" ? "text-blue-400" : "text-amber-400")}>
                  {activity.type === "automation" ? <Zap size={18} /> : activity.type === "contract" ? <FileText size={18} /> : <Users size={18} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start"><p className="text-sm text-zinc-200 font-medium">{activity.title}</p><span className="text-[10px] text-zinc-600 font-mono">{activity.time}</span></div>
                  <p className="text-xs text-zinc-500 mt-0.5">{activity.user}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setShowFullLog(!showFullLog)} className="w-full mt-8 py-3 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors border border-emerald-500/20 rounded-xl hover:bg-emerald-500/5 flex items-center justify-center gap-2">
            {showFullLog ? "Recolher" : "Ver Log Completo"}<ChevronRight size={16} className={cn("transition-transform", showFullLog && "rotate-90")} />
          </button>
        </div>
      </div>
    </div>
  );
};
