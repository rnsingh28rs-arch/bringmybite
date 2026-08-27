export interface SupabaseRestConfig { url:string; anonKey:string; }
const config:SupabaseRestConfig={
  url:(import.meta.env.VITE_SUPABASE_URL||import.meta.env.NEXT_PUBLIC_SUPABASE_URL||'https://tknmdgeikmlsprqppukf.supabase.co').replace(/\/$/,''),
  anonKey:import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||import.meta.env.VITE_SUPABASE_ANON_KEY||import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'sb_publishable_8aupeYk6D1q4c0T_EtzgtQ_rViMvNME'
};
export const isSupabaseConfigured=Boolean(config.url&&config.anonKey);
const jsonHeaders=()=>({'Content-Type':'application/json',apikey:config.anonKey});
const authHeaders=()=>({...jsonHeaders(),Authorization:`Bearer ${config.anonKey}`});
async function readResponse(response:Response){const data=await response.json().catch(()=>null);if(!response.ok){const message=data&&typeof data==='object'&&typeof (data as any).message==='string'?(data as any).message:data&&typeof data==='object'&&typeof (data as any).error==='string'?(data as any).error:`Supabase request failed (${response.status})`;throw new Error(message);}return data;}
function toDatabasePayload(table:string,body:any):any{
  if(table!=='bmb_admin_users') return body;
  const normalize=(row:any)=>({user_id:row.user_id,username:row.username,email:row.email,role_id:row.role_id,active:row.active});
  return Array.isArray(body)?body.map(normalize):normalize(body);
}
export async function supabaseSelect<T>(table:string,query=''):Promise<T[]>{const response=await fetch(`${config.url}/rest/v1/${table}${query?`?${query}`:''}`,{headers:authHeaders(),cache:'no-store'});return await readResponse(response);}
export async function supabaseInsert<T>(table:string,body:T|T[]):Promise<T[]>{const response=await fetch(`${config.url}/rest/v1/${table}`,{method:'POST',headers:{...authHeaders(),Prefer:'return=representation'},body:JSON.stringify(toDatabasePayload(table,body))});const data=await readResponse(response);const rows=Array.isArray(data)?data:[data];if(!rows.length)throw new Error(`Supabase insert returned no rows for ${table}.`);return rows as T[];}
export async function supabaseRpc<T>(fn:string,args:Record<string,unknown>={}):Promise<T[]>{const response=await fetch(`${config.url}/rest/v1/rpc/${fn}`,{method:'POST',headers:authHeaders(),body:JSON.stringify(args),cache:'no-store'});const data=await readResponse(response);const rows=Array.isArray(data)?data:[data];if(!rows.length)throw new Error(`Supabase RPC ${fn} returned no rows.`);return rows as T[];}
export async function supabaseUpsert<T>(table:string,body:T|T[]):Promise<T[]>{
  if(table==='bmb_pricing'){
    const rows=Array.isArray(body)?body:[body];
    const saved:T[]=[];
    for(const row of rows){
      const value=Number((row as any).value);
      if(!Number.isInteger(value)) throw new Error(`Pricing value for ${(row as any).key} must be a whole number.`);
      const key=encodeURIComponent(String((row as any).key));
      const response=await fetch(`${config.url}/rest/v1/bmb_pricing?key=eq.${key}`,{method:'PATCH',headers:{...authHeaders(),Prefer:'return=representation'},body:JSON.stringify({value})});
      const data=await readResponse(response); const result=Array.isArray(data)?data:[data];
      if(!result.length) throw new Error(`Pricing row ${(row as any).key} was not found or could not be updated.`);
      saved.push(...result as T[]);
    }
    return saved;
  }
  const response=await fetch(`${config.url}/rest/v1/${table}`,{method:'POST',headers:{...authHeaders(),Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(toDatabasePayload(table,body))});const data=await readResponse(response);const rows=Array.isArray(data)?data:[data];if(!rows.length)throw new Error(`Supabase upsert returned no rows for ${table}.`);return rows as T[];
}
export async function supabasePatch<T>(table:string,query:string,body:Partial<T>):Promise<T[]>{const response=await fetch(`${config.url}/rest/v1/${table}?${query}`,{method:'PATCH',headers:{...authHeaders(),Prefer:'return=representation'},body:JSON.stringify(body)});const data=await readResponse(response);const rows=Array.isArray(data)?data:[data];if(!rows.length)throw new Error(`Supabase update matched no rows in ${table}.`);return rows as T[];}
export async function supabaseDelete(table:string,query:string):Promise<void>{const response=await fetch(`${config.url}/rest/v1/${table}?${query}`,{method:'DELETE',headers:{...authHeaders(),Prefer:'return=representation'}});const data=await readResponse(response);const rows=Array.isArray(data)?data:[data];if(!rows.length)throw new Error(`Supabase delete matched no rows in ${table}.`);}
