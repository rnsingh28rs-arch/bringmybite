export type StaffRole = 'd_admin' | 'admin' | 'manager' | 'chef';
export function resolveStaffRoute(pathname: string, hash: string): { role: StaffRole; pin: string } | null;
