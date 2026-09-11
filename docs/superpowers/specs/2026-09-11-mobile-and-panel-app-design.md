# Mobile Customer Fix + Operations Panel App Design

## Goal
Restore reliable customer mobile interactions and provide one installable staff panel app for Admin, Manager, Chef, and future staff roles.

## Scope
- Consolidate customer mobile actions around one consistent navigation/state model.
- Replace the mobile header BM placeholder with the CMS-configured logo and remove hardcoded duplicate branding.
- Keep the existing customer order/subscription flows and central Supabase database.
- Add a dedicated `/panel-app` experience using the same central order data.
- Make pending orders persistent in the panel until an authorized staff member acts on them.
- Provide prominent new-order alerts, sound while the app is active, browser/PWA notifications where permitted, and recovery of pending orders after reopening.
- Reuse existing Admin, Manager, Chef, and CMS capabilities rather than creating duplicate business logic.

## Deliberately excluded from V1
- Separate native Android/iOS binaries.
- A second database.
- Complex analytics.
- New staff hierarchy beyond the existing role model.
- Guaranteed background audio when the operating system suspends a PWA; notification behavior remains subject to browser/OS permissions.

## Architecture
The customer website/PWA and panel app remain in the existing Vite application but are isolated by route and render path. Both use the existing centralized Supabase order table and CMS. The panel app is a mobile-first shell that authenticates/authorizes staff using the existing role configuration and routes each role to its existing panel functionality.

The order alert layer must not rely only on a five-second local polling loop. It should read pending orders from the central database on panel startup and refresh promptly on order changes, while preserving a visible pending queue until the order status changes. The existing order lifecycle remains: Pending Verification -> Approved -> Preparing -> Dispatched -> Delivered, with Declined/Rejected/Cancelled terminal outcomes.

## Customer mobile behavior
- One canonical customer mobile view for installed PWA and mobile web.
- Every primary CTA uses the same AppContext setters and valid tab names.
- Modal open/close behavior must work on iPhone and Android.
- No overlay should intercept pointer/touch events over primary controls.
- Install instructions/button must invoke the actual browser install flow when available and provide correct iOS Add to Home Screen instructions when not programmatically installable.
- Logo comes from `siteSettings.logo_url`; no `BM` fallback in the branded header.

## Panel app V1
Route: `/panel-app`

Entry screen:
- Bring My Bite logo.
- Staff role/login gate using existing role data.
- Four-person deployment supported through separate accounts.

Dashboard:
- New/Pending Verification orders at the top.
- Large Accept and Decline actions for Admin.
- Role-appropriate next actions for Chef and Manager.
- Active orders and completed/declined history below.
- Pull-to-refresh/reload-safe pending queue.

Alerts:
- New pending order banner/modal.
- Audible chime while page is active and audio permission has been unlocked.
- Browser notification when permission is granted.
- Optional speech announcement while active.
- Persistent visible pending card until acted upon.
- Reconciliation on app open/focus so missed alerts cannot make an order disappear.

## Data flow
Customer order -> `bmb_orders` -> panel app startup/realtime refresh -> pending queue -> authorized action -> central status update -> all clients refresh.

## Error handling
- If realtime/notification/audio fails, order handling must continue.
- Failed alert permission never hides an order.
- Failed network update leaves the order pending and shows an actionable retry/error state.
- Role mismatch blocks unauthorized status transitions.
- No automatic client-side cancellation is introduced by the panel app.

## Testing
- Unit tests for customer tab/action mapping and order alert detection.
- Unit tests for role-based lifecycle actions and pending-order persistence.
- Production build/typecheck through the repository/Vercel pipeline.
- Manual mobile acceptance checklist: Order Today, Subscribe, See Menu, 7-Day Menu, Profile, Install, banner controls, and panel Accept/Decline all respond on touch.
