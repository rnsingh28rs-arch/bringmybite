import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/seo/SeoManager.tsx', import.meta.url), 'utf8');

test('SEO manager refreshes metadata when SPA route changes', () => {
  assert.match(source, /location\.pathname/);
  assert.match(source, /addEventListener\('popstate'/);
  assert.match(source, /addEventListener\('hashchange'/);
});

test('SEO manager keeps canonical and crawler metadata under the managed marker', () => {
  assert.match(source, /data-bringmybite-seo/);
  assert.match(source, /upsertLink\('canonical', canonical\)/);
  assert.match(source, /index,follow,max-image-preview:large/);
  assert.match(source, /noindex,nofollow/);
});
