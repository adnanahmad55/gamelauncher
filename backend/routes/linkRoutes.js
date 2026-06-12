import express from 'express';
import { generateLinks } from '../controllers/linkController.js';

const router = express.Router();

router.post('/', generateLinks);

export default router;
