import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const secretMap = (() => {
  try { return JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}'); } catch { return {}; }
})();
const publicMap = (() => {
  try { return JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') || '{}'); } catch { return {}; }
})();
const SUPABASE_SECRET = secretMap.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SECRET_KEY') || '';
const SUPABASE_PUBLIC = publicMap.default || Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_PUBLISHABLE_KEY') || '';

// SHA-256 hashes for the current six-digit PINs plus the legacy four-digit
// PINs that existed before the authentication migration. Raw PINs never ship
// to the browser and are never written to logs.
const PIN_HASHES: Record<string, string[]> = {
  admin: [
    'c8df28b3943286680cb05b318ffd17aa0a0e963f091fd007a6ad421485b71799',
    'c44066cadb3f91efc94e8a80b0ed370d9e9775d66fad1dac4e546bf9f1916df9',
  ],
  manager: [
    '122c518b75781d2060f6cb7c1c4d479d7f1a223bb73b0173a086ecc4b608bbbc',
    '6334610e2b0395f327c5e8538743545ad16c8daf5b9b144503f7722e4a154f10',
  ],
  chef: [
    '995b09d7f38bd02645384751e20d2c5649bd4936d3436268c0209d2b393ff390',
    'b3282a2f2a28757b3a18ab833de16a9c54518c0b0cf493e3f0a7cf09386f326a',
  ],
  d_admin: [
    '83fb0408faee5d4b0644660c1b1902143f517cc6303e08fa184182ddead70d73',
  ],
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

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(digest));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  if (!SUPABASE_URL || !SUPABASE_SECRET || !SUPABASE_PUBLIC) {
    console.error('staff-login stage=config missing Supabase runtime configuration');
    return json({ error: 'Authentication service configuration error.' }, 500);
  }

  let body: { role?: string; pin?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const role = String(body.role || '').trim();
  const pin = String(body.pin || '').trim();
  const hashes = PIN_HASHES[role];

  if (!hashes || !/^\d{4,8}$/.test(pin)) {
    return json({ error: 'Invalid credentials.' }, 401);
  }

  const suppliedHash = await sha256(pin);
  if (!hashes.includes(suppliedHash)) {
    return json({ error: 'Invalid credentials.' }, 401);
  }

  const dbRole = DB_ROLES[role];
  const adminClient = createClient(SUPABASE_URL, SUPABASE_SECRET, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
  const publicClient = createClient(SUPABASE_URL, SUPABASE_PUBLIC, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });

  // Step 1: verify the staff account exists and is active.
  const { data: account, error: lookupError } = await adminClient
    .from('bmb_admin_users')
    .select('user_id,email,role_id,active')
    .eq('role_id', dbRole)
    .eq('active', true)
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    console.error('staff-login stage=lookup', JSON.stringify({ code: lookupError.code, message: lookupError.message }));
    return json({ error: 'Authentication database lookup failed.' }, 500);
  }

  if (!account?.user_id || account.role_id !== dbRole || !account.active) {
    console.error('staff-login stage=account-not-configured', JSON.stringify({ role, dbRole }));
    return json({ error: 'Staff account is not configured.' }, 403);
  }

  // Step 2: synchronize the known staff PIN into the Supabase Auth password.
  // This is server-only and uses the Supabase admin SDK rather than hand-built
  // REST headers, avoiding JWT-vs-secret-key header incompatibilities.
  const { error: updateError } = await adminClient.auth.admin.updateUserById(
    account.user_id,
    { password: pin, email_confirm: true },
  );

  if (updateError) {
    console.error('staff-login stage=update-password', JSON.stringify({ status: updateError.status, code: updateError.code, message: updateError.message }));
    return json({ error: 'Authentication password update failed.' }, 500);
  }

  // Step 3: create the real Supabase Auth session using the publishable key.
  const { data: sessionData, error: signInError } = await publicClient.auth.signInWithPassword({
    email: account.email || AUTH_EMAILS[role],
    password: pin,
  });

  if (signInError || !sessionData.session) {
    console.error('staff-login stage=token', JSON.stringify({ status: signInError?.status, code: signInError?.code, message: signInError?.message }));
    return json({ error: 'Authentication token creation failed.' }, 500);
  }

  console.log('staff-login stage=success', JSON.stringify({ role, user_id: account.user_id }));
  return json({
    access_token: sessionData.session.access_token,
    refresh_token: sessionData.session.refresh_token,
    expires_in: sessionData.session.expires_in,
    user_id: account.user_id,
    role,
  });
});
