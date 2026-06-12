import axios from 'axios';
import { loginAndGetToken } from './loginService.js';
import { games as localGames } from '../config/games.js';

let cachedGames = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export const getGamesList = async () => {
  if (cachedGames && Date.now() - lastFetchTime < CACHE_DURATION) {
    return cachedGames;
  }

  try {
    // We need a token to fetch games. We'll use a generic/system login for this.
    // The credentials used here are the default ones from .env
    // We pass a generic username, e.g., 'testpl01'
    const token = await loginAndGetToken('testpl01');
    
    // According to loginService, token is returned successfully.
    // Wait, the API requires player_id. We might need to extract player_id from login.
    // Let's modify loginService to return the full response or just hardcode a player_id for game lists?
    // The test script showed we can just pass a dummy player_id or empty string.
    // Let's use empty string as the user provided: "player_id": ""
    const gamesUrl = 'https://oms-api.rocketapi.site/api/game-lists';
    const payload = {
      integration_env: "H5",
      operator_id: "250201",
      player_id: ""
    };

    const response = await axios.post(gamesUrl, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const apiGames = response.data?.data || [];
    
    // Merge local games with API games to get images and provider names
    const mergedGames = localGames.map(localGame => {
      const apiData = apiGames.find(g => g.game_code === localGame.game_code);
      return {
        ...localGame,
        game_icon: localGame.game_icon || apiData?.game_icon || null,
        provider_name: apiData?.provider_name || 'N/A',
        is_hot: true // We can just set them all to hot for the UI
      };
    });

    cachedGames = mergedGames;
    lastFetchTime = Date.now();
    return mergedGames;

  } catch (error) {
    console.error('Error fetching game lists from API:', error.message);
    if (cachedGames) return cachedGames; // Return stale cache if available
    
    // Fallback to local games if API fails completely
    return localGames.map(g => ({ ...g, game_icon: g.game_icon || null, provider_name: 'N/A', is_hot: true }));
  }
};
