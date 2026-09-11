# Mobile Customer Fix + Operations Panel App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the customer mobile UI reliably interactive and deliver one installable `/panel-app` for staff to receive and handle orders from the central database.

**Architecture:** Keep the existing Vite/React application and Supabase database. Replace the split mobile interaction path with one canonical customer view, then add a route-isolated mobile staff shell that reuses existing role panels and order lifecycle utilities. Use central `bmb_orders` as the source of truth and reconcile pending orders on startup/focus so missed notifications never remove the order from view.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Supabase REST/realtime already present in the repo, browser PWA APIs.

**Spec:** `docs/superpowers/specs/2026-09-11-mobile-and-panel-app-design.md`

## Global Constraints

- One installable staff app at `/panel-app` for Admin, Manager, Chef, and future staff roles.
- The existing centralized Supabase database remains the source of truth.
- No new automatic client-side order cancellation.
- Alert failures must never prevent order handling.
- Customer mobile primary actions must remain functional on iPhone and Android.
- The CMS-configured logo replaces the BM placeholder in the customer mobile header.
- No guarantee of background audio when the OS suspends a PWA.

---

## Task 1: Add failing tests for canonical mobile actions

- [ ] Add tests covering the allowed customer tab values and primary action mappings.
- [ ] Add a test proving an invalid legacy tab such as `subscribe` cannot be selected by the canonical mobile navigation.
- [ ] Run the test suite and confirm the new behavior tests fail against the current implementation.
- [ ] Commit the failing tests.

## Task 2: Consolidate customer mobile interaction model

- [ ] Refactor `SecureCustomerMobileView.tsx` so all primary actions use the canonical `home/menu/instant/profile` tab model and AppContext modal setters.
- [ ] Remove/avoid legacy mobile-only tab values that are not handled by the canonical view.
- [ ] Replace the `BM` header fallback with the CMS logo path and an intentional neutral fallback only when no CMS logo exists.
- [ ] Ensure banner arrows/dots and all cards/buttons have no pointer-event overlay above them.
- [ ] Make install action use the actual PWA install helper when supported and show platform-appropriate instructions otherwise.
- [ ] Run typecheck/tests and confirm the mobile action tests pass.
- [ ] Commit the customer mobile fix.

## Task 3: Add panel app entry and mobile shell

- [ ] Add a `/panel-app` route resolver before customer SEO routes.
- [ ] Create a small panel-app shell with logo, signed-in role, connection status, pending-order count, and role navigation.
- [ ] Reuse existing `AdminPanel`, `ManagerStockPanel`, `ChefKitchenPanel`, and `DAdminDesigner` rather than duplicating their business logic.
- [ ] Keep customer routes isolated from staff routes.
- [ ] Add installable web-app metadata and service-worker registration for the panel route using the repo's existing Vite setup, without introducing a large dependency.
- [ ] Add tests for role-to-panel mapping.
- [ ] Run typecheck/tests.
- [ ] Commit the panel shell.

## Task 4: Make pending order handling reliable

- [ ] Add tests for pending-order reconciliation: startup/focus must surface every central `Pending Verification` order not already resolved.
- [ ] Extend the order alert utility to distinguish new pending orders from already-known historical orders while still retaining unresolved pending orders after reload.
- [ ] Update `OrderRequestAlerts.tsx` to refresh from the central store promptly and keep a persistent pending queue instead of hiding an order after nine seconds.
- [ ] Add an explicit Accept/Decline action surface that calls the existing order update/lifecycle logic.
- [ ] Keep sound, browser notifications, and speech as optional layers around the persistent queue.
- [ ] Ensure network/notification/audio failures leave the order visible and actionable.
- [ ] Run typecheck/tests.
- [ ] Commit order reliability changes.

## Task 5: Connect panel app to role actions

- [ ] Put pending orders at the top of the panel dashboard.
- [ ] Admin can Accept or Decline pending orders.
- [ ] Chef can move approved orders to Preparing and Dispatched according to the existing lifecycle.
- [ ] Manager can move dispatched orders to Delivered.
- [ ] Keep role checks aligned with `orderLifecycle.mjs`.
- [ ] Add retry/error feedback for failed status updates.
- [ ] Run typecheck/tests.
- [ ] Commit role action integration.

## Task 6: PWA install and production verification

- [ ] Add panel-app manifest metadata using the CMS logo where supported and a stable app name such as `Bring My Bite Panel`.
- [ ] Verify the panel URL can be opened directly and shared as a normal HTTPS link.
- [ ] Run `npm run lint` and `npm test` in CI-capable environment.
- [ ] Run the production build and inspect for TypeScript/build errors.
- [ ] Deploy preview and manually test the mobile checklist: Order Today, Subscribe, See Menu, 7-Day Menu, Profile, Install, banner controls, panel login, new order, Accept, Decline, Chef transitions, and Manager delivery.
- [ ] Deploy production only after verification succeeds.
- [ ] Create a final PR from the feature branch and document the share/install link for the user.
