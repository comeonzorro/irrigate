-- Irrigate — schéma Supabase
-- Exécuter dans l'éditeur SQL du projet Supabase (Dashboard → SQL)

-- Profils utilisateurs (complète auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  default_postal_code text,
  default_city_hint text,
  created_at timestamptz not null default now()
);

-- Projets potager (config JSON complète)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default 'Mon potager',
  config jsonb not null,
  location jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_user_id_idx on public.projects (user_id);
create index if not exists projects_updated_at_idx on public.projects (updated_at desc);

-- Réalisations potager (partage communautaire — V2)
create table if not exists public.garden_showcases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  title text not null,
  description text,
  photo_urls jsonb not null default '[]'::jsonb,
  status text not null default 'draft'
    check (status in ('draft', 'pending', 'published')),
  created_at timestamptz not null default now()
);

create index if not exists garden_showcases_status_idx
  on public.garden_showcases (status, created_at desc);

-- updated_at automatique
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- Profil auto à l'inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.garden_showcases enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "projects_select_own"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "projects_insert_own"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "projects_update_own"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "projects_delete_own"
  on public.projects for delete
  using (auth.uid() = user_id);

create policy "showcases_select_own"
  on public.garden_showcases for select
  using (auth.uid() = user_id);

create policy "showcases_select_published"
  on public.garden_showcases for select
  using (status = 'published');

create policy "showcases_insert_own"
  on public.garden_showcases for insert
  with check (auth.uid() = user_id);

create policy "showcases_update_own"
  on public.garden_showcases for update
  using (auth.uid() = user_id);

create policy "showcases_delete_own"
  on public.garden_showcases for delete
  using (auth.uid() = user_id);
