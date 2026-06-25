import express from 'express'
import {
  getAllDecks,
  getDeckById,
  createDeck,
  updateDeck,
  deleteDeck,
} from '../controllers/deck.controller.js'

// Define endpoints para gerenciamento de decks
const router = express.Router()

router.get('/', getAllDecks)
router.get('/:id', getDeckById)
router.post('/', createDeck)
router.put('/:id', updateDeck)
router.delete('/:id', deleteDeck)

export default router
