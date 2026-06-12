import express from 'express';
import { getGamesList } from '../services/gameService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const games = await getGamesList();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve games' });
  }
});

export default router;
