import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

/**
 * Browser-side Supabase client for client components
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export function createBrowserClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
