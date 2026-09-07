import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const registration = fs.readFileSync('src/components/customer/RegistrationModal.tsx', 'utf8');
const instant = fs.readFileSync('src/components/customer/InstantOrderModal.tsx', 'utf8');
const centralData = fs.readFileSync('src/utils/centralData.ts', 'utf8');
const orderStore = fs.readFileSync('src/utils/orderStore.ts', 'utf8');
const migration = fs.readFileSync('supabase/migrations/20260907090000_customer_location_mapping.sql', 'utf8');

test('subscription checkout exposes optional current-location mapping', () => {
  assert.match(registration, /Use Current Location/);
  assert.match(registration, /Delivery Map Location.*Optional/);
  assert.match(registration, /navigator\.geolocation/);
  assert.match(registration, /mapLocationLink/);
  assert.match(registration, /mapLatitude/);
  assert.match(registration, /mapLongitude/);
});

test('instant thali checkout retains current-location mapping', () => {
  assert.match(instant, /Use Current Location/);
  assert.match(instant, /navigator\.geolocation/);
  assert.match(instant, /Current GPS/);
});

test('subscription persistence writes GPS coordinates', () => {
  assert.match(centralData, /map_latitude:n\.mapLatitude/);
  assert.match(centralData, /map_longitude:n\.mapLongitude/);
  assert.match(centralData, /mapLatitude:r\.map_latitude/);
  assert.match(centralData, /mapLongitude:r\.map_longitude/);
});

test('order persistence extracts coordinates from map links', () => {
  assert.match(orderStore, /extractCoordinatesFromMapLink/);
  assert.match(orderStore, /map_latitude: coords\.latitude/);
  assert.match(orderStore, /map_longitude: coords\.longitude/);
});

test('database migration adds optional GPS columns for both purchase types', () => {
  assert.match(migration, /bmb_subscriptions[\s\S]*add column if not exists map_latitude/);
  assert.match(migration, /bmb_orders[\s\S]*add column if not exists map_latitude/);
});
