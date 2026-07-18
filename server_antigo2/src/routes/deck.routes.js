import express from 'express'
import {
  getAllDecks,
  getDeckById,
  createDeck,
  updateDeck,
  deleteDeck,
} from '../controllers/deck.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

// Define endpoints para gerenciamento de decks (todas exigem autenticação)
const router = express.Router()

router.use(authMiddleware)

router.get('/', getAllDecks)
router.get('/:id', getDeckById)
router.post('/', createDeck)
router.put('/:id', updateDeck)
router.delete('/:id', deleteDeck)

export default router
