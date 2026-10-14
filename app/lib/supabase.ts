import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://sldegnxjsfglurwdrtrx.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZGVnbnhqc2ZnbHVyd2RydHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NDk3OTYsImV4cCI6MjEwNzUyNTc5Nn0.y3bsuZcIShryfjLG1vCjc2j6V7sbPmOKCLzT0OH08uo";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
