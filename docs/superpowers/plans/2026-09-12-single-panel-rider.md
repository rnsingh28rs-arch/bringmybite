# Single Panel App + Rider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build one mobile-first Bring My Bite staff app with Admin, D-Admin, Manager, Chef and Rider, connected to the existing centralized Supabase production database.

**Architecture:** Extend the existing `/panel-app` instead of creating another application or database. Add Rider as a first-class role, use the existing centralized data layer for riders and delivery assignments, and make the staff PWA manifest available before iOS installation.

**Tech Stack:** React, TypeScript, Vite, existing Supabase data layer, existing order store, Google Maps navigation URLs.

**Spec:** `docs/superpowers/specs/2026-09-12-single-panel-rider-design.md`

## Global Constraints
- Use the existing production Supabase project/database only.
- Keep the customer app separate from the staff panel app.
- Staff login remains username/password based.
- Keep the staff UI mobile-first and simple.
- Use Google Maps navigation links rather than embedding a paid Maps API initially.

---

### Task 1: Add Rider role

**Files:** `src/utils/mobilePanelRouting.mjs`, `src/types.ts`, and routing tests.

- [ ] Add `rider` to the shared role union and panel role list.
- [ ] Make `/panel-app/rider` resolve to Rider.
- [ ] Add a routing regression test.
- [ ] Run the test and TypeScript check.

### Task 2: Add centralized rider and assignment data

**Files:** create `src/utils/riderStore.ts`; update existing central data utilities only where necessary; add rider-store tests.

- [ ] Define rider profile and delivery assignment models.
- [ ] Implement list/create/update/activate operations using the existing centralized data conventions.
- [ ] Implement delivery assignment and rider-delivery lookup.
- [ ] Test create/update/list and assignment filtering.
- [ ] Run tests and TypeScript check.

### Task 3: Add Rider to the single Panel App

**Files:** `src/components/panels/PanelApp.tsx`, `src/components/panels/SimpleStaffLogin.tsx` if needed, and new `src/components/panels/RiderPanel.tsx`.

- [ ] Add Rider metadata and the Rider option to the panel picker.
- [ ] Add Rider content to the existing panel application.
- [ ] Build a simple mobile Rider dashboard for assigned active deliveries.
- [ ] Show customer name, phone, address, order summary and delivery status.
- [ ] Add delivery action buttons.
- [ ] Keep customer routes untouched.

### Task 4: Add Google Maps navigation

**Files:** create `src/utils/googleMapsNavigation.mjs`; update `RiderPanel.tsx`; add navigation tests.

- [ ] Build and test an encoded Google Maps destination URL.
- [ ] Add a Rider Navigate button that opens Google Maps for the customer destination.
- [ ] Show stored distance/coordinates when available and otherwise use the delivery address.

### Task 5: Add Admin Rider management

**Files:** `src/components/panels/AdminPanel.tsx` and new `src/components/panels/RiderManagementPanel.tsx`.

- [ ] Add a Riders & Delivery area in Admin.
- [ ] Add Add Rider, edit and activate/deactivate controls.
- [ ] Add assignment of eligible orders to active riders.
- [ ] Persist assignments centrally so they appear in the Rider app.

### Task 6: Separate staff PWA installation

**Files:** `index.html`, `public/panel-manifest.json`, `src/components/panels/PanelApp.tsx`.

- [ ] Update panel manifest icons to current Bring My Bite branding assets.
- [ ] Select the panel manifest synchronously from the initial `/panel-app` path instead of relying only on a React effect.
- [ ] Keep the customer manifest unchanged for customer routes.
- [ ] Ensure the staff Home Screen app is named Bring My Bite Panel.

### Task 7: Verify

- [ ] Run the complete test suite.
- [ ] Run the production build.
- [ ] Verify Rider routing and login.
- [ ] Verify Admin Rider management and assignment.
- [ ] Verify Google Maps navigation URL generation.
- [ ] Verify customer app and staff app remain separate.
- [ ] Verify the panel manifest uses current branding.
