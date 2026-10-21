import {readFile, stat} from 'node:fs/promises';
import {test} from 'node:test';
import assert from 'node:assert/strict';

const pagePath = new URL(
  '../app/components/VelnauraHomepage.tsx',
  import.meta.url,
);

test('homepage contains the conversion hero and editorial commerce sequence', async () => {
  const source = await readFile(pagePath, 'utf8');
  for (const required of [
    'Complimentary shipping on all orders',
    'Shop',
    'Philosophy',
    'Ritual',
    'Journal',
    'About',
    'What you’re given is only the beginning.',
    'Shop now',
    'Evidence-led skincare',
    'Mugtea Whipped Cleanser',
  ]) {
    assert.ok(source.includes(required));
  }
  assert.ok(source.includes('<footer'));
  assert.ok(source.includes('Email me instead'));
  assert.ok(source.includes('footer-beyond'));
  assert.ok(source.includes('media-templates'));
});

test('countdown uses the visitor local end of day and timed seconds disclosure', async () => {
  const source = await readFile(pagePath, 'utf8');
  assert.ok(source.includes('end.setHours(23, 59, 59, 999)'));
  assert.ok(source.includes('setInterval(update, 1000)'));
  assert.ok(source.includes('setShowSeconds(false)'));
  assert.ok(source.includes('3600'));
  assert.ok(source.includes('window.scrollY < lastScrollY.current - 4'));
  assert.ok(source.includes('<small>h</small>'));
});

test('removed hero copy stays removed and conversion block remains separate', async () => {
  const source = await readFile(pagePath, 'utf8');
  assert.ok(!source.includes('Velnaura belief № 01'));
  assert.ok(!source.includes('For the person who treats care'));
  assert.ok(!source.includes('as an act of becoming'));
  assert.ok(source.includes('className="hero-conversion"'));
});

test('Shopify and fallback product paths share the Mugtea commerce UI', async () => {
  const source = await readFile(pagePath, 'utf8');
  const route = await readFile(new URL('../app/routes/_index.tsx', import.meta.url), 'utf8');
  assert.ok(source.includes('<AddToCartButton'));
  assert.ok(route.includes('context.storefront.query'));
  assert.ok(route.includes("mode: 'demo'"));
  const image = await stat(new URL('../public/mugtea-cleanser.png', import.meta.url));
  assert.ok(image.size > 100000);
});

test('belief machine contains every requested expression', async () => {
  const source = await readFile(pagePath, 'utf8');
  for (const expression of [
    'Genetics.',
    'Potential.',
    'Limits.',
    'Expectations.',
    'the Baseline.',
    'Ordinary.',
    'Hype.',
    'Yesterday.',
  ]) {
    assert.ok(source.includes(`'${expression}'`));
  }
});

test('menu content and supplied SVG wordmark are present', async () => {
  const source = await readFile(pagePath, 'utf8');
  assert.ok(source.includes('/velnaura-wordmark.svg'));
  assert.ok(source.includes('Get it NOW!'));
  assert.ok(source.includes('Mugtea Whipped Cleanser'));
  assert.ok(source.includes('Claim'));
  for (const item of ['FAQs', 'Contact']) assert.ok(source.includes(item));

  const logo = await stat(
    new URL('../public/velnaura-wordmark.svg', import.meta.url),
  );
  assert.ok(logo.size > 1000);
});

test('menu includes accessible dismissal and focus containment', async () => {
  const source = await readFile(pagePath, 'utf8');
  assert.ok(source.includes("event.key === 'Escape'"));
  assert.ok(source.includes("event.key !== 'Tab'"));
  assert.ok(source.includes('aria-expanded={menuOpen}'));
  assert.ok(source.includes('aria-hidden={!menuOpen}'));
});
