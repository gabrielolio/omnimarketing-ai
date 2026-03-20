import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Instagram, Globe, Clock, Filter, MoreVertical, Calendar as CalendarIcon, LayoutGrid, List, X, Edit2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/types";
import { useCalendarStore, PostData } from "@/src/stores/useCalendarStore";
import { useClientsStore } from "@/src/stores/useClientsStore";
import { toast } from "sonner";

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const platforms = ["instagram", "website", "whatsapp", "tiktok"] as const;
const types = ["reel", "feed", "story", "blog", "carousel"] as const;

export const Calendar = () => {
  const { posts, add, update, remove } = useCalendarStore();
  const { clients } = useClientsStore();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1));
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [editingPost, setEditingPost] = useState<PostData | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", platform: "instagram" as any, type: "feed" as any, client: "", date: "", time: "10:00" });

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString("pt-BR", { month: "long" });
  const year = currentDate.getFullYear();

  const filteredPosts = filterPlatform === "all" ? posts : posts.filter(p => p.platform === filterPlatform);

  const handleAddPost = () => {
    if (!newPost.title || !newPost.date) return;
    add({ title: newPost.title, platform: newPost.platform, type: newPost.type, status: "draft", date: newPost.date + "T" + newPost.time + ":00", client: newPost.client || "Sem cliente", thumbnail: "https://picsum.photos/seed/" + Date.now() + "/200/200" });
    setNewPost({ title: "", platform: "instagram", type: "feed", client: "", date: "", time: "10:00" });
    setShowNewPost(false);
    toast.success("Post criado!");
  };

  const handleDeletePost = (id: string) => { remove(id); toast.success("Post removido!"); };

  const getPostsForDate = (date: Date) => filteredPosts.filter(p => new Date(p.date).toDateString() === date.toDateString());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"><ChevronLeft size={20} /></button>
            <div className="px-4 font-bold text-zinc-100 capitalize">{monthName} {year}</div>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"><ChevronRight size={20} /></button>
          </div>
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-zinc-800 text-emerald-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300")}><LayoutGrid size={18} /></button>
            <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-zinc-800 text-emerald-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300")}><List size={18} /></button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2.5 rounded-xl font-medium hover:bg-zinc-800 transition-all"><Filter size={18} />Filtros</button>
            {showFilters && (
              <div className="absolute top-full mt-2 right-0 bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-2xl z-20 w-48">
                {["all", ...platforms].map(p => (<button key={p} onClick={() => { setFilterPlatform(p); setShowFilters(false); }} className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-all", filterPlatform === p ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-400 hover:bg-zinc-800")}>{p === "all" ? "Todos" : p}</button>))}
              </div>
            )}
          </div>
          <button onClick={() => setShowNewPost(true)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"><Plus size={20} />Novo Post</button>
        </div>
      </div>
      {viewMode === "grid" ? (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="grid grid-cols-7 border-b border-zinc-800">
            {daysOfWeek.map(day => (<div key={day} className="py-4 text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{day}</div>))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (<div key={`e-${i}`} className="h-32 border-r border-b border-zinc-800/50 bg-zinc-950/20" />))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const isToday = new Date().toDateString() === date.toDateString();
              const postsOnDay = getPostsForDate(date);
              return (
                <div key={day} className={cn("h-32 border-r border-b border-zinc-800/50 p-2 transition-all hover:bg-zinc-800/20 group relative cursor-pointer", isToday ? "bg-emerald-500/5" : "")} onClick={() => setSelectedDate(date)}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={cn("text-xs font-bold w-6 h-6 flex items-center justify-center rounded-lg", isToday ? "bg-emerald-500 text-white" : "text-zinc-500 group-hover:text-zinc-300")}>{day}</span>
                    {postsOnDay.length > 0 && <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">{postsOnDay.length}</span>}
                  </div>
                  <div className="space-y-1 overflow-y-auto max-h-20 custom-scrollbar">
                    {postsOnDay.map(post => (
                      <div key={post.id} className={cn("text-[10px] p-1.5 rounded-lg border flex items-center gap-1.5 transition-all truncate",
                        post.status === "scheduled" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : post.status === "approved" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-zinc-800 border-zinc-700 text-zinc-400")}>
                        {post.platform === "instagram" ? <Instagram size={10} /> : <Globe size={10} />}<span className="truncate font-medium">{post.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {Array.from({ length: (7 - (firstDayOfMonth + daysInMonth) % 7) % 7 }).map((_, i) => (<div key={`en-${i}`} className="h-32 border-b border-zinc-800/50 bg-zinc-950/20" />))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(post => (
            <div key={post.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 hover:border-zinc-700 transition-all">
              <img src={post.thumbnail} alt="" className="w-14 h-14 rounded-xl object-cover border border-zinc-800" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">{post.platform === "instagram" ? <Instagram size={14} className="text-pink-500" /> : <Globe size={14} className="text-blue-500" />}<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{post.client}</span></div>
                <h4 className="font-bold text-zinc-200 text-sm">{post.title}</h4>
                <span className="text-xs text-zinc-500 flex items-center gap-1"><Clock size={12} />{new Date(post.date).toLocaleString("pt-BR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase", post.status === "scheduled" ? "bg-blue-500/10 text-blue-400" : post.status === "approved" ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-500")}>{post.status}</span>
              <button onClick={() => handleDeletePost(post.id)} className="p-2 text-zinc-600 hover:text-rose-400 transition-colors"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-6 pt-4">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-xs text-zinc-500">Agendado</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-xs text-zinc-500">Aprovado</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-zinc-600" /><span className="text-xs text-zinc-500">Rascunho</span></div>
        <div className="ml-auto flex items-center gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-3"><Clock size={16} className="text-zinc-500" /><span className="text-xs text-zinc-400">Total: <span className="text-zinc-100 font-bold">{filteredPosts.length} posts</span></span></div>
        </div>
      </div>

      {/* Date detail modal */}
      <AnimatePresence>
        {selectedDate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <div><h3 className="text-xl font-bold text-zinc-100">{selectedDate.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}</h3><p className="text-sm text-zinc-500">Conteudos programados</p></div>
                <button onClick={() => setSelectedDate(null)} className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {getPostsForDate(selectedDate).length > 0 ? getPostsForDate(selectedDate).map(post => (
                  <div key={post.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
                    <img src={post.thumbnail} alt="" className="w-16 h-16 rounded-xl object-cover border border-zinc-800" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">{post.platform === "instagram" ? <Instagram size={14} className="text-pink-500" /> : <Globe size={14} className="text-blue-500" />}<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{post.client}</span></div>
                      <h4 className="font-bold text-zinc-200 text-sm mb-1">{post.title}</h4>
                      <span className="text-xs text-zinc-500 flex items-center gap-1"><Clock size={12} />{new Date(post.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <button onClick={() => handleDeletePost(post.id)} className="p-2 text-zinc-600 hover:text-rose-400"><Trash2 size={16} /></button>
                  </div>
                )) : (
                  <div className="text-center py-12"><div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-600"><CalendarIcon size={32} /></div><p className="text-zinc-500">Nenhum post para este dia.</p></div>
                )}
              </div>
              <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 flex gap-3">
                <button onClick={() => setSelectedDate(null)} className="flex-1 py-3 bg-zinc-800 text-zinc-200 rounded-xl font-bold hover:bg-zinc-700 transition-all">Fechar</button>
                <button onClick={() => { setSelectedDate(null); setShowNewPost(true); }} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">Novo Post</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* New post modal */}
      <AnimatePresence>
        {showNewPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between"><h3 className="text-lg font-bold text-zinc-100">Novo Post</h3><button onClick={() => setShowNewPost(false)} className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400"><X size={20} /></button></div>
              <div className="p-6 space-y-4">
                <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Titulo</label><input type="text" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} placeholder="Titulo do post" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:ring-2 focus:ring-emerald-500/50 outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Plataforma</label><select value={newPost.platform} onChange={e => setNewPost({...newPost, platform: e.target.value as any})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none">{platforms.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                  <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Tipo</label><select value={newPost.type} onChange={e => setNewPost({...newPost, type: e.target.value as any})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none">{types.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Data</label><input type="date" value={newPost.date} onChange={e => setNewPost({...newPost, date: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none" /></div>
                  <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Hora</label><input type="time" value={newPost.time} onChange={e => setNewPost({...newPost, time: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none" /></div>
                </div>
                <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Cliente</label><select value={newPost.client} onChange={e => setNewPost({...newPost, client: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none"><option value="">Selecione...</option>{clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
              </div>
              <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 flex gap-3">
                <button onClick={() => setShowNewPost(false)} className="flex-1 py-3 bg-zinc-800 text-zinc-200 rounded-xl font-bold hover:bg-zinc-700 transition-all">Cancelar</button>
                <button onClick={handleAddPost} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">Criar Post</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
