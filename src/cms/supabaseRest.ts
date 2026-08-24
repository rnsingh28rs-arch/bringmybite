export interface SupabaseRestConfig { url: string; anonKey: string; }
const config: SupabaseRestConfig = {
  url: (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, ''),
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
};
export const isSupabaseConfigured = Boolean(config.url && config.anonKey);
let accessToken = '';

export interface AuthUser { id: string; email?: string; access_token: string; refresh_token?: string; }

const baseHeaders = () => ({ apikey: config.anonKey, Authorization: `Bearer ${accessToken || config.anonKey}`, 'Content-Type': 'application/json' });
const headers = () => ({ ...baseHeaders(), Prefer: 'return=representation' });

export async function signIn(email: string, password: string): Promise<AuthUser> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
  const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: config.anonKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  if (!response.ok) throw new Error('Login failed. Check the email/password and make sure the user exists in Supabase Auth.');
  const data = await response.json();
  accessToken = data.access_token || '';
  localStorage.setItem('bmb_supabase_access_token', accessToken);
  return { id: data.user?.id, email: data.user?.email, access_token: accessToken, refresh_token: data.refresh_token };
}

export function restoreSession() { accessToken = localStorage.getItem('bmb_supabase_access_token') || ''; return Boolean(accessToken); }
export function signOut() { accessToken = ''; localStorage.removeItem('bmb_supabase_access_token'); }

export async function supabaseSelect<T>(table: string, query = ''): Promise<T[]> {
  if (!isSupabaseConfigured) return [];
  const response = await fetch(`${config.url}/rest/v1/${table}${query ? `?${query}` : ''}`, { headers: headers(), cache: 'no-store' });
  if (!response.ok) throw new Error(`Supabase ${table} GET failed (${response.status})`);
  return response.json();
}
export async function supabaseUpsert<T>(table: string, body: T | T[]): Promise<T[]> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.');
  const response = await fetch(`${config.url}/rest/v1/${table}`, { method: 'POST', headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}
export async function supabasePatch<T>(table: string, query: string, body: Partial<T>): Promise<T[]> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
  const response = await fetch(`${config.url}/rest/v1/${table}?${query}`, { method: 'PATCH', headers: headers(), body: JSON.stringify(body) });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}
export async function supabaseDelete(table: string, query: string): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
  const response = await fetch(`${config.url}/rest/v1/${table}?${query}`, { method: 'DELETE', headers: headers() });
  if (!response.ok) throw new Error(await response.text());
}
