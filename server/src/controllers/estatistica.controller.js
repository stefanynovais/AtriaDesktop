import { estatisticaService } from '../services/estatistica.service.js';

export const getEstatisticasAluno = async (req, res, next) => {
  try {
    const estatisticas = await estatisticaService.getEstatisticasAluno(req.user.id);
    res.json(estatisticas);
  } catch (error) {
    next(error);
  }
};

export const getEstatisticasTurma = async (req, res, next) => {
  try {
    const { id } = req.params;
    const estatisticas = await estatisticaService.getEstatisticasTurma(id);
    res.json(estatisticas);
  } catch (error) {
    next(error);
  }
};
