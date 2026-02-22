import { MediaItem } from '../constants';

export async function searchMovies(query: string): Promise<MediaItem[]> {
  if (!query) return [];
  
  try {
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=movie&limit=20`);
    const data = await response.json();
    
    return data.results.map((item: any) => ({
      id: item.trackId?.toString() || Math.random().toString(),
      title: item.trackName,
      artist: item.artistName || 'Unknown Director',
      thumbnail: item.artworkUrl100.replace('100x100', '600x600'),
      url: item.previewUrl,
      type: 'movie',
      duration: formatDuration(item.trackTimeMillis || 0),
      genre: item.primaryGenreName,
      description: item.longDescription
    }));
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
}

export async function searchMusic(query: string): Promise<MediaItem[]> {
  if (!query) return [];
  
  try {
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`);
    const data = await response.json();
    
    return data.results.map((item: any) => ({
      id: item.trackId.toString(),
      title: item.trackName,
      artist: item.artistName,
      thumbnail: item.artworkUrl100.replace('100x100', '600x600'),
      url: item.previewUrl,
      type: 'song',
      duration: formatDuration(item.trackTimeMillis),
      genre: item.primaryGenreName
    }));
  } catch (error) {
    console.error('Error searching music:', error);
    return [];
  }
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
}
