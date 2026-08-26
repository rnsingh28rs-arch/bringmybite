export interface SupabaseRestConfig { url:string; anonKey:string; }
const config:SupabaseRestConfig={
  url:(import.meta.env.VITE_SUPABASE_URL||import.meta.env.NEXT_PUBLIC_SUPABASE_URL||'https://tknmdgeikmlsprqppukf.supabase.co').replace(/\/$/,''),
  anonKey:import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||import.meta.env.VITE_SUPABASE_ANON_KEY||import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'sb_publishable_8aupeYk6D1q4c0T_EtzgtQ_rViMvNME'
};
export const isSupabaseConfigured=Boolean(config.url&&config.anonKey);
let accessToken='';
let refreshToken='';

export interface AuthUser { id:string; email?:string; access_token:string; refresh_token?:string; }
const jsonHeaders=()=>({'Content-Type':'application/json',apikey:config.anonKey});
const authHeaders=()=>({...jsonHeaders(),Authorization:`Bearer ${accessToken||config.anonKey}`});

/**
 * Staff authentication has a single supported entry point: the staff-login
 * Edge Function. The browser never authenticates staff directly with email
 * and password; the PIN remains the staff credential and the Edge Function
 * is responsible for the server-side Auth session exchange.
 */
export async function signInWithStaffPin(role:'admin'|'manager'|'chef'|'d_admin',pin:string):Promise<AuthUser & {role:string}>{
  if(!isSupabaseConfigured) throw new Error('Supabase authentication is not configured.');
  const cleanPin=pin.trim();
  if(!/^\d{6}$/.test(cleanPin)) throw new Error('Enter the configured 6-digit staff PIN.');
  const response=await fetch(`${config.url}/functions/v1/staff-login`,{method:'POST',headers:jsonHeaders(),body:JSON.stringify({role,pin:cleanPin})});
  const data=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(data?.error||'Authentication failed.');
  if(!data.access_token||!data.refresh_token||!data.user_id||!data.role) throw new Error('Authentication returned an incomplete session.');
  accessToken=data.access_token; refreshToken=data.refresh_token;
  localStorage.setItem('bmb_supabase_access_token',accessToken); localStorage.setItem('bmb_supabase_refresh_token',refreshToken);
  return{id:data.user_id,access_token:data.access_token,refresh_token:data.refresh_token,role:data.role};
}

export function restoreSession(){accessToken=localStorage.getItem('bmb_supabase_access_token')||'';refreshToken=localStorage.getItem('bmb_supabase_refresh_token')||'';return Boolean(accessToken||refreshToken);}
export async function getCurrentUser():Promise<AuthUser|null>{if(!isSupabaseConfigured)return null;restoreSession();if(!accessToken)return null;const response=await fetch(`${config.url}/auth/v1/user`,{headers:authHeaders(),cache:'no-store'});if(!response.ok)return null;const user=await response.json();return{id:user.id,email:user.email,access_token:accessToken,refresh_token:refreshToken};}
export function signOut(){accessToken='';refreshToken='';localStorage.removeItem('bmb_supabase_access_token');localStorage.removeItem('bmb_supabase_refresh_token');}

export async function supabaseSelect<T>(table:string,query=''):Promise<T[]>{const response=await fetch(`${config.url}/rest/v1/${table}${query?`?${query}`:''}`,{headers:authHeaders(),cache:'no-store'});if(!response.ok)throw new Error(`Supabase ${table} GET failed (${response.status})`);return response.json();}
export async function supabaseInsert<T>(table:string,body:T|T[]):Promise<void>{const response=await fetch(`${config.url}/rest/v1/${table}`,{method:'POST',headers:{...authHeaders(),Prefer:'return=minimal'},body:JSON.stringify(body)});if(!response.ok)throw new Error(await response.text());}
export async function supabaseRpc<T>(fn:string,args:Record<string,unknown>={}):Promise<T[]>{const response=await fetch(`${config.url}/rest/v1/rpc/${fn}`,{method:'POST',headers:authHeaders(),body:JSON.stringify(args),cache:'no-store'});if(!response.ok)throw new Error(`Supabase RPC ${fn} failed (${response.status})`);const data=await response.json();return Array.isArray(data)?data:[data];}
export async function supabaseUpsert<T>(table:string,body:T|T[]):Promise<T[]>{const response=await fetch(`${config.url}/rest/v1/${table}`,{method:'POST',headers:{...authHeaders(),Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(body)});if(!response.ok)throw new Error(await response.text());return response.json();}
export async function supabasePatch<T>(table:string,query:string,body:Partial<T>):Promise<T[]>{const response=await fetch(`${config.url}/rest/v1/${table}?${query}`,{method:'PATCH',headers:authHeaders(),body:JSON.stringify(body)});if(!response.ok)throw new Error(await response.text());return response.json();}
export async function supabaseDelete(table:string,query:string):Promise<void>{const response=await fetch(`${config.url}/rest/v1/${table}?${query}`,{method:'DELETE',headers:authHeaders()});if(!response.ok)throw new Error(await response.text());}
