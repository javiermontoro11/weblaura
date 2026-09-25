const test = require('node:test');
const assert = require('node:assert/strict');
const { carouselAssetKeys } = require('../app/js/nuestro24.js');

test('carouselAssetKeys filters invalid values and removes duplicates', () => {
  assert.deepEqual(
    carouselAssetKeys({
      asset_keys: [
        'moment-2026-09-24-bowling-1',
        'bad key',
        'moment-2026-09-24-bowling-2',
        'moment-2026-09-24-bowling-1',
        24
      ]
    }),
    ['moment-2026-09-24-bowling-1', 'moment-2026-09-24-bowling-2']
  );
});

test('carouselAssetKeys returns an empty list when no asset_keys exist', () => {
  assert.deepEqual(carouselAssetKeys({}), []);
  assert.deepEqual(carouselAssetKeys(null), []);
});
