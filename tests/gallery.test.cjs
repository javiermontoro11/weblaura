const test = require('node:test');
const assert = require('node:assert/strict');
const gallery = require('../app/js/gallery.js');

test('pageRange returns inclusive Supabase ranges in blocks of 24', () => {
  assert.deepEqual(gallery.pageRange(0, 24), { from: 0, to: 23 });
  assert.deepEqual(gallery.pageRange(24, 24), { from: 24, to: 47 });
});

test('clampFiles rejects selections over the upload limit', () => {
  const files = Array.from({ length: 11 }, (_, i) => ({ name: `f${i}` }));
  assert.equal(gallery.clampFiles(files, 10).ok, false);
  assert.equal(gallery.clampFiles(files, 10).files.length, 0);
});

test('clampFiles keeps valid selections unchanged', () => {
  const files = [{ name: 'a.jpg' }, { name: 'b.jpg' }];
  const result = gallery.clampFiles(files, 10);
  assert.equal(result.ok, true);
  assert.deepEqual(result.files, files);
});

test('wrapIndex cycles viewer positions', () => {
  assert.equal(gallery.wrapIndex(3, 4), 3);
  assert.equal(gallery.wrapIndex(4, 4), 0);
  assert.equal(gallery.wrapIndex(-1, 4), 3);
  assert.equal(gallery.wrapIndex(0, 0), 0);
});

test('normalizeRow keeps only the gallery fields used by the UI', () => {
  const row = gallery.normalizeRow({
    id: 'abc', fecha: '2026-09-25', descripcion: 'Hola', image_path: 'gallery/a.webp',
    created_at: '2026-09-25T10:00:00Z', updated_at: '2026-09-25T10:00:00Z', ignored: 123
  });
  assert.deepEqual(row, {
    id: 'abc', fecha: '2026-09-25', descripcion: 'Hola', image_path: 'gallery/a.webp',
    created_at: '2026-09-25T10:00:00Z', updated_at: '2026-09-25T10:00:00Z', signedUrl: ''
  });
});

test('signed URL freshness respects the refresh margin', () => {
  const now = 1_000_000;
  assert.equal(gallery.isSignedUrlFresh({ expiresAt: now + (6 * 60 * 1000) }, now), true);
  assert.equal(gallery.isSignedUrlFresh({ expiresAt: now + (4 * 60 * 1000) }, now), false);
  assert.equal(gallery.isSignedUrlFresh(null, now), false);
});