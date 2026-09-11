export const CUSTOMER_MOBILE_TABS = Object.freeze(['home', 'menu', 'instant', 'profile']);
export const PANEL_ROLES = Object.freeze(['admin', 'manager', 'chef', 'd_admin']);

export function resolvePanelRole(pathname) {
  const path = String(pathname || '').toLowerCase().replace(/\/+$/, '') || '/';
  const match = path.match(/^\/panel-app\/(admin|manager|chef|d-admin)$/);
  if (!match) return null;
  return match[1] === 'd-admin' ? 'd_admin' : match[1];
}
