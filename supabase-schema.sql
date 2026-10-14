-- =============================================================================
-- Supabase Database Schema: Software Engineer Portfolio & Admin System
-- =============================================================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. PROFILES TABLE (Engineer bio, credentials, availability)
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null default 'MD Abu Hanif Mia',
  preferred_name text not null default 'Abu Hanif',
  kicker text not null default 'Staff Software Engineer & Systems Architect',
  headline text not null default 'Clean Architecture • High Performance • Scalable Systems',
  bio text not null default 'Staff Software Engineer & Systems Architect with 9+ years building high-throughput distributed systems, Next.js applications, Supabase integrations, and Cloudflare Pages deployments.',
  email text not null default 'contact@abuhanif.dev',
  phone text not null default '+880 1700-000000',
  location text not null default 'Dhaka, Bangladesh / Remote Worldwide',
  availability_status text not null default 'Available for Architecture Consulting & High-Impact Contracts',
  is_available boolean not null default true,
  social_links jsonb not null default '{
    "github": "https://github.com",
    "linkedin": "https://linkedin.com",
    "twitter": "https://x.com",
    "discord": "https://discord.com"
  }'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -----------------------------------------------------------------------------
-- 2. PROJECTS TABLE (Portfolio Work Showcase)
-- -----------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  summary text not null,
  description_markdown text not null,
  client_name text default 'Confidential Client',
  thumbnail_url text,
  demo_url text,
  github_url text,
  price_tag text, -- e.g. "$12,500 Scope", "$140/hr", "Open Source"
  impact_metric text, -- e.g. "99.99% Uptime", "10x Throughput", "<40ms P99"
  tech_stack text[] not null default '{}',
  sort_order int not null default 0,
  is_featured boolean not null default true,
  is_published boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -----------------------------------------------------------------------------
-- 3. SERVICES & PRICING TABLE (Transparent Work Pricing)
-- -----------------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text not null,
  pricing_type text not null default 'fixed', -- 'fixed' | 'hourly' | 'retainer'
  price_display text not null, -- e.g. "$2,500", "$140 / hr", "$4,800 / mo"
  timeline text not null, -- e.g. "3-5 Business Days", "2-4 Weeks", "Ongoing"
  deliverables text[] not null default '{}',
  is_popular boolean not null default false,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -----------------------------------------------------------------------------
-- 4. BLOG POSTS TABLE (Personal Technical Blogging System)
-- -----------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content_markdown text not null,
  cover_image_url text,
  tags text[] not null default '{}',
  reading_time_minutes int not null default 5,
  is_published boolean not null default true,
  published_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -----------------------------------------------------------------------------
-- 5. INQUIRIES TABLE (Contact & Project Scoping Form Leads)
-- -----------------------------------------------------------------------------
create table if not exists public.inquiries (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  project_type text not null,
  budget_range text not null,
  message text not null,
  status text not null default 'new', -- 'new' | 'reviewed' | 'contacted' | 'archived'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.blog_posts enable row level security;
alter table public.inquiries enable row level security;

-- Public can read profile, published projects, active services, and published blog posts
create policy "Public can view profiles" on public.profiles for select using (true);
create policy "Public can view published projects" on public.projects for select using (is_published = true);
create policy "Public can view active services" on public.services for select using (is_active = true);
create policy "Public can view published blog posts" on public.blog_posts for select using (is_published = true);

-- Public can submit project inquiries
create policy "Public can insert inquiries" on public.inquiries for insert with check (true);

-- Authenticated admins can manage everything
create policy "Admins have full access to profiles" on public.profiles using (auth.role() = 'authenticated');
create policy "Admins have full access to projects" on public.projects using (auth.role() = 'authenticated');
create policy "Admins have full access to services" on public.services using (auth.role() = 'authenticated');
create policy "Admins have full access to blog posts" on public.blog_posts using (auth.role() = 'authenticated');
create policy "Admins have full access to inquiries" on public.inquiries using (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- STORAGE BUCKETS (portfolio-assets & blog-images)
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public) 
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

create policy "Public can view portfolio assets" on storage.objects for select using (bucket_id = 'portfolio-assets');
create policy "Public can view blog images" on storage.objects for select using (bucket_id = 'blog-images');
create policy "Admins can upload portfolio assets" on storage.objects for insert with check (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');
create policy "Admins can upload blog images" on storage.objects for insert with check (bucket_id = 'blog-images' and auth.role() = 'authenticated');
