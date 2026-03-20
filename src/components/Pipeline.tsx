import React, { useState } from "react";
import { Plus, DollarSign, Users, TrendingUp, GripVertical, Mail, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/types";
import { usePipelineStore, PipelineColumn } from "@/src/stores/usePipelineStore";
import { toast } from "sonner";

const columns: { id: PipelineColumn; label: string; color: string }[] = [
  { id: "novo", label: "Novo Lead", color: "bg-blue-500" },
  { id: "qualificado", label: "Qualificado", color: "bg-purple-500" },
  { id: "proposta", label: "Proposta Enviada", color: "bg-amber-500" },
  { id: "negociacao", label: "Negociacao", color: "bg-orange-500" },
  { id: "fechado", label: "Fechado", color: "bg-emerald-500" },
  { id: "perdido", label: "Perdido", color: "bg-rose-500" },
];

function parseValue(v: string): number {
  const cleaned = v.replace(/[^0-9.,]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

export const Pipeline = () => {
  const { leads, add, moveToColumn } = usePipelineStore();
  const [showNewLead, setShowNewLead] = useState(false);
  const [draggedLead, setDraggedLead] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<PipelineColumn | null>(null);
  const [newLead, setNewLead] = useState({ name: "", value: "", email: "" });

  const handleAddLead = () => {
    if (!newLead.name || !newLead.value) return;
    const val = newLead.value.startsWith("R$") ? newLead.value : "R$ " + newLead.value;
    add({ name: newLead.name, value: val, email: newLead.email, date: new Date().toISOString().substring(0, 10), lastContact: "Agora", column: "novo" });
    setNewLead({ name: "", value: "", email: "" });
    setShowNewLead(false);
    toast.success("Lead adicionado!");
  };

  const totalValue = leads.filter(l => l.column !== "perdido").reduce((acc, l) => acc + parseValue(l.value), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h2 className="text-2xl font-bold text-zinc-100">Pipeline de Vendas</h2><p className="text-sm text-zinc-500">Arraste cards entre colunas</p></div>
        <button onClick={() => setShowNewLead(true)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"><Plus size={20} /> Novo Lead</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-zinc-800 rounded-lg text-emerald-400"><DollarSign size={20} /></div><p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Pipeline Total</p></div><h3 className="text-2xl font-bold text-zinc-100">R$ {totalValue.toLocaleString()}</h3></div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-zinc-800 rounded-lg text-blue-400"><Users size={20} /></div><p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Leads</p></div><h3 className="text-2xl font-bold text-zinc-100">{leads.length}</h3></div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-zinc-800 rounded-lg text-amber-400"><TrendingUp size={20} /></div><p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Conversao</p></div><h3 className="text-2xl font-bold text-zinc-100">{leads.length > 0 ? Math.round((leads.filter(l => l.column === "fechado").length / leads.length) * 100) : 0}%</h3></div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {columns.map(col => {
          const colLeads = leads.filter(l => l.column === col.id);
          return (
            <div key={col.id} className={cn("min-w-[280px] flex-1 bg-zinc-900/30 border rounded-2xl flex flex-col transition-all", dragOverColumn === col.id ? "border-emerald-500/50 bg-emerald-500/5" : "border-zinc-800")} onDragOver={(e) => { e.preventDefault(); setDragOverColumn(col.id); }} onDragLeave={() => setDragOverColumn(null)} onDrop={() => { if (draggedLead) { moveToColumn(draggedLead, col.id); toast.success("Lead movido!"); } setDraggedLead(null); setDragOverColumn(null); }}>
              <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2"><div className={cn("w-2 h-2 rounded-full", col.color)} /><span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">{col.label}</span></div>
                <span className="text-[10px] font-bold text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full">{colLeads.length}</span>
              </div>
              <div className="p-3 space-y-3 flex-1 min-h-[200px]">
                {colLeads.map(lead => (
                  <motion.div key={lead.id} layout draggable onDragStart={() => setDraggedLead(lead.id)} onDragEnd={() => { setDraggedLead(null); setDragOverColumn(null); }} className={cn("bg-zinc-950 border border-zinc-800 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-zinc-700 transition-all group", draggedLead === lead.id && "opacity-50")}>
                    <div className="flex items-start justify-between mb-2"><h4 className="text-sm font-bold text-zinc-200">{lead.name}</h4><GripVertical size={14} className="text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                    <p className="text-lg font-bold text-emerald-400 mb-2">{lead.value}</p>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500"><span>{lead.lastContact}</span>{lead.email && <Mail size={12} className="text-zinc-600" />}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <AnimatePresence>
        {showNewLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between"><h3 className="text-lg font-bold text-zinc-100">Novo Lead</h3><button onClick={() => setShowNewLead(false)} className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400"><X size={20} /></button></div>
              <div className="p-6 space-y-4">
                <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Nome</label><input type="text" value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} placeholder="Nome do lead" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:ring-2 focus:ring-emerald-500/50 outline-none" /></div>
                <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Valor</label><input type="text" value={newLead.value} onChange={e => setNewLead({...newLead, value: e.target.value})} placeholder="R$ 5.000" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:ring-2 focus:ring-emerald-500/50 outline-none" /></div>
                <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Email</label><input type="email" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} placeholder="email@exemplo.com" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:ring-2 focus:ring-emerald-500/50 outline-none" /></div>
              </div>
              <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 flex gap-3">
                <button onClick={() => setShowNewLead(false)} className="flex-1 py-3 bg-zinc-800 text-zinc-200 rounded-xl font-bold hover:bg-zinc-700 transition-all">Cancelar</button>
                <button onClick={handleAddLead} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">Adicionar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
