const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

function requireEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`${name} is missing. Check your .env.local file.`);
  }

  return value;
}

export function getSupabaseUrl() {
  return requireEnv("NEXT_PUBLIC_SUPABASE_URL", env.supabaseUrl);
}

export function getSupabaseAnonKey() {
  return requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", env.supabaseAnonKey);
}

export function getSupabasePublishableKey() {
  return env.supabasePublishableKey;
}

export function getSupabaseServiceRoleKey() {
  return requireEnv("SUPABASE_SERVICE_ROLE_KEY", env.supabaseServiceRoleKey);
}
