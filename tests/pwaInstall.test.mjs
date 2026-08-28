import test from 'node:test';
import assert from 'node:assert/strict';
import { getInstallPlatform, isStandaloneMode } from '../src/utils/pwaInstall.js';

test('detects iOS devices for the install flow', () => {
  assert.equal(getInstallPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)'), 'ios');
});

test('detects Android devices for the install flow', () => {
  assert.equal(getInstallPlatform('Mozilla/5.0 (Linux; Android 15; Pixel 9)'), 'android');
});

test('detects desktop browsers separately', () => {
  assert.equal(getInstallPlatform('Mozilla/5.0 (Windows NT 10.0; Win64; x64)'), 'desktop');
});

test('detects standalone display mode', () => {
  assert.equal(isStandaloneMode({ standalone: true }), true);
  assert.equal(isStandaloneMode({ standalone: false }), false);
});
