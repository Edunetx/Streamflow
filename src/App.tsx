import React from 'react';
import { Search, Play, Pause, SkipBack, SkipForward, Volume2, Music, Film, Home, Library, Heart, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactPlayer from 'react-player';
import { cn } from './lib/utils';
import { CURATED_MOVIES, FALLBACK_MUSIC, MediaItem } from './constants';
import { searchMusic, searchMovies } from './services/mediaService';

const Player = ReactPlayer as any;

export default function App() {
  const [activeTab, setActiveTab] = React.useState<'home' | 'movies' | 'music'>('home');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<MediaItem[]>([]);
  const [movieSearchResults, setMovieSearchResults] = React.useState<MediaItem[]>([]);
  const [currentMedia, setCurrentMedia] = React.useState<MediaItem | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [volume, setVolume] = React.useState(0.8);
  const [progress, setProgress] = React.useState(0);
  const [isSearching, setIsSearching] = React.useState(false);
  const [showMovieOverlay, setShowMovieOverlay] = React.useState(false);
  const [playbackError, setPlaybackError] = React.useState<string | null>(null);

  const playerRef = React.useRef<any>(null);

  React.useEffect(() => {
    // Load initial trending content
    const loadTrending = async () => {
      try {
        const [music, movies] = await Promise.all([
          searchMusic('trending'),
          searchMovies('2024')
        ]);
        
        setSearchResults(music.length > 0 ? music : FALLBACK_MUSIC);
        setMovieSearchResults(movies.length > 0 ? movies : CURATED_MOVIES);
      } catch (error) {
        console.error('Initial load failed:', error);
        setSearchResults(FALLBACK_MUSIC);
        setMovieSearchResults(CURATED_MOVIES);
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadTrending();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    
    if (activeTab === 'music') {
      const results = await searchMusic(searchQuery);
      setSearchResults(results);
    } else if (activeTab === 'movies') {
      const results = await searchMovies(searchQuery);
      setMovieSearchResults(results);
    } else {
      const [music, movies] = await Promise.all([
        searchMusic(searchQuery),
        searchMovies(searchQuery)
      ]);
      setSearchResults(music);
      setMovieSearchResults(movies);
    }
    
    setIsSearching(false);
  };

  const playMedia = (item: MediaItem) => {
    // Clear previous errors
    setPlaybackError(null);
    
    // Reset ready state for new media
    setIsReady(false);
    
    // Stop current playback first to avoid "interrupted" errors
    setIsPlaying(false);
    
    // Small timeout to allow state to settle
    setTimeout(() => {
      setCurrentMedia(item);
      setIsPlaying(true);
      if (item.type === 'movie') {
        setShowMovieOverlay(true);
      } else {
        setShowMovieOverlay(false);
      }

      // Safety timeout for isReady
      setTimeout(() => {
        setIsReady(true);
      }, 5000);
    }, 50);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const closeMovieOverlay = () => {
    setIsPlaying(false);
    setShowMovieOverlay(false);
  };

  const handleDownload = (item: MediaItem) => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = `${item.title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden text-white font-sans">
      <AnimatePresence>
        {isInitialLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-bg flex flex-col items-center justify-center gap-8"
          >
            <div className="w-24 h-24 bg-brand-primary rounded-[32px] flex items-center justify-center shadow-2xl shadow-brand-primary/40 animate-pulse">
              <Play className="w-12 h-12 fill-white" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-4xl font-serif italic tracking-tighter">StreamFlow</h2>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-80 border-r border-white/10 flex flex-col p-10 gap-12 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4 px-2">
          <div className="w-10 h-10 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <Play className="w-6 h-6 fill-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter">StreamFlow</span>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem 
            icon={<Home className="w-5 h-5" />} 
            label="Home" 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
          />
          <NavItem 
            icon={<Film className="w-5 h-5" />} 
            label="Movies" 
            active={activeTab === 'movies'} 
            onClick={() => setActiveTab('movies')} 
          />
          <NavItem 
            icon={<Music className="w-5 h-5" />} 
            label="Music" 
            active={activeTab === 'music'} 
            onClick={() => setActiveTab('music')} 
          />
        </nav>

        <div className="mt-auto flex flex-col gap-2">
          <NavItem icon={<Library className="w-5 h-5" />} label="Library" />
          <NavItem icon={<Heart className="w-5 h-5" />} label="Liked" />
        </div>
        <div className="mt-auto pt-10 border-t border-white/10 flex flex-col gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-4 px-6 py-4 rounded-2xl text-white/30 hover:text-white hover:bg-white/5 transition-all"
          >
            <AlertCircle className="w-6 h-6" />
            <span className="font-bold tracking-wide text-lg">Reset Player</span>
          </button>
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-brand-primary/10 border border-brand-primary/20">
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">System Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header / Search */}
        <header className="px-16 py-12 flex items-center justify-between z-10">
          <form onSubmit={handleSearch} className="relative w-full max-w-2xl flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20" />
              <input 
                type="text" 
                placeholder={`Search for ${activeTab === 'movies' ? 'movies' : activeTab === 'music' ? 'songs' : 'anything'}...`} 
                className="w-full bg-white/5 border border-white/10 rounded-full py-5 pl-16 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all text-xl placeholder:text-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-5 rounded-full font-bold transition-all border border-white/10"
            >
              Search
            </button>
          </form>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-base font-bold">Guest User</span>
              <span className="text-xs text-brand-primary uppercase tracking-[0.2em] font-bold">Premium Access</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-primary to-orange-400 border border-white/20 shadow-2xl rotate-6" />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-12 no-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-32"
              >
                {/* Hero Section */}
                <section className="relative h-[600px] rounded-[60px] overflow-hidden group shadow-2xl">
                  <img 
                    src="https://picsum.photos/seed/stream/1920/1080" 
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                    alt="Hero"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-20">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    >
                      <span className="text-brand-primary font-bold uppercase tracking-[0.5em] text-xs mb-6 block">Exclusive Premiere</span>
                      <h1 className="text-9xl font-serif italic mb-8 leading-[0.9] tracking-tighter">Beyond <br/>The Horizon</h1>
                      <p className="max-w-3xl text-white/50 text-xl mb-12 leading-relaxed font-light">Immerse yourself in a world of unlimited entertainment. Stream the latest movies and discover your next favorite artist, all in one place.</p>
                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => playMedia(CURATED_MOVIES[0])}
                          className="w-fit bg-brand-primary text-white px-12 py-5 rounded-full font-bold flex items-center gap-4 hover:bg-white hover:text-black transition-all hover:scale-105 active:scale-95 shadow-2xl"
                        >
                          <Play className="w-6 h-6 fill-current" /> Start Streaming
                        </button>
                        <button className="px-12 py-5 rounded-full font-bold border border-white/20 hover:bg-white/10 transition-all">
                          Learn More
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </section>

                {/* Trending Movies */}
                <section>
                  <div className="flex items-center justify-between mb-16">
                    <div className="space-y-2">
                      <h2 className="text-5xl font-serif italic">Trending Cinema</h2>
                      <p className="text-white/30 text-lg">Most watched this week</p>
                    </div>
                    <button className="text-brand-primary text-sm font-bold tracking-widest uppercase hover:underline">Explore All</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
                    {movieSearchResults.slice(0, 4).map((movie) => (
                      <MediaCard 
                        key={movie.id} 
                        item={movie} 
                        onPlay={() => playMedia(movie)} 
                        onDownload={() => handleDownload(movie)}
                        isCurrent={currentMedia?.id === movie.id}
                        isReady={isReady}
                      />
                    ))}
                  </div>
                </section>

                {/* Trending Music */}
                <section>
                  <div className="flex items-center justify-between mb-16">
                    <div className="space-y-2">
                      <h2 className="text-5xl font-serif italic">Hot Tracks</h2>
                      <p className="text-white/30 text-lg">New music for you</p>
                    </div>
                    <button className="text-brand-primary text-sm font-bold tracking-widest uppercase hover:underline">Listen All</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
                    {searchResults.slice(0, 5).map((song) => (
                      <MediaCard 
                        key={song.id} 
                        item={song} 
                        onPlay={() => playMedia(song)} 
                        onDownload={() => handleDownload(song)}
                        isCurrent={currentMedia?.id === song.id}
                        isReady={isReady}
                      />
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'movies' && (
              <motion.div 
                key="movies"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-16"
              >
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-6xl font-serif italic">Cinema Selection</h2>
                  {isSearching && (
                    <div className="flex items-center gap-3 text-brand-primary">
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-bold uppercase tracking-widest">Searching Movies...</span>
                    </div>
                  )}
                </div>

                {movieSearchResults.length > 0 && (
                  <section>
                    <h3 className="text-2xl font-serif italic mb-10 text-white/60">Search Results</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                      {movieSearchResults.map((movie) => (
                        <MediaCard 
                          key={movie.id} 
                          item={movie} 
                          onPlay={() => playMedia(movie)} 
                          onDownload={() => handleDownload(movie)}
                          isCurrent={currentMedia?.id === movie.id}
                          isReady={isReady}
                        />
                      ))}
                    </div>
                    <div className="h-px bg-white/10 my-16" />
                  </section>
                )}

                <section>
                  <h3 className="text-2xl font-serif italic mb-10 text-white/60">Curated Masterpieces</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {CURATED_MOVIES.map((movie) => (
                      <MediaCard 
                        key={movie.id} 
                        item={movie} 
                        onPlay={() => playMedia(movie)} 
                        onDownload={() => handleDownload(movie)}
                        isCurrent={currentMedia?.id === movie.id}
                        isReady={isReady}
                      />
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'music' && (
              <motion.div 
                key="music"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-5xl font-serif italic">Music Discovery</h2>
                  {isSearching && (
                    <div className="flex items-center gap-3 text-brand-primary">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-bold uppercase tracking-widest">Searching...</span>
                    </div>
                  )}
                </div>
                
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
                    {searchResults.map((song) => (
                      <MediaCard 
                        key={song.id} 
                        item={song} 
                        onPlay={() => playMedia(song)} 
                        onDownload={() => handleDownload(song)}
                        isCurrent={currentMedia?.id === song.id}
                        isReady={isReady}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 text-white/20">
                    <Music className="w-24 h-24 mb-6 opacity-10" />
                    <p className="text-xl font-serif italic">Search for your favorite artists or songs above</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Movie Player Overlay */}
        <div 
          className={cn(
            "fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500",
            showMovieOverlay ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {(!isReady && showMovieOverlay) && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm gap-6">
                <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,78,0,0.3)]" />
                <p className="text-white/50 font-serif italic text-xl animate-pulse">Preparing Cinema...</p>
              </div>
            )}
            <Player
              ref={playerRef}
              url={currentMedia?.type === 'movie' ? currentMedia.url : ''}
              playing={isPlaying && isReady && currentMedia?.type === 'movie' && showMovieOverlay}
              volume={volume}
              width="100%"
              height="100%"
              controls
              playsinline
              config={{
                file: {
                  attributes: {
                    crossOrigin: 'anonymous',
                    style: { width: '100%', height: '100%', objectFit: 'contain' }
                  }
                }
              }}
              onReady={() => setIsReady(true)}
              onProgress={(p: any) => setProgress(p.played)}
              onEnded={() => setIsPlaying(false)}
              onError={(e: any) => {
                console.error('Playback Error:', e);
                setPlaybackError(`Failed to play movie: ${currentMedia?.title}. The file might be broken or unsupported.`);
                setIsReady(true);
              }}
            />
            <button 
              onClick={() => currentMedia && handleDownload(currentMedia)}
              className="absolute top-10 right-28 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl transition-all z-50 border border-white/10 group"
              title="Download"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Download</span>
                <SkipForward className="w-8 h-8 rotate-90" />
              </div>
            </button>
            <button 
              onClick={closeMovieOverlay}
              className="absolute top-10 right-10 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl transition-all hover:rotate-90 z-50 border border-white/10"
            >
              <Pause className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Music Player Bar */}
        <footer className="h-24 border-t border-white/10 bg-black/60 backdrop-blur-xl px-8 flex items-center justify-between z-40">
          <div className="flex items-center gap-4 w-1/3">
            {currentMedia ? (
              <>
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10">
                  <img src={currentMedia.thumbnail} alt={currentMedia.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium line-clamp-1">{currentMedia.title}</h4>
                  <p className="text-xs text-white/50 line-clamp-1">{currentMedia.artist}</p>
                </div>
                <button className="ml-2 text-white/40 hover:text-brand-primary transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="text-white/20 text-sm italic">No media selected</div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 w-1/3">
            <div className="flex items-center gap-6">
              <button className="text-white/40 hover:text-white transition-colors"><SkipBack className="w-5 h-5" /></button>
              <button 
                onClick={togglePlay}
                disabled={!currentMedia}
                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all disabled:opacity-50 shadow-xl relative group"
              >
                {!isReady && isPlaying && currentMedia ? (
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />
                )}
              </button>
              <button className="text-white/40 hover:text-white transition-colors"><SkipForward className="w-5 h-5" /></button>
            </div>
            <div className="w-full max-w-md flex items-center gap-3 text-[10px] text-white/40">
              <span>0:00</span>
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-brand-primary" 
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <span>{currentMedia?.duration || '0:00'}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 w-1/3">
            <Volume2 className="w-4 h-4 text-white/40" />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 accent-brand-primary"
            />
          </div>
        </footer>

        {/* Background Atmosphere */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/5 blur-[100px] rounded-full" />
        </div>
      </main>

      {/* Persistent Audio Player for Songs */}
      <div className="fixed -top-full -left-full opacity-0 pointer-events-none">
        <Player
          url={currentMedia?.type === 'song' ? currentMedia.url : ''}
          playing={isPlaying && isReady && currentMedia?.type === 'song'}
          volume={volume}
          width="0px"
          height="0px"
          playsinline
          onReady={() => setIsReady(true)}
          onProgress={(p: any) => setProgress(p.played)}
          onEnded={() => setIsPlaying(false)}
          onError={(e: any) => {
            console.error('Playback Error:', e);
            setPlaybackError(`Failed to play song: ${currentMedia?.title}. The file might be broken or unsupported.`);
            setIsReady(true);
          }}
        />
      </div>

      {/* Error Toast */}
      <AnimatePresence>
        {playbackError && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-32 left-1/2 z-[100] bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[400px] border border-red-400/50 backdrop-blur-xl"
          >
            <AlertCircle className="w-6 h-6 shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-sm">Playback Error</p>
              <p className="text-xs opacity-90">{playbackError}</p>
              <button 
                onClick={() => currentMedia && playMedia(currentMedia)}
                className="mt-2 text-[10px] font-bold uppercase tracking-widest bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
              >
                Try Again
              </button>
            </div>
            <button 
              onClick={() => setPlaybackError(null)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group",
        active ? "bg-white/10 text-white shadow-xl" : "text-white/30 hover:text-white hover:bg-white/5"
      )}
    >
      <span className={cn("transition-transform group-hover:scale-110", active && "text-brand-primary")}>
        {icon}
      </span>
      <span className="font-bold tracking-wide text-lg">{label}</span>
      {active && <motion.div layoutId="active-pill" className="ml-auto w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(255,78,0,0.5)]" />}
    </button>
  );
}

function MediaCard({ item, onPlay, onDownload, isCurrent, isReady }: { item: MediaItem, onPlay: () => void, onDownload?: () => void, isCurrent?: boolean, isReady?: boolean }) {
  const isLoading = isCurrent && !isReady;

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={cn("group cursor-pointer", isCurrent && "ring-2 ring-brand-primary/50 rounded-[32px] p-1")}
    >
      <div className="relative aspect-[16/9] rounded-[32px] overflow-hidden mb-6 border border-white/5 shadow-lg">
        <img 
          src={item.thumbnail} 
          alt={item.title} 
          className={cn("w-full h-full object-cover transition-transform duration-700 group-hover:scale-110", isLoading && "blur-sm")}
          referrerPolicy="no-referrer"
        />
        <div className={cn(
          "absolute inset-0 bg-black/60 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px] gap-4",
          isLoading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          {isLoading ? (
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); onPlay(); }}
                className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center scale-75 group-hover:scale-100 transition-all duration-300 shadow-2xl hover:scale-110 active:scale-90"
              >
                <Play className="w-8 h-8 fill-white ml-1" />
              </button>
              {onDownload && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onDownload(); }}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center scale-75 group-hover:scale-100 transition-all duration-300 shadow-2xl hover:bg-white/20 hover:scale-110 active:scale-90 border border-white/10"
                >
                  <SkipForward className="w-5 h-5 rotate-90" />
                </button>
              )}
            </>
          )}
        </div>
        {item.type === 'movie' && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl text-[10px] font-bold uppercase tracking-[0.2em] border border-white/10">
            Cinema
          </div>
        )}
      </div>
      <div onClick={onPlay}>
        <h3 className="text-xl font-serif italic mb-1 group-hover:text-brand-primary transition-colors line-clamp-1">{item.title}</h3>
        <p className="text-sm text-white/30 tracking-wide line-clamp-1">{item.artist || item.genre}</p>
      </div>
    </motion.div>
  );
}
