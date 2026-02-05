-- =============================================
-- 完整資料庫初始化腳本
-- 用於全新 Supabase 專案
-- =============================================

-- Migration 追蹤表
CREATE TABLE IF NOT EXISTS _migrations (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  executed_at timestamp with time zone DEFAULT now()
);

-- =============================================
-- MENUS 商品表
-- =============================================
CREATE TABLE IF NOT EXISTS menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price integer NOT NULL,
  category text NOT NULL DEFAULT '其他',
  description text,
  image text DEFAULT '🍰',
  sizes text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE menus ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active menus" ON menus;
CREATE POLICY "Anyone can view active menus" ON menus
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert menus" ON menus;
CREATE POLICY "Anyone can insert menus" ON menus
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update menus" ON menus;
CREATE POLICY "Anyone can update menus" ON menus
  FOR UPDATE USING (true);

-- =============================================
-- PROFILES 用戶表
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert profiles" ON profiles;
CREATE POLICY "Anyone can insert profiles" ON profiles
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update profiles" ON profiles;
CREATE POLICY "Anyone can update profiles" ON profiles
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete profiles" ON profiles;
CREATE POLICY "Anyone can delete profiles" ON profiles
  FOR DELETE USING (true);

-- =============================================
-- ORDERS 訂單表
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name text,
  status text NOT NULL DEFAULT 'pending',
  total integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view orders" ON orders;
CREATE POLICY "Anyone can view orders" ON orders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
CREATE POLICY "Anyone can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update orders" ON orders;
CREATE POLICY "Anyone can update orders" ON orders
  FOR UPDATE USING (true);

-- =============================================
-- ORDER_ITEMS 訂單明細表
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  menu_id uuid REFERENCES menus(id),
  menu_name text NOT NULL,
  menu_image text,
  price integer NOT NULL,
  size text,
  quantity integer NOT NULL DEFAULT 1
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view order_items" ON order_items;
CREATE POLICY "Anyone can view order_items" ON order_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert order_items" ON order_items;
CREATE POLICY "Anyone can insert order_items" ON order_items
  FOR INSERT WITH CHECK (true);

-- =============================================
-- 預設商品資料
-- =============================================
INSERT INTO menus (name, price, category, description, image, sizes) VALUES
  ('草莓奶油戚風', 680, '戚風系列', '嚴選大湖草莓與日本鮮奶油，每一口都能感受到絲滑與酸甜的完美平衡。', '🍓', '{"4吋", "6吋", "8吋"}'),
  ('經典巧克力慕斯', 720, '慕斯系列', '選用 70% 苦甜巧克力製作，層次分明，入口即化，巧克力控的首選。', '🍫', '{"6吋", "8吋"}'),
  ('小清新檸檬塔', 150, '塔類', '手作酥脆塔皮搭配新鮮現榨檸檬餡，清爽宜人，是下午茶的最佳良伴。', '🍋', '{"單人份"}'),
  ('靜岡抹茶捲', 450, '生乳捲', '濃郁抹茶與生乳完美融合，微苦後的甘甜回韻，讓人回味無窮。', '🍵', '{"標準捲"}')
ON CONFLICT DO NOTHING;

-- 記錄已執行的 migrations
INSERT INTO _migrations (name) VALUES
  ('001_menus'),
  ('002_orders'),
  ('003_order_items'),
  ('004_profiles'),
  ('005_add_menu_columns')
ON CONFLICT DO NOTHING;
