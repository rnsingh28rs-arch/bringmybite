# Single Panel App + Rider Design

## Goal
Create one dedicated Bring My Bite staff application containing Admin, D-Admin, Manager, Chef and Rider, while keeping the existing customer application separate and using the existing centralized Supabase production database.

## Architecture
The existing `/panel-app` experience becomes the single staff application. Role selection/login remains inside that application; no separate staff applications or database are created. Rider delivery data is derived from the existing order/customer records, with assignment/status persisted through the centralized data path.

## Roles
- Admin: orders, customers, payments, delivery assignment and staff management.
- D-Admin: panels, roles and permissions.
- Manager: operations, stock and delivery workflow.
- Chef: kitchen preparation and dispatch workflow.
- Rider: assigned deliveries, customer contact/address, delivery status, distance and Google Maps navigation.

## Admin Rider Management
Admin receives a Staff/Riders area to add, edit, activate/deactivate riders and assign deliveries. The initial Rider account is configured in the staff login service; additional riders are managed through the same centralized staff configuration rather than a second database.

## Delivery Flow
Admin/Manager assigns an order to a rider. Rider sees assigned active deliveries, customer/order details, destination address and a Navigate action. Google Maps is opened for navigation using the customer's stored address/coordinates when available. Rider can update delivery status, which is reflected back to the central order workflow.

## PWA Separation
Customer app and staff panel must install as separate Home Screen apps. The staff app uses `panel-manifest.json`, its own start URL/scope and the same approved Bring My Bite branding asset. Manifest selection must occur before iOS installation rather than relying only on a React effect.

## Constraints
- Do not create another Supabase project/database.
- Do not change customer app data ownership.
- Do not require email authentication for staff login.
- Keep the panel mobile-first and simple.
- Do not embed a paid Google Maps API initially; use Google Maps navigation URLs/deep links.
