# Order System - 蛋糕訂購系統

練習用專案，用於學習 TypeScript、Nuxt、Supabase 與 Database Migration。

## AI 協作工具

| 工具 | 用途 |
|------|------|
| Gemini | 設計稿製作 |
| ChatGPT | 專案規劃 |
| Claude | Code Review |

## 技術棧

| 類型 | 技術 |
|------|------|
| 前端框架 | Nuxt 4 |
| 程式語言 | TypeScript |
| 樣式 | Tailwind CSS |
| 資料庫 | Supabase (PostgreSQL) |
| 套件管理 | Bun |

## 專案結構

```
order-system/
├── apps/
│   └── web/          # Nuxt 前端應用
├── database/
│   ├── init.sql      # 完整資料庫初始化腳本
│   └── README.md     # Migration 規則說明
└── README.md
```

## 資料庫設計

```
┌─────────────┐       ┌─────────────┐
│   profiles  │       │    menus    │
│  (用戶資料)  │       │  (蛋糕商品)  │
└──────┬──────┘       └──────┬──────┘
       │                     │
       │    ┌────────────┐   │
       └───►│   orders   │◄──┘
            │   (訂單)    │
            └──────┬─────┘
                   │
            ┌──────▼──────┐
            │ order_items │
            │  (訂單明細)  │
            └─────────────┘
```

### 資料表說明

| 資料表 | 用途 |
|--------|------|
| `menus` | 蛋糕商品（名稱、價格、分類、尺寸） |
| `profiles` | 用戶資料（綁定 Supabase Auth） |
| `orders` | 訂單主檔（狀態、總金額） |
| `order_items` | 訂單明細（商品、數量、價格） |
| `_migrations` | Migration 執行紀錄 |

## 系統流程

```
1. 瀏覽商品    使用者查看蛋糕菜單
       ↓
2. 選擇商品    選擇蛋糕、尺寸、數量
       ↓
3. 加入購物車  暫存選購項目
       ↓
4. 建立訂單    送出訂單，寫入 orders + order_items
       ↓
5. 訂單追蹤    查看訂單狀態 (pending → completed)
```

## 自行架設

### 1. Clone 專案

```bash
git clone https://github.com/你的帳號/order-system.git
cd order-system
```

### 2. 建立 Supabase 專案

1. 前往 [supabase.com](https://supabase.com) 建立帳號
2. 點擊 **New Project** 建立新專案
3. 等待專案建立完成（約 2 分鐘）
4. 進入 **Settings → API**，複製：
   - `Project URL` → 這是 `SUPABASE_URL`
   - `anon public` → 這是 `SUPABASE_KEY`

### 3. 初始化資料庫

1. 進入 Supabase Dashboard → **SQL Editor**
2. 複製 `database/init.sql` 的內容貼上
3. 點擊 **Run** 執行

### 4. 設定環境變數

在 `apps/web` 目錄建立 `.env` 檔案：

```env
SUPABASE_URL=https://你的專案.supabase.co
SUPABASE_KEY=你的_anon_key
```

### 5. 安裝依賴並啟動

```bash
cd apps/web
bun install
bun run dev
```

開啟瀏覽器前往 http://localhost:3000

### 6. 建立帳號

在網站上點擊「註冊」建立你的帳號，即可開始使用

## 常用指令

```bash
# 開發模式
bun run dev

# 建置專案
bun run build

# 預覽建置結果
bun run preview
```


