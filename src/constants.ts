export interface MediaItem {
  id: string;
  title: string;
  artist?: string;
  thumbnail: string;
  url: string;
  type: 'movie' | 'song';
  duration?: string;
  genre?: string;
  description?: string;
}

export const CURATED_MOVIES: MediaItem[] = [
  {
    id: 'm1',
    title: 'Big Buck Bunny',
    artist: 'Blender Foundation',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'movie',
    duration: '9:56',
    genre: 'Animation',
    description: 'A giant rabbit with a heart bigger than his belly.'
  },
  {
    id: 'm2',
    title: 'Sintel',
    artist: 'Blender Foundation',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Sintel_poster.jpg/800px-Sintel_poster.jpg',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    type: 'movie',
    duration: '14:48',
    genre: 'Fantasy',
    description: 'A young woman searches for her dragon companion.'
  },
  {
    id: 'm3',
    title: 'Tears of Steel',
    artist: 'Blender Foundation',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Tears_of_Steel_poster.jpg/800px-Tears_of_Steel_poster.jpg',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    type: 'movie',
    duration: '12:14',
    genre: 'Sci-Fi',
    description: 'A group of warriors and scientists in Amsterdam.'
  },
  {
    id: 'm4',
    title: 'Elephant\'s Dream',
    artist: 'Blender Foundation',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Elephants_Dream_s1_proog.jpg/800px-Elephants_Dream_s1_proog.jpg',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    type: 'movie',
    duration: '10:53',
    genre: 'Sci-Fi',
    description: 'The first open-source 3D animated short film.'
  },
  {
    id: 'm5',
    title: 'Caminandes: Llama Drama',
    artist: 'Blender Foundation',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Caminandes_Llama_Drama_Poster.png/800px-Caminandes_Llama_Drama_Poster.png',
    url: 'https://archive.org/download/CaminandesLlamaDrama/Caminandes%20-%20Llama%20Drama.mp4',
    type: 'movie',
    duration: '1:30',
    genre: 'Comedy',
    description: 'Koro the llama tries to cross a road.'
  },
  {
    id: 'm6',
    title: 'Cosmos Laundromat',
    artist: 'Blender Foundation',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cosmos_Laundromat_poster.jpg/800px-Cosmos_Laundromat_poster.jpg',
    url: 'https://archive.org/download/CosmosLaundromat/Cosmos%20Laundromat%20-%20First%20Cycle.mp4',
    type: 'movie',
    duration: '12:10',
    genre: 'Sci-Fi',
    description: 'On a desolate island, a suicidal sheep named Franck meets a mysterious salesman.'
  },
  {
    id: 'm7',
    title: 'Glass Half',
    artist: 'Blender Foundation',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Glass_Half_poster.jpg/800px-Glass_Half_poster.jpg',
    url: 'https://archive.org/download/GlassHalf/Glass%20Half.mp4',
    type: 'movie',
    duration: '3:00',
    genre: 'Comedy',
    description: 'A short film about two art critics.'
  },
  {
    id: 'm8',
    title: 'Ocean Life',
    artist: 'Nature Docs',
    thumbnail: 'https://images.pexels.com/photos/1001633/pexels-photo-1001633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    url: 'https://vjs.zencdn.net/v/oceans.mp4',
    type: 'movie',
    duration: '0:46',
    genre: 'Documentary',
    description: 'A glimpse into the deep blue.'
  }
];

export const FALLBACK_MUSIC: MediaItem[] = [
  {
    id: 'f1',
    title: 'Midnight City',
    artist: 'M83',
    thumbnail: 'https://picsum.photos/seed/music1/600/600',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    type: 'song',
    duration: '6:12',
    genre: 'Electronic'
  },
  {
    id: 'f2',
    title: 'Starlight',
    artist: 'Muse',
    thumbnail: 'https://picsum.photos/seed/music2/600/600',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    type: 'song',
    duration: '7:05',
    genre: 'Rock'
  },
  {
    id: 'f3',
    title: 'Ocean Eyes',
    artist: 'Billie Eilish',
    thumbnail: 'https://picsum.photos/seed/music3/600/600',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    type: 'song',
    duration: '5:12',
    genre: 'Pop'
  }
];
