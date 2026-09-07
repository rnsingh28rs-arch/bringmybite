import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/data/initialData.ts', import.meta.url), 'utf8');

assert.match(source, /'EGG DELIGHT':|export const EGG_DELIGHT_MENU/);
assert.match(source, /'NON-VEG CLUB':|export const NON_VEG_CLUB_MENU/);

const eggStart = source.indexOf('export const EGG_DELIGHT_MENU');
const nonVegStart = source.indexOf('export const NON_VEG_CLUB_MENU');
assert.ok(eggStart >= 0 && nonVegStart > eggStart, 'Egg and Non-Veg menu definitions must exist separately.');

const eggMenu = source.slice(eggStart, nonVegStart);
const nonVegMenu = source.slice(nonVegStart);

assert.match(eggMenu, /Egg Curry \(2 Eggs\)/, 'Egg menu must contain an egg special.');
assert.match(eggMenu, /Egg Bhurji Gravy/, 'Egg dinner must retain an egg special.');
assert.match(nonVegMenu, /Chicken Curry \(3 pcs\)/, 'Non-Veg menu must contain a chicken special.');
assert.match(nonVegMenu, /Chicken Masala \(3 pcs\)/, 'Non-Veg dinner must contain a chicken special.');

console.log('package menu tab requirements passed');
