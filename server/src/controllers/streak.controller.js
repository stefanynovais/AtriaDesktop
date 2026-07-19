import { streakService } from '../services/streak.service.js';

export const getStreak = async (req, res, next) => {
  try {
    const streak = await streakService.getStreak(req.user.id);
    res.json(streak);
  } catch (error) {
    next(error);
  }
};
