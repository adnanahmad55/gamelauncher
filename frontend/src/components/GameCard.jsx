import React from 'react';
import { Copy, ExternalLink, Flame } from 'lucide-react';
import toast from 'react-hot-toast';

const GameCard = ({ game, onPlay }) => {
  return (
    <div 
      onClick={() => onPlay(game)}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:shadow-none dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 cursor-pointer group border border-gray-100 dark:border-gray-700 flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Top Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
        {game.game_icon ? (
          <img 
            src={game.game_icon} 
            alt={game.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Game' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
            {game.name}
          </div>
        )}
        
        {/* Hot Badge */}
        {game.is_hot && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
            HOT <Flame size={12} className="fill-white" />
          </div>
        )}
      </div>

      {/* Bottom Text Section */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {game.name}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mt-1 font-semibold">
            {game.provider_name || 'MGP'}
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
          Play Now &rarr;
        </div>
      </div>
    </div>
  );
};

export default GameCard;
