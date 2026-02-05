-- Migration: 新增 order_items 欄位
-- Date: 2024-02-01

ALTER TABLE order_items ADD COLUMN IF NOT EXISTS menu_image text;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS size text;
