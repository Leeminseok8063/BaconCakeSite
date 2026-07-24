create extension if not exists pgcrypto;

create table if not exists public.content_sections (
  id uuid primary key default gen_random_uuid(),
  eyebrow text,
  title text not null,
  slug text,
  layout text not null default 'article' check (layout in ('article', 'album', 'release')),
  sort_order integer,
  created_at timestamptz not null default now()
);

alter table public.content_sections
add column if not exists slug text;

alter table public.content_sections
add column if not exists sort_order integer;

alter table public.content_sections
drop constraint if exists content_sections_layout_check;

alter table public.content_sections
add constraint content_sections_layout_check
check (layout in ('article', 'album', 'release'));

with ranked_sections as (
  select id, row_number() over (order by created_at asc, id asc) * 10 as next_order
  from public.content_sections
  where sort_order is null
)
update public.content_sections
set sort_order = ranked_sections.next_order
from ranked_sections
where public.content_sections.id = ranked_sections.id;

alter table public.content_sections
alter column sort_order set default 0;

create unique index if not exists content_sections_slug_key
on public.content_sections (slug)
where slug is not null;

create table if not exists public.content_entries (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.content_sections(id) on delete cascade,
  number text,
  title text not null,
  slug text,
  body text not null,
  media_items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.content_entries
add column if not exists slug text;

create unique index if not exists content_entries_slug_key
on public.content_entries (slug)
where slug is not null;

create table if not exists public.site_settings (
  id text primary key,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.content_sections enable row level security;
alter table public.content_entries enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Anyone can read content sections" on public.content_sections;
drop policy if exists "Authenticated users can manage content sections" on public.content_sections;
drop policy if exists "Anyone can read content entries" on public.content_entries;
drop policy if exists "Authenticated users can manage content entries" on public.content_entries;
drop policy if exists "Anyone can read site settings" on public.site_settings;
drop policy if exists "Authenticated users can manage site settings" on public.site_settings;

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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'content-media',
  'content-media',
  true,
  524288000,
  array[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'audio/mpeg',
    'audio/mp4',
    'audio/wav',
    'audio/webm',
    'application/pdf'
  ]
)
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

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
