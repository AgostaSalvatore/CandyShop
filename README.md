# 🍭 CandyShop

E-commerce per dolci, patatine e bevande americane. Built with Next.js 16, TypeScript, Tailwind 4, Prisma e Stripe.

## Stack

- **Framework**: Next.js 16 (App Router) + TypeScript + Turbopack
- **UI**: Tailwind CSS 4 + shadcn/ui (base-nova) + Lucide icons
- **Database**: PostgreSQL (Neon) + Prisma 6
- **Auth**: Auth.js v5 (Credentials + Google OAuth)
- **i18n**: next-intl 4 (it + en, routing `/it` `/en`)
- **State**: Zustand (cart con persistenza)
- **Pagamenti**: Stripe Checkout + Webhooks
- **Email**: Resend + React Email
- **Media**: Cloudinary
- **Deploy**: Vercel + Neon

## Setup

1. **Installa dipendenze**:
   ```bash
   pnpm install
   ```

2. **Configura le variabili d'ambiente**: copia `.env.example` in `.env.local` e compila i valori:
   ```bash
   cp .env.example .env.local
   ```

   Servizi necessari:
   - **Neon** (DB Postgres): crea un progetto su https://neon.tech, copia `DATABASE_URL` e `DIRECT_URL`
   - **Stripe**: chiavi test da https://dashboard.stripe.com/test/apikeys
   - **Google OAuth** (opzionale): https://console.cloud.google.com/apis/credentials
   - **Cloudinary**: free tier su https://cloudinary.com
   - **Resend**: API key su https://resend.com/api-keys

   Genera `AUTH_SECRET` con:
   ```bash
   pnpm dlx auth secret
   ```

3. **Crea lo schema DB e popola con dati di esempio**:
   ```bash
   pnpm db:migrate     # crea le tabelle (dev)
   pnpm db:seed        # popola categorie, marche, prodotti, admin demo
   ```

4. **Avvia il dev server**:
   ```bash
   pnpm dev
   ```

   Apri http://localhost:3000 → verrai reindirizzato a `/it`.

## Comandi utili

| Comando | Descrizione |
|---------|-------------|
| `pnpm dev` | Dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Avvia il server di produzione |
| `pnpm lint` | ESLint |
| `pnpm db:generate` | Rigenera Prisma client |
| `pnpm db:migrate` | Crea/applica migrations (dev) |
| `pnpm db:push` | Sync schema senza migration (prototyping) |
| `pnpm db:seed` | Popola DB con dati demo |
| `pnpm db:studio` | Apri Prisma Studio per il DB |

## Struttura

```
src/
├── app/
│   ├── [locale]/        # route con i18n (it, en)
│   ├── api/             # API routes (auth, stripe webhook, upload)
│   └── globals.css      # Tailwind 4 + shadcn theme
├── components/
│   └── ui/              # shadcn primitives
├── i18n/                # next-intl config + messages
├── lib/
│   ├── auth.ts          # Auth.js config
│   └── db.ts            # Prisma singleton
└── proxy.ts             # i18n proxy (ex-middleware, Next 16)
prisma/
├── schema.prisma
├── catalog-data.ts      # seed catalogo
└── seed.ts
```

## Account demo (dopo seed)

- **Admin**: `admin@candyshop.it` / `admin12345`
- **User**:  `demo@candyshop.it` / `demo12345`

## Stripe webhook in locale

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copia il `whsec_...` in `.env.local` come `STRIPE_WEBHOOK_SECRET`.

## Deploy

- Push su GitHub → connetti repo a Vercel → setta env vars (gli stessi di `.env.example`) → deploy
- Su Neon, crea un branch separato per `production`
- Su Stripe, passa a live keys quando vai live e configura webhook endpoint per `https://<dominio>/api/stripe/webhook`
