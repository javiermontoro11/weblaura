const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('latest memory hero biases the image upward so faces are not cropped', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'app', 'css', 'ui.css'), 'utf8');
  assert.match(css, /\.v3-memory-hero\.has-image[^}]*background-position:\s*50%\s+24%/s);
});
