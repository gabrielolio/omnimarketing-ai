import React, { useState, useRef, useEffect } from "react";
import { Bot, Sparkles, Brain, MessageSquare, Settings2, RefreshCw, Plus, ArrowRight, ShieldCheck, Zap, Globe, FileText, ArrowLeft, Save, History, Send, User, Cpu, X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/types";
import { useAgentsStore, mockResponses, AgentData } from "@/src/stores/useAgentsStore";
import { toast } from "sonner";

const AgentPlayground = ({ agent, onBack }: { agent: AgentData; onBack: () => void }) => {
  const { chatMessages, addChatMessage, clearChat, update, addSource } = useAgentsStore();
  const [input, setInput] = useState("");
  const [showLogs, setShowLogs] = useState(false);
  const [showAddSource, setShowAddSource] = useState(false);
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [temperature, setTemperature] = useState(agent.temperature);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messages = chatMessages[agent.id] || [{ role: "assistant" as const, content: "Ola! Eu sou o " + agent.name + ". Como posso ajudar com as estrategias de marketing hoje?" }];

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    addChatMessage(agent.id, { role: "user", content: input });
    setInput("");
    setTimeout(() => {
      const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      addChatMessage(agent.id, { role: "assistant", content: response });
    }, 800);
  };

  const handleSaveTraining = () => { update(agent.id, { temperature }); toast.success("Treinamento salvo!"); };
  const handleClearChat = () => { clearChat(agent.id); toast.success("Chat limpo!"); };
  const handleAddSource = () => { if (!newSourceUrl) return; addSource(agent.id, { url: newSourceUrl, type: "web" }); setNewSourceUrl(""); setShowAddSource(false); toast.success("Fonte adicionada!"); };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200 transition-all"><ArrowLeft size={20} /></button>
          <div><h2 className="text-2xl font-bold text-zinc-100">Playground: {agent.name}</h2><p className="text-sm text-zinc-500">Teste e refine o comportamento da IA em tempo real</p></div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowLogs(!showLogs)} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-xl font-medium transition-all"><History size={18} />Logs</button>
          <button onClick={handleSaveTraining} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"><Save size={18} />Salvar Treinamento</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-280px)]">
        <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold text-zinc-100 mb-4 flex items-center gap-2"><Settings2 size={18} className="text-emerald-400" />Configuracoes de Core</h3>
            <div className="space-y-4">
              <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Modelo de Linguagem</label><div className="flex items-center gap-2 p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-300"><Cpu size={16} className="text-blue-400" />{agent.model}</div></div>
              <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Temperatura: {temperature.toFixed(1)}</label><input type="range" className="w-full accent-emerald-500" min="0" max="1" step="0.1" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))} /><div className="flex justify-between text-[10px] text-zinc-600 mt-1"><span>Preciso</span><span>Criativo</span></div></div>
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold text-zinc-100 mb-4 flex items-center gap-2"><Brain size={18} className="text-purple-400" />Base de Conhecimento</h3>
            <div className="space-y-3">
              {agent.sources.map((src, i) => (
                <div key={i} className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between group">
                  <div className="flex items-center gap-3"><Globe size={16} className="text-blue-400" /><span className="text-xs text-zinc-300 truncate">{src.url}</span></div>
                  <span className="text-[10px] text-emerald-500 font-bold">{src.synced ? "Sincronizado" : "Pendente"}</span>
                </div>
              ))}
              <button onClick={() => setShowAddSource(true)} className="w-full py-2 border border-dashed border-zinc-800 rounded-xl text-xs text-zinc-500 hover:border-zinc-600 hover:text-zinc-400 transition-all flex items-center justify-center gap-2"><Plus size={14} />Adicionar Fonte</button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/30 flex items-center justify-between">
            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /><span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Sessao de Teste Ativa</span></div>
            <button onClick={handleClearChat} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Limpar Chat</button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex gap-4 max-w-[85%]", msg.role === "user" ? "ml-auto flex-row-reverse" : "")}>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", msg.role === "assistant" ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-400")}>{msg.role === "assistant" ? <Bot size={18} /> : <User size={18} />}</div>
                <div className={cn("p-4 rounded-2xl text-sm leading-relaxed", msg.role === "assistant" ? "bg-zinc-800 text-zinc-200" : "bg-emerald-500/10 text-emerald-100 border border-emerald-500/20")}>{msg.content}</div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 bg-zinc-950/50 border-t border-zinc-800">
            <div className="relative">
              <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Digite uma mensagem para testar..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-4 pr-12 py-3 text-sm text-zinc-200 focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none" />
              <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all"><Send size={18} /></button>
            </div>
          </div>
        </div>
      </div>
      {/* Logs modal */}
      <AnimatePresence>
        {showLogs && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between"><h3 className="text-lg font-bold text-zinc-100">Logs do Agente</h3><button onClick={() => setShowLogs(false)} className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400"><X size={20} /></button></div>
              <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {[{time: "10:30", msg: "Sessao iniciada"}, {time: "10:31", msg: "Mensagem recebida de usuario"}, {time: "10:31", msg: "Resposta gerada (0.8s, 124 tokens)"}, {time: "10:35", msg: "Fonte de conhecimento atualizada"}, {time: "10:40", msg: "Temperatura ajustada para " + temperature.toFixed(1)}].map((log, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800"><span className="text-[10px] font-mono text-zinc-600 shrink-0">{log.time}</span><span className="text-xs text-zinc-400">{log.msg}</span></div>
                ))}
              </div>
              <div className="p-6 border-t border-zinc-800"><button onClick={() => setShowLogs(false)} className="w-full py-3 bg-zinc-800 text-zinc-200 rounded-xl font-bold hover:bg-zinc-700 transition-all">Fechar</button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Add source modal */}
      <AnimatePresence>
        {showAddSource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between"><h3 className="text-lg font-bold text-zinc-100">Adicionar Fonte</h3><button onClick={() => setShowAddSource(false)} className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400"><X size={20} /></button></div>
              <div className="p-6"><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">URL da Fonte</label><input type="text" value={newSourceUrl} onChange={e => setNewSourceUrl(e.target.value)} placeholder="https://meusite.com/dados" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:ring-2 focus:ring-emerald-500/50 outline-none" /></div>
              <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 flex gap-3">
                <button onClick={() => setShowAddSource(false)} className="flex-1 py-3 bg-zinc-800 text-zinc-200 rounded-xl font-bold hover:bg-zinc-700 transition-all">Cancelar</button>
                <button onClick={handleAddSource} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all">Adicionar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Agents = () => {
  const { agents, add } = useAgentsStore();
  const [view, setView] = useState<"list" | "playground">("list");
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [showNewAgent, setShowNewAgent] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: "", role: "", context: "", model: "Gemini 3 Flash" });

  const handleAddAgent = () => {
    if (!newAgent.name || !newAgent.role) return;
    add({ name: newAgent.name, role: newAgent.role, context: newAgent.context, status: "offline", tokens: "0", accuracy: "N/A", model: newAgent.model, temperature: 0.7, sources: [] });
    setNewAgent({ name: "", role: "", context: "", model: "Gemini 3 Flash" });
    setShowNewAgent(false);
    toast.success("Agente criado!");
  };

  return (
    <AnimatePresence mode="wait">
      {view === "list" ? (
        <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><div className="flex justify-between items-start mb-4"><div className="p-3 bg-zinc-800 rounded-xl text-emerald-400"><Bot size={24} /></div></div><p className="text-zinc-500 text-sm mb-1">Total de Agentes</p><h3 className="text-2xl font-bold text-zinc-100">{agents.length}</h3></div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><div className="flex justify-between items-start mb-4"><div className="p-3 bg-zinc-800 rounded-xl text-blue-400"><MessageSquare size={24} /></div></div><p className="text-zinc-500 text-sm mb-1">Conversas (24h)</p><h3 className="text-2xl font-bold text-zinc-100">1,240</h3></div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><div className="flex justify-between items-start mb-4"><div className="p-3 bg-zinc-800 rounded-xl text-purple-400"><Zap size={24} /></div></div><p className="text-zinc-500 text-sm mb-1">Taxa Resolucao</p><h3 className="text-2xl font-bold text-zinc-100">98.2%</h3></div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"><div className="flex justify-between items-start mb-4"><div className="p-3 bg-zinc-800 rounded-xl text-amber-400"><Cpu size={24} /></div></div><p className="text-zinc-500 text-sm mb-1">Latencia</p><h3 className="text-2xl font-bold text-zinc-100">0.8s</h3></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between mb-6"><h3 className="text-lg font-semibold text-zinc-100">Seus Agentes</h3><button onClick={() => setShowNewAgent(true)} className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all"><Plus size={20} /></button></div>
              {agents.map((agent) => (
                <button key={agent.id} onClick={() => setSelectedAgent(agent)} className={cn("w-full text-left p-4 rounded-2xl border transition-all", selectedAgent?.id === agent.id ? "bg-emerald-500/10 border-emerald-500/30" : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700")}>
                  <div className="flex items-center gap-3 mb-2"><div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", agent.status === "online" ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500")}><Bot size={22} /></div><div><h4 className="font-bold text-zinc-100">{agent.name}</h4><p className="text-xs text-zinc-500">{agent.role}</p></div></div>
                  <div className="flex items-center justify-between mt-4"><div className="flex items-center gap-2"><div className={cn("w-2 h-2 rounded-full", agent.status === "online" ? "bg-emerald-500" : "bg-zinc-600")} /><span className="text-[10px] uppercase font-bold text-zinc-500">{agent.status}</span></div><span className="text-[10px] font-mono text-zinc-600">{agent.tokens} tokens</span></div>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2 space-y-6">
              {selectedAgent && (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 relative overflow-hidden">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4"><div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg"><Brain size={32} /></div><div><h2 className="text-2xl font-bold text-zinc-100">{selectedAgent.name}</h2><p className="text-zinc-500">{selectedAgent.role}</p></div></div>
                    <div className="flex gap-2"><button onClick={() => toast.success("Config")} className="p-3 bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl"><Settings2 size={20} /></button><button onClick={() => toast.success("Reiniciado!")} className="p-3 bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl"><RefreshCw size={20} /></button></div>
                  </div>
                  <div className="space-y-6">
                    <div><label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Contexto</label><div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-xl text-zinc-300 text-sm">{selectedAgent.context}</div></div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800"><p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Precisao</p><p className="text-xl font-bold text-emerald-400">{selectedAgent.accuracy}</p></div>
                      <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800"><p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Seguranca</p><div className="flex items-center gap-2 text-xl font-bold text-zinc-200"><ShieldCheck size={20} className="text-blue-400" />Alta</div></div>
                      <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800"><p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Temp</p><p className="text-xl font-bold text-zinc-200">{selectedAgent.temperature.toFixed(1)}</p></div>
                    </div>
                    <button onClick={() => setView("playground")} className="w-full mt-6 flex items-center justify-center gap-2 bg-zinc-100 text-zinc-950 py-4 rounded-2xl font-bold hover:bg-white transition-all group"><MessageSquare size={20} />Testar Agente<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <AnimatePresence>
            {showNewAgent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                  <div className="p-6 border-b border-zinc-800 flex items-center justify-between"><h3 className="text-lg font-bold text-zinc-100">Novo Agente</h3><button onClick={() => setShowNewAgent(false)} className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400"><X size={20} /></button></div>
                  <div className="p-6 space-y-4">
                    <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Nome</label><input type="text" value={newAgent.name} onChange={e => setNewAgent({...newAgent, name: e.target.value})} placeholder="Nome do agente" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none" /></div>
                    <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Funcao</label><input type="text" value={newAgent.role} onChange={e => setNewAgent({...newAgent, role: e.target.value})} placeholder="Ex: Especialista em Vendas" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none" /></div>
                    <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Contexto</label><textarea value={newAgent.context} onChange={e => setNewAgent({...newAgent, context: e.target.value})} placeholder="Instrucoes..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none h-24 resize-none" /></div>
                  </div>
                  <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 flex gap-3">
                    <button onClick={() => setShowNewAgent(false)} className="flex-1 py-3 bg-zinc-800 text-zinc-200 rounded-xl font-bold hover:bg-zinc-700 transition-all">Cancelar</button>
                    <button onClick={handleAddAgent} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all">Criar</button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <AgentPlayground agent={selectedAgent} onBack={() => setView("list")} />
      )}
    </AnimatePresence>
  );
};
