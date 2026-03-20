import React, { useState } from "react";
import { FileText, Download, Eye, Calendar, DollarSign, AlertCircle, CheckCircle2, ArrowLeft, Share2, Printer, ShieldCheck, Clock, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/types";
import { useContractsStore, ContractData } from "@/src/stores/useContractsStore";
import { useClientsStore } from "@/src/stores/useClientsStore";
import { toast } from "sonner";

const ContractDetail = ({ contract, onBack }: { contract: ContractData; onBack: () => void }) => {
  const { update } = useContractsStore();
  const [showLogs, setShowLogs] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200 transition-all"><ArrowLeft size={20} /></button>
          <div><div className="flex items-center gap-2"><h2 className="text-2xl font-bold text-zinc-100">{contract.id}</h2><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", contract.status === "signed" ? "bg-emerald-500/10 text-emerald-400" : contract.status === "cancelled" ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400")}>{contract.status === "signed" ? "Assinado" : contract.status === "cancelled" ? "Anulado" : "Aguardando"}</span></div><p className="text-sm text-zinc-500">{contract.client} - {contract.service}</p></div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copiado!"); }} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200"><Share2 size={20} /></button>
          <button onClick={() => window.print()} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200"><Printer size={20} /></button>
          <button onClick={() => { window.print(); toast.success("Preparando PDF..."); }} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"><Download size={20} />Baixar PDF</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-12 shadow-2xl min-h-[600px] text-zinc-900 font-serif relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
            <div className="flex justify-between items-start mb-16"><div><h1 className="text-3xl font-bold mb-2">CONTRATO DE PRESTACAO DE SERVICOS</h1><p className="text-zinc-500 font-sans text-sm uppercase tracking-widest">Ref: {contract.id}</p></div><div className="text-right font-sans"><p className="font-bold">AIOX</p><p className="text-sm text-zinc-500">Campo Grande, MS</p></div></div>
            <div className="space-y-8 text-sm leading-relaxed">
              <section><h3 className="font-bold uppercase mb-4 border-b border-zinc-200 pb-2">1. OBJETO</h3><p>{contract.description}</p></section>
              <section><h3 className="font-bold uppercase mb-4 border-b border-zinc-200 pb-2">2. VALORES</h3><p>Valor total: <span className="font-bold">{contract.amount}</span>, pagos mensalmente.</p></section>
              <section><h3 className="font-bold uppercase mb-4 border-b border-zinc-200 pb-2">3. TERMOS</h3><p>{contract.terms}</p></section>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6"><h3 className="font-bold text-zinc-100 mb-4">Status</h3><div className="flex items-center gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800"><div className={cn("p-2 rounded-lg", contract.status === "signed" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400")}>{contract.status === "signed" ? <ShieldCheck size={18} /> : <Clock size={18} />}</div><div><p className="text-xs font-bold text-zinc-200 uppercase tracking-widest">{contract.status === "signed" ? "Verificado" : "Pendente"}</p><p className="text-[10px] text-zinc-500">{contract.date}</p></div></div></div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6"><h3 className="font-bold text-zinc-100 mb-4">Acoes</h3><div className="space-y-2">
            <button onClick={() => toast.success("Link reenviado!")} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"><Share2 size={16} />Reenviar Link</button>
            <button onClick={() => setShowLogs(true)} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"><Eye size={16} />Ver Logs de Acesso</button>
            <button onClick={() => { update(contract.id, { status: "cancelled" }); toast.success("Contrato anulado"); onBack(); }} className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-sm font-bold transition-all">Anular Contrato</button>
          </div></div>
        </div>
      </div>
      <AnimatePresence>
        {showLogs && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between"><h3 className="text-lg font-bold text-zinc-100">Logs de Acesso</h3><button onClick={() => setShowLogs(false)} className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400"><X size={20} /></button></div>
              <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {[{time: "19 Mar, 10:30", action: "Documento visualizado", user: "Gabriel"}, {time: "18 Mar, 14:20", action: "Link compartilhado", user: "Gabriel"}, {time: "18 Mar, 09:00", action: "Contrato criado", user: "Sistema"}].map((log, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800"><div className="flex-1"><p className="text-xs text-zinc-200">{log.action}</p><p className="text-[10px] text-zinc-500">{log.time} - {log.user}</p></div></div>
                ))}
              </div>
              <div className="p-6 border-t border-zinc-800"><button onClick={() => setShowLogs(false)} className="w-full py-3 bg-zinc-800 text-zinc-200 rounded-xl font-bold">Fechar</button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Contracts = () => {
  const { contracts, add } = useContractsStore();
  const { clients } = useClientsStore();
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedContract, setSelectedContract] = useState(contracts[0]);
  const [showNewContract, setShowNewContract] = useState(false);
  const [nc, setNc] = useState({ client: "", service: "", amount: "", description: "", terms: "" });

  const handleAdd = () => {
    if (!nc.client || !nc.amount) return;
    const today = new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" });
    add({ client: nc.client, service: nc.service, amount: nc.amount, date: today, status: "pending", description: nc.description, terms: nc.terms });
    setNc({ client: "", service: "", amount: "", description: "", terms: "" });
    setShowNewContract(false);
    toast.success("Contrato criado!");
  };

  return (
    <AnimatePresence mode="wait">
      {view === "list" ? (
        <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl"><div className="flex items-center gap-4 mb-4"><div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl"><DollarSign size={24} /></div><div><p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Receita Mensal</p><h3 className="text-2xl font-bold text-zinc-100">R$ 28.500</h3></div></div></div>
            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl"><div className="flex items-center gap-4 mb-4"><div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl"><FileText size={24} /></div><div><p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Contratos Ativos</p><h3 className="text-2xl font-bold text-zinc-100">{contracts.filter(c => c.status === "signed").length}</h3></div></div></div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><div className="flex items-center gap-4 mb-4"><div className="p-3 bg-zinc-800 text-zinc-400 rounded-xl"><Calendar size={24} /></div><div><p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Pendentes</p><h3 className="text-2xl font-bold text-zinc-100">{contracts.filter(c => c.status === "pending").length}</h3></div></div></div>
          </div>
          <div className="flex justify-between items-center"><h3 className="text-lg font-semibold text-zinc-100">Contratos Recentes</h3><button onClick={() => setShowNewContract(true)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"><FileText size={18} />Novo Contrato</button></div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6"><div className="space-y-4">
            {contracts.map((contract) => (
              <div key={contract.id} onClick={() => { setSelectedContract(contract); setView("detail"); }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all group cursor-pointer">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className={cn("p-3 rounded-xl", contract.status === "signed" ? "bg-emerald-500/10 text-emerald-400" : contract.status === "cancelled" ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400")}><FileText size={20} /></div>
                  <div><div className="flex items-center gap-2"><h4 className="font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">{contract.client}</h4><span className="text-[10px] font-mono text-zinc-600">{contract.id}</span></div><p className="text-xs text-zinc-500">{contract.service} - {contract.date}</p></div>
                </div>
                <div className="flex items-center gap-8"><p className="font-bold text-zinc-200">{contract.amount}</p>
                  <span className={cn("text-[10px] font-bold uppercase", contract.status === "signed" ? "text-emerald-500" : contract.status === "cancelled" ? "text-rose-500" : "text-amber-500")}>{contract.status === "signed" ? "Assinado" : contract.status === "cancelled" ? "Anulado" : "Pendente"}</span>
                </div>
              </div>
            ))}
          </div></div>
          <AnimatePresence>
            {showNewContract && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                  <div className="p-6 border-b border-zinc-800 flex items-center justify-between"><h3 className="text-lg font-bold text-zinc-100">Novo Contrato</h3><button onClick={() => setShowNewContract(false)} className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400"><X size={20} /></button></div>
                  <div className="p-6 space-y-4">
                    <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Cliente</label><select value={nc.client} onChange={e => setNc({...nc, client: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none"><option value="">Selecione...</option>{clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
                    <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Servico</label><input type="text" value={nc.service} onChange={e => setNc({...nc, service: e.target.value})} placeholder="Nome do servico" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none" /></div>
                    <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Valor</label><input type="text" value={nc.amount} onChange={e => setNc({...nc, amount: e.target.value})} placeholder="R$ 5.000,00" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none" /></div>
                    <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Descricao</label><textarea value={nc.description} onChange={e => setNc({...nc, description: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none h-20 resize-none" /></div>
                  </div>
                  <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 flex gap-3">
                    <button onClick={() => setShowNewContract(false)} className="flex-1 py-3 bg-zinc-800 text-zinc-200 rounded-xl font-bold hover:bg-zinc-700 transition-all">Cancelar</button>
                    <button onClick={handleAdd} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all">Criar</button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <ContractDetail contract={selectedContract} onBack={() => setView("list")} />
      )}
    </AnimatePresence>
  );
};
