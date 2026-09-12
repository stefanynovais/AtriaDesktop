import { flashcardService } from '../services/flashcard.service.js';

// Erros de "não encontrado / sem permissão" viram 404, em vez de
// caírem no erro genérico 500 do resto do sistema.
const tratarErroComumOu = (error, res, next) => {
  if (error.message === 'Deck não encontrado' || error.message === 'Flashcard não encontrado') {
    return res.status(404).json({ status: 'error', message: error.message });
  }
  next(error);
};

export const buscarFlashcards = async (req, res, next) => {
  try {
    const { search } = req.query;
    const resultados = await flashcardService.buscar(search, req.user.id);
    res.json(resultados);
  } catch (error) {
    tratarErroComumOu(error, res, next);
  }
};

export const getFlashcardsByDeck = async (req, res, next) => {
  try {
    const { deckId } = req.params;
    const flashcards = await flashcardService.getByDeck(deckId, req.user.id);
    res.json(flashcards);
  } catch (error) {
    tratarErroComumOu(error, res, next);
  }
};

export const createFlashcard = async (req, res, next) => {
  try {
    const novoFlashcard = await flashcardService.create(req.body, req.user.id);
    res.status(201).json(novoFlashcard);
  } catch (error) {
    tratarErroComumOu(error, res, next);
  }
};

export const updateFlashcard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const atualizado = await flashcardService.update(id, req.body, req.user.id);
    res.json(atualizado);
  } catch (error) {
    tratarErroComumOu(error, res, next);
  }
};

export const deleteFlashcard = async (req, res, next) => {
  try {
    const { id } = req.params;
    await flashcardService.delete(id, req.user.id);
    res.status(204).send();
  } catch (error) {
    tratarErroComumOu(error, res, next);
  }
};