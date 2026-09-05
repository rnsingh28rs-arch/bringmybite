import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('production service worker clears legacy caches and stays network-only', () => {
  const source = fs.readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');
  assert.match(source, /caches\.keys\(\)/);
  assert.match(source, /caches\.delete\(key\)/);
  assert.match(source, /event\.respondWith\(fetch\(event\.request\)\)/);
  assert.doesNotMatch(source, /caches\.match\(/);
});
