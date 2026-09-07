import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const seoConfig = fs.readFileSync(path.join(root, 'src/seo/seoConfig.ts'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8');
const robots = fs.readFileSync(path.join(root, 'public/robots.txt'), 'utf8');

test('SEO config contains all intended public routes', () => {
  for (const route of [
    '/', '/monthly-meal-subscription', '/veg-meal-subscription', '/egg-meal-subscription',
    '/non-veg-meal-subscription', '/instant-thali', '/weekly-menu', '/how-it-works',
    '/delivery-areas', '/contact',
  ]) assert.match(seoConfig, new RegExp(`path: '${route.replace('/', '\\/')}'`));
});

test('SEO config does not publish staff portal routes', () => {
  assert.doesNotMatch(sitemap, /\/admin|\/manager|\/chef|\/d-admin|\/staff/);
  assert.match(robots, /Disallow: \/admin/);
  assert.match(robots, /Disallow: \/manager/);
  assert.match(robots, /Disallow: \/chef/);
  assert.match(robots, /Disallow: \/d-admin/);
});

test('sitemap uses the production canonical origin', () => {
  assert.doesNotMatch(sitemap, /www\.bringmybite\.com/);
  assert.match(sitemap, /https:\/\/bringmybite\.com\//);
});

test('homepage metadata has a real canonical and search description', () => {
  const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(index, /rel="canonical" href="https:\/\/bringmybite\.com\/"/);
  assert.match(index, /name="description" content="[^"]+"/);
  assert.match(index, /property="og:title"/);
  assert.match(index, /name="twitter:card"/);
});
