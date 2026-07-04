// Pure, testable helpers for playlist / export features.
// Imported by setlist.html (browser) and tests/ (Node). No DOM, no Firebase.

// Extract an 11-char YouTube video id from any common URL shape.
export function ytIdFromUrl(url) {
  if (!url) return null;
  const m = String(url).match(/(?:v=|youtu\.be\/|\/embed\/|\/shorts\/|\/v\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

// Ordered list of YouTube ids from an array of song objects ({youtube}).
export function ytIdsFromSongs(songs) {
  return (songs || []).map(s => ytIdFromUrl(s && s.youtube)).filter(Boolean);
}

// Build a no-login "play these videos in order" YouTube URL.
// YouTube's watch_videos endpoint is limited in practice — cap the count.
export function buildYouTubePlaylistUrl(ids, max = 50) {
  const use = (ids || []).slice(0, max);
  return use.length ? 'https://www.youtube.com/watch_videos?video_ids=' + use.join(',') : null;
}

// Build an M3U playlist from songs that have an uploaded MP3 URL.
// Returns null if none of the songs have an mp3Url.
export function buildM3U(songs) {
  const lines = ['#EXTM3U'];
  let n = 0;
  (songs || []).forEach(s => {
    if (s && s.mp3Url) {
      lines.push(`#EXTINF:-1,${s.artist ? s.artist + ' - ' : ''}${s.title || 'Untitled'}`);
      lines.push(s.mp3Url);
      n++;
    }
  });
  return n ? lines.join('\n') + '\n' : null;
}

// Human-readable ordered list, e.g. "1. Song — Artist" — for pasting into
// Spotify/Apple search or sharing.
export function orderedListText(songs) {
  return (songs || [])
    .map((s, i) => `${i + 1}. ${s.title || 'Untitled'}${s.artist ? ' — ' + s.artist : ''}`)
    .join('\n');
}
