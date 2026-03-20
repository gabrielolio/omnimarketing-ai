import React from "react";
import { Sidebar, Header } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { Automations } from "./components/Automations";
import { Agents } from "./components/Agents";
import { Contracts } from "./components/Contracts";
import { Clients } from "./components/Clients";
import { Calendar } from "./components/Calendar";
import { Settings } from "./components/Settings";
import { Pipeline } from "./components/Pipeline";
import { Reports } from "./components/Reports";
import { ChatAssistant } from "./components/ChatAssistant";
import { NotificationsPanel } from "./components/Notifications";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore } from "./stores/useAppStore";
import { Toaster } from "sonner";

export default function App() {
  const { activeTab, chatOpen, setChatOpen, notificationsOpen, setNotificationsOpen } = useAppStore();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard />;
      case "calendar": return <Calendar />;
      case "automations": return <Automations />;
      case "agents": return <Agents />;
      case "contracts": return <Contracts />;
      case "clients": return <Clients />;
      case "settings": return <Settings />;
      case "pipeline": return <Pipeline />;
      case "reports": return <Reports />;
      default: return <Dashboard />;
    }
  };

  const getTitle = () => {
    const titles: Record<string, string> = {
      dashboard: "Dashboard Geral",
      calendar: "Calendario Editorial",
      automations: "Automacoes de Marketing",
      agents: "Agentes de IA",
      contracts: "Contratos e Faturamento",
      clients: "Gestao de Clientes",
      settings: "Configuracoes",
      pipeline: "Pipeline de Vendas",
      reports: "Relatorios",
    };
    return titles[activeTab] || "OmniMarketing";
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-emerald-500/30">
      <Toaster position="top-right" theme="dark" richColors />
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title={getTitle()} />
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
      <AnimatePresence>{notificationsOpen && <NotificationsPanel onClose={() => setNotificationsOpen(false)} />}</AnimatePresence>
      <AnimatePresence>{chatOpen && <ChatAssistant onClose={() => setChatOpen(false)} />}</AnimatePresence>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setChatOpen(!chatOpen)} className="fixed bottom-8 right-8 w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 z-50 group">
        <div className="absolute -top-12 right-0 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Falar com Assistente IA</div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 10h.01" /><path d="M12 10h.01" /><path d="M16 10h.01" /></svg>
      </motion.button>
    </div>
  );
}
