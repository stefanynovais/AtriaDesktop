import express from 'express'
import {
  getCartoesClassicos,
  getVerdadeiroFalso,
  getJogoDaMemoria,
  getCombinarPares,
  getRelacionarImagem,
  getRevisao,
  getEscreverDefinicao,
  getEscreverAudio,
  postVerificarResposta,
  getRevisaoMultipla,
  postRevisaoMultipla,
} from '../controllers/exercicio.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/revisao', getRevisao)
router.get('/revisao-multipla', getRevisaoMultipla)
router.post('/revisao-multipla/responder', postRevisaoMultipla)
router.post('/escrever/verificar', postVerificarResposta)
router.get('/escrever-definicao/:deckId', getEscreverDefinicao)
router.get('/escrever-audio/:deckId', getEscreverAudio)
router.get('/cartoes/:deckId', getCartoesClassicos)
router.get('/verdadeiro-falso/:deckId', getVerdadeiroFalso)
router.get('/jogo-memoria/:deckId', getJogoDaMemoria)
router.get('/combinar/:deckId', getCombinarPares)
router.get('/relacionar-imagem/:deckId', getRelacionarImagem)

export default router
