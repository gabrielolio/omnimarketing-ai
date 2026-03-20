import React, { useState } from "react";
import { X, Send, Bot, User, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/types";

const mockResponses = [
  "Posso ajudar com isso! Baseado nos dados do seu dashboard, recomendo focar em automacoes de Instagram DM para aumentar a conversao.",
  "Analisando seus clientes ativos, o TechFlow Solutions tem o maior potencial de upsell. Sugiro oferecer o plano Enterprise AI.",
  "Seus agentes de IA estao com 98% de taxa de resolucao. Excelente performance! Considere adicionar mais fontes de conhecimento.",
  "O calendario editorial esta com 3 posts agendados esta semana. Deseja que eu sugira mais conteudo baseado nas tendencias?",
  "A receita mensal cresceu 18.5% este mes. Continue com a estrategia atual de automacao de leads via Instagram.",
];

interface Message { role: "user" | "assistant"; content: string; }

export const ChatAssistant = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ola! Sou o assistente do OmniMarketing. Como posso ajudar voce hoje?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-8 w-[400px] h-[500px] bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
    >
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center"><Bot size={18} className="text-white" /></div>
          <div><p className="text-sm font-bold text-zinc-100">Assistente IA</p><p className="text-[10px] text-emerald-400">Online</p></div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400"><X size={18} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-3 max-w-[85%]", msg.role === "user" ? "ml-auto flex-row-reverse" : "")}>
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", msg.role === "assistant" ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-400")}>
              {msg.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
            </div>
            <div className={cn("p-3 rounded-2xl text-sm", msg.role === "assistant" ? "bg-zinc-800 text-zinc-200" : "bg-emerald-500/10 text-emerald-100 border border-emerald-500/20")}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 bg-zinc-950/50 border-t border-zinc-800">
        <div className="relative">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Digite sua pergunta..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-4 pr-12 py-3 text-sm text-zinc-200 focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all"><Send size={16} /></button>
        </div>
      </div>
    </motion.div>
  );
};
