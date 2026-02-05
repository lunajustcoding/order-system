-- 訂單明細
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  menu_id uuid references menus(id),
  menu_name text not null,                -- 商品名稱快照
  menu_image text,                        -- 商品圖片快照
  price integer not null,                 -- 單價快照
  size text,                              -- 選擇的尺寸
  quantity integer not null default 1
);

-- RLS
alter table order_items enable row level security;

create policy "Users can view own order items" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Users can create order items for own orders" on order_items
  for insert with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Admin can view all order items" on order_items
  for select using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
