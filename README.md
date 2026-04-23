# Mira Bánh Ngọt

Website đặt bánh với trang công khai cho khách + trang quản trị cho chủ shop. Stack: **Next.js 14 (App Router) · TypeScript · Prisma · Postgres (Neon) · Vercel Blob**. Design system và assets được kế thừa từ UI kit Mira (giữ lại trong `legacy/`).

## Tính năng

### Trang khách (`/`)
- Hiển thị menu bánh với filter theo category
- Thêm vào giỏ, điều chỉnh số lượng, xoá
- Form checkout với thông tin khách hàng + địa chỉ giao hàng
- Thông báo order mới cho chủ shop (stub — log ra terminal)

### Trang admin (`/admin`)
- Đăng nhập bằng username/password (cookie session, bcrypt hash)
- Dashboard: số order pending / hôm nay / sản phẩm đang bán
- Orders: danh sách + chi tiết, update status (pending → confirmed → delivered / cancelled)
- Products: CRUD đầy đủ, toggle Available trực tiếp từ list
- Categories: CRUD danh mục, toggle Active từ list — filter bar trên storefront tự động cập nhật
- Upload ảnh: file uploaded lên **Vercel Blob** (prod) hoặc `public/uploads/` (local dev), max 5 MB

---

## Local development

Yêu cầu **Node.js 18+** và một Postgres database (dùng **Neon** miễn phí hoặc Postgres local qua Docker).

```bash
# 1. Lấy code
git clone <repo> bakery && cd bakery

# 2. Cài deps
npm install

# 3. Tạo .env từ template, rồi điền DATABASE_URL
cp .env.example .env
# Mở .env và paste Neon connection string

# 4. Push schema + seed
npm run setup

# 5. Chạy dev server
npm run dev
```

Mặc định chạy tại [http://localhost:3000](http://localhost:3000).

### Tài khoản admin mặc định

```
username: admin
password: admin123
```

Đăng nhập tại `/admin/login`. Đổi password bằng cách sửa `ADMIN_PASSWORD` trong `.env` rồi chạy lại `npm run db:seed` (upsert sẽ cập nhật hash mới).

---

## Deploy lên Vercel

### 1. Push code lên GitHub

Đã có repo GitHub trỏ sẵn.

### 2. Import vào Vercel

- Vào [vercel.com/new](https://vercel.com/new), import repo GitHub
- Framework detect: **Next.js** (auto)
- Build command: `npm run build` (default — sẽ tự chạy `prisma db push + next build`)

### 3. Tạo Postgres (Neon) — 1 click

Trong dashboard project Vercel:
- **Storage** tab → **Create Database** → **Neon** (Serverless Postgres)
- Chọn region gần user nhất (Singapore cho VN, San Francisco cho US)
- Click **Connect** — Vercel tự inject `DATABASE_URL` vào Environment Variables

### 4. Tạo Blob store (cho upload ảnh) — 1 click

- **Storage** tab → **Create Database** → **Blob**
- Click **Connect** — Vercel tự inject `BLOB_READ_WRITE_TOKEN`

### 5. Thêm env vars còn lại

Settings → Environment Variables:

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<strong password>
SESSION_SECRET=<generate: openssl rand -hex 32>
```

### 6. Deploy

Push code → Vercel auto build + deploy. Build step sẽ:
- `prisma generate` → tạo Prisma client
- `prisma db push` → sync schema sang Neon
- `next build` → build Next.js

### 7. Seed data lần đầu

Sau khi deploy thành công, mở Vercel CLI hoặc chạy 1 lần từ local (đã điền `DATABASE_URL` Neon):

```bash
npm run db:seed
```

Seed sẽ tạo 4 categories + 8 bánh mẫu + tài khoản admin.

---

## Notification cho chủ shop

Khi khách đặt hàng, [lib/notify.ts](lib/notify.ts) log thông tin order ra terminal (trên Vercel, xem ở **Logs** tab của deployment):

```
======================================
NEW ORDER  ·  #ABC123  ·  Apr 23, 2026, 11:25 AM
======================================
Customer: Jane Doe
Phone:    (408) 555-0123
Email:    jane@example.com
Address:  128 Lion Ave, San Jose, CA
...
```

Để gửi mail / Telegram, set env vars và cắm logic trong [lib/notify.ts](lib/notify.ts):

```env
RESEND_API_KEY=re_xxx
NOTIFY_EMAIL_TO=owner@example.com

# hoặc
TELEGRAM_BOT_TOKEN=123456:abc
TELEGRAM_CHAT_ID=987654
```

---

## Cấu trúc folder

```
bakery/
├── app/
│   ├── (public)/              # trang khách
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx         # sidebar + auth gate
│   │   ├── actions.ts         # server actions (login, CRUD, status, toggle)
│   │   ├── StatusToggle.tsx   # toggle switch component
│   │   ├── page.tsx           # dashboard
│   │   ├── login/
│   │   ├── orders/
│   │   ├── products/
│   │   └── categories/
│   ├── api/
│   │   ├── orders/route.ts        # POST đặt hàng
│   │   └── admin/upload/route.ts  # POST upload ảnh (Blob + local fallback)
│   └── layout.tsx
├── components/
│   └── public/                # Header, Hero, Products, CartDrawer, CartContext
├── lib/
│   ├── db.ts                  # Prisma singleton
│   ├── auth.ts                # login / logout / session cookie
│   ├── adminGuard.ts
│   ├── notify.ts              # order notification stub
│   └── types.ts               # DTOs + mappers
├── prisma/
│   ├── schema.prisma          # Postgres schema
│   └── seed.ts
├── public/
│   ├── assets/                # default illustrations + logo
│   └── uploads/               # local dev upload fallback (gitignored)
├── styles/
│   ├── tokens.css
│   ├── website.css
│   └── admin.css
└── legacy/                    # UI kit gốc để tham khảo
```

---

## Scripts

```bash
npm run dev         # Next.js dev server
npm run build       # prisma generate + db push + next build
npm run start       # start built app
npm run setup       # db push + seed (lần đầu)
npm run db:push     # sync schema -> Postgres
npm run db:seed     # seed / reset data
npm run db:studio   # Prisma Studio GUI
```

---

## Lưu ý bảo mật (production)

- `ADMIN_PASSWORD` và `SESSION_SECRET` phải là giá trị mạnh, **không commit** `.env`
- Session cookie set `httpOnly + sameSite=lax + secure` ở prod
- Mọi server action admin gọi `requireAdmin()` / `ensureAdmin()`
- Zod validation cho order input ([app/api/orders/route.ts](app/api/orders/route.ts))
- Bcrypt hash password admin (10 rounds)
- Upload route check session + MIME whitelist + max 5 MB

---

## Migration path

Hiện dùng `prisma db push` trong build (đơn giản, không track schema history). Khi app lớn hơn hoặc team nhiều người, switch sang `prisma migrate`:

1. Đổi build script: `prisma generate && prisma migrate deploy && next build`
2. Tạo migration: `npx prisma migrate dev --name init`
3. Commit folder `prisma/migrations/`
4. Bỏ `prisma/migrations/` khỏi `.gitignore`
