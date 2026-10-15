export type StaffRole = 'd_admin' | 'admin' | 'manager' | 'chef';
export function resolveStaffRoute(pathname: string): { role: StaffRole } | null;
