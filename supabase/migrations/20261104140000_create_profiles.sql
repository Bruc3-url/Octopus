create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  alias text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, alias)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'alias'), ''), '')
  );

  return new;
end;
$$;

drop trigger if exists al_crear_usuario_auth on auth.users;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
