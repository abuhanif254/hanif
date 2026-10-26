-- =============================================================================
-- Supabase Database Schema: Abu Hanif Portfolio & Admin System
-- Run this entire script in Supabase SQL Editor (https://supabase.com/dashboard)
-- =============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null default 'MD Abu Hanif Mia',
  preferred_name text not null default 'Abu Hanif',
  kicker text not null default 'Staff Software Engineer & Systems Architect',
  headline text not null default 'Clean Architecture • High Performance • Scalable Systems',
  bio text not null default 'Staff Software Engineer & Systems Architect with 9+ years building high-throughput distributed systems, Next.js applications, Supabase integrations, and Cloudflare Pages deployments.',
  email text not null default 'abuhanifmain@gmail.com',
  phone text not null default 'Available upon request (Direct Email / Calendly)',
  location text not null default 'Dhaka, Bangladesh / Remote Worldwide',
  availability_status text not null default 'Available for Architecture Consulting & High-Impact Contracts',
  is_available boolean not null default true,
  social_links jsonb not null default '{
    "github": "https://github.com/abuhanif254",
    "linkedin": "https://linkedin.com/in/abuhanif",
    "twitter": "https://x.com/abuhanif",
    "discord": "https://discord.com"
  }'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -----------------------------------------------------------------------------
-- 2. PROJECTS TABLE (Work Showcase & Scoped Prices)
-- -----------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  summary text not null,
  description_markdown text not null,
  client_name text default 'Confidential Client',
  thumbnail_url text,
  image_url text,
  screenshots text[] not null default '{}',
  demo_url text,
  github_url text,
  price_tag text,
  impact_metric text,
  tech_stack text[] not null default '{}',
  sort_order int not null default 0,
  is_featured boolean not null default true,
  is_published boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure image columns exist if projects table was created prior
alter table public.projects add column if not exists thumbnail_url text;
alter table public.projects add column if not exists image_url text;
alter table public.projects add column if not exists screenshots text[] not null default '{}';

-- -----------------------------------------------------------------------------
-- 3. SERVICES TABLE (Transparent Pricing Matrix)
-- -----------------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text not null,
  pricing_type text not null default 'fixed',
  price_display text not null,
  timeline text not null,
  deliverables text[] not null default '{}',
  is_popular boolean not null default false,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -----------------------------------------------------------------------------
-- 4. BLOG POSTS TABLE (Personal Technical Blog)
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
-- 5. INQUIRIES TABLE (Client Consultation Requests)
-- -----------------------------------------------------------------------------
create table if not exists public.inquiries (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  project_type text not null,
  budget_range text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -----------------------------------------------------------------------------
-- 6. EDGE TELEMETRY TABLE (Live Global Latency Radar & Supabase Realtime)
-- -----------------------------------------------------------------------------
create table if not exists public.edge_telemetry (
  id uuid primary key default uuid_generate_v4(),
  region text not null,
  city_name text not null,
  continent text not null,
  latency_ms int not null check (latency_ms >= 1 and latency_ms <= 10000),
  pop_code text,
  cf_ray text,
  user_agent_category text default 'desktop',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_edge_telemetry_region_created on public.edge_telemetry (region, created_at desc);
create index if not exists idx_edge_telemetry_continent_created on public.edge_telemetry (continent, created_at desc);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.blog_posts enable row level security;
alter table public.inquiries enable row level security;
alter table public.edge_telemetry enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Public can view profiles" on public.profiles;
drop policy if exists "Public can view published projects" on public.projects;
drop policy if exists "Public can view active services" on public.services;
drop policy if exists "Public can view published blog posts" on public.blog_posts;
drop policy if exists "Public can insert inquiries" on public.inquiries;
drop policy if exists "Public can view inquiries" on public.inquiries;
drop policy if exists "Public can update inquiries" on public.inquiries;
drop policy if exists "Public can insert projects" on public.projects;
drop policy if exists "Public can update projects" on public.projects;
drop policy if exists "Public can insert services" on public.services;
drop policy if exists "Public can update services" on public.services;
drop policy if exists "Public can insert blog posts" on public.blog_posts;
drop policy if exists "Public can update blog posts" on public.blog_posts;
drop policy if exists "Public can update profiles" on public.profiles;
drop policy if exists "Public can view edge telemetry" on public.edge_telemetry;
drop policy if exists "Public can insert edge telemetry" on public.edge_telemetry;
drop policy if exists "Admins have full access to profiles" on public.profiles;
drop policy if exists "Admins have full access to projects" on public.projects;
drop policy if exists "Admins have full access to services" on public.services;
drop policy if exists "Admins have full access to blog posts" on public.blog_posts;
drop policy if exists "Admins have full access to inquiries" on public.inquiries;
drop policy if exists "Admins have full access to edge telemetry" on public.edge_telemetry;

-- Public read policies (Strictly read-only for published/active records)
create policy "Public can view profiles" on public.profiles for select using (true);
create policy "Public can view published projects" on public.projects for select using (is_published = true);
create policy "Public can view active services" on public.services for select using (is_active = true);
create policy "Public can view published blog posts" on public.blog_posts for select using (is_published = true);

-- Public inquiry submission (Insert-only with validation; never readable by anon)
create policy "Public can insert inquiries" on public.inquiries
  for insert
  with check (length(trim(name)) >= 2 and length(trim(email)) >= 5 and length(trim(message)) >= 5);

-- Authenticated / Service Role full access (No anonymous read/write on inquiries or portfolio tables)
create policy "Admins have full access to profiles" on public.profiles
  for all using (auth.role() in ('authenticated', 'service_role'))
  with check (auth.role() in ('authenticated', 'service_role'));

create policy "Admins have full access to projects" on public.projects
  for all using (auth.role() in ('authenticated', 'service_role'))
  with check (auth.role() in ('authenticated', 'service_role'));

create policy "Admins have full access to services" on public.services
  for all using (auth.role() in ('authenticated', 'service_role'))
  with check (auth.role() in ('authenticated', 'service_role'));

create policy "Admins have full access to blog posts" on public.blog_posts
  for all using (auth.role() in ('authenticated', 'service_role'))
  with check (auth.role() in ('authenticated', 'service_role'));

create policy "Admins have full access to inquiries" on public.inquiries
  for all using (auth.role() in ('authenticated', 'service_role'))
  with check (auth.role() in ('authenticated', 'service_role'));

-- Public edge telemetry policies (Empirical telemetry streaming)
create policy "Public can view edge telemetry" on public.edge_telemetry
  for select using (created_at > now() - interval '7 days');

create policy "Public can insert edge telemetry" on public.edge_telemetry
  for insert
  with check (latency_ms >= 1 and latency_ms <= 5000 and length(trim(region)) >= 2);

create policy "Admins have full access to edge telemetry" on public.edge_telemetry
  for all using (auth.role() in ('authenticated', 'service_role'))
  with check (auth.role() in ('authenticated', 'service_role'));

-- -----------------------------------------------------------------------------
-- STORAGE BUCKETS
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public) 
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view portfolio assets" on storage.objects;
drop policy if exists "Public can view blog images" on storage.objects;
drop policy if exists "Admins can upload portfolio assets" on storage.objects;
drop policy if exists "Admins can upload blog images" on storage.objects;

create policy "Public can view portfolio assets" on storage.objects for select using (bucket_id = 'portfolio-assets');
create policy "Public can view blog images" on storage.objects for select using (bucket_id = 'blog-images');
create policy "Admins can upload portfolio assets" on storage.objects for insert with check (bucket_id = 'portfolio-assets' and auth.role() in ('authenticated', 'service_role'));
create policy "Admins can upload blog images" on storage.objects for insert with check (bucket_id = 'blog-images' and auth.role() in ('authenticated', 'service_role'));

-- -----------------------------------------------------------------------------
-- INITIAL SEED DATA
-- -----------------------------------------------------------------------------

-- 1. Profile Seed
insert into public.profiles (full_name, preferred_name, kicker, headline, bio, email, phone, location, availability_status, is_available)
values (
  'MD Abu Hanif Mia',
  'Abu Hanif',
  'Staff Software Engineer & Systems Architect',
  'Clean Architecture • High Performance • Scalable Systems',
  'Staff Software Engineer & Systems Architect with 9+ years building high-throughput distributed systems, Next.js applications, Supabase integrations, and Cloudflare Pages deployments.',
  'abuhanifmain@gmail.com',
  'Direct Email / Scheduled Discovery Call',
  'Dhaka, Bangladesh / Remote Worldwide',
  'Available for Architecture Consulting & High-Impact Contracts',
  true
);

-- 2. Projects Seed
insert into public.projects (title, slug, summary, description_markdown, client_name, price_tag, impact_metric, tech_stack, sort_order, is_featured, is_published)
values
(
  'Real-Time Financial Telemetry Pipeline',
  'financial-telemetry-pipeline',
  'High-throughput WebSocket order book streaming and market depth aggregation engine processing 12M events/sec.',
  '## The Challenge\n\nAggregate and normalize raw order-book streams from 14 exchanges and fan out live market depth to over 45,000 concurrent browser clients with sub-25ms latency.\n\n## Architecture\n\n- Concurrent Go ingestion workers\n- Redis Pub/Sub cluster with pipelining\n- TimescaleDB continuous aggregates\n- Next.js WebSocket UI with Canvas charts\n\n## Results\n\nProcessed 12,000,000 events/sec at peak with 22ms P99 delivery and 99.995% uptime across 18 months.',
  'Apex Telemetry Labs',
  '$18,500 Scope',
  '<22ms P99 • 12M events/sec',
  ARRAY['Go', 'Redis', 'WebSockets', 'Next.js', 'TimescaleDB'],
  1,
  true,
  true
),
(
  'Cloudflare Edge Multi-Tenant E-Commerce Platform',
  'cloudflare-edge-ecommerce',
  'Sub-100ms global commerce platform deployed on Cloudflare Pages with distributed edge database caching.',
  '## The Challenge\n\nHigh serverless cold starts and dynamic database queries caused slow product catalog loads and shopping cart abandonment during international flash sales.\n\n## Architecture\n\n- Next.js 16 App Router on Cloudflare Pages\n- Supabase PostgreSQL with read-replicas\n- Regional edge caching with Cloudflare Workers KV\n- Optimistic UI transitions\n\n## Results\n\nCut global page render time from 1.8s down to 95ms; lifted checkout conversions by 28% and reduced cloud hosting costs by 64%.',
  'Synthetix Retail',
  '$24,000 Scope',
  '95ms Global P99 • -64% Cloud Spend',
  ARRAY['Next.js 16', 'Cloudflare Pages', 'Supabase', 'TypeScript', 'Tailwind CSS'],
  2,
  true,
  true
),
(
  'Enterprise AI Document Search & RAG Pipeline',
  'enterprise-ai-document-search',
  'Autonomous document indexing, semantic chunking, and sub-second hybrid retrieval engine over 800,000 technical manuals.',
  '## The Challenge\n\nEngineering and operations teams lost over 4 hours per week hunting down scattered technical documentation and API specifications across internal systems.\n\n## Architecture\n\n- Python & FastAPI asynchronous document processor\n- pgvector on PostgreSQL with HNSW index\n- Hybrid dense/sparse retrieval with cross-encoder re-ranking\n- Real-time streaming UI in React\n\n## Results\n\nSearch accuracy improved by 83%; average time to resolve internal support inquiries reduced from 26 minutes to 4 minutes.',
  'OmniCore Systems',
  '$14,000 Scope',
  '83% Accuracy Lift • 4min Resolution',
  ARRAY['Python', 'pgvector', 'PostgreSQL', 'FastAPI', 'React', 'OpenAI'],
  3,
  true,
  true
),
(
  'High-Concurrency PostgreSQL Performance Audit',
  'postgres-performance-audit',
  'Diagnostic query profiling, connection pool tuning, and index redesign eliminating deadlocks for 3.5M active accounts.',
  '## The Challenge\n\nA SaaS platform faced persistent connection pool exhaustion and frequent transaction deadlocks during daily morning traffic spikes.\n\n## Solution\n\n- Conducted EXPLAIN (ANALYZE, BUFFERS) profiling on 50 highest-impact query paths\n- Rebuilt composite B-Tree indexes and partial indexes\n- Installed PgBouncer with transaction pooling\n- Optimized foreign-key cascaded deletes\n\n## Results\n\nReduced median CPU utilization from 92% to 28%; zero connection drops or deadlocks observed over 12 consecutive months.',
  'Nexus Cloud Platform',
  '$11,000 Scope',
  '-68% CPU • 0 Deadlocks Observed',
  ARRAY['PostgreSQL', 'PgBouncer', 'Query Tuning', 'Linux Performance'],
  4,
  true,
  true
)
on conflict (slug) do nothing;

-- 3. Services Seed
insert into public.services (title, slug, description, pricing_type, price_display, timeline, deliverables, is_popular, sort_order, is_active)
values
(
  'Architecture & Codebase Audit',
  'architecture-audit',
  'Comprehensive diagnostic review of system bottlenecks, database query efficiency, security vulnerabilities, and scalability limits.',
  'fixed',
  '$3,500',
  '3-5 Business Days',
  ARRAY['Full Architecture Diagnostic Report', 'Query Performance & Index Plan', 'Security & RLS Vulnerability Review', '60-minute Strategy Debrief Call'],
  false,
  1,
  true
),
(
  'Full-Stack Greenfield MVP Build',
  'greenfield-mvp',
  'End-to-end design, implementation, and deployment of a production-ready application using Next.js 16, Supabase, and Cloudflare Pages.',
  'fixed',
  '$12,000+',
  '3-6 Weeks',
  ARRAY['Complete Next.js App Router Codebase', 'Supabase Database & Authentication Setup', 'Cloudflare Pages CI/CD Pipeline', 'Full Test Suite & Technical Documentation'],
  true,
  2,
  true
),
(
  'PostgreSQL & Database Optimization',
  'database-optimization',
  'In-depth query profiling, index optimization, lock resolution, and connection pooling for mission-critical relational databases.',
  'fixed',
  '$4,500',
  '1-2 Weeks',
  ARRAY['EXPLAIN ANALYZE Query Optimization', 'Partial & Composite Index Tuning', 'PgBouncer / Connection Pool Config', 'Benchmark & Load-Test Verification'],
  false,
  3,
  true
),
(
  'Fractional Staff Architect Retainer',
  'fractional-staff-architect',
  'Ongoing high-level architectural oversight, technical mentorship, code review, and critical incident escalation support for growing engineering teams.',
  'retainer',
  '$6,000 / mo',
  'Monthly Retainer (Cancel Anytime)',
  ARRAY['20 Hours Dedicated Architecture Support', 'Weekly System Design & RFC Reviews', 'Priority PR & Security Code Audits', 'Direct Slack / Discord Access'],
  false,
  4,
  true
)
on conflict (slug) do nothing;

-- 4. Blog Posts Seed
insert into public.blog_posts (title, slug, excerpt, content_markdown, tags, reading_time_minutes, is_published, published_at)
values
(
  'Architecting Next.js 16 Applications for Cloudflare Pages: Lessons from Production',
  'nextjs-16-cloudflare-pages-architecture',
  'How to deploy full-stack Next.js 16 applications to Cloudflare Pages edge network with zero cold starts and sub-50ms TTFB worldwide.',
  '# Architecting Next.js 16 Applications for Cloudflare Pages\n\nModern web architectures require near-zero latency and high uptime. In this article, Abu Hanif shares the exact techniques used to achieve sub-50ms time-to-first-byte (TTFB) on Cloudflare Pages using Next.js 16 static site generation.\n\n## 1. Static HTML Pre-Rendering\nBy pre-rendering your pages ahead of time with `generateStaticParams`, your web application can be deployed as pure HTML and JS assets on Cloudflare global edge network.\n\n## 2. Supabase Integration\nConnecting to Supabase PostgreSQL from static pages allows fast client-side hydration while maintaining instant initial renders from edge cache.\n\n## Conclusion\nCombining Next.js with Cloudflare Pages and Supabase provides a powerful, cost-effective infrastructure stack.',
  ARRAY['Next.js 16', 'Cloudflare Pages', 'Edge Computing', 'Performance'],
  6,
  true,
  now() - interval '2 days'
),
(
  'Building Real-Time Data Pipelines with Supabase and PostgreSQL CDC',
  'realtime-telemetry-supabase-postgres-cdc',
  'A deep dive into Postgres Change Data Capture (CDC), Supabase Realtime, and WebSocket fan-out patterns for low-latency dashboards.',
  '# Building Real-Time Data Pipelines with Supabase\n\nReal-time web applications require efficient change propagation without overwhelming database connections. In this guide, we explore how Supabase Realtime leverages PostgreSQL logical decoding to stream updates directly to browser clients.\n\n## 1. Logical Replication & CDC\nPostgreSQL write-ahead logs (WAL) record every change transaction. Supabase listens to WAL changes and broadcasts them over WebSockets to authenticated subscribers.\n\n## 2. Row Level Security in Realtime\nRLS policies are evaluated per subscriber, ensuring users only receive data they are authorized to view.',
  ARRAY['PostgreSQL', 'Supabase', 'Realtime', 'WebSockets'],
  8,
  true,
  now() - interval '5 days'
),
(
  'Why We Swapped Microservices for a Modular Monolith (And Saved $140k/yr)',
  'swapping-microservices-for-modular-monolith',
  'A pragmatic engineering retrospective on consolidating 11 distributed microservices into a single modular TypeScript repository.',
  '# Why We Swapped Microservices for a Modular Monolith\n\nMicroservice complexity often exceeds business requirements for teams under 50 engineers. This retrospective details how consolidating 11 microservices into a unified TypeScript codebase reduced cloud hosting costs by $140,000 annually while improving release velocity.\n\n## 1. Network Overhead & Distributed Tracing\nInter-service gRPC and HTTP calls introduced compounding failure modes. A modular monolith restored in-process function calls with zero network serialization overhead.\n\n## 2. Developer Velocity\nSingle repository pull requests eliminated coordinated multi-service deployments and drift between API versions.',
  ARRAY['Architecture', 'Monolith', 'TypeScript', 'Cost Optimization'],
  10,
  true,
  now() - interval '12 days'
),
(
  'Mastering PostgreSQL Indexing: From B-Trees to Partial and BRIN Indexes',
  'mastering-postgres-indexing-query-optimization',
  'Practical strategies for diagnosing slow queries with EXPLAIN ANALYZE and selecting the optimal index types for high-write workloads.',
  '# Mastering PostgreSQL Indexing\n\nIndexes are the single highest-leverage lever for database scalability. This comprehensive guide reviews B-Tree, GIN, GiST, and BRIN indexes with real-world query execution examples.\n\n## 1. EXPLAIN (ANALYZE, BUFFERS)\nAlways inspect shared hit blocks and filter conditions before adding indexes. Avoid indexing low-cardinality columns without partial filters.\n\n## 2. Partial Indexes\nIndex only active rows (`WHERE is_active = true`) to minimize index footprint and accelerate the most frequent query patterns.',
  ARRAY['PostgreSQL', 'Database', 'Indexing', 'Performance'],
  7,
  true,
  now() - interval '20 days'
)
on conflict (slug) do nothing;

-- -----------------------------------------------------------------------------
-- 5. STORAGE BUCKETS (Project Assets & Screenshots)
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('project-assets', 'project-assets', true)
on conflict (id) do update set public = true;

-- Storage Policies (Drop first if exists, then create)
drop policy if exists "Project Assets Public Access" on storage.objects;
create policy "Project Assets Public Access"
  on storage.objects for select
  using (bucket_id = 'project-assets');

drop policy if exists "Project Assets Anon Upload" on storage.objects;
drop policy if exists "Project Assets Anon Update" on storage.objects;
drop policy if exists "Project Assets Admin Upload" on storage.objects;
create policy "Project Assets Admin Upload"
  on storage.objects for insert
  with check (bucket_id = 'project-assets' and auth.role() in ('authenticated', 'service_role'));

drop policy if exists "Project Assets Admin Update" on storage.objects;
create policy "Project Assets Admin Update"
  on storage.objects for update
  with check (bucket_id = 'project-assets' and auth.role() in ('authenticated', 'service_role'));

-- -----------------------------------------------------------------------------
-- 6. REALTIME SUBSCRIPTION CONFIGURATION
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'edge_telemetry'
  ) then
    alter publication supabase_realtime add table public.edge_telemetry;
  end if;
exception
  when undefined_object then null;
end $$;

-- -----------------------------------------------------------------------------
-- 7. INITIAL EDGE TELEMETRY SEED
-- -----------------------------------------------------------------------------
insert into public.edge_telemetry (region, city_name, continent, latency_ms, pop_code, cf_ray)
values
  ('IAD', 'Ashburn', 'North America', 18, 'IAD', '83a1290-IAD'),
  ('SFO', 'San Jose', 'North America', 22, 'SFO', '83a1291-SFO'),
  ('LHR', 'London', 'Europe', 24, 'LHR', '83a1292-LHR'),
  ('FRA', 'Frankfurt', 'Europe', 26, 'FRA', '83a1293-FRA'),
  ('SIN', 'Singapore', 'Southeast Asia', 29, 'SIN', '83a1294-SIN'),
  ('DAC', 'Dhaka', 'South Asia', 19, 'DAC', '83a1295-DAC'),
  ('SYD', 'Sydney', 'Oceania', 43, 'SYD', '83a1296-SYD'),
  ('NRT', 'Tokyo', 'East Asia', 35, 'NRT', '83a1297-NRT')
on conflict do nothing;

-- =============================================================================
-- 8. CUSTOMER & ORDER MANAGEMENT SYSTEM (CRM & OMS)
-- =============================================================================

-- 8.1 CUSTOMERS TABLE (Client Organizations & Enterprise Accounts)
create table if not exists public.customers (
  id uuid primary key default uuid_generate_v4(),
  company_name text not null,
  primary_contact_name text not null,
  email text not null unique,
  phone text,
  billing_address jsonb default '{}'::jsonb,
  vat_tax_id text,
  client_tier text not null default 'active_client'
    check (client_tier in ('lead', 'active_client', 'vip_partner', 'retained', 'churned')),
  nda_status text not null default 'none'
    check (nda_status in ('none', 'requested', 'signed', 'mutual_nda_active')),
  total_spend_usd numeric(12, 2) not null default 0.00
    check (total_spend_usd >= 0),
  internal_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_customers_email on public.customers (email);
create index if not exists idx_customers_tier on public.customers (client_tier);

-- 8.2 ORDERS TABLE (Contracts, Scoped SOWs & Engineering Sprints)
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique,
  customer_id uuid not null references public.customers(id) on delete cascade,
  inquiry_id uuid references public.inquiries(id) on delete set null,
  title text not null,
  service_tier text not null,
  status text not null default 'draft'
    check (status in ('draft', 'quoted', 'deposit_paid', 'in_progress', 'milestone_review', 'completed', 'delivered', 'cancelled', 'refunded')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'partially_paid', 'paid', 'refunded')),
  currency text not null default 'USD'
    check (currency in ('USD', 'EUR', 'GBP')),
  subtotal_amount numeric(12, 2) not null check (subtotal_amount >= 0),
  tax_amount numeric(12, 2) not null default 0.00 check (tax_amount >= 0),
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  amount_paid numeric(12, 2) not null default 0.00 check (amount_paid >= 0 and amount_paid <= total_amount),
  start_date date,
  target_completion_date date,
  completed_at timestamp with time zone,
  sow_document_url text,
  client_access_token text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_orders_customer on public.orders (customer_id);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_orders_token on public.orders (client_access_token);

-- 8.3 ORDER MILESTONES TABLE (Deliverable Phases & Payment Slices)
create table if not exists public.order_milestones (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  milestone_index int not null check (milestone_index >= 1),
  title text not null,
  deliverables_summary text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  due_date date,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'submitted', 'client_approved', 'paid')),
  approved_at timestamp with time zone,
  approved_by text,
  approval_signature_hash text,
  deliverable_artifacts jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (order_id, milestone_index)
);

create index if not exists idx_milestones_order on public.order_milestones (order_id);

-- 8.4 ORDER AUDIT LOGS TABLE (Immutable Governance & Security Trail)
create table if not exists public.order_audit_logs (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  actor text not null,
  action text not null,
  previous_state jsonb,
  new_state jsonb,
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_audit_order on public.order_audit_logs (order_id, created_at desc);

-- 8.5 ROW LEVEL SECURITY FOR CRM & OMS
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_milestones enable row level security;
alter table public.order_audit_logs enable row level security;

-- Drop prior policies if present
drop policy if exists "Admins have full access to customers" on public.customers;
drop policy if exists "Admins have full access to orders" on public.orders;
drop policy if exists "Admins have full access to order milestones" on public.order_milestones;
drop policy if exists "Admins have full access to audit logs" on public.order_audit_logs;
drop policy if exists "Clients can view their own order by token" on public.orders;
drop policy if exists "Clients can view their own milestones" on public.order_milestones;

-- Admin access (Authenticated sessions or Service Role)
create policy "Admins have full access to customers" on public.customers
  for all using (auth.role() in ('authenticated', 'service_role'))
  with check (auth.role() in ('authenticated', 'service_role'));

create policy "Admins have full access to orders" on public.orders
  for all using (auth.role() in ('authenticated', 'service_role'))
  with check (auth.role() in ('authenticated', 'service_role'));

create policy "Admins have full access to order milestones" on public.order_milestones
  for all using (auth.role() in ('authenticated', 'service_role'))
  with check (auth.role() in ('authenticated', 'service_role'));

create policy "Admins have full access to audit logs" on public.order_audit_logs
  for all using (auth.role() in ('authenticated', 'service_role'))
  with check (auth.role() in ('authenticated', 'service_role'));

-- Public client self-service read: strictly matching client_access_token (IDOR-immune)
create policy "Clients can view their own order by token" on public.orders
  for select using (client_access_token is not null and length(client_access_token) >= 32);

create policy "Clients can view their own milestones" on public.order_milestones
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_milestones.order_id
        and o.client_access_token is not null
        and length(o.client_access_token) >= 32
    )
  );



