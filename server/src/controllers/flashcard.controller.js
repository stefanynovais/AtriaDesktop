import { flashcardService } from '../services/flashcard.service.js';

export const buscarFlashcards = async (req, res, next) => {
  try {
    const { search } = req.query;
    const resultados = await flashcardService.buscar(search, req.user.id);
    res.json(resultados);
  } catch (error) {
    next(error);
  }
};

export const getFlashcardsByDeck = async (req, res, next) => {
  try {
    const { deckId } = req.params;
    const flashcards = await flashcardService.getByDeck(deckId, req.user.id);
    res.json(flashcards);
  } catch (error) {
    next(error);
  }
};

export const createFlashcard = async (req, res, next) => {
  try {
    const novoFlashcard = await flashcardService.create(req.body, req.user.id);
    res.status(201).json(novoFlashcard);
  } catch (error) {
    next(error);
  }
};

export const updateFlashcard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const atualizado = await flashcardService.update(id, req.body, req.user.id);
    res.json(atualizado);
  } catch (error) {
    next(error);
  }
};

export const deleteFlashcard = async (req, res, next) => {
  try {
    const { id } = req.params;
    await flashcardService.delete(id, req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
