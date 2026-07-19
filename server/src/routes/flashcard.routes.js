import express from 'express';
import {
  buscarFlashcards,
  getFlashcardsByDeck,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from '../controllers/flashcard.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

// IMPORTANTE: /buscar precisa vir ANTES de /:deckId, senão o Express
// entende "buscar" como se fosse um valor de deckId
router.get('/buscar', buscarFlashcards);
router.get('/:deckId', getFlashcardsByDeck);
router.post('/', createFlashcard);
router.put('/:id', updateFlashcard);
router.delete('/:id', deleteFlashcard);

export default router;
