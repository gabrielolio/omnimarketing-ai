import React, { useState } from "react";
import { BarChart3, Download, Users, DollarSign, Zap, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { motion } from "motion/react";
import { cn } from "@/src/types";
import { useClientsStore } from "@/src/stores/useClientsStore";
import { toast } from "sonner";

const revenueData = [
  { name: "Out", value: 18000 },
  { name: "Nov", value: 22000 },
  { name: "Dez", value: 25000 },
  { name: "Jan", value: 28000 },
  { name: "Fev", value: 30000 },
  { name: "Mar", value: 32400 },
];

const automationData = [
  { name: "Out", execucoes: 3200 },
  { name: "Nov", execucoes: 4100 },
  { name: "Dez", execucoes: 3800 },
  { name: "Jan", execucoes: 5200 },
  { name: "Fev", execucoes: 6100 },
  { name: "Mar", execucoes: 7400 },
];

const leadsData = [
  { name: "Out", convertidos: 12, total: 45 },
  { name: "Nov", convertidos: 18, total: 52 },
  { name: "Dez", convertidos: 15, total: 48 },
  { name: "Jan", convertidos: 22, total: 60 },
  { name: "Fev", convertidos: 28, total: 65 },
  { name: "Mar", convertidos: 32, total: 72 },
];

export const Reports = () => {
  const { clients } = useClientsStore();
  const [selectedClient, setSelectedClient] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h2 className="text-2xl font-bold text-zinc-100">Relatorios</h2><p className="text-sm text-zinc-500">Analise detalhada de performance</p></div>
        <div className="flex items-center gap-3">
          <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none">
            <option value="all">Todos os clientes</option>
            {clients.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
          <button onClick={() => { window.print(); toast.success("Preparando exportacao..."); }} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"><Download size={18} /> Exportar</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><div className="p-3 bg-zinc-800 rounded-xl text-emerald-400 w-fit mb-3"><DollarSign size={20} /></div><p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Receita Total</p><h3 className="text-2xl font-bold text-zinc-100">R$ 155.400</h3><p className="text-xs text-emerald-400 mt-1">+18% vs periodo anterior</p></div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><div className="p-3 bg-zinc-800 rounded-xl text-blue-400 w-fit mb-3"><Users size={20} /></div><p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Clientes Ativos</p><h3 className="text-2xl font-bold text-zinc-100">{clients.filter(c => c.status === "active").length}</h3><p className="text-xs text-blue-400 mt-1">de {clients.length} total</p></div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><div className="p-3 bg-zinc-800 rounded-xl text-purple-400 w-fit mb-3"><Zap size={20} /></div><p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Automacoes</p><h3 className="text-2xl font-bold text-zinc-100">29.800</h3><p className="text-xs text-purple-400 mt-1">execucoes no periodo</p></div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><div className="p-3 bg-zinc-800 rounded-xl text-amber-400 w-fit mb-3"><TrendingUp size={20} /></div><p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Leads Convertidos</p><h3 className="text-2xl font-bold text-zinc-100">127</h3><p className="text-xs text-amber-400 mt-1">taxa de 44%</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-zinc-100 mb-6 flex items-center gap-2 uppercase tracking-widest"><DollarSign size={16} className="text-emerald-400" /> Receita Mensal</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$ ${v/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-zinc-100 mb-6 flex items-center gap-2 uppercase tracking-widest"><Zap size={16} className="text-purple-400" /> Automacoes Executadas</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={automationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                <Bar dataKey="execucoes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
        <h3 className="text-sm font-bold text-zinc-100 mb-6 flex items-center gap-2 uppercase tracking-widest"><TrendingUp size={16} className="text-amber-400" /> Leads: Total vs Convertidos</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leadsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="convertidos" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-xs text-zinc-500">Total</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-xs text-zinc-500">Convertidos</span></div>
        </div>
      </div>
    </div>
  );
};
