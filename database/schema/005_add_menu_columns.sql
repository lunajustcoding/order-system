-- Migration: 新增 menus 欄位
-- Date: 2024-02-01
-- Description: 新增 category, description, image, sizes 欄位

ALTER TABLE menus ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT '其他';
ALTER TABLE menus ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE menus ADD COLUMN IF NOT EXISTS image text DEFAULT '🍰';
ALTER TABLE menus ADD COLUMN IF NOT EXISTS sizes text[] DEFAULT '{}';
