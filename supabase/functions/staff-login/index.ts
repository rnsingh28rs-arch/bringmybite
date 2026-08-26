import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SECRET =
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ||
  Deno.env.get('SUPABASE_SECRET_KEY') ||
  Deno.env.get('SUPABASE_SECRET') || '';
const SUPABASE_PUBLIC =
  Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ||
  Deno.env.get('SUPABASE_ANON_KEY') || '';

const DB_ROLES: Record<string, string> = {
  admin: 'admin',
  manager: 'manager',
  chef: 'chef',
  d_admin: 'ceo-director',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

const hex = (bytes: Uint8Array) =>
  Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');

const sha256 = async (value: string) =>
  hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))));

const deriveAuthPassword = async (role: string, pin: string) =>
  `BMB-${role}-${await sha256(`bringmybite-staff:${role}:${pin}`)}-auth!`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  if (!SUPABASE_URL || !SUPABASE_SECRET || !SUPABASE_PUBLIC) {
    console.error('staff-login stage=config');
    return json({ error: 'Authentication service configuration error.' }, 500);
  }

  let body: { role?: string; pin?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const role = String(body.role || '').trim().toLowerCase();
  const pin = String(body.pin || '').trim();
  const dbRole = DB_ROLES[role];

  if (!dbRole || !/^\d{6}$/.test(pin)) {
    return json({ error: 'Enter the configured 6-digit staff PIN.' }, 401);
  }

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SECRET, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
  const publicClient = createClient(SUPABASE_URL, SUPABASE_PUBLIC, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });

  const { data: account, error: lookupError } = await adminClient
    .from('bmb_admin_users')
    .select('user_id,email,role_id,active,pin_hash')
    .eq('role_id', dbRole)
    .eq('active', true)
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    console.error('staff-login stage=lookup', JSON.stringify({ code: lookupError.code }));
    return json({ error: 'Authentication database lookup failed.' }, 500);
  }

  if (!account?.user_id || !account.email || account.role_id !== dbRole || !account.active) {
    return json({ error: 'Staff account is not configured.' }, 403);
  }

  if (!account.pin_hash) {
    console.error('staff-login stage=pin-not-configured', JSON.stringify({ role }));
    return json({ error: 'Staff PIN is not configured for this panel.' }, 503);
  }

  const suppliedHash = await sha256(pin);
  if (suppliedHash !== account.pin_hash) {
    return json({ error: 'Invalid credentials.' }, 401);
  }

  const authPassword = await deriveAuthPassword(role, pin);
  const { error: updateError } = await adminClient.auth.admin.updateUserById(
    account.user_id,
    { password: authPassword, email_confirm: true },
  );

  if (updateError) {
    console.error(
      'staff-login stage=update-password',
      JSON.stringify({ status: updateError.status, code: updateError.code }),
    );
    return json({ error: 'Authentication password synchronization failed.' }, 500);
  }

  const { data: sessionData, error: signInError } = await publicClient.auth.signInWithPassword({
    email: account.email,
    password: authPassword,
  });

  if (signInError || !sessionData.session) {
    console.error(
      'staff-login stage=token',
      JSON.stringify({ status: signInError?.status, code: signInError?.code }),
    );
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
