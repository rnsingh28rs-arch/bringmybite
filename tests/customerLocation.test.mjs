import test from 'node:test';
import assert from 'node:assert/strict';
import { createMapLocationLink, normalizeCustomerLocation } from '../src/utils/customerLocation.mjs';

test('creates a Google Maps link from latitude and longitude', () => {
  assert.equal(
    createMapLocationLink(22.572645, 88.363892),
    'https://www.google.com/maps?q=22.572645,88.363892'
  );
});

test('normalizes an optional customer location with coordinates and map link', () => {
  assert.deepEqual(
    normalizeCustomerLocation({ latitude: 22.572645, longitude: 88.363892, mapLocationLink: '' }),
    {
      latitude: 22.572645,
      longitude: 88.363892,
      mapLocationLink: 'https://www.google.com/maps?q=22.572645,88.363892'
    }
  );
});

test('keeps location optional when customer does not provide GPS', () => {
  assert.deepEqual(normalizeCustomerLocation(null), {
    latitude: undefined,
    longitude: undefined,
    mapLocationLink: undefined
  });
});

test('preserves a manually supplied map link', () => {
  assert.deepEqual(
    normalizeCustomerLocation({ latitude: 22.5, longitude: 88.3, mapLocationLink: 'https://maps.google.com/custom' }),
    {
      latitude: 22.5,
      longitude: 88.3,
      mapLocationLink: 'https://maps.google.com/custom'
    }
  );
});
