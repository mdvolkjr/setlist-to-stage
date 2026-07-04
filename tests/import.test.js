// Run: node tests/import.test.js
import assert from 'node:assert/strict';
import { parseLine, parseSongList, markDuplicates } from '../lib/import.js';

let passed = 0;
function t(name, fn) { fn(); passed++; console.log('  ✓ ' + name); }

console.log('import.js');

t('parseLine: Title - Artist (and en/em dashes)', () => {
  assert.deepEqual(parseLine('Mama Tried - Merle Haggard'), { title: 'Mama Tried', artist: 'Merle Haggard' });
  assert.deepEqual(parseLine('Tempted – Squeeze'), { title: 'Tempted', artist: 'Squeeze' });
});

t('parseLine: Title by Artist', () => {
  assert.deepEqual(parseLine('Dead Flowers by Rolling Stones'), { title: 'Dead Flowers', artist: 'Rolling Stones' });
});

t('parseLine: CSV Title, Artist', () => {
  assert.deepEqual(parseLine('Fireman, George Strait'), { title: 'Fireman', artist: 'George Strait' });
});

t('parseLine: tab-separated', () => {
  assert.deepEqual(parseLine('Timber\tPitbull'), { title: 'Timber', artist: 'Pitbull' });
});

t('parseLine: strips numbering, bullets, quotes', () => {
  assert.deepEqual(parseLine('1. Freeborn'), { title: 'Freeborn', artist: '' });
  assert.deepEqual(parseLine('- "Anyplace"'), { title: 'Anyplace', artist: '' });
  assert.deepEqual(parseLine('3) Timber - Pitbull'), { title: 'Timber', artist: 'Pitbull' });
});

t('parseLine: bare title, empty/noise', () => {
  assert.deepEqual(parseLine('Turn It On'), { title: 'Turn It On', artist: '' });
  assert.equal(parseLine(''), null);
  assert.equal(parseLine('   '), null);
});

t('parseSongList: multi-line + drops CSV header', () => {
  const out = parseSongList('title, artist\nMama Tried - Merle Haggard\n\nFreeborn');
  assert.deepEqual(out, [
    { title: 'Mama Tried', artist: 'Merle Haggard' },
    { title: 'Freeborn', artist: '' },
  ]);
});

t('markDuplicates: flags existing and in-paste repeats', () => {
  const parsed = [
    { title: 'Mama Tried', artist: 'Merle Haggard' },
    { title: 'Freeborn', artist: '' },
    { title: 'mama tried', artist: 'MERLE HAGGARD' }, // repeat (case-insensitive)
  ];
  const existing = [{ title: 'Freeborn', artist: '' }];
  const marked = markDuplicates(parsed, existing);
  assert.equal(marked[0].dup, false); // new
  assert.equal(marked[1].dup, true);  // already in library
  assert.equal(marked[2].dup, true);  // repeat within paste
});

console.log(`\n${passed} passed`);
