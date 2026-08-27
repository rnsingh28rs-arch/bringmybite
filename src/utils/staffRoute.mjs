const STAFF_ROUTES = {
  '/dadmin': 'd_admin',
  '/d-admin': 'd_admin',
  '/admin': 'admin',
  '/manager': 'manager',
  '/chef': 'chef',
};

export function resolveStaffRoute(pathname) {
  const path = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const role = STAFF_ROUTES[path];
  return role ? { role } : null;
}
