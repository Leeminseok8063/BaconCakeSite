create extension if not exists pgcrypto;

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  media_items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.notices
add column if not exists media_items jsonb not null default '[]'::jsonb;

create table if not exists public.studio_notes (
  id uuid primary key default gen_random_uuid(),
  number text,
  title text not null,
  body text not null,
  media_items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.studio_notes
add column if not exists media_items jsonb not null default '[]'::jsonb;

create table if not exists public.content_sections (
  id uuid primary key default gen_random_uuid(),
  eyebrow text,
  title text not null,
  layout text not null default 'article' check (layout in ('article', 'album')),
  created_at timestamptz not null default now()
);

create table if not exists public.content_entries (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.content_sections(id) on delete cascade,
  number text,
  title text not null,
  body text not null,
  media_items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.notices enable row level security;
alter table public.studio_notes enable row level security;
alter table public.content_sections enable row level security;
alter table public.content_entries enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Anyone can read notices" on public.notices;
drop policy if exists "Authenticated users can manage notices" on public.notices;
drop policy if exists "Anyone can read studio notes" on public.studio_notes;
drop policy if exists "Authenticated users can manage studio notes" on public.studio_notes;
drop policy if exists "Anyone can read content sections" on public.content_sections;
drop policy if exists "Authenticated users can manage content sections" on public.content_sections;
drop policy if exists "Anyone can read content entries" on public.content_entries;
drop policy if exists "Authenticated users can manage content entries" on public.content_entries;
drop policy if exists "Anyone can read site settings" on public.site_settings;
drop policy if exists "Authenticated users can manage site settings" on public.site_settings;

create policy "Anyone can read notices"
on public.notices
for select
using (true);

create policy "Authenticated users can manage notices"
on public.notices
for all
to authenticated
using (true)
with check (true);

create policy "Anyone can read studio notes"
on public.studio_notes
for select
using (true);

create policy "Authenticated users can manage studio notes"
on public.studio_notes
for all
to authenticated
using (true)
with check (true);

create policy "Anyone can read content sections"
on public.content_sections
for select
using (true);

create policy "Authenticated users can manage content sections"
on public.content_sections
for all
to authenticated
using (true)
with check (true);

create policy "Anyone can read content entries"
on public.content_entries
for select
using (true);

create policy "Authenticated users can manage content entries"
on public.content_entries
for all
to authenticated
using (true)
with check (true);

create policy "Anyone can read site settings"
on public.site_settings
for select
using (true);

create policy "Authenticated users can manage site settings"
on public.site_settings
for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('content-media', 'content-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Anyone can read content media" on storage.objects;
drop policy if exists "Authenticated users can upload content media" on storage.objects;
drop policy if exists "Authenticated users can update content media" on storage.objects;
drop policy if exists "Authenticated users can delete content media" on storage.objects;

create policy "Anyone can read content media"
on storage.objects
for select
using (bucket_id = 'content-media');

create policy "Authenticated users can upload content media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'content-media');

create policy "Authenticated users can update content media"
on storage.objects
for update
to authenticated
using (bucket_id = 'content-media')
with check (bucket_id = 'content-media');

create policy "Authenticated users can delete content media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'content-media');
