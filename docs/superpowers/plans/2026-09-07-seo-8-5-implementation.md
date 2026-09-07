# SEO 8.5+ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Raise Bring My Bite's technical/on-page SEO quality to an estimated 8.5+ without disturbing customer ordering, PWA, CMS, or staff operations.

**Architecture:** A small route metadata module drives document head state and JSON-LD. A public SEO content component renders indexable high-intent pages inside the existing React SPA; static robots and sitemap provide crawler discovery.

**Tech Stack:** Vite, React, TypeScript, existing Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-07-seo-8-5-design.md`

## Global Constraints
- Supabase remains the source of truth for live pricing/menu/banner data.
- Do not modify order, payment, inventory, Admin, Chef, Manager, or D-Admin workflows.
- Do not invent locations, reviews, ratings, addresses, or unsupported claims.
- Staff portal paths must not be included in the sitemap.
- Canonicals use `https://bringmybite.com`.

### Task 1: SEO route model and tests
**Files:** Create `src/seo/seoConfig.ts`, `tests/seoConfig.test.mjs`.
- Define the public route list and metadata for each route.
- Export route resolution helpers usable by the React SEO component and tests.
- Test titles/descriptions/canonical paths, staff exclusion, and sitemap route set.

### Task 2: Dynamic head and structured data
**Files:** Create `src/seo/SeoManager.tsx`.
- Update title, description, canonical, robots, Open Graph and Twitter tags on route changes.
- Replace prior generated tags instead of accumulating duplicates.
- Emit Organization and WebSite JSON-LD globally; emit Product/Offer or FAQ only on matching pages.
- Ensure staff paths receive `noindex,nofollow`.

### Task 3: Public landing content
**Files:** Create `src/components/seo/PublicSeoPage.tsx`, modify `src/App.tsx`.
- Render public route-specific pages with one H1, descriptive sections, FAQ where useful, and internal links.
- Preserve existing homepage UI at `/`.
- Keep transaction buttons connected to the existing AppContext modals.
- Route staff paths exactly as before.

### Task 4: Crawler files
**Files:** Create `public/robots.txt`, `public/sitemap.xml`.
- Allow public crawling.
- Disallow known staff portal paths.
- List only canonical public URLs.

### Task 5: Base document metadata
**Files:** Modify `index.html`.
- Add baseline canonical, OG, Twitter, theme and crawler metadata that remains valid before React hydration.
- Keep existing PWA manifest/icon behavior.

### Task 6: Verification and deployment
- Run `npm test`, `npm run lint`, and `npm run build`.
- Review changed-file diff for accidental business-logic changes.
- Deploy through Vercel.
- Smoke-test homepage and all public SEO routes plus staff portal HTTP responses.
