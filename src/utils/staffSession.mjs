export function getStaffAccessTokenFromSession(session) {
  if (typeof session?.access_token === 'string' && session.access_token.trim()) return session.access_token;
  return '';
}

export function getStaffDatabaseRole(role) {
  return ({ admin: 'admin', d_admin: 'ceo-director', manager: 'manager', chef: 'chef' })[role] || '';
}

export function isStaffSessionShapeValid(session, expectedRole, now = Date.now()) {
  return Boolean(
    session &&
    session.role === expectedRole &&
    typeof session.access_token === 'string' && session.access_token.length > 20 &&
    typeof session.refresh_token === 'string' && session.refresh_token.length > 20 &&
    Number.isFinite(Number(session.expires_at)) && Number(session.expires_at) > now
  );
}
