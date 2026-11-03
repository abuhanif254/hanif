import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedAdminClient: SupabaseClient | null = null;

/**
 * Returns a privileged Supabase client for server-side API routes and Server Actions.
 * Uses SUPABASE_SERVICE_ROLE_KEY when available to bypass Row-Level Security (RLS)
 * for authenticated admin CRM operations and privileged background mutations.
 * Falls back safely to anon key or null in local development / offline test suites.
 */
export function getServiceSupabase(): SupabaseClient | null {
  if (cachedAdminClient) {
    return cachedAdminClient;
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://sldegnxjsfglurwdrtrx.supabase.co";

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZGVnbnhqc2ZnbHVyd2RydHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NDk3OTYsImV4cCI6MjEwNzUyNTc5Nn0.y3bsuZcIShryfjLG1vCjc2j6V7sbPmOKCLzT0OH08uo";

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  try {
    cachedAdminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    return cachedAdminClient;
  } catch (err) {
    console.error("Failed to initialize privileged Supabase client:", err);
    return null;
  }
}
