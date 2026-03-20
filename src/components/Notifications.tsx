import React from 'react';
import { Bell, Zap, Users, FileText, Bot, Settings, X, Check, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/types';
import { useAppStore, Notification } from '@/src/stores/useAppStore';

const iconMap: Record<string, any> = {
  automation: Zap,
  lead: Users,
  contract: FileText,
  agent: Bot,
  system: Settings,
};

const colorMap: Record<string, string> = {
  automation: 'text-emerald-400 bg-emerald-500/10',
  lead: 'text-amber-400 bg-amber-500/10',
  contract: 'text-blue-400 bg-blue-500/10',
  agent: 'text-purple-400 bg-purple-500/10',
  system: 'text-zinc-400 bg-zinc-800',
};

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Ha ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Ha ${hours}h`;
  return `Ha ${Math.floor(hours / 24)}d`;
}

export const NotificationsPanel = ({ onClose }: { onClose: () => void }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = useAppStore();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-[60] flex flex-col shadow-2xl"
    >
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Bell size={20} className="text-emerald-400" />
            Notificacoes
          </h2>
          <p className="text-xs text-zinc-500 mt-1">{unread} nao lidas</p>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button onClick={markAllNotificationsRead} className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1">
              <CheckCheck size={14} /> Marcar todas
            </button>
          )}
          <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-xl text-zinc-400 transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={48} className="mx-auto text-zinc-700 mb-4" />
            <p className="text-zinc-500">Nenhuma notificacao.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {notifications.map((n) => {
              const Icon = iconMap[n.type] || Bell;
              const colors = colorMap[n.type] || colorMap.system;
              return (
                <div
                  key={n.id}
                  className={cn(
                    'p-4 flex gap-4 transition-all hover:bg-zinc-900/50 group cursor-pointer',
                    !n.read && 'bg-emerald-500/5'
                  )}
                  onClick={() => markNotificationRead(n.id)}
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', colors)}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn('text-sm font-medium', n.read ? 'text-zinc-400' : 'text-zinc-100')}>{n.title}</p>
                      <span className="text-[10px] text-zinc-600 font-mono shrink-0">{timeAgo(n.timestamp)}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">{n.message}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 mt-2" />}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                    className="p-1 text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
