import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const url = Deno.env.get('SUPABASE_URL') || '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SECRET_KEY') || '';
  const publicKey = Deno.env.get('SUPABASE_PUBLISHABLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';
  if (!url || !serviceKey || !publicKey) return json({ error: 'Password service is not configured.' }, 500);

  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token || token === authHeader) return json({ error: 'Sign in first.' }, 401);

  let body: { new_password?: string; target_username?: string; target_role?: string };
  try { body = await req.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
  const newPassword = String(body.new_password || '');
  const targetUsername = String(body.target_username || '').trim().toLowerCase();
  const targetRole = String(body.target_role || '').trim().toLowerCase();
  if (newPassword.length < 12 || newPassword.length > 128) {
    return json({ error: 'Use a password between 12 and 128 characters.' }, 400);
  }

  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData.user) return json({ error: 'Your session is invalid. Sign in again.' }, 401);

  const { data: actor, error: actorError } = await admin.from('bmb_admin_users')
    .select('user_id,username,role_id,active').eq('user_id', userData.user.id).eq('active', true).maybeSingle();
  if (actorError || !actor) return json({ error: 'No active staff account is linked to this login.' }, 403);
  if (!['admin', 'ceo-director'].includes(actor.role_id)) return json({ error: 'Only Admin or D-Admin can manage staff passwords.' }, 403);

  let targetId = actor.user_id;
  if (targetUsername || targetRole) {
    if (!['admin', 'ceo-director'].includes(actor.role_id)) return json({ error: 'Only Admin or D-Admin can change another staff member password.' }, 403);
    if (!/^[a-z0-9._-]{2,64}$/.test(targetUsername) || !['admin','ceo-director','manager','chef'].includes(targetRole)) {
      return json({ error: 'Choose a valid staff username and role.' }, 400);
    }
    const { data: target, error: targetError } = await admin.from('bmb_admin_users')
      .select('user_id,username,role_id,active').eq('username', targetUsername).eq('role_id', targetRole).eq('active', true).maybeSingle();
    if (targetError || !target) return json({ error: 'No active staff account matches that username and role.' }, 404);
    targetId = target.user_id;
  }

  const { error: revokeError } = await admin.rpc('bmb_revoke_staff_sessions_for_user', { p_user_id: targetId });
  if (revokeError) {
    console.error('staff-password-update session revocation failed', JSON.stringify({ code: (revokeError as any).code || 'unknown' }));
    return json({ error: 'Existing sessions could not be safely revoked, so the password was not changed.' }, 500);
  }

  const { error: updateError } = await admin.auth.admin.updateUserById(targetId, { password: newPassword });
  if (updateError) {
    console.error('staff-password-update failed', JSON.stringify({ code: (updateError as any).code || 'unknown' }));
    return json({ error: 'Supabase could not update this password.' }, 400);
  }
  return json({ success: true, message: 'Password updated in Supabase Auth.' });
});