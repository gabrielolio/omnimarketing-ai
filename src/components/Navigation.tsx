import React, { useState, useRef, useEffect } from "react";
import { LayoutDashboard, Zap, Bot, FileText, Users, Settings, ChevronRight, Menu, X, Search, Bell, Calendar as CalendarIcon, Kanban, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/types";
import { useAppStore, TabId } from "@/src/stores/useAppStore";
import { SearchDropdown } from "./SearchDropdown";

const menuItems: { id: TabId; label: string; icon: any }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "calendar", label: "Calendario", icon: CalendarIcon },
  { id: "automations", label: "Automacoes", icon: Zap },
  { id: "agents", label: "Agentes IA", icon: Bot },
  { id: "contracts", label: "Contratos", icon: FileText },
  { id: "clients", label: "Clientes", icon: Users },
  { id: "pipeline", label: "Pipeline", icon: Kanban },
  { id: "reports", label: "Relatorios", icon: BarChart3 },
];

export const Sidebar = () => {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen, mobileSidebarOpen, setMobileSidebarOpen } = useAppStore();

  const renderNav = (isMobile: boolean) => (
    <nav className="flex-1 px-4 space-y-2 mt-4">
      {menuItems.map((item) => (
        <button key={item.id} onClick={() => { setActiveTab(item.id); if (isMobile) setMobileSidebarOpen(false); }}
          className={cn("w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative",
            activeTab === item.id ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200")}>
          <item.icon size={22} className={cn("transition-transform duration-200", activeTab === item.id ? "scale-110" : "group-hover:scale-110")} />
          {(sidebarOpen || isMobile) && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium">{item.label}</motion.span>}
          {activeTab === item.id && <motion.div layoutId={isMobile ? "active-pill-mobile" : "active-pill"} className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full" />}
        </button>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.div initial={false} animate={{ width: sidebarOpen ? 260 : 80 }} className="h-screen bg-zinc-950 border-r border-zinc-800 flex-col relative z-50 hidden md:flex">
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center"><Zap className="text-white w-5 h-5" /></div>
                <span className="font-bold text-zinc-100 tracking-tight">OmniMarketing</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-400 transition-colors">{sidebarOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
        {renderNav(false)}
        <div className="p-4 border-t border-zinc-900">
          <button onClick={() => setActiveTab("settings")} className={cn("w-full flex items-center gap-3 p-3 transition-colors rounded-xl", activeTab === "settings" ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-200")}>
            <Settings size={20} />{sidebarOpen && <span className="font-medium">Configuracoes</span>}
          </button>
        </div>
      </motion.div>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-zinc-950/80 z-40 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25 }} className="fixed left-0 top-0 h-full w-[280px] bg-zinc-950 border-r border-zinc-800 z-50 flex flex-col md:hidden">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-2"><div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center"><Zap className="text-white w-5 h-5" /></div><span className="font-bold text-zinc-100 tracking-tight">OmniMarketing</span></div>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-400"><X size={20} /></button>
              </div>
              {renderNav(true)}
              <div className="p-4 border-t border-zinc-900">
                <button onClick={() => { setActiveTab("settings"); setMobileSidebarOpen(false); }} className="w-full flex items-center gap-3 p-3 text-zinc-400 hover:text-zinc-200 transition-colors"><Settings size={20} /><span className="font-medium">Configuracoes</span></button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const titleMap: Record<string, string> = {
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

export const Header = ({ title }: { title: string }) => {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, notificationsOpen, setNotificationsOpen, setMobileSidebarOpen } = useAppStore();
  const unreadCount = useAppStore(s => s.unreadCount());
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="h-20 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={() => setMobileSidebarOpen(true)} className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-400 md:hidden"><Menu size={20} /></button>
        <h1 className="text-xl font-semibold text-zinc-100">{title}</h1>
        <div className="h-4 w-[1px] bg-zinc-800 mx-2 hidden sm:block" />
        <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-500">
          <span>AIOX Admin</span>
          <ChevronRight size={14} />
          <span className="text-zinc-300">{titleMap[activeTab] || title}</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div ref={searchRef} className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input type="text" placeholder="Buscar..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setSearchFocused(true); }} onFocus={() => setSearchFocused(true)} className="bg-zinc-900 border-none rounded-full pl-10 pr-4 py-2 text-sm text-zinc-300 focus:ring-2 focus:ring-emerald-500/50 w-64 transition-all" />
          {searchFocused && searchQuery && <SearchDropdown query={searchQuery} onNavigate={(tab) => { setActiveTab(tab as TabId); setSearchQuery(""); setSearchFocused(false); }} />}
        </div>
        <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative p-2 text-zinc-400 hover:text-zinc-200 transition-colors">
          <Bell size={20} />
          {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-emerald-500 rounded-full border-2 border-zinc-950 text-[10px] font-bold text-white flex items-center justify-center">{unreadCount}</span>}
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
          <div className="text-right hidden sm:block"><p className="text-sm font-medium text-zinc-100">AIOX Admin</p><p className="text-xs text-zinc-500">Plano Pro</p></div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px]"><div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden"><img src="https://picsum.photos/seed/admin/100/100" alt="Avatar" className="w-full h-full object-cover" /></div></div>
        </div>
      </div>
    </header>
  );
};
