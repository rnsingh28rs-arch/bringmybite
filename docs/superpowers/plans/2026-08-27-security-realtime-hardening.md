# Security and Realtime Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Supabase the authoritative authorization and realtime synchronization layer for the existing portal without changing the existing portal UI unnecessarily.

**Architecture:** PostgreSQL/RLS remains the final authorization boundary. Staff roles and panel permissions come from `bmb_roles`, `bmb_permissions`, and `bmb_admin_users`; the browser never becomes the authority for permissions. Supabase Realtime propagates committed database changes to connected clients, replacing unnecessary polling while preserving explicit database writes as the only source of truth.

**Tech Stack:** React + TypeScript + Vite, Supabase PostgreSQL/RLS/Realtime/Edge Functions, GitHub, Vercel.

**Spec:** Approved security/realtime architecture from the current conversation and the completed deep audit.

## Global Constraints

- Do not delete existing staff Auth identities or change existing staff PINs.
- Do not replace or redesign the existing portal UI unless required for correctness.
- No browser-side privileged database initialization.
- A portal mutation is successful only after the authoritative Supabase write succeeds.
- RLS must remain the final database authorization boundary.
- Realtime is for propagation, not authorization and not a replacement for database writes.
- Every production change must pass a clean Vercel build before merge.
- Do not expose `pin_hash` or plaintext PINs to the browser.

---

### Task 1: Capture current security/realtime baseline

**Files:**
- Read: Supabase schema, policies, functions, and current GitHub source.
- Create: `docs/superpowers/audits/2026-08-27-security-realtime-baseline.md`

**Interfaces:**
- Consumes: current production schema and source at commit `9648fe9437d503b48e16acce9ab4f7be4a5967dd`.
- Produces: an auditable baseline listing policies, functions, realtime publication state, and affected portal tables.

- [ ] **Step 1: Record current RLS and function exposure.**

- [ ] **Step 2: Record current Realtime publication/table state.**

- [ ] **Step 3: Record the current portal-to-table mapping.**

- [ ] **Step 4: Commit the baseline document.**

---

### Task 2: Harden database authorization

**Files:**
- Modify: Supabase migration/schema layer for RLS and grants.
- Test: SQL authorization checks using anonymous and authenticated contexts where supported.

**Interfaces:**
- Consumes: `bmb_admin_users`, `bmb_roles`, `bmb_permissions`, operational tables, existing RPCs.
- Produces: database policies that enforce panel/action permissions without trusting frontend role checks.

- [ ] **Step 1: Inventory every policy for CMS and operational tables.**

- [ ] **Step 2: Remove duplicate permissive policies where an equivalent policy already exists.**

- [ ] **Step 3: Ensure public/customer operations only expose the minimum required columns/operations.**

- [ ] **Step 4: Ensure staff writes require an active authenticated staff account and the appropriate database permission.**

- [ ] **Step 5: Restrict `SECURITY DEFINER` functions to the smallest required EXECUTE audience.**

- [ ] **Step 6: Set an explicit `search_path` on security-sensitive functions where required.**

- [ ] **Step 7: Add/verify indexes for foreign-key and RLS lookup columns that are actually used.**

- [ ] **Step 8: Run authorization regression queries before application changes.**

- [ ] **Step 9: Commit the database security changes.**

---

### Task 3: Make database permissions consumable by the application

**Files:**
- Modify: `src/cms/CmsContext.tsx`
- Modify: shared staff/auth authorization helpers already present in `src/`.
- Test: permission-resolution paths used by Admin, Manager, Chef, and D-Admin.

**Interfaces:**
- Consumes: `bmb_permissions(role_id,panel_id,can_read,can_write,can_add,can_delete)`.
- Produces: one frontend permission model derived from Supabase, with no hard-coded authorization decisions replacing database permissions.

- [ ] **Step 1: Define the canonical permission shape used by the UI.**

- [ ] **Step 2: Load permissions for the authenticated staff role.**

- [ ] **Step 3: Make panel visibility/read/write/add/delete decisions consume that permission model.**

- [ ] **Step 4: Keep frontend checks as UX guards only; rely on RLS for enforcement.**

- [ ] **Step 5: Verify D-Admin can manage permissions while non-authorized staff cannot escalate them.**

- [ ] **Step 6: Commit the application authorization changes.**

---

### Task 4: Enable Supabase Realtime for authoritative tables

**Files:**
- Modify: Supabase migration/configuration for Realtime publication.
- Modify: `src/cms/CmsContext.tsx`
- Modify: shared operational data service if required.

**Interfaces:**
- Consumes: committed PostgreSQL changes.
- Produces: realtime events for CMS and operational tables consumed by connected clients.

- [ ] **Step 1: Enable Realtime for `bmb_settings`, `bmb_pricing`, `bmb_banners`, `bmb_menus`, `bmb_registration_fields`, and `bmb_payment_settings`.**

- [ ] **Step 2: Enable Realtime for `bmb_orders`, `bmb_subscriptions`, `bmb_inventory`, `bmb_chef_indents`, and `bmb_referrals` where client synchronization is required.**

- [ ] **Step 3: Replace the 5-second CMS polling loop with channel subscriptions.**

- [ ] **Step 4: On INSERT/UPDATE/DELETE events, refresh only the affected resource or apply the event payload safely.**

- [ ] **Step 5: Ensure subscriptions are cleaned up on provider unmount/logout.**

- [ ] **Step 6: Prevent duplicate subscriptions when React effects rerun.**

- [ ] **Step 7: Commit the realtime implementation.**

---

### Task 5: Remove remaining browser-side CMS seeding

**Files:**
- Modify: `src/cms/CmsContext.tsx`
- Modify: Supabase migration/seed data.

**Interfaces:**
- Consumes: one-time canonical database seed.
- Produces: read-only client initialization for CMS data, with staff-only mutations.

- [ ] **Step 1: Verify every required CMS default row exists in Supabase.**

- [ ] **Step 2: Move any remaining canonical initialization into a migration/seed operation.**

- [ ] **Step 3: Remove browser-side `seedIfEmpty()` execution.**

- [ ] **Step 4: Make missing CMS data an explicit configuration error rather than silently mutating production from a browser.**

- [ ] **Step 5: Commit the CMS initialization cleanup.**

---

### Task 6: Add realtime/data-flow regression tests

**Files:**
- Create/modify: repository test files appropriate to the existing test setup.
- Create: `docs/superpowers/verification/2026-08-27-security-realtime-verification.md`

**Interfaces:**
- Consumes: database permission model, realtime subscriptions, application data service.
- Produces: repeatable checks for read/write authorization and portal synchronization.

- [ ] **Step 1: Test unauthorized writes are rejected by RLS.**

- [ ] **Step 2: Test authorized staff writes succeed.**

- [ ] **Step 3: Test CMS UPDATE reaches a subscribed client.**

- [ ] **Step 4: Test operational INSERT/UPDATE reaches subscribed staff views.**

- [ ] **Step 5: Test logout/unmount removes realtime listeners.**

- [ ] **Step 6: Test a failed database mutation does not produce a false UI success state.**

- [ ] **Step 7: Record verification results.**

- [ ] **Step 8: Commit the verification artifacts.**

---

### Task 7: Production release and verification

**Files:**
- Modify only files already verified by Tasks 1–6.

**Interfaces:**
- Consumes: verified GitHub branch.
- Produces: production Vercel deployment with verified Supabase connectivity.

- [ ] **Step 1: Run the clean Vercel build for the branch.**

- [ ] **Step 2: Reject the release if TypeScript/build errors occur.**

- [ ] **Step 3: Merge only the verified branch into `main`.**

- [ ] **Step 4: Confirm Vercel production deployment reaches READY.**

- [ ] **Step 5: Check production runtime errors immediately after deployment.**

- [ ] **Step 6: Verify the production portal can read central CMS data.**

- [ ] **Step 7: Verify a controlled staff-side CMS change reaches the connected client through Realtime.**

- [ ] **Step 8: Record the final commit, deployment ID, and verification result.**

- [ ] **Step 9: Commit any final documentation-only verification update.**
