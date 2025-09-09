-- Alex Hormozi AI Coaching Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text,
  company_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Business profiles
create table public.businesses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  industry text,
  current_revenue numeric,
  customer_count integer,
  cac numeric, -- Customer Acquisition Cost
  ltv numeric, -- Lifetime Value
  gross_margin numeric,
  business_stage text check (business_stage in ('startup', 'growth', 'scale', 'mature')) not null default 'startup',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Coaching sessions
create table public.coaching_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  business_id uuid references public.businesses(id) on delete set null,
  query text not null,
  session_type text check (session_type in ('diagnostic', 'strategic', 'implementation')) not null,
  agent_used text not null,
  n8n_response jsonb,
  synthesis text,
  action_items jsonb,
  next_steps jsonb,
  frameworks jsonb,
  confidence numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Agent analyses (for detailed breakdowns)
create table public.agent_analyses (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.coaching_sessions(id) on delete cascade not null,
  agent_type text not null,
  findings jsonb,
  recommendations jsonb,
  metrics jsonb,
  confidence numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User preferences and settings
create table public.user_preferences (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null unique,
  preferred_session_type text default 'diagnostic',
  notification_settings jsonb default '{}'::jsonb,
  coaching_history_visible boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Policies
alter table public.users enable row level security;
alter table public.businesses enable row level security;
alter table public.coaching_sessions enable row level security;
alter table public.agent_analyses enable row level security;
alter table public.user_preferences enable row level security;

-- Users can only see their own data
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- Business policies
create policy "Users can view own businesses" on public.businesses
  for select using (auth.uid() = user_id);

create policy "Users can create own businesses" on public.businesses
  for insert with check (auth.uid() = user_id);

create policy "Users can update own businesses" on public.businesses
  for update using (auth.uid() = user_id);

-- Coaching session policies
create policy "Users can view own sessions" on public.coaching_sessions
  for select using (auth.uid() = user_id);

create policy "Users can create own sessions" on public.coaching_sessions
  for insert with check (auth.uid() = user_id);

-- Agent analyses policies
create policy "Users can view own analyses" on public.agent_analyses
  for select using (
    exists (
      select 1 from public.coaching_sessions cs 
      where cs.id = agent_analyses.session_id 
      and cs.user_id = auth.uid()
    )
  );

create policy "Users can create own analyses" on public.agent_analyses
  for insert with check (
    exists (
      select 1 from public.coaching_sessions cs 
      where cs.id = agent_analyses.session_id 
      and cs.user_id = auth.uid()
    )
  );

-- User preferences policies
create policy "Users can view own preferences" on public.user_preferences
  for select using (auth.uid() = user_id);

create policy "Users can update own preferences" on public.user_preferences
  for all using (auth.uid() = user_id);

-- Indexes for better performance
create index idx_businesses_user_id on public.businesses(user_id);
create index idx_coaching_sessions_user_id on public.coaching_sessions(user_id);
create index idx_coaching_sessions_created_at on public.coaching_sessions(created_at desc);
create index idx_agent_analyses_session_id on public.agent_analyses(session_id);

-- Functions for automatic timestamp updates
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger handle_users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

create trigger handle_businesses_updated_at
  before update on public.businesses
  for each row execute function public.handle_updated_at();

create trigger handle_user_preferences_updated_at
  before update on public.user_preferences
  for each row execute function public.handle_updated_at();

-- Function to automatically create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  
  insert into public.user_preferences (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();