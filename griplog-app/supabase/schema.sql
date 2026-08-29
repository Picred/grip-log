create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  is_synced boolean not null default false,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workout_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  is_synced boolean not null default false,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid references public.workout_templates(id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds integer default 0,
  total_volume_kg numeric default 0,
  is_completed boolean not null default false,
  is_synced boolean not null default false,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid references public.workout_sessions(id) on delete cascade,
  name text not null,
  muscle_group text not null,
  sort_order integer not null default 0,
  is_synced boolean not null default false,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  set_number integer not null default 1,
  weight_kg numeric not null default 0,
  reps integer not null default 0,
  rpe numeric,
  is_completed boolean not null default false,
  is_synced boolean not null default false,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.workout_templates enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.exercises enable row level security;
alter table public.sets enable row level security;

create policy "Users can view their own profiles"
on public.profiles for select using (auth.uid() = user_id);
create policy "Users can insert their own profiles"
on public.profiles for insert with check (auth.uid() = user_id);
create policy "Users can update their own profiles"
on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own profiles"
on public.profiles for delete using (auth.uid() = user_id);

create policy "Users can view their own templates"
on public.workout_templates for select using (auth.uid() = user_id);
create policy "Users can insert their own templates"
on public.workout_templates for insert with check (auth.uid() = user_id);
create policy "Users can update their own templates"
on public.workout_templates for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own templates"
on public.workout_templates for delete using (auth.uid() = user_id);

create policy "Users can view their own sessions"
on public.workout_sessions for select using (auth.uid() = user_id);
create policy "Users can insert their own sessions"
on public.workout_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update their own sessions"
on public.workout_sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own sessions"
on public.workout_sessions for delete using (auth.uid() = user_id);

create policy "Users can view their own exercises"
on public.exercises for select using (auth.uid() = user_id);
create policy "Users can insert their own exercises"
on public.exercises for insert with check (auth.uid() = user_id);
create policy "Users can update their own exercises"
on public.exercises for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own exercises"
on public.exercises for delete using (auth.uid() = user_id);

create policy "Users can view their own sets"
on public.sets for select using (auth.uid() = user_id);
create policy "Users can insert their own sets"
on public.sets for insert with check (auth.uid() = user_id);
create policy "Users can update their own sets"
on public.sets for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own sets"
on public.sets for delete using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, user_id, email, display_name, avatar_url)
  values (
    new.id,
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.update_updated_at_column();

create trigger set_workout_templates_updated_at
before update on public.workout_templates
for each row execute procedure public.update_updated_at_column();

create trigger set_workout_sessions_updated_at
before update on public.workout_sessions
for each row execute procedure public.update_updated_at_column();

create trigger set_exercises_updated_at
before update on public.exercises
for each row execute procedure public.update_updated_at_column();

create trigger set_sets_updated_at
before update on public.sets
for each row execute procedure public.update_updated_at_column();
