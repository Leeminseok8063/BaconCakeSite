# BaconCakeOfficial.com

이미지를 활용한 BaconCake 개발사 공식 사이트 스타일의 정적 웹앱입니다.

## 실행

`index.html`을 브라우저로 열면 바로 확인할 수 있습니다.

별도 로그인 없이 페이지 하단 ROOT 콘솔에서 사이트 문구와 공지 작성, 수정, 삭제가 가능합니다. 데이터는 브라우저 `localStorage`에 저장됩니다.

일반 방문자 페이지는 `index.html`, 관리자 편집 페이지는 `admin.html`입니다. 일반 페이지 상단의 `ADMIN` 버튼에서 Supabase 관리자 계정으로 로그인하면 관리자 페이지로 이동합니다.

공지사항과 스튜디오 노트는 Supabase 데이터베이스에 저장됩니다. 관리자 작성, 수정, 삭제는 Supabase Auth 로그인 세션이 있어야 가능합니다.

긴 글 작성 제한은 없으며, 공지사항과 스튜디오 노트에는 이미지, 동영상, 오디오, PDF 첨부가 가능합니다.

첨부 파일 기능을 쓰려면 Supabase SQL Editor에서 아래 SQL을 한 번 실행해야 합니다.

```sql
alter table public.notices
add column if not exists media_items jsonb not null default '[]'::jsonb;

alter table public.studio_notes
add column if not exists media_items jsonb not null default '[]'::jsonb;

insert into storage.buckets (id, name, public)
values ('content-media', 'content-media', true)
on conflict (id) do update set public = true;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Anyone can read content media'
  ) then
    create policy "Anyone can read content media"
    on storage.objects
    for select
    using (bucket_id = 'content-media');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can upload content media'
  ) then
    create policy "Authenticated users can upload content media"
    on storage.objects
    for insert
    to authenticated
    with check (bucket_id = 'content-media');
  end if;
end $$;
```

관리자 콘솔에서 직접 새 섹션을 만들려면 아래 SQL도 함께 실행해야 합니다. 섹션은 `article`(작문형) 또는 `album`(앨범형)을 선택할 수 있습니다.

```sql
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

alter table public.content_sections enable row level security;
alter table public.content_entries enable row level security;

create policy "Anyone can read content sections"
on public.content_sections
for select
using (true);

create policy "Anyone can read content entries"
on public.content_entries
for select
using (true);

create policy "Authenticated users can manage content sections"
on public.content_sections
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage content entries"
on public.content_entries
for all
to authenticated
using (true)
with check (true);
```

사이트 문구와 개인정보 처리방침을 어드민 콘솔에서 업데이트하려면 아래 SQL도 실행해야 합니다. 일반 방문자는 읽기만 가능하고, 로그인한 관리자만 수정할 수 있습니다.

```sql
create table if not exists public.site_settings (
  id text primary key,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

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
```

## GitHub Pages

이 프로젝트는 정적 사이트라 GitHub Pages에 바로 배포할 수 있습니다.

1. GitHub에서 새 저장소를 만듭니다.
2. 이 폴더를 해당 저장소에 push합니다.
3. 저장소의 `Settings > Pages`에서 `Deploy from a branch`를 선택합니다.
4. Branch는 `master`, folder는 `/root`를 선택하고 저장합니다.

배포 후 일반 사이트는 GitHub Pages 주소의 `/`에서, 관리자 페이지는 `/admin.html`에서 열 수 있습니다.
