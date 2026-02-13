import { createClient } from "@supabase/supabase-js";

// keys are fine to be shown publicly since they are only used on the client side and have limited permissions :)))
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);