import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('website exposes the PWA manifest and registers the service worker', () => {
  const indexHtml = read('index.html');
  const mainTsx = read('src/main.tsx');

  assert.match(indexHtml, /<link\s+rel=["']manifest["']\s+href=["']\/manifest\.json["']\s*\/?>(?:\s*)/i);
  assert.match(mainTsx, /serviceWorker\.register\(["']\/sw\.js["']\)/);
});

test('the PWA service worker never serves a cached application response', () => {
  const sw = read('public/sw.js');

  assert.match(sw, /self\.addEventListener\(['"]fetch['"]/);
  assert.match(sw, /event\.respondWith\(fetch\(event\.request\)\)/);
  assert.doesNotMatch(sw, /caches\.match\(/);
});

test('the customer header renders the existing install app control', () => {
  const header = read('src/components/common/Header.tsx');

  assert.match(header, /InstallAppButton/);
  assert.match(header, /<InstallAppButton\s*\/?>(?:\s*)/);
});
