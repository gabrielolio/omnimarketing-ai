import React, { useState } from "react";
import { User, Bell, Palette, Info, Save, Plug, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/types";
import { toast } from "sonner";
import { useAuth } from "@/src/lib/auth";

export const Settings = () => {
  const { signOut, user, profile: authProfile } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [profile, setProfile] = useState({ name: "Gabriel Oliveira", email: "gabriel@aiox.com.br", role: "Administrador" });
  const [prefs, setPrefs] = useState({ theme: "dark" as string, language: "pt-BR", emailNotifications: true, pushNotifications: true, weeklyReport: true });

  const sections = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "preferences", label: "Preferencias", icon: Palette },
    { id: "notifications", label: "Notificacoes", icon: Bell },
    { id: "integrations", label: "Integracoes", icon: Plug },
    { id: "about", label: "Sobre", icon: Info },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-zinc-100">Configuracoes</h2><p className="text-sm text-zinc-500">Gerencie seu perfil e preferencias</p></div>
        <button onClick={async () => { await signOut(); toast.success("Desconectado!"); }} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2.5 rounded-xl font-medium transition-all"><LogOut size={18} /> Sair</button>
        <button onClick={() => toast.success("Configuracoes salvas!")} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"><Save size={18} /> Salvar</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-2">
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} className={cn("w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left", activeSection === s.id ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200")}>
              <s.icon size={20} /><span className="font-medium">{s.label}</span>
            </button>
          ))}
        </div>
        <div className="lg:col-span-3">
          <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            {activeSection === "profile" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-zinc-100">Perfil do Usuario</h3>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px]"><div className="w-full h-full rounded-2xl bg-zinc-950 flex items-center justify-center overflow-hidden"><img src="https://picsum.photos/seed/admin/100/100" alt="Avatar" className="w-full h-full object-cover" /></div></div>
                  <div><button className="text-sm text-emerald-400 font-bold hover:underline">Alterar foto</button><p className="text-xs text-zinc-500 mt-1">JPG, PNG. Max 2MB.</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Nome</label><input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:ring-2 focus:ring-emerald-500/50 outline-none" /></div>
                  <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Email</label><input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:ring-2 focus:ring-emerald-500/50 outline-none" /></div>
                  <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Cargo</label><input type="text" value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:ring-2 focus:ring-emerald-500/50 outline-none" /></div>
                </div>
              </div>
            )}
            {activeSection === "preferences" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-zinc-100">Preferencias</h3>
                <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Tema</label>
                  <div className="flex gap-3">{(["dark","light"] as const).map(t => (<button key={t} onClick={() => setPrefs({...prefs, theme: t})} className={cn("px-4 py-2 rounded-xl text-sm font-medium border transition-all", prefs.theme === t ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-zinc-950 border-zinc-800 text-zinc-400")}>{t === "dark" ? "Escuro" : "Claro"}</button>))}</div>
                  <p className="text-xs text-zinc-600 mt-2">Tema claro em breve.</p></div>
                <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Idioma</label>
                  <select value={prefs.language} onChange={e => setPrefs({...prefs, language: e.target.value})} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none w-full max-w-xs"><option value="pt-BR">Portugues (Brasil)</option><option value="en">English</option></select></div>
              </div>
            )}
            {activeSection === "notifications" && (
              <div className="space-y-6"><h3 className="text-lg font-bold text-zinc-100">Preferencias de Notificacao</h3>
                {([{key:"emailNotifications" as const,label:"Notificacoes por Email",desc:"Receba alertas por email."},{key:"pushNotifications" as const,label:"Notificacoes Push",desc:"Alertas em tempo real."},{key:"weeklyReport" as const,label:"Relatorio Semanal",desc:"Resumo semanal toda segunda."}]).map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                    <div><p className="text-sm font-bold text-zinc-200">{item.label}</p><p className="text-xs text-zinc-500">{item.desc}</p></div>
                    <button onClick={() => setPrefs({...prefs, [item.key]: !prefs[item.key]})} className={cn("w-12 h-6 rounded-full transition-all relative", prefs[item.key] ? "bg-emerald-500" : "bg-zinc-700")}>
                      <div className={cn("w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all", prefs[item.key] ? "left-6" : "left-0.5")} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {activeSection === "integrations" && (
              <div className="space-y-6"><h3 className="text-lg font-bold text-zinc-100">Integracoes</h3><p className="text-sm text-zinc-500">Conecte suas ferramentas ao OmniMarketing.</p>
                {[{name:"Instagram API"},{name:"WhatsApp Business"},{name:"Google Ads"},{name:"Supabase"},{name:"Stripe"}].map(item => (
                  <div key={item.name} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-zinc-800 rounded-lg" /><div><p className="text-sm font-bold text-zinc-200">{item.name}</p><p className="text-xs text-zinc-500">Em breve</p></div></div>
                    <button className="px-4 py-2 bg-zinc-800 text-zinc-400 rounded-xl text-sm font-medium cursor-not-allowed opacity-50">Conectar</button></div>
                ))}
              </div>
            )}
            {activeSection === "about" && (
              <div className="space-y-6"><h3 className="text-lg font-bold text-zinc-100">Sobre o Sistema</h3>
                <div className="space-y-4">{[{l:"Aplicacao",v:"OmniMarketing AI"},{l:"Versao",v:"1.1.0"},{l:"Por",v:"AIOX Agency"},{l:"Stack",v:"React 19 + Vite + Tailwind 4 + Zustand + Supabase"}].map(i => (
                  <div key={i.l} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl"><p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{i.l}</p><p className="text-sm text-zinc-200">{i.v}</p></div>
                ))}</div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
