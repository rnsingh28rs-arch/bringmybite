const STAFF_ACCESS = {
  '505555': { role: 'd_admin', pin: '505555' },
  '115566': { role: 'admin', pin: '115566' },
  '556611': { role: 'manager', pin: '556611' },
  '665511': { role: 'chef', pin: '665511' },
};

export function resolveStaffRoute(pathname, hash) {
  const path = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const pin = hash.replace(/^#/, '').trim();

  if (path === '/dadmin' || path === '/d-admin') {
    return STAFF_ACCESS[pin]?.role === 'd_admin' ? STAFF_ACCESS[pin] : null;
  }

  if (path === '/admin') {
    const access = STAFF_ACCESS[pin];
    return access && access.role !== 'd_admin' ? access : null;
  }

  return null;
}
