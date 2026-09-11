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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  if (!SUPABASE_URL || !SUPABASE_SECRET || !SUPABASE_PUBLIC) {
    console.error('staff-login stage=config');
    return json({ error: 'Authentication service configuration error.' }, 500);
  }

  let body: { role?: string; username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const role = String(body.role || '').trim().toLowerCase();
  const username = String(body.username || '').trim().toLowerCase();
  const password = String(body.password || '');
  const dbRole = DB_ROLES[role];

  if (!dbRole || !/^[a-z0-9._-]{2,64}$/.test(username) || password.length < 8 || password.length > 128) {
    return json({ error: 'Enter your valid staff username and password.' }, 401);
  }

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SECRET, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
  const publicClient = createClient(SUPABASE_URL, SUPABASE_PUBLIC, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });

  // The application database remains the authority for staff identity, active status,
  // and role. Supabase Auth is used only for the password/session itself.
  const { data: account, error: lookupError } = await adminClient
    .from('bmb_admin_users')
    .select('user_id,username,role_id,active')
    .eq('username', username)
    .eq('role_id', dbRole)
    .eq('active', true)
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    console.error('staff-login stage=lookup', JSON.stringify({ code: lookupError.code }));
    return json({ error: 'Authentication database lookup failed.' }, 500);
  }

  if (!account?.user_id || account.username !== username || account.role_id !== dbRole || !account.active) {
    return json({ error: 'Staff account is not active for this panel.' }, 403);
  }

  // Existing Supabase Auth accounts use the stable company email convention based on
  // the database username (for example admin -> admin@bringmybite.com).
  const authEmail = `${username}@bringmybite.com`;
  const { data: sessionData, error: signInError } = await publicClient.auth.signInWithPassword({
    email: authEmail,
    password,
  });

  if (signInError || !sessionData.session) {
    console.error(
      'staff-login stage=credentials',
      JSON.stringify({ status: signInError?.status, code: signInError?.code }),
    );
    return json({ error: 'Invalid username or password.' }, 401);
  }

  const session = sessionData.session;
  console.log('staff-login stage=success', JSON.stringify({ role, user_id: account.user_id }));
  return json({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: session.expires_in,
    expires_at: session.expires_at,
    user_id: account.user_id,
    username: account.username,
    role,
  });
});
