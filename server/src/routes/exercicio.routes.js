import express from 'express'
import {
  getCartoesClassicos,
  getVerdadeiroFalso,
  getJogoDaMemoria,
  getCombinarPares,
} from '../controllers/exercicio.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/cartoes/:deckId', getCartoesClassicos)
router.get('/verdadeiro-falso/:deckId', getVerdadeiroFalso)
router.get('/jogo-memoria/:deckId', getJogoDaMemoria)
router.get('/combinar/:deckId', getCombinarPares)

export default router
