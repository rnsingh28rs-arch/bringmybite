export interface StaffRoleConfig {
  role: 'admin' | 'manager' | 'chef';
  title: string;
  name: string;
  description: string;
  permissions: string[];
  badgeColor: string;
}

// Public UI metadata only. Authentication credentials are NEVER stored in the
// frontend bundle. Staff sign in through Supabase Auth and their role is read
// from public.bmb_admin_users after authentication.
export const STAFF_CREDENTIALS: Record<'admin' | 'manager' | 'chef', StaffRoleConfig> = {
  admin: {
    role: 'admin',
    title: 'Master Administrator',
    name: 'Executive Administrator',
    description: 'Executive governance, revenue analytics, user approvals, price management & audit',
    permissions: [
      'Gross Revenue & Financial Audit',
      'All Customer Subscription Verification',
      'Instant Order Audit & Overrides',
      'Manager & Chef Sub-panel Oversight',
      'Zip Source Export & Banking Controls'
    ],
    badgeColor: 'bg-red-700 text-white'
  },
  manager: {
    role: 'manager',
    title: 'Kitchen & Dispatch Operations Manager',
    name: 'Operations Manager',
    description: 'Menu schedule editor, raw material inventory stock, route dispatching & chef indent approvals',
    permissions: [
      'Daily 7-Day Menu Schedule Editor',
      'Raw Material Inventory & Stock Alerts',
      'Route Code Assignment (RT-01 to RT-06)',
      'Chef Indent Approval & Reorder Requests',
      'Gate Delivery Captain Dispatch'
    ],
    badgeColor: 'bg-blue-700 text-white'
  },
  chef: {
    role: 'chef',
    title: 'Head Kitchen Chef',
    name: 'Head Kitchen Chef',
    description: 'Live cooking alerts, daily batch counts, 5CP thali packaging line & ingredient indents',
    permissions: [
      'Live Batch Cooking Counts (Veg, Egg, Chicken)',
      'Production Schedule & Alerts',
      'Fast Ingredient Indent System',
      '5CP Hot Partition Packaging Check',
      'Instant Single Thali Preparation Queue'
    ],
    badgeColor: 'bg-amber-700 text-white'
  }
};
