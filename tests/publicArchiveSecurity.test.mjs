import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const zipExporter = fs.readFileSync(new URL('../src/utils/zipExporter.ts', import.meta.url), 'utf8');
const paymentConfig = fs.readFileSync(new URL('../src/data/paymentConfig.ts', import.meta.url), 'utf8');

test('downloadable source archives do not contain private bank identifiers', () => {
  assert.doesNotMatch(zipExporter, /PAYMENT_CONFIG\.json/);
  assert.doesNotMatch(zipExporter, /\b\d{14}\b/);
  assert.doesNotMatch(zipExporter, /\b[A-Z]{4}0[A-Z0-9]{6}\b/);
  assert.doesNotMatch(zipExporter, /\b\d{10}@[A-Z]+\b/);
  assert.doesNotMatch(paymentConfig, /\b\d{14}\b/);
  assert.doesNotMatch(paymentConfig, /\b[A-Z]{4}0[A-Z0-9]{6}\b/);
});
