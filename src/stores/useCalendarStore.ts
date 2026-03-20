import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PostData {
  id: string;
  title: string;
  platform: 'instagram' | 'website' | 'whatsapp' | 'tiktok';
  type: 'reel' | 'feed' | 'story' | 'blog' | 'carousel';
  status: 'draft' | 'scheduled' | 'approved' | 'published';
  date: string; // ISO string for serialization
  client: string;
  thumbnail: string;
}

interface CalendarState {
  posts: PostData[];
  add: (post: Omit<PostData, 'id'>) => void;
  update: (id: string, data: Partial<PostData>) => void;
  remove: (id: string) => void;
  getById: (id: string) => PostData | undefined;
}

const initialPosts: PostData[] = [
  {
    id: 'post-1',
    title: 'Lancamento Colecao Outono',
    platform: 'instagram',
    type: 'reel',
    status: 'scheduled',
    date: '2026-03-20T10:00:00',
    client: 'Bamaq GWM',
    thumbnail: 'https://picsum.photos/seed/car1/200/200',
  },
  {
    id: 'post-2',
    title: 'Dicas de Marketing Digital',
    platform: 'instagram',
    type: 'feed',
    status: 'approved',
    date: '2026-03-22T14:30:00',
    client: 'AIOX Agency',
    thumbnail: 'https://picsum.photos/seed/marketing/200/200',
  },
  {
    id: 'post-3',
    title: 'Webinar: IA no Varejo',
    platform: 'website',
    type: 'blog',
    status: 'draft',
    date: '2026-03-25T19:00:00',
    client: 'Omni Retail',
    thumbnail: 'https://picsum.photos/seed/tech/200/200',
  },
];

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      posts: initialPosts,
      add: (post) =>
        set((state) => ({
          posts: [...state.posts, { ...post, id: `post-${Date.now()}` }],
        })),
      update: (id, data) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),
      remove: (id) =>
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== id),
        })),
      getById: (id) => get().posts.find((p) => p.id === id),
    }),
    { name: 'omni-calendar-store' }
  )
);
