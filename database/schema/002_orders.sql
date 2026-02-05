-- 訂單
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_name text,                         -- 顧客名稱快照
  status text not null default 'pending', -- pending, cooking, ready, completed, cancelled
  total integer not null default 0,       -- 訂單總金額
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS
alter table orders enable row level security;

create policy "Users can view own orders" on orders
  for select using (auth.uid() = user_id);

create policy "Users can create own orders" on orders
  for insert with check (auth.uid() = user_id);

create policy "Admin can view all orders" on orders
  for select using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admin can update orders" on orders
  for update using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
