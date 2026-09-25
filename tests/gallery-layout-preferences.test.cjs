const test = require('node:test');
const assert = require('node:assert/strict');
const layout = require('../app/js/gallery-layout.js');

test('normalizes gallery column choices to 3, 5 or 10', () => {
  assert.equal(layout.normalizeColumns(3), 3);
  assert.equal(layout.normalizeColumns('5'), 5);
  assert.equal(layout.normalizeColumns(10), 10);
  assert.equal(layout.normalizeColumns(6), 5);
  assert.equal(layout.normalizeColumns('nope'), 5);
});

test('reads and writes the selected column count without Supabase', () => {
  const values = new Map();
  const storage = {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); }
  };
  assert.equal(layout.readColumns(storage), 5);
  layout.writeColumns(10, storage);
  assert.equal(layout.readColumns(storage), 10);
});