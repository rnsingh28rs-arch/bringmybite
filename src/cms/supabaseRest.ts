export interface SupabaseRestConfig { url: string; anonKey: string; }

// Vercel is currently configured with NEXT_PUBLIC_SUPABASE_* variables.
// Keep VITE_* as a fallback for local Vite deployments.
const config: SupabaseRestConfig = {
  url: (import.meta.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, ''),
  anonKey: import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || ''
};
export const isSupabaseConfigured = Boolean(config.url && config.anonKey);
let accessToken = '';
let refreshToken = '';

export interface AuthUser { id: string; email?: string; access_token: string; refresh_token?: string; }
const baseHeaders = () => ({ apikey: config.anonKey, Authorization: `Bearer ${accessToken || config.anonKey}`, 'Content-Type': 'application/json' });
const headers = () => ({ ...baseHeaders(), Prefer: 'return=representation' });

export async function signIn(email: string, password: string): Promise<AuthUser> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
  const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: config.anonKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  if (!response.ok) throw new Error('Login failed. Check the email/password and make sure the user exists in Supabase Auth.');
  const data = await response.json();
  accessToken = data.access_token || '';
  refreshToken = data.refresh_token || '';
  localStorage.setItem('bmb_supabase_access_token', accessToken);
  localStorage.setItem('bmb_supabase_refresh_token', refreshToken);
  return { id: data.user?.id, email: data.user?.email, access_token: accessToken, refresh_token: data.refresh_token };
}

export async function signInWithStaffPin(role: 'admin' | 'manager' | 'chef', pin: string): Promise<AuthUser & { role: string }> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
  const response = await fetch(`${config.url}/functions/v1/staff-login`, {
    method: 'POST',
    headers: { apikey: config.anonKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, pin }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || 'Login failed.');
  accessToken = data.access_token || '';
  refreshToken = data.refresh_token || '';
  if (!accessToken || !refreshToken || !data.user_id) throw new Error('Login failed.');
  localStorage.setItem('bmb_supabase_access_token', accessToken);
  localStorage.setItem('bmb_supabase_refresh_token', refreshToken);
  return { id: data.user_id, access_token: accessToken, refresh_token: refreshToken, role: data.role };
}

export function restoreSession() {
  accessToken = localStorage.getItem('bmb_supabase_access_token') || '';
  refreshToken = localStorage.getItem('bmb_supabase_refresh_token') || '';
  return Boolean(accessToken || refreshToken);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured) return null;
  restoreSession();
  if (!accessToken && !refreshToken) return null;
  if (!accessToken && !(await refreshAccessToken())) return null;
  let response = await fetch(`${config.url}/auth/v1/user`, { headers: { apikey: config.anonKey, Authorization: `Bearer ${accessToken}` } });
  if (response.status === 401 && await refreshAccessToken()) {
    response = await fetch(`${config.url}/auth/v1/user`, { headers: { apikey: config.anonKey, Authorization: `Bearer ${accessToken}` } });
  }
  if (!response.ok) return null;
  const user = await response.json();
  return { id: user.id, email: user.email, access_token: accessToken, refresh_token: refreshToken };
}

export function signOut() {
  accessToken = ''; refreshToken = '';
  localStorage.removeItem('bmb_supabase_access_token');
  localStorage.removeItem('bmb_supabase_refresh_token');
}

async function refreshAccessToken(): Promise<boolean> {
  if (!isSupabaseConfigured || !refreshToken) return false;
  try {
    const response = await fetch(`${config.url}/auth/v1/token?grant_type=refresh_token`, { method: 'POST', headers: { apikey: config.anonKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: refreshToken }) });
    if (!response.ok) return false;
    const data = await response.json();
    accessToken = data.access_token || accessToken;
    refreshToken = data.refresh_token || refreshToken;
    localStorage.setItem('bmb_supabase_access_token', accessToken);
    localStorage.setItem('bmb_supabase_refresh_token', refreshToken);
    return Boolean(accessToken);
  } catch { return false; }
}

export async function supabaseSelect<T>(table: string, query = ''): Promise<T[]> {
  if (!isSupabaseConfigured) return [];
  let response = await fetch(`${config.url}/rest/v1/${table}${query ? `?${query}` : ''}`, { headers: headers(), cache: 'no-store' });
  if (response.status === 401 && await refreshAccessToken()) response = await fetch(`${config.url}/rest/v1/${table}${query ? `?${query}` : ''}`, { headers: headers(), cache: 'no-store' });
  if (!response.ok) throw new Error(`Supabase ${table} GET failed (${response.status})`);
  return response.json();
}

export async function supabaseInsert<T>(table: string, body: T | T[]): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
  let response = await fetch(`${config.url}/rest/v1/${table}`, { method: 'POST', headers: { ...baseHeaders(), Prefer: 'return=minimal' }, body: JSON.stringify(body) });
  if (response.status === 401 && await refreshAccessToken()) response = await fetch(`${config.url}/rest/v1/${table}`, { method: 'POST', headers: { ...baseHeaders(), Prefer: 'return=minimal' }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(await response.text());
}

export async function supabaseRpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<T[]> {
  if (!isSupabaseConfigured) return [];
  let response = await fetch(`${config.url}/rest/v1/rpc/${fn}`, { method: 'POST', headers: baseHeaders(), body: JSON.stringify(args), cache: 'no-store' });
  if (response.status === 401 && await refreshAccessToken()) response = await fetch(`${config.url}/rest/v1/rpc/${fn}`, { method: 'POST', headers: baseHeaders(), body: JSON.stringify(args), cache: 'no-store' });
  if (!response.ok) throw new Error(`Supabase RPC ${fn} failed (${response.status})`);
  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

export async function supabaseUpsert<T>(table: string, body: T | T[]): Promise<T[]> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Vercel.');
  let response = await fetch(`${config.url}/rest/v1/${table}`, { method: 'POST', headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify(body) });
  if (response.status === 401 && await refreshAccessToken()) response = await fetch(`${config.url}/rest/v1/${table}`, { method: 'POST', headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function supabasePatch<T>(table: string, query: string, body: Partial<T>): Promise<T[]> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
  let response = await fetch(`${config.url}/rest/v1/${table}?${query}`, { method: 'PATCH', headers: headers(), body: JSON.stringify(body) });
  if (response.status === 401 && await refreshAccessToken()) response = await fetch(`${config.url}/rest/v1/${table}?${query}`, { method: 'PATCH', headers: headers(), body: JSON.stringify(body) });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function supabaseDelete(table: string, query: string): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
  let response = await fetch(`${config.url}/rest/v1/${table}?${query}`, { method: 'DELETE', headers: headers() });
  if (response.status === 401 && await refreshAccessToken()) response = await fetch(`${config.url}/rest/v1/${table}?${query}`, { method: 'DELETE', headers: headers() });
  if (!response.ok) throw new Error(await response.text());
}
