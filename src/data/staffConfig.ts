export interface StaffRoleConfig {
  role: 'admin' | 'manager' | 'chef';
  title: string;
  name: string;
  email: string;
  defaultPasscode: string;
  pin: string;
  description: string;
  permissions: string[];
  badgeColor: string;
}

export const STAFF_CREDENTIALS: Record<'admin' | 'manager' | 'chef', StaffRoleConfig> = {
  admin: {
    role: 'admin',
    title: 'Master Administrator',
    name: 'Rahul Narendra Singh (Executive Director)',
    email: 'admin@bringmybite.com',
    defaultPasscode: 'Admin@BMB2026',
    pin: '9922',
    description: 'Executive governance, total revenue analytics, user approvals, price management & audit',
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
    name: 'Vikram Mehta (Operations Lead)',
    email: 'manager@bringmybite.com',
    defaultPasscode: 'Manager@BMB2026',
    pin: '5544',
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
    name: 'Chef Rajesh Sharma (Master Chef)',
    email: 'chef@bringmybite.com',
    defaultPasscode: 'Chef@BMB2026',
    pin: '1122',
    description: 'Live cooking alerts, daily batch counts, 5CP thali packaging line & ingredient indents',
    permissions: [
      'Live Batch Cooking Counts (Veg, Egg, Chicken)',
      'Sub-Panel 1: Production Schedule & Alerts',
      'Sub-Panel 2: Fast Ingredient Indent System',
      '5CP Hot Partition Packaging Check',
      'Instant Single Thali Preparation Queue'
    ],
    badgeColor: 'bg-amber-700 text-white'
  }
};
