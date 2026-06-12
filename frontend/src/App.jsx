import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader2, Sun, Moon, Zap } from 'lucide-react';
import UserSection from './components/UserSection';
import GameCard from './components/GameCard';
import { getGames, generateLinks } from './services/api';
import toast from 'react-hot-toast';

function App() {
  const [selectedUser, setSelectedUser] = useState('');
  const [games, setGames] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);

  // Toggle dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    fetchGamesData();
  }, []);

  const fetchGamesData = async () => {
    try {
      const data = await getGames();
      setGames(data);
    } catch (err) {
      toast.error('Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async (game) => {
    if (!selectedUser) {
      toast.error('Please select a username first to play!');
      // Scroll to top where user section is
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const toastId = toast.loading('Generating launch link...');
    try {
      // The current generateLinks endpoint returns links for ALL games.
      // We just pick the one the user clicked.
      const allLinks = await generateLinks(selectedUser);
      const gameLink = allLinks.find(l => l.name === game.name);
      
      if (gameLink) {
        toast.dismiss(toastId);
        
        // Copy and open
        navigator.clipboard.writeText(gameLink.link);
        toast.success(`Copied link for ${game.name}! Redirecting...`, { duration: 2000 });
        
        setTimeout(() => {
          window.open(gameLink.link, '_blank');
        }, 1000);

      } else {
        toast.error('Game link not found', { id: toastId });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate link', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Toaster position="top-right" toastOptions={{
        className: 'dark:bg-gray-800 dark:text-white'
      }}/>

      {/* Simple Header with Dark Mode Toggle */}
      <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-blue-600 dark:text-blue-400" size={28} fill="currentColor" />
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">
              Game Launcher
            </h1>
          </div>
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDark ? <Sun className="text-yellow-400" size={24} /> : <Moon className="text-gray-600" size={24} />}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* User Selection */}
        <div className="mb-12">
          <UserSection onSelectUser={setSelectedUser} selectedUser={selectedUser} />
        </div>

        {/* Hot Games Section */}
        <div className="mb-8 flex items-center gap-2">
          <h2 className="text-2xl font-bold">Hot Games</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {games.map((game, index) => (
              <GameCard key={index} game={game} onPlay={handlePlay} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
