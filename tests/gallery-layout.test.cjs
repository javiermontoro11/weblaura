const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const css = fs.readFileSync(path.join(__dirname, '..', 'app', 'css', 'gallery.css'), 'utf8');

test('gallery uses a seamless Instagram-like square grid', () => {
  assert.match(css, /\.couple-gallery-grid\{[^}]*gap:2px/);
  assert.match(css, /\.couple-gallery-card\{[^}]*border-radius:0/);
  assert.match(css, /\.couple-gallery-photo-wrap\{[^}]*aspect-ratio:1\/1/);
});

test('gallery foreground photo never crops the image', () => {
  assert.match(css, /\.couple-gallery-photo-main\{[^}]*object-fit:contain/);
});

test('mobile gallery uses three joined columns', () => {
  assert.match(css, /@media\(max-width:520px\)[\s\S]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
});
