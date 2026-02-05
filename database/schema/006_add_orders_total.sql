-- Migration: 新增 orders 欄位
-- Date: 2024-02-01

ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_name text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total integer NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();
