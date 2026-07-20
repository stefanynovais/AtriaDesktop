import { turmaService } from '../services/turma.service.js';

export const getMinhasTurmas = async (req, res, next) => {
  try {
    const turmas = await turmaService.getMinhasTurmas(req.user);
    res.json(turmas);
  } catch (error) {
    next(error);
  }
};

export const getTurmaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const turma = await turmaService.getTurmaById(id);
    res.json(turma);
  } catch (error) {
    next(error);
  }
};

export const createTurma = async (req, res, next) => {
  try {
    const novaTurma = await turmaService.createTurma(req.body, req.user.id);
    res.status(201).json(novaTurma);
  } catch (error) {
    next(error);
  }
};

export const updateTurma = async (req, res, next) => {
  try {
    const { id } = req.params;
    const turmaAtualizada = await turmaService.updateTurma(id, req.body, req.user.id);
    res.json(turmaAtualizada);
  } catch (error) {
    next(error);
  }
};

export const entrarNaTurma = async (req, res, next) => {
  try {
    const { codigo } = req.body;
    const turma = await turmaService.entrarNaTurma(codigo, req.user.id);
    res.status(200).json({ message: 'Você entrou na turma com sucesso', turma });
  } catch (error) {
    next(error);
  }
};

export const vincularDeck = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { deckId } = req.body;
    const vinculo = await turmaService.vincularDeck(id, deckId, req.user.id);
    res.status(201).json(vinculo);
  } catch (error) {
    next(error);
  }
};

export const deleteTurma = async (req, res, next) => {
  try {
    const { id } = req.params;
    await turmaService.deleteTurma(id, req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
