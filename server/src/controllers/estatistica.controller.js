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
    const estatisticas = await estatisticaService.getEstatisticasTurma(id, req.user.id);
    res.json(estatisticas);
  } catch (error) {
    if (error.message === 'Turma não encontrada') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

export const getRespostasAlunoNaTurma = async (req, res, next) => {
  try {
    const { id, alunoId } = req.params;
    const detalhe = await estatisticaService.getRespostasAlunoNaTurma(id, req.user.id, alunoId);
    res.json(detalhe);
  } catch (error) {
    if (error.message === 'Turma não encontrada' || error.message === 'Aluno não encontrado nesta turma') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};
