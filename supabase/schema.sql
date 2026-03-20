-- =============================================
-- OmniMarketing AI -- Database Schema
-- =============================================

-- 0. Extensions
create extension if not exists "pgcrypto";

-- 1. PROFILES (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text check (role in ('admin', 'viewer')) default 'viewer',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. CLIENTS
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  avatar_url text,
  status text check (status in ('active', 'inactive')) default 'active',
  health text check (health in ('green', 'yellow', 'red')) default 'green',
  instagram text,
  city text,
  state text,
  contact_name text,
  notes text default '',
  joined_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. CONTRACTS
create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  service text,
  amount numeric(12,2) default 0,
  start_date date,
  end_date date,
  status text check (status in ('signed', 'pending', 'expired', 'cancelled')) default 'pending',
  description text default '',
  terms text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. AUTOMATIONS
create table if not exists public.automations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  name text not null,
  type text check (type in ('instagram', 'website', 'whatsapp', 'general')) default 'general',
  status text check (status in ('active', 'paused', 'draft')) default 'draft',
  description text default '',
  last_run timestamptz,
  runs_count integer default 0,
  success_rate numeric(5,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. AGENTS
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  name text not null,
  role text,
  context text default '',
  status text check (status in ('online', 'offline')) default 'offline',
  model text default 'Gemini 3 Flash',
  accuracy numeric(5,2) default 0,
  tokens_used integer default 0,
  temperature numeric(3,2) default 0.7,
  sources jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. CALENDAR POSTS
create table if not exists public.calendar_posts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  title text not null,
  platform text check (platform in ('instagram', 'website', 'whatsapp', 'tiktok')) default 'instagram',
  type text check (type in ('feed', 'reel', 'story', 'blog', 'carousel')) default 'feed',
  status text check (status in ('draft', 'scheduled', 'approved', 'published')) default 'draft',
  scheduled_at timestamptz,
  content text default '',
  thumbnail_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. PIPELINE LEADS
create table if not exists public.pipeline_leads (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  name text not null,
  value numeric(12,2) default 0,
  stage text check (stage in ('new', 'qualified', 'proposal', 'negotiation', 'closed', 'lost')) default 'new',
  contact text default '',
  last_contact timestamptz default now(),
  source text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 8. NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text check (type in ('automation', 'lead', 'contract', 'agent', 'system')) default 'system',
  title text not null,
  message text default '',
  read boolean default false,
  entity_type text,
  entity_id uuid,
  created_at timestamptz default now()
);

-- 9. ACTIVITY LOG
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  details jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'viewer')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.contracts enable row level security;
alter table public.automations enable row level security;
alter table public.agents enable row level security;
alter table public.calendar_posts enable row level security;
alter table public.pipeline_leads enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_log enable row level security;

-- Simple RLS: authenticated users can do everything
create or replace function public.is_authenticated()
returns boolean as $$
begin
  return (auth.role() = 'authenticated');
end;
$$ language plpgsql security definer;

-- Apply RLS policies for all tables
do $$
declare
  tbl text;
begin
  for tbl in select unnest(array[
    'profiles', 'clients', 'contracts', 'automations',
    'agents', 'calendar_posts', 'pipeline_leads',
    'notifications', 'activity_log'
  ]) loop
    execute format('drop policy if exists auth_all_%I on public.%I', tbl, tbl);
    execute format(
      'create policy auth_all_%I on public.%I for all using (public.is_authenticated()) with check (public.is_authenticated())',
      tbl, tbl
    );
  end loop;
end $$;

-- Apply updated_at triggers
do $$
declare
  tbl text;
begin
  for tbl in select unnest(array[
    'profiles', 'clients', 'contracts', 'automations',
    'agents', 'calendar_posts', 'pipeline_leads'
  ]) loop
    execute format(
      'drop trigger if exists set_updated_at on public.%I; create trigger set_updated_at before update on public.%I for each row execute function public.handle_updated_at();',
      tbl, tbl
    );
  end loop;
end $$;
