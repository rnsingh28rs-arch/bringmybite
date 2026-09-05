import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('production service worker unregisters legacy PWA cache', () => {
  const source = fs.readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');
  assert.match(source, /registration\.unregister\(\)/);
  assert.match(source, /caches\.keys\(\)/);
});
