# Abu Hanif (MD Abu Hanif Mia) - Staff Software Engineer Portfolio

Professional portfolio, technical case studies, transparent service pricing, and engineering blog for **MD Abu Hanif Mia (Abu Hanif)** — Staff Software Engineer & Systems Architect.

Built on Next.js 16 (App Router), TypeScript, Tailwind CSS, Supabase PostgreSQL, and deployable on Cloudflare Pages.

## 🚀 Key Features

- **Pixel-Perfect Classic Architecture Theme**: Preserves the structural layout with flat, solid modern color styling (no gradients).
- **Work Showcase & Scoped Pricing**: Detailed engineering case studies covering distributed telemetry pipelines, multi-tenant e-commerce platforms, AI document search/RAG pipelines, and database optimization.
- **Transparent Services & Pricing**: Fixed-fee architecture audits, database performance tuning, greenfield builds, and fractional advisory plans.
- **Technical Blogging System**: Built-in blogging archive and markdown article reader pre-rendered via static site generation (SSG).
- **Interactive Admin Control Panel**: Located at `/admin` for real-time management of projects, pricing scopes, blog posts, and consultation inquiries.
- **Supabase Integration**: PostgreSQL schema with Row Level Security (RLS) policies and storage bucket configuration (`supabase-schema.sql`).
- **Cloudflare Pages Ready**: Fully static export compatible with Next.js SSG.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (Turbopack, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Classic Scoped Stylesheet
- **Database**: Supabase / PostgreSQL (with offline localStorage fallback)
- **Deployment Target**: Cloudflare Pages / Vercel

## 💻 Local Development

```bash
# Install dependencies
pnpm install

# Start local development server
pnpm dev

# Type check
pnpm check

# Production build
pnpm build
```

## 📂 Project Structure

```
├── app/
│   ├── admin/           # Interactive Admin Portal
│   ├── blog/            # Technical Blog & Article Reader
│   ├── components/      # UI components & form guards
│   ├── lib/             # Data stores, engineer dataset & Supabase client
│   ├── layout.tsx       # Root metadata & layout
│   └── page.tsx         # Homepage source document
├── public/
│   └── images/          # Vector logos, tagline badges & hero assets
├── supabase-schema.sql  # Supabase PostgreSQL schema with RLS
└── next.config.ts       # Next.js configuration
```

## 📬 Contact

- **Name**: MD Abu Hanif Mia (Abu Hanif)
- **Email**: contact@abuhanif.dev
- **Location**: Dhaka, Bangladesh / Remote Worldwide
