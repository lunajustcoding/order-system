-- Migration 追蹤表
-- 用來記錄哪些 migration 已經執行過

CREATE TABLE IF NOT EXISTS _migrations (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  executed_at timestamp with time zone DEFAULT now()
);

-- 使用方式：
-- 執行完一個 migration 後，記錄它
-- INSERT INTO _migrations (name) VALUES ('001_menus');
-- INSERT INTO _migrations (name) VALUES ('002_orders');
-- ...

-- 查看已執行的 migrations
-- SELECT * FROM _migrations ORDER BY id;
