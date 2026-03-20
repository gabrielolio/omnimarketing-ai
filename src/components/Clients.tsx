import React, { useState } from "react";
import { Users, UserPlus, MoreHorizontal, Mail, ExternalLink, Briefcase, Clock, Search, Filter, Phone, Calendar, DollarSign, TrendingUp, ArrowUpRight, ArrowLeft, History, MessageSquare, Zap, Globe, Instagram, ChevronRight, MoreVertical, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/types";
import { useClientsStore, ClientData } from "@/src/stores/useClientsStore";
import { toast } from "sonner";

const ClientProfile = ({ client, onBack }: { client: ClientData; onBack: () => void }) => {
  const { update } = useClientsStore();
  const [notes, setNotes] = useState(client.notes);

  const handleSaveNotes = () => { update(client.id, { notes }); toast.success("Notas salvas!"); };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200"><ArrowLeft size={20} /></button>
          <div className="flex items-center gap-4">
            <img src={client.avatar} alt={client.name} className="w-12 h-12 rounded-2xl object-cover border border-zinc-800" referrerPolicy="no-referrer" />
            <div><h2 className="text-2xl font-bold text-zinc-100">{client.name}</h2><div className="flex items-center gap-3 text-sm text-zinc-500"><span className="flex items-center gap-1"><Mail size={14} /> {client.email}</span><span className="w-1 h-1 bg-zinc-700 rounded-full" /><span className="flex items-center gap-1"><Calendar size={14} /> Desde {client.joined}</span></div></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => toast.success("Menu de opcoes")} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200"><MoreVertical size={20} /></button>
          <button onClick={() => toast.success("Criar projeto")} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20">Novo Projeto</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Receita Total</p><h3 className="text-2xl font-bold text-zinc-100">{client.revenue}</h3></div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Projetos</p><h3 className="text-2xl font-bold text-zinc-100">{client.projects}</h3></div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Automacoes</p><h3 className="text-2xl font-bold text-zinc-100">8</h3></div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6"><h3 className="font-bold text-zinc-100 mb-6 flex items-center gap-2"><History size={18} className="text-blue-400" />Historico</h3>
            <div className="space-y-6">{[{msg: "Reuniao de alinhamento mensal", time: "Ha 3 dias"}, {msg: "Automacao de Leads atualizada", time: "Ha 6 dias"}, {msg: "Novo projeto criado", time: "Ha 9 dias"}].map((item, i) => (
              <div key={i} className="flex gap-4"><div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0"><MessageSquare size={14} className="text-emerald-400" /></div><div><p className="text-sm text-zinc-200 font-medium">{item.msg}</p><p className="text-xs text-zinc-500 mt-1">{item.time}</p></div></div>
            ))}</div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6"><h3 className="font-bold text-zinc-100 mb-4">Contato</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800"><Phone size={16} className="text-zinc-500" /><span className="text-sm text-zinc-300">{client.phone}</span></div>
              <button onClick={() => { window.open("mailto:" + client.email); }} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-sm font-bold transition-all">Enviar E-mail</button>
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6"><h3 className="font-bold text-zinc-100 mb-4">Notas Internas</h3>
            <textarea className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-400 focus:ring-1 focus:ring-emerald-500 outline-none h-32 resize-none" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Adicione notas..." />
            <button onClick={handleSaveNotes} className="w-full mt-3 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-sm font-bold hover:bg-emerald-500/20 transition-all">Salvar Notas</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Clients = () => {
  const { clients, add } = useClientsStore();
  const [view, setView] = useState<"list" | "profile">("list");
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [showNewClient, setShowNewClient] = useState(false);
  const [nc, setNc] = useState({ name: "", email: "", phone: "", status: "active" as const });

  const filtered = clients.filter(c => (c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())) && (statusFilter === "all" || c.status === statusFilter));

  const handleAdd = () => {
    if (!nc.name || !nc.email) return;
    add({ name: nc.name, email: nc.email, phone: nc.phone, status: nc.status, projects: 0, revenue: "R$ 0", avatar: "https://picsum.photos/seed/" + Date.now() + "/100/100", joined: "Mar 2026", lastActive: "Agora", notes: "" });
    setNc({ name: "", email: "", phone: "", status: "active" });
    setShowNewClient(false);
    toast.success("Cliente criado!");
  };

  return (
    <AnimatePresence mode="wait">
      {view === "list" ? (
        <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><div className="flex justify-between items-start mb-4"><div className="p-3 bg-zinc-800 rounded-xl text-emerald-400"><Users size={24} /></div><div className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><ArrowUpRight size={14} />+4</div></div><p className="text-zinc-500 text-sm mb-1">Total de Clientes</p><h3 className="text-2xl font-bold text-zinc-100">{clients.length}</h3></div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><div className="flex justify-between items-start mb-4"><div className="p-3 bg-zinc-800 rounded-xl text-blue-400"><DollarSign size={24} /></div></div><p className="text-zinc-500 text-sm mb-1">MRR</p><h3 className="text-2xl font-bold text-zinc-100">R$ 28.500</h3></div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><div className="flex justify-between items-start mb-4"><div className="p-3 bg-zinc-800 rounded-xl text-amber-400"><TrendingUp size={24} /></div></div><p className="text-zinc-500 text-sm mb-1">Retencao</p><h3 className="text-2xl font-bold text-zinc-100">92%</h3></div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-96"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} /><input type="text" placeholder="Buscar clientes..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 focus:ring-2 focus:ring-emerald-500/50 outline-none" /></div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative"><button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-800"><Filter size={18} />Filtros</button>
                {showFilters && (<div className="absolute top-full mt-2 right-0 bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-2xl z-20 w-40">{(["all", "active", "inactive"] as const).map(s => (<button key={s} onClick={() => { setStatusFilter(s); setShowFilters(false); }} className={cn("w-full text-left px-3 py-2 rounded-lg text-sm", statusFilter === s ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-400 hover:bg-zinc-800")}>{s === "all" ? "Todos" : s === "active" ? "Ativos" : "Inativos"}</button>))}</div>)}
              </div>
              <button onClick={() => setShowNewClient(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-zinc-100 text-zinc-950 px-5 py-2.5 rounded-xl font-bold hover:bg-white transition-all"><UserPlus size={20} />Novo Cliente</button>
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="border-b border-zinc-800 bg-zinc-950/50">
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cliente</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Projetos</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Receita</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Atividade</th>
              <th className="px-6 py-4 text-right">Acoes</th>
            </tr></thead><tbody className="divide-y divide-zinc-800">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-zinc-800/30 transition-colors group cursor-pointer" onClick={() => { setSelectedClient(client); setView("profile"); }}>
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={client.avatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-zinc-800" referrerPolicy="no-referrer" /><div><p className="text-sm font-bold text-zinc-200 group-hover:text-emerald-400">{client.name}</p><p className="text-xs text-zinc-500">{client.email}</p></div></div></td>
                  <td className="px-6 py-4"><span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase", client.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-500")}><div className={cn("w-1.5 h-1.5 rounded-full", client.status === "active" ? "bg-emerald-500" : "bg-zinc-600")} />{client.status === "active" ? "Ativo" : "Inativo"}</span></td>
                  <td className="px-6 py-4"><span className="text-sm text-zinc-300 font-medium">{client.projects}</span></td>
                  <td className="px-6 py-4"><p className="text-sm font-bold text-zinc-200">{client.revenue}</p></td>
                  <td className="px-6 py-4"><p className="text-xs text-zinc-500">{client.lastActive}</p></td>
                  <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-2">
                    <button onClick={(e) => { e.stopPropagation(); window.open("mailto:" + client.email); }} className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg"><Mail size={18} /></button>
                    <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(client.email); toast.success("Email copiado!"); }} className="p-2 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg"><ExternalLink size={18} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody></table></div>
            {filtered.length === 0 && (<div className="p-12 text-center"><Users size={48} className="mx-auto text-zinc-700 mb-4" /><p className="text-zinc-500">Nenhum cliente encontrado.</p></div>)}
          </div>
          <AnimatePresence>
            {showNewClient && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                  <div className="p-6 border-b border-zinc-800 flex items-center justify-between"><h3 className="text-lg font-bold text-zinc-100">Novo Cliente</h3><button onClick={() => setShowNewClient(false)} className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400"><X size={20} /></button></div>
                  <div className="p-6 space-y-4">
                    <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Nome</label><input type="text" value={nc.name} onChange={e => setNc({...nc, name: e.target.value})} placeholder="Nome da empresa" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none" /></div>
                    <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Email</label><input type="email" value={nc.email} onChange={e => setNc({...nc, email: e.target.value})} placeholder="email@empresa.com" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none" /></div>
                    <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Telefone</label><input type="text" value={nc.phone} onChange={e => setNc({...nc, phone: e.target.value})} placeholder="+55 11 99999-9999" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none" /></div>
                  </div>
                  <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 flex gap-3">
                    <button onClick={() => setShowNewClient(false)} className="flex-1 py-3 bg-zinc-800 text-zinc-200 rounded-xl font-bold hover:bg-zinc-700">Cancelar</button>
                    <button onClick={handleAdd} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600">Criar</button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <ClientProfile client={selectedClient} onBack={() => setView("list")} />
      )}
    </AnimatePresence>
  );
};
