import { createClient } from '@supabase/supabase-js';

export interface SupabaseRestConfig { url:string; anonKey:string; }
const config:SupabaseRestConfig={
  url:(import.meta.env.VITE_SUPABASE_URL||import.meta.env.NEXT_PUBLIC_SUPABASE_URL||'https://tknmdgeikmlsprqppukf.supabase.co').replace(/\/$/,''),
  anonKey:import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||import.meta.env.VITE_SUPABASE_ANON_KEY||import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||''
};
export const isSupabaseConfigured=Boolean(config.url&&config.anonKey);
const client=createClient(config.url,config.anonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});

export interface AuthUser { id:string; email?:string; access_token:string; refresh_token?:string; }

export async function signIn(email:string,password:string):Promise<AuthUser>{
  const {data,error}=await client.auth.signInWithPassword({email,password});
  if(error||!data.session||!data.user) throw new Error(error?.message||'Login failed.');
  return {id:data.user.id,email:data.user.email,access_token:data.session.access_token,refresh_token:data.session.refresh_token};
}

export async function signInWithStaffPin(role:'admin'|'manager'|'chef'|'d_admin',pin:string):Promise<AuthUser & {role:string}>{
  if(!isSupabaseConfigured) throw new Error('Supabase authentication is not configured.');
  const response=await fetch(`${config.url}/functions/v1/staff-login`,{
    method:'POST',headers:{apikey:config.anonKey,'Content-Type':'application/json'},body:JSON.stringify({role,pin:pin.trim()})
  });
  const data=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(data?.error||`Authentication failed (${response.status}).`);
  if(!data.access_token||!data.refresh_token||!data.user_id||!data.role) throw new Error('Authentication returned an incomplete session.');
  const {error}=await client.auth.setSession({access_token:data.access_token,refresh_token:data.refresh_token});
  if(error) throw new Error(`Unable to establish session: ${error.message}`);
  return {id:data.user_id,access_token:data.access_token,refresh_token:data.refresh_token,role:data.role};
}

export async function restoreSession(){const {data}=await client.auth.getSession();return Boolean(data.session);}
export async function getCurrentUser():Promise<AuthUser|null>{const {data}=await client.auth.getSession();const s=data.session;if(!s?.user)return null;return{id:s.user.id,email:s.user.email,access_token:s.access_token,refresh_token:s.refresh_token};}
export async function signOut(){await client.auth.signOut();}

async function authHeaders(){const {data}=await client.auth.getSession();return{apikey:config.anonKey,Authorization:`Bearer ${data.session?.access_token||config.anonKey}`,'Content-Type':'application/json'};}
export async function supabaseSelect<T>(table:string,query=''):Promise<T[]>{const response=await fetch(`${config.url}/rest/v1/${table}${query?`?${query}`:''}`,{headers:await authHeaders(),cache:'no-store'});if(!response.ok)throw new Error(`Supabase ${table} GET failed (${response.status})`);return response.json();}
export async function supabaseInsert<T>(table:string,body:T|T[]):Promise<void>{const response=await fetch(`${config.url}/rest/v1/${table}`,{method:'POST',headers:{...(await authHeaders()),Prefer:'return=minimal'},body:JSON.stringify(body)});if(!response.ok)throw new Error(await response.text());}
export async function supabaseRpc<T>(fn:string,args:Record<string,unknown>={}):Promise<T[]>{const response=await fetch(`${config.url}/rest/v1/rpc/${fn}`,{method:'POST',headers:await authHeaders(),body:JSON.stringify(args),cache:'no-store'});if(!response.ok)throw new Error(`Supabase RPC ${fn} failed (${response.status})`);const data=await response.json();return Array.isArray(data)?data:[data];}
export async function supabaseUpsert<T>(table:string,body:T|T[]):Promise<T[]>{const response=await fetch(`${config.url}/rest/v1/${table}`,{method:'POST',headers:{...(await authHeaders()),Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(body)});if(!response.ok)throw new Error(await response.text());return response.json();}
export async function supabasePatch<T>(table:string,query:string,body:Partial<T>):Promise<T[]>{const response=await fetch(`${config.url}/rest/v1/${table}?${query}`,{method:'PATCH',headers:await authHeaders(),body:JSON.stringify(body)});if(!response.ok)throw new Error(await response.text());return response.json();}
export async function supabaseDelete(table:string,query:string):Promise<void>{const response=await fetch(`${config.url}/rest/v1/${table}?${query}`,{method:'DELETE',headers:await authHeaders()});if(!response.ok)throw new Error(await response.text());}
