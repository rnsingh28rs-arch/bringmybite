export interface StaffSessionLike { access_token?: unknown; token?: unknown; }

export function getStaffAccessTokenFromSession(session: StaffSessionLike | null | undefined): string {
  if (typeof session?.access_token === 'string' && session.access_token.trim()) return session.access_token;
  if (typeof session?.token === 'string' && session.token.trim()) return session.token;
  return '';
}
