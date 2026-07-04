// Run: node tests/playlist.test.js   (or: npm test)
import assert from 'node:assert/strict';
import { ytIdFromUrl, ytIdsFromSongs, buildYouTubePlaylistUrl, buildM3U, orderedListText }
  from '../lib/playlist.js';

let passed = 0;
function t(name, fn) { fn(); passed++; console.log('  ✓ ' + name); }

console.log('playlist.js');

t('ytIdFromUrl handles watch, youtu.be, embed, shorts', () => {
  assert.equal(ytIdFromUrl('https://www.youtube.com/watch?v=EsA5tLr4_Pw'), 'EsA5tLr4_Pw');
  assert.equal(ytIdFromUrl('https://youtu.be/EsA5tLr4_Pw'), 'EsA5tLr4_Pw');
  assert.equal(ytIdFromUrl('https://www.youtube.com/embed/EsA5tLr4_Pw'), 'EsA5tLr4_Pw');
  assert.equal(ytIdFromUrl('https://www.youtube.com/shorts/EsA5tLr4_Pw'), 'EsA5tLr4_Pw');
  assert.equal(ytIdFromUrl('https://www.youtube.com/watch?v=EsA5tLr4_Pw&t=42s'), 'EsA5tLr4_Pw');
});

t('ytIdFromUrl returns null for junk / empty', () => {
  assert.equal(ytIdFromUrl(''), null);
  assert.equal(ytIdFromUrl(null), null);
  assert.equal(ytIdFromUrl('https://example.com/nope'), null);
});

t('ytIdsFromSongs keeps order and drops songs without a video', () => {
  const songs = [
    { title: 'A', youtube: 'https://youtu.be/aaaaaaaaaaa' },
    { title: 'B', youtube: '' },
    { title: 'C', youtube: 'https://www.youtube.com/watch?v=ccccccccccc' },
  ];
  assert.deepEqual(ytIdsFromSongs(songs), ['aaaaaaaaaaa', 'ccccccccccc']);
});

t('buildYouTubePlaylistUrl builds url and caps count', () => {
  assert.equal(buildYouTubePlaylistUrl([]), null);
  assert.equal(buildYouTubePlaylistUrl(['a', 'b']), 'https://www.youtube.com/watch_videos?video_ids=a,b');
  const many = Array.from({ length: 60 }, (_, i) => 'id' + i);
  const url = buildYouTubePlaylistUrl(many, 50);
  assert.equal(url.split(',').length, 50);
});

t('buildM3U includes only songs with mp3Url, null if none', () => {
  assert.equal(buildM3U([{ title: 'x' }]), null);
  const m3u = buildM3U([
    { title: 'Song', artist: 'Band', mp3Url: 'https://x/y.mp3' },
    { title: 'NoFile' },
  ]);
  assert.ok(m3u.startsWith('#EXTM3U'));
  assert.ok(m3u.includes('#EXTINF:-1,Band - Song'));
  assert.ok(m3u.includes('https://x/y.mp3'));
  assert.ok(!m3u.includes('NoFile'));
});

t('orderedListText numbers and formats', () => {
  const txt = orderedListText([{ title: 'A', artist: 'X' }, { title: 'B' }]);
  assert.equal(txt, '1. A — X\n2. B');
});

console.log(`\n${passed} passed`);
