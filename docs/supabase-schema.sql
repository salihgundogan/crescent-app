create extension if not exists "pgcrypto";

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  address text not null,
  working_hours_start time not null default '09:00',
  working_hours_end time not null default '19:00',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  is_available boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.product_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  detail text,
  price numeric(10, 2) not null check (price >= 0),
  is_default boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customer_profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (customer_id, product_id)
);

create table if not exists public.guest_profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text not null unique,
  customer_id uuid references public.customer_profiles(id) on delete set null,
  guest_profile_id uuid references public.guest_profiles(id) on delete set null,
  branch_id uuid not null references public.branches(id),
  status text not null default 'Alindi',
  payment_method text not null,
  payment_status text not null default 'Beklemede',
  note text,
  policy_snapshot text not null default 'Iade yoktur, degisim vardir.',
  created_at timestamptz not null default now(),
  constraint orders_owner_check check (
    (customer_id is not null and guest_profile_id is null)
    or (customer_id is null and guest_profile_id is not null)
  )
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_option_id uuid references public.product_options(id) on delete set null,
  product_name_snapshot text not null,
  option_label_snapshot text not null,
  unit_price_snapshot numeric(10, 2) not null check (unit_price_snapshot >= 0),
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

insert into public.branches (name, slug, address)
values
  ('Dukkan 1', 'dukkan-1', 'Merkez Mah. Ataturk Cad. No: 18'),
  ('Dukkan 2', 'dukkan-2', 'Carsi Mah. Cumhuriyet Sok. No: 7')
on conflict (slug) do nothing;

insert into public.categories (name, slug, sort_order)
values
  ('Deneme 1', 'deneme-1', 1),
  ('Deneme 2', 'deneme-2', 2)
on conflict (slug) do nothing;

alter table public.branches enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_options enable row level security;
alter table public.customer_profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.guest_profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_profiles enable row level security;

drop policy if exists "Public can read active branches" on public.branches;
create policy "Public can read active branches"
on public.branches for select
using (is_active = true);

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories for select
using (is_active = true);

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products for select
using (is_active = true);

drop policy if exists "Public can read product options" on public.product_options;
create policy "Public can read product options"
on public.product_options for select
using (true);

drop policy if exists "Users can manage own profile" on public.customer_profiles;
create policy "Users can manage own profile"
on public.customer_profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can manage own favorites" on public.favorites;
create policy "Users can manage own favorites"
on public.favorites for all
using (auth.uid() = customer_id)
with check (auth.uid() = customer_id);

drop policy if exists "Users can read own orders" on public.orders;
create policy "Users can read own orders"
on public.orders for select
using (auth.uid() = customer_id);

drop policy if exists "Users can read own order items" on public.order_items;
create policy "Users can read own order items"
on public.order_items for select
using (
  exists (
    select 1
    from public.orders
    where public.orders.id = order_items.order_id
      and public.orders.customer_id = auth.uid()
  )
);
