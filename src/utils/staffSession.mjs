export function getStaffAccessTokenFromSession(session) {
  if (typeof session?.access_token === 'string' && session.access_token.trim()) return session.access_token;
  return '';
}
