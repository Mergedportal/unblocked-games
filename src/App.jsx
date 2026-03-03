import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, Trophy, Zap, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(gamesData.map(g => g.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}>
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Gamepad2 className="text-black w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">NEXUS<span className="text-emerald-500">GAMES</span></h1>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div className="flex items-center gap-4">
             <button className="hidden md:flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors">
               <Trophy className="w-4 h-4" />
               Leaderboard
             </button>
             <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent("User")}`} alt="Avatar" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {!searchQuery && activeCategory === 'All' && (
          <section className="mb-12">
            <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3 h-3 fill-current" />
                  Featured Game
                </div>
                <h2 className="text-4xl md:text-5xl font-black leading-tight">SLOPE UNBLOCKED</h2>
                <p className="text-zinc-400 text-lg max-w-lg">
                  Experience the ultimate speed challenge. Navigate through the neon world and avoid obstacles in this fast-paced arcade classic.
                </p>
                <button 
                  onClick={() => setSelectedGame(gamesData.find(g => g.id === 'slope') || null)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  Play Now
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 w-full max-w-sm aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/10 border border-white/10">
                <img 
                  src="https://picsum.photos/seed/slope-hero/800/450" 
                  alt="Slope" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </section>
        )}

        {/* Categories */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat 
                ? 'bg-emerald-500 text-black' 
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game) => (
              <motion.div
                layout
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 cursor-pointer"
                onClick={() => setSelectedGame(game)}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={game.thumbnail} 
                    alt={game.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="bg-emerald-500 text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      Play Now
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm truncate group-hover:text-emerald-400 transition-colors">{game.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold tracking-widest">{game.category}</span>
                    <div className="flex items-center gap-1 text-zinc-600">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px]">Just added</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredGames.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 border border-white/5 mb-4">
              <Gamepad2 className="w-8 h-8 text-zinc-700" />
            </div>
            <h3 className="text-xl font-bold text-zinc-400">No games found</h3>
            <p className="text-zinc-600 mt-2">Try searching for something else or explore categories.</p>
          </div>
        )}
      </main>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-6xl h-full flex flex-col bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-900/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                    <img src={selectedGame.thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold leading-none">{selectedGame.title}</h2>
                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{selectedGame.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white" title="Fullscreen">
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-zinc-400 hover:text-red-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Game Frame */}
              <div className="flex-1 bg-black relative">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="autoplay; fullscreen; keyboard"
                />
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    1,204 playing now
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-xs font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
                    Report Issue
                  </button>
                  <div className="h-4 w-px bg-white/10" />
                  <button className="bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2">
                    Share Game
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="text-black w-5 h-5" />
                </div>
                <span className="text-lg font-bold tracking-tight">NEXUS<span className="text-emerald-500">GAMES</span></span>
              </div>
              <p className="text-zinc-500 max-w-sm text-sm leading-relaxed">
                The ultimate destination for unblocked web games. Fast, secure, and always free. Play the best titles directly in your browser.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Quick Links</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-emerald-500 transition-colors">New Games</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Popular</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Categories</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Leaderboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Support</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">DMCA</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-600 text-xs">© 2024 Nexus Games. All rights reserved.</p>
            <div className="flex items-center gap-6">
               <span className="text-zinc-600 text-xs flex items-center gap-1">
                 Made with <span className="text-red-500">❤</span> for gamers
               </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
