-- Migration 001: menus 表
-- 基礎欄位，後續擴充請建立新的 migration 檔案

CREATE TABLE IF NOT EXISTS menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'menus' AND policyname = 'Anyone can view active menus'
  ) THEN
    CREATE POLICY "Anyone can view active menus" ON menus FOR SELECT USING (is_active = true);
  END IF;
END $$;
