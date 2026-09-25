const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('Recuerdos exposes the shared gallery UI and loads its assets', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  for (const id of [
    'memory-mode-tabs','memories-view','couple-gallery-view','gallery-grid','gallery-upload-btn','gallery-load-more',
    'couple-gallery-modal','couple-gallery-editor-modal','couple-gallery-viewer-image','couple-gallery-download'
  ]) assert.match(html, new RegExp(`id=["']${id}["']`), `missing ${id}`);
  assert.match(html, /app\/css\/gallery\.css/);
  assert.match(html, /app\/js\/gallery\.js/);
});