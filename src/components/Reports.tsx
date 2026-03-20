import React, { useState } from "react";
import { BarChart3, Download, Users, DollarSign, Zap, TrendingUp, Bot, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { motion } from "motion/react";
import { cn } from "@/src/types";
import { useClientsStore } from "@/src/stores/useClientsStore";
import { useContractsStore } from "@/src/stores/useContractsStore";
import { useAutomationsStore } from "@/src/stores/useAutomationsStore";
import { useAgentsStore } from "@/src/stores/useAgentsStore";
import { useCalendarStore } from "@/src/stores/useCalendarStore";
import { usePipelineStore } from "@/src/stores/usePipelineStore";
import { toast } from "sonner";

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#3b82f6', '#8b5cf6'];

export const Reports = () => {
  const { clients } = useClientsStore();
  const { contracts } = useContractsStore();
  const { automations } = useAutomationsStore();
  const { agents } = useAgentsStore();
  const { posts } = useCalendarStore();
  const { leads } = usePipelineStore();
  const [selectedClient, setSelectedClient] = useState("all");

  // Filter data by selected client
  const filteredContracts = selectedClient === "all" ? contracts : contracts.filter(c => c.client_id === selectedClient);
  const filteredAutomations = selectedClient === "all" ? automations : automations.filter(a => a.client_id === selectedClient);
  const filteredAgents = selectedClient === "all" ? agents : agents.filter(a => a.client_id === selectedClient);
  const filteredPosts = selectedClient === "all" ? posts : posts.filter(p => p.client_id === selectedClient);
  const filteredLeads = selectedClient === "all" ? leads : leads.filter(l => l.client_id === selectedClient);

  // Real stats
  const totalRevenue = filteredContracts.filter(c => c.status === 'signed').reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const totalRuns = filteredAutomations.reduce((sum, a) => sum + (a.runs_count || 0), 0);
  const activeAutomations = filteredAutomations.filter(a => a.status === 'active').length;
  const closedLeads = filteredLeads.filter(l => l.stage === 'closed').length;
  const conversionRate = filteredLeads.length > 0 ? Math.round((closedLeads / filteredLeads.length) * 100) : 0;

  // Revenue per client chart
  const revenueByClient = clients.map(c => {
    const clientContracts = contracts.filter(ct => ct.client_id === c.id && ct.status === 'signed');
    const revenue = clientContracts.reduce((sum, ct) => sum + (Number(ct.amount) || 0), 0);
    return { name: c.name.length > 12 ? c.name.slice(0, 12) + '...' : c.name, value: revenue, fullName: c.name };
  }).filter(c => c.value > 0);

  // Automations per client
  const automationsByClient = clients.map(c => ({
    name: c.name.split(' ')[0],
    total: automations.filter(a => a.client_id === c.id).length,
    ativas: automations.filter(a => a.client_id === c.id && a.status === 'active').length,
    execucoes: automations.filter(a => a.client_id === c.id).reduce((sum, a) => sum + (a.runs_count || 0), 0),
  }));

  // Posts per status
  const postsByStatus = [
    { name: 'Aprovado', value: filteredPosts.filter(p => p.status === 'approved').length, color: '#10b981' },
    { name: 'Agendado', value: filteredPosts.filter(p => p.status === 'scheduled').length, color: '#3b82f6' },
    { name: 'Rascunho', value: filteredPosts.filter(p => p.status === 'draft').length, color: '#71717a' },
    { name: 'Publicado', value: filteredPosts.filter(p => p.status === 'published').length, color: '#8b5cf6' },
  ].filter(p => p.value > 0);

  // Leads per stage
  const leadsByStage = [
    { name: 'Novo', count: filteredLeads.filter(l => l.stage === 'new').length },
    { name: 'Qualificado', count: filteredLeads.filter(l => l.stage === 'qualified').length },
    { name: 'Proposta', count: filteredLeads.filter(l => l.stage === 'proposal').length },
    { name: 'Negociacao', count: filteredLeads.filter(l => l.stage === 'negotiation').length },
    { name: 'Fechado', count: filteredLeads.filter(l => l.stage === 'closed').length },
    { name: 'Perdido', count: filteredLeads.filter(l => l.stage === 'lost').length },
  ].filter(l => l.count > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h2 className="text-2xl font-bold text-zinc-100">Relatorios</h2><p className="text-sm text-zinc-500">Dados reais da operacao AIOX</p></div>
        <div className="flex items-center gap-3">
          <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none">
            <option value="all">Todos os clientes</option>
            {clients.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
          <button onClick={() => { window.print(); toast.success("Preparando exportacao..."); }} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"><Download size={18} /> Exportar</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <div className="p-3 bg-zinc-800 rounded-xl text-emerald-400 w-fit mb-3"><DollarSign size={20} /></div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">MRR Total</p>
          <h3 className="text-2xl font-bold text-zinc-100">R$ {totalRevenue.toLocaleString('pt-BR')}</h3>
          <p className="text-xs text-emerald-400 mt-1">{filteredContracts.filter(c => c.status === 'signed').length} contratos ativos</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <div className="p-3 bg-zinc-800 rounded-xl text-blue-400 w-fit mb-3"><Users size={20} /></div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Clientes Ativos</p>
          <h3 className="text-2xl font-bold text-zinc-100">{clients.filter(c => c.status === "active").length}</h3>
          <p className="text-xs text-blue-400 mt-1">de {clients.length} total</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <div className="p-3 bg-zinc-800 rounded-xl text-purple-400 w-fit mb-3"><Zap size={20} /></div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Automacoes</p>
          <h3 className="text-2xl font-bold text-zinc-100">{activeAutomations} ativas</h3>
          <p className="text-xs text-purple-400 mt-1">{totalRuns.toLocaleString()} execucoes total</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <div className="p-3 bg-zinc-800 rounded-xl text-amber-400 w-fit mb-3"><TrendingUp size={20} /></div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Pipeline</p>
          <h3 className="text-2xl font-bold text-zinc-100">{filteredLeads.length} leads</h3>
          <p className="text-xs text-amber-400 mt-1">{closedLeads} fechados ({conversionRate}%)</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-zinc-100 mb-6 flex items-center gap-2 uppercase tracking-widest"><DollarSign size={16} className="text-emerald-400" /> Receita por Cliente</h3>
          <div className="h-[300px]">
            {revenueByClient.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByClient}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$ ${v/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Receita']} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {revenueByClient.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500">Nenhum dado de receita</div>
            )}
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-zinc-100 mb-6 flex items-center gap-2 uppercase tracking-widest"><Zap size={16} className="text-purple-400" /> Automacoes por Cliente</h3>
          <div className="h-[300px]">
            {automationsByClient.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={automationsByClient}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                  <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total" />
                  <Bar dataKey="ativas" fill="#10b981" radius={[4, 4, 0, 0]} name="Ativas" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500">Nenhuma automacao</div>
            )}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-xs text-zinc-500">Total</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-xs text-zinc-500">Ativas</span></div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-zinc-100 mb-6 flex items-center gap-2 uppercase tracking-widest"><Calendar size={16} className="text-blue-400" /> Posts por Status</h3>
          <div className="h-[250px] flex items-center justify-center">
            {postsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={postsByStatus} cx="50%" cy="50%" outerRadius={80} innerRadius={50} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {postsByStatus.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-zinc-500 text-sm">Nenhum post</p>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {postsByStatus.map(p => (
              <div key={p.name} className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} /><span className="text-[10px] text-zinc-500 uppercase font-bold">{p.name}</span></div>
            ))}
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-zinc-100 mb-6 flex items-center gap-2 uppercase tracking-widest"><TrendingUp size={16} className="text-amber-400" /> Pipeline de Vendas</h3>
          <div className="h-[250px]">
            {leadsByStage.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadsByStage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                  <XAxis type="number" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {leadsByStage.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500">Nenhum lead no pipeline</div>
            )}
          </div>
        </div>
      </div>

      {/* Agents Summary */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
        <h3 className="text-sm font-bold text-zinc-100 mb-6 flex items-center gap-2 uppercase tracking-widest"><Bot size={16} className="text-emerald-400" /> Performance dos Agentes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredAgents.map(a => (
            <div key={a.id} className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-zinc-200">{a.name}</span>
                <div className={cn("w-2 h-2 rounded-full", a.status === 'online' ? "bg-emerald-500" : "bg-zinc-600")} />
              </div>
              <p className="text-xs text-zinc-500 mb-3">{a.role}</p>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Precisao</span>
                <span className="text-emerald-400 font-bold">{a.accuracy}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${a.accuracy}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
