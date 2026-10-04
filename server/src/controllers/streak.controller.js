import { streakService } from '../services/streak.service.js';

export const getStreak = async (req, res, next) => {
  try {
    const streak = await streakService.getStreak(req.user.id);
    res.json(streak);
  } catch (error) {
    next(error);
  }
};

export const getCalendarioAtividade = async (req, res, next) => {
  try {
    const { meses } = req.query; // opcional, padrão 3
    const calendario = await streakService.getCalendarioAtividade(req.user.id, meses);
    res.json(calendario);
  } catch (error) {
    next(error);
  }
};
