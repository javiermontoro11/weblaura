const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'app', 'css', 'gallery.css'), 'utf8');

test('gallery offers 3, 5 and 10 photos per row', () => {
  assert.match(html, /data-gallery-columns="3"/);
  assert.match(html, /data-gallery-columns="5"/);
  assert.match(html, /data-gallery-columns="10"/);
});

test('gallery grid uses the selected CSS variable', () => {
  assert.match(css, /repeat\(var\(--gallery-columns,5\),minmax\(0,1fr\)\)/);
});