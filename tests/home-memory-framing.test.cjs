const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('latest memory hero keeps the whole photo visible while filling the wide card', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'app', 'css', 'ui.css'), 'utf8');
  assert.match(css, /\.v3-memory-hero\.has-image::before[\s\S]*background-size:\s*cover/);
  assert.match(css, /\.v3-memory-hero\.has-image::after[\s\S]*background-size:\s*contain/);
  assert.match(css, /\.v3-memory-hero\.has-image::after[\s\S]*background-repeat:\s*no-repeat/);
});