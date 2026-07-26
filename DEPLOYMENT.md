# MiniBazaar — Production Deployment Guide

A single **Next.js 16** app (frontend + backend) deployed to **Vercel**, backed by
**Supabase** (Postgres database + image storage). Total running cost: ~$0 (only a
domain).

---

## 1. Architecture

```
Browser ──► Next.js on Vercel ──► Supabase (Postgres + Storage)
            frontend + backend      database + product images
```

- **Public storefront** reads the DB with the anon/publishable key (read-only, RLS-enforced).
- **Admin panel** (`/admin`) writes through server actions using the **service-role key**,
  which never reaches the browser.
- **Product images** are compressed to WebP (max 3MB) in the browser, then uploaded to the
  Supabase `product-images` bucket.

---

## 2. One-time Supabase setup (already done for the current project)

1. Create a Supabase project (region: Singapore/Mumbai for Sri Lanka).
2. In **SQL Editor**, run in order:
   - `supabase/schema.sql`
   - `supabase/migration_production.sql`
   This creates all tables, the `refunded` payment status, RLS policies, and the
   `product-images` storage bucket.

---

## 3. Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (and locally in
`.env.local`). Values live in your Supabase dashboard under **Project Settings → API**.

| Variable | Where to get it | Exposed to browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | Yes (safe) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable / anon key | Yes (safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** / service_role key | **NO — keep secret** |
| `DATABASE_URL` | Connection string (for migrations only) | No |
| `NEXT_PUBLIC_SITE_URL` | Your production URL, e.g. `https://minibazaar.lk` | Yes |
| `ADMIN_USERNAME` | You choose (default `admin`) | No |
| `ADMIN_PASSWORD` | You choose — **change from default** | No |
| `ADMIN_SESSION_SECRET` | A long random string (`openssl rand -hex 32`) | No |

> ⚠️ Never commit `.env.local` (it is gitignored) and never expose the service-role key.

---

## 4. Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel: **New Project → Import** the repo. Framework auto-detects as Next.js.
3. Add all environment variables from the table above.
4. Deploy.
5. Add your custom domain under **Settings → Domains**.

The `vercel.json` cron pings `/api/keep-alive` daily at 06:00 UTC to stop the free
Supabase project from pausing after 7 days of inactivity.

---

## 5. Admin panel

- URL: `https://<your-domain>/admin` → redirects to `/admin/login`.
- Log in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
- **Products** (`/admin/products`): add / edit / delete, upload images, set featured,
  assign category, set stock, toggle active (visible in shop).
- **Dashboard** (`/admin`): view orders, change **order status**
  (processing / delivered / cancelled, etc.) and **payment status**
  (payment complete / pending / return).

---

## 6. Growth path when storage fills up

- Images are auto-compressed, so 1GB free ≈ several thousand product images.
- When it fills: move image storage to **Cloudflare R2** (10GB free) — only the upload
  helper's target changes; the database is untouched.
- The database itself (text/numbers) will not fill for a very long time.
