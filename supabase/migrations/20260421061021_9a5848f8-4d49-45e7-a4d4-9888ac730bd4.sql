-- Roles enum + table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can view their own roles"
on public.user_roles for select
to authenticated
using (auth.uid() = user_id);

create policy "Admins can view all roles"
on public.user_roles for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage roles"
on public.user_roles for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- Menu items
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Coffee','Beverages','Desserts','Continental Food')),
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.menu_items enable row level security;

create policy "Anyone can view active menu items"
on public.menu_items for select
to anon, authenticated
using (is_active = true or public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert menu items"
on public.menu_items for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update menu items"
on public.menu_items for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete menu items"
on public.menu_items for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Contact messages
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "Anyone can submit contact messages"
on public.contact_messages for insert
to anon, authenticated
with check (
  length(name) between 1 and 100
  and length(email) between 3 and 255
  and length(message) between 1 and 2000
);

create policy "Admins can view contact messages"
on public.contact_messages for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete contact messages"
on public.contact_messages for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update contact messages"
on public.contact_messages for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end$$;

create trigger menu_items_set_updated_at
before update on public.menu_items
for each row execute function public.set_updated_at();

-- Auto-grant admin role to first signup (so the owner can self-bootstrap)
create or replace function public.handle_first_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user');
  end if;
  return new;
end$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_first_admin();

-- Indexes
create index idx_menu_items_category on public.menu_items(category) where is_active = true;
create index idx_contact_messages_created on public.contact_messages(created_at desc);