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

  const [generatedLinkData, setGeneratedLinkData] = useState(null);

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const toastId = toast.loading('Generating launch link...');
    try {
      const allLinks = await generateLinks(selectedUser);
      const gameLink = allLinks.find(l => l.name === game.name);
      
      if (gameLink) {
        toast.dismiss(toastId);
        toast.success(`Link generated for ${game.name}!`);
        // Show modal instead of auto redirect
        setGeneratedLinkData({
          name: game.name,
          link: gameLink.link
        });
      } else {
        toast.error('Game link not found', { id: toastId });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate link', { id: toastId });
    }
  };

  const handleCopyLink = () => {
    if (generatedLinkData) {
      navigator.clipboard.writeText(generatedLinkData.link);
      toast.success('Link copied to clipboard!');
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

      {/* Generated Link Modal */}
      {generatedLinkData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Link Ready: {generatedLinkData.name}
            </h3>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg mb-6 border border-gray-200 dark:border-gray-700 break-all text-sm text-gray-600 dark:text-gray-400">
              {generatedLinkData.link}
            </div>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setGeneratedLinkData(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
              <button 
                onClick={handleCopyLink}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Copy Link
              </button>
              <a 
                href={generatedLinkData.link}
                target="_blank"
                rel="noreferrer"
                onClick={() => setGeneratedLinkData(null)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium inline-block"
              >
                Play Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
