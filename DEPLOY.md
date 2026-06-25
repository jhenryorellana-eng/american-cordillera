# Deploy — Vercel + Supabase

Production runs Next.js on **Vercel** with **Postgres on Supabase**
(project `american-cordillera`, ref `sktnatpjzrpvsxjxeorw`, region us-east-1).

The database schema and base data (admin user, countries, the Trujillo pilot chapter,
and chat channels) are already applied. Events / podcast / observatory content is added
from the in-app Admin panel (`/admin`).

## 1. Environment variables (Vercel → Project → Settings → Environment Variables)

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Supabase **pooled** connection (port 6543) + `?pgbouncer=true&connection_limit=1` |
| `DIRECT_URL` | Supabase **direct** connection (port 5432) |
| `JWT_SECRET` | a long random string (keep it secret) |
| `AUTH_COOKIE_NAME` | `ac_session` |
| `ENABLE_TAX_RECEIPT_501C3` | `false` |
| `ENABLE_PAYMENTS` | `false` |

Get `DATABASE_URL` / `DIRECT_URL` from the Supabase dashboard:
**Project → Connect → ORMs → Prisma** (copy both; replace `[YOUR-PASSWORD]` with the DB
password — reset it under Settings → Database if needed).

## 2. Push to GitHub

```bash
git remote add origin https://github.com/<you>/american-cordillera.git
git push -u origin main
```
(`.env` is gitignored — secrets are never pushed.)

## 3. Import to Vercel

- vercel.com → **Add New → Project** → import the GitHub repo.
- Framework: **Next.js** (auto-detected). Build command stays `npm run build`
  (runs `prisma generate && next build`).
- Add the environment variables from step 1 (Production + Preview).
- **Deploy.**

## 4. After deploy

- Log in at `/admin` with the admin email above and the password set during seeding.
- Add events, podcast episodes and observatory posts from the Admin panel.

## Security — Row Level Security (RLS)

Supabase exposes an auto-generated Data API to the public **anon** key. Our app does **not**
use it (it connects via Prisma using the Postgres role), so enabling RLS with no policies
**locks the public API without affecting the app**. Recommended:

```sql
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
-- ...repeat for every table (see repo / ask).
```

## Payments

Stripe is not wired yet. Donation/sponsorship flows capture intent (`Donation.status=INTENT`,
`Sponsorship` rows). When a Stripe account exists: add `STRIPE_*` keys, flip `ENABLE_PAYMENTS`,
and create checkout sessions + a `/api/webhooks/stripe` handler.
