import { games } from '../config/games.js';
import { loginAndGetToken } from '../services/loginService.js';
import dotenv from 'dotenv';

dotenv.config();

export const generateLinks = async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Call login API to get the token
    const token = await loginAndGetToken(username);

    // Generate links for each game
    const generatedLinks = games.map(game => {
      const baseUrl = game.base_url || process.env.GAME_LAUNCH_BASE_URL || 'http://localhost:3000';
      const sanitizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const link = `${sanitizedBaseUrl}/?token=${token}&opr_id=${game.opr_id}&game_code=${game.game_code}`;
      
      return {
        name: game.name,
        link: link
      };
    });

    res.json(generatedLinks);
  } catch (error) {
    console.error('Error generating links:', error.message);
    res.status(500).json({ error: 'Failed to generate links. Please check the login API.' });
  }
};
