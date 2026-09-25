const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const css = fs.readFileSync(path.join(__dirname, '..', 'app', 'css', 'gallery.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, '..', 'app', 'js', 'gallery.js'), 'utf8');

test('gallery keeps the previous card layout', () => {
  assert.match(css, /\.couple-gallery-grid\{[^}]*gap:12px/);
  assert.match(css, /\.couple-gallery-card\{[^}]*border-radius:18px[^}]*box-shadow:0 10px 28px/);
  assert.match(css, /\.couple-gallery-photo-wrap\{[^}]*aspect-ratio:1\/1\.12/);
  assert.doesNotMatch(js, /couple-gallery-photo-backdrop/);
});

test('gallery photos are never cropped inside cards', () => {
  assert.match(css, /\.couple-gallery-photo-wrap img\{[^}]*object-fit:contain/);
});

test('mobile returns to the previous two-column layout', () => {
  assert.match(css, /@media\(max-width:520px\)[\s\S]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
});
