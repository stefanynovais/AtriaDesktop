import express from 'express'
import authRoutes from './auth.routes.js'
import deckRoutes from './deck.routes.js'

// Cria o roteador principal da API e monta as rotas de cada recurso
const router = express.Router()

router.use('/auth', authRoutes)
router.use('/decks', deckRoutes)

export default router
