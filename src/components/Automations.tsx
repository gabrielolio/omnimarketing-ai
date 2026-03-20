import React, { useState } from "react";
import { Zap, Instagram, Globe, Play, Pause, Plus, Trash2, Edit2, Share2, ArrowRight, ChevronRight, Settings, Clock, Filter, MousePointer2, ArrowLeft, Save, Sparkles, Bot, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/types";
import { useAutomationsStore } from "@/src/stores/useAutomationsStore";
import { toast } from "sonner";

const AutomationBuilder = ({ onBack }: { onBack: () => void }) => {
  const { builderSteps, addBuilderStep, removeBuilderStep, resetBuilder } = useAutomationsStore();
  const iconMap: Record<string, any> = { zap: Zap, filter: Filter, bot: Bot, instagram: Instagram, globe: Globe, clock: Clock, share: Share2, save: Save };

  const handleSaveDraft = () => { toast.success("Rascunho salvo!"); };
  const handlePublish = () => { toast.success("Fluxo publicado com sucesso!"); onBack(); };
  const handleAddStep = (type: string, title: string, subtitle: string, color: string, iconType: string) => {
    addBuilderStep({ type: type as any, title, subtitle, color: color as any, iconType: iconType as any });
    toast.success("Passo adicionado!");
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200 transition-all"><ArrowLeft size={20} /></button>
          <div><h2 className="text-2xl font-bold text-zinc-100">Editor de Fluxo</h2><p className="text-sm text-zinc-500">Crie automacoes complexas com IA</p></div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSaveDraft} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors">Salvar Rascunho</button>
          <button onClick={handlePublish} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"><Save size={18} />Publicar Fluxo</button>
        </div>
      </div>
      <div className="flex-1 flex gap-8 overflow-hidden">
        <div className="w-72 shrink-0 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Biblioteca de Passos</h3>
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Gatilhos</p>
              {[{icon: Instagram, label: "Instagram DM", color: "text-pink-400", ic: "instagram"}, {icon: Globe, label: "Webhook", color: "text-blue-400", ic: "globe"}, {icon: Clock, label: "Agendamento", color: "text-emerald-400", ic: "clock"}].map((item, i) => (
                <button key={i} onClick={() => handleAddStep("trigger", "Gatilho: " + item.label, "Configurar gatilho", "emerald", item.ic)} className="w-full flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all text-left group">
                  <item.icon size={18} className={item.color} /><span className="text-sm text-zinc-300 group-hover:text-zinc-100">{item.label}</span>
                </button>
              ))}
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest pt-2">Acoes</p>
              {[{icon: Bot, label: "IA Gemini", color: "text-blue-400", ic: "bot"}, {icon: Share2, label: "Notificacao", color: "text-amber-400", ic: "share"}, {icon: Save, label: "Salvar Lead", color: "text-emerald-400", ic: "save"}].map((item, i) => (
                <button key={i} onClick={() => handleAddStep("action", "Acao: " + item.label, "Configurar acao", "blue", item.ic)} className="w-full flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all text-left group">
                  <item.icon size={18} className={item.color} /><span className="text-sm text-zinc-300 group-hover:text-zinc-100">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 bg-zinc-950 rounded-3xl border border-zinc-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)", backgroundSize: "32px 32px" }} />
          <div className="absolute inset-0 overflow-y-auto p-12 custom-scrollbar">
            <div className="max-w-2xl mx-auto space-y-12 relative">
              {builderSteps.map((step, index) => {
                const StepIcon = iconMap[step.iconType] || Zap;
                return (
                  <div key={step.id} className="relative">
                    {index < builderSteps.length - 1 && <div className="absolute left-1/2 -bottom-12 w-[2px] h-12 bg-gradient-to-b from-zinc-800 to-zinc-800/0" />}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative group/step">
                      <div className="flex items-start gap-6">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border", step.color === "emerald" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : step.color === "amber" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20")}><StepIcon size={24} /></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-zinc-100">{step.title}</h3>
                            <div className="flex items-center gap-2 opacity-0 group-hover/step:opacity-100 transition-opacity">
                              <button className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all"><Settings size={14} /></button>
                              <button onClick={() => { removeBuilderStep(step.id); toast.success("Passo removido!"); }} className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                            </div>
                          </div>
                          <p className="text-sm text-zinc-500">{step.subtitle}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
              <div className="flex justify-center pt-4">
                <button onClick={() => handleAddStep("action", "Nova Acao", "Clique para configurar", "blue", "zap")} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex items-center justify-center group shadow-lg"><Plus size={20} className="group-hover:scale-110 transition-transform" /></button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-2 rounded-xl">
            <button className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors"><MousePointer2 size={18} /></button>
            <div className="w-[1px] h-4 bg-zinc-800 mx-1" /><span className="text-xs font-mono text-zinc-500 px-2">100%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Automations = () => {
  const { automations, remove, toggleStatus } = useAutomationsStore();
  const [view, setView] = useState<"list" | "builder">("list");
  const [filter, setFilter] = useState<"all" | "instagram" | "website">("all");
  const [editId, setEditId] = useState<string | null>(null);

  const filtered = automations.filter(a => filter === "all" || a.type === filter);

  const handleDelete = (id: string) => { remove(id); toast.success("Automacao removida!"); };
  const handleToggle = (id: string) => { toggleStatus(id); toast.success("Status atualizado!"); };

  return (
    <AnimatePresence mode="wait">
      {view === "list" ? (
        <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              {(["all", "instagram", "website"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={cn("px-4 py-2 text-sm font-medium rounded-lg transition-all", filter === f ? "bg-zinc-800 text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-300")}>{f === "all" ? "Todos" : f === "instagram" ? "Instagram" : "Website"}</button>
              ))}
            </div>
            <button onClick={() => setView("builder")} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20"><Plus size={20} />Nova Automacao</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((automation) => (
              <motion.div key={automation.id} layout className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-3 rounded-xl", automation.type === "instagram" ? "bg-pink-500/10 text-pink-400" : "bg-blue-500/10 text-blue-400")}>{automation.type === "instagram" ? <Instagram size={24} /> : <Globe size={24} />}</div>
                    <div><h3 className="font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">{automation.name}</h3><p className="text-xs text-zinc-500">Ultima execucao: {automation.lastRun}</p></div>
                  </div>
                  <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                    automation.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : automation.status === "paused" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-zinc-800 text-zinc-500 border-zinc-700")}>
                    {automation.status === "active" && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                    {automation.status === "active" ? "Ativo" : automation.status === "paused" ? "Pausado" : "Rascunho"}
                  </div>
                </div>
                <p className="text-sm text-zinc-400 mb-6 line-clamp-2">{automation.description}</p>
                <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-950/50 rounded-xl mb-6">
                  <div><p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Execucoes</p><p className="text-lg font-bold text-zinc-200">{automation.runs.toLocaleString()}</p></div>
                  <div><p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Sucesso</p><p className="text-lg font-bold text-emerald-400">{automation.successRate}%</p></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setView("builder")} className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(automation.id)} className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"><Trash2 size={18} /></button>
                  </div>
                  <button onClick={() => handleToggle(automation.id)} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                    automation.status === "active" ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700" : automation.status === "draft" ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20" : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30")}>
                    {automation.status === "active" ? <><Pause size={18} /> Pausar</> : automation.status === "draft" ? <><Play size={18} /> Publicar</> : <><Play size={18} /> Iniciar</>}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <AutomationBuilder onBack={() => setView("list")} />
      )}
    </AnimatePresence>
  );
};
