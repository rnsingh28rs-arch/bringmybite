const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const secretMap = (() => { try { return JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}'); } catch { return {}; } })();
const publicMap = (() => { try { return JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') || '{}'); } catch { return {}; } })();
const SUPABASE_SECRET = secretMap.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SECRET_KEY') || '';
const SUPABASE_PUBLIC = publicMap.default || Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_PUBLISHABLE_KEY') || '';

const PIN_HASHES: Record<string, string> = {
  admin: 'c8df28b3943286680cb05b318ffd17aa0a0e963f091fd007a6ad421485b71799',
  manager: '122c518b75781d2060f6cb7c1c4d479d7f1a223bb73b0173a086ecc4b608bbbc',
  chef: '995b09d7f38bd02645384751e20d2c5649bd4936d3436268c0209d2b393ff390',
  d_admin: '83fb0408faee5d4b0644660c1b1902143f517cc6303e08fa184182ddead70d73',
};

const AUTH_EMAILS: Record<string, string> = {
  admin: 'admin@bringmybite.com',
  manager: 'manager@bringmybite.com',
  chef: 'chef@bringmybite.com',
  d_admin: 'dadmin@bringmybite.com',
};

const DB_ROLES: Record<string, string> = {
  admin: 'admin',
  manager: 'manager',
  chef: 'chef',
  d_admin: 'ceo-director',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}
function bytesToHex(bytes: Uint8Array) { return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(''); }
async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(digest));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!SUPABASE_URL || !SUPABASE_SECRET || !SUPABASE_PUBLIC) {
    console.error('staff-login stage=config missing required Supabase runtime configuration');
    return json({ error: 'Authentication service error.' }, 500);
  }

  let body: { role?: string; pin?: string };
  try { body = await req.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
  const role = String(body.role || '').trim();
  const pin = String(body.pin || '').trim();
  if (!Object.prototype.hasOwnProperty.call(PIN_HASHES, role) || !/^\d{6}$/.test(pin)) return json({ error: 'Invalid credentials.' }, 401);
  if (await sha256(pin) !== PIN_HASHES[role]) return json({ error: 'Invalid credentials.' }, 401);

  const dbRole = DB_ROLES[role];
  const lookup = await fetch(`${SUPABASE_URL}/rest/v1/bmb_admin_users?select=user_id,email,role_id,active&role_id=eq.${encodeURIComponent(dbRole)}&active=eq.true&limit=1`, {
    headers: { apikey: SUPABASE_SECRET },
  });
  if (!lookup.ok) {
    console.error('staff-login stage=lookup status=', lookup.status);
    return json({ error: 'Authentication service error.' }, 500);
  }
  const accounts = await lookup.json();
  const account = Array.isArray(accounts) ? accounts[0] : null;
  if (!account?.user_id || account.role_id !== dbRole || !account.active) return json({ error: 'Staff account is not configured.' }, 403);

  const update = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${account.user_id}`, {
    method: 'PUT',
    headers: { apikey: SUPABASE_SECRET, 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: pin, email_confirm: true }),
  });
  if (!update.ok) {
    console.error('staff-login stage=update-password status=', update.status);
    return json({ error: 'Authentication service error.' }, 500);
  }

  const token = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: SUPABASE_PUBLIC, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: AUTH_EMAILS[role], password: pin }),
  });
  if (!token.ok) {
    console.error('staff-login stage=token status=', token.status);
    return json({ error: 'Authentication service error.' }, 500);
  }
  const session = await token.json();
  return json({ access_token: session.access_token, refresh_token: session.refresh_token, expires_in: session.expires_in, user_id: account.user_id, role });
});
