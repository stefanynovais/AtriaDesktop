import express from 'express';
import { getStreak } from '../controllers/streak.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getStreak);

export default router;
