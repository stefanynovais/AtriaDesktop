import express from 'express'
import {
  getFlashcardsByDeck,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from '../controllers/flashcard.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/:deckId', getFlashcardsByDeck)
router.post('/', createFlashcard)
router.put('/:id', updateFlashcard)
router.delete('/:id', deleteFlashcard)

export default router
