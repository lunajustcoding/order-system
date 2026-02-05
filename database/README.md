# Database Migrations

## 結構

```
database/schema/
├── 000_migrations.sql    # Migration 追蹤表
├── 001_menus.sql         # 基礎表
├── 002_orders.sql
├── 003_order_items.sql
├── 004_profiles.sql
├── 005_add_menu_columns.sql  # 欄位擴充
└── ...
```

## 規則

1. **永遠不要修改已執行的 migration 檔案**
2. 需要改動時，建立新的 migration 檔案
3. 檔名格式：`XXX_描述.sql`
4. 使用 `IF NOT EXISTS` 讓 SQL 可重複執行

## 新增欄位範例

```sql
-- 006_add_menu_rating.sql
ALTER TABLE menus ADD COLUMN IF NOT EXISTS rating decimal(2,1) DEFAULT 0;
ALTER TABLE menus ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0;
```

## 新增表格範例

```sql
-- 007_create_reviews.sql
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id uuid REFERENCES menus(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT now()
);
```

## 執行順序

在 Supabase SQL Editor 中，按照編號順序執行：

```
000 → 001 → 002 → 003 → 004 → 005 → ...
```

## 首次設定（全新資料庫）

執行 `database/init.sql` 一次搞定所有表格。

## 追蹤已執行的 migrations

```sql
-- 查看已執行
SELECT * FROM _migrations ORDER BY id;

-- 記錄已執行
INSERT INTO _migrations (name) VALUES ('005_add_menu_columns');
```
