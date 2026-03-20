import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/src/lib/supabase';

export interface PostData {
  id: string;
  client_id?: string;
  title: string;
  platform: 'instagram' | 'website' | 'whatsapp' | 'tiktok';
  type: 'reel' | 'feed' | 'story' | 'blog' | 'carousel';
  status: 'draft' | 'scheduled' | 'approved' | 'published';
  date: string;
  scheduled_at?: string;
  client: string;
  thumbnail: string;
  thumbnail_url?: string;
  content?: string;
}

interface CalendarState {
  posts: PostData[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  add: (post: Partial<PostData>) => Promise<void>;
  update: (id: string, data: Partial<PostData>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => PostData | undefined;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      posts: [],
      loading: false,
      error: null,

      fetchPosts: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('calendar_posts')
            .select('*, clients(name)')
            .order('scheduled_at', { ascending: true });
          if (error) throw error;
          if (data) {
            const mapped = data.map((p: any) => ({
              ...p,
              date: p.scheduled_at || p.created_at,
              client: p.clients?.name || 'Sem cliente',
              thumbnail: p.thumbnail_url || 'https://picsum.photos/seed/' + p.id + '/200/200',
            }));
            set({ posts: mapped, loading: false });
          }
        } catch (err: any) {
          console.warn('Supabase posts fetch failed:', err.message);
          set({ loading: false, error: err.message });
        }
      },

      add: async (post) => {
        try {
          const { data, error } = await supabase
            .from('calendar_posts')
            .insert({
              client_id: post.client_id,
              title: post.title || '',
              platform: post.platform || 'instagram',
              type: post.type || 'feed',
              status: post.status || 'draft',
              scheduled_at: post.date || post.scheduled_at,
              content: post.content || '',
              thumbnail_url: post.thumbnail || post.thumbnail_url || 'https://picsum.photos/seed/' + Date.now() + '/200/200',
            })
            .select('*, clients(name)')
            .single();
          if (error) throw error;
          if (data) {
            const mapped = {
              ...data,
              date: data.scheduled_at || data.created_at,
              client: data.clients?.name || post.client || 'Sem cliente',
              thumbnail: data.thumbnail_url || 'https://picsum.photos/seed/' + data.id + '/200/200',
            };
            set((state) => ({ posts: [...state.posts, mapped] }));
            // Cross-module: log post creation
            try {
              const { useAppStore } = await import('./useAppStore');
              useAppStore.getState().addNotification({
                type: 'system',
                title: 'Post criado',
                message: (post.title || 'Novo post') + ' adicionado ao calendario.',
              });
            } catch {}
          }
        } catch (err: any) {
          const newPost: PostData = {
            id: 'post-' + Date.now(),
            title: post.title || '',
            platform: (post.platform as any) || 'instagram',
            type: (post.type as any) || 'feed',
            status: (post.status as any) || 'draft',
            date: post.date || new Date().toISOString(),
            client: post.client || 'Sem cliente',
            thumbnail: post.thumbnail || 'https://picsum.photos/seed/' + Date.now() + '/200/200',
          };
          set((state) => ({ posts: [...state.posts, newPost] }));
        }
      },

      update: async (id, data) => {
        try {
          const updateData: any = { ...data };
          delete updateData.client;
          delete updateData.thumbnail;
          delete updateData.date;
          if (data.date) updateData.scheduled_at = data.date;
          const { error } = await supabase.from('calendar_posts').update(updateData).eq('id', id);
          if (error) throw error;
        } catch (err: any) {
          console.warn('Supabase post update failed:', err.message);
        }
        set((state) => ({
          posts: state.posts.map((p) => (p.id === id ? { ...p, ...data } : p)),
        }));
      },

      remove: async (id) => {
        try {
          const { error } = await supabase.from('calendar_posts').delete().eq('id', id);
          if (error) throw error;
        } catch (err: any) {
          console.warn('Supabase post delete failed:', err.message);
        }
        set((state) => ({ posts: state.posts.filter((p) => p.id !== id) }));
      },

      getById: (id) => get().posts.find((p) => p.id === id),
    }),
    { name: 'omni-calendar-store' }
  )
);
