import { exercicioService } from '../services/exercicio.service.js'

export const getCartoesClassicos = async (req, res, next) => {
  try {
    const { deckId } = req.params
    const { nivel } = req.query
    res.json(await exercicioService.gerarCartoesClassicos(deckId, req.user.id, nivel))
  } catch (error) { next(error) }
}

export const getVerdadeiroFalso = async (req, res, next) => {
  try {
    const { deckId } = req.params
    const { nivel } = req.query
    res.json(await exercicioService.gerarVerdadeiroFalso(deckId, req.user.id, nivel))
  } catch (error) { next(error) }
}

export const getJogoDaMemoria = async (req, res, next) => {
  try {
    const { deckId } = req.params
    const { quantidade } = req.query
    res.json(await exercicioService.gerarJogoDaMemoria(deckId, req.user.id, quantidade))
  } catch (error) { next(error) }
}

export const getCombinarPares = async (req, res, next) => {
  try {
    const { deckId } = req.params
    const { quantidade } = req.query
    res.json(await exercicioService.gerarCombinarPares(deckId, req.user.id, quantidade))
  } catch (error) { next(error) }
}

export const getRelacionarImagem = async (req, res, next) => {
  try {
    const { deckId } = req.params
    const { quantidade } = req.query
    res.json(await exercicioService.gerarRelacionarImagem(deckId, req.user.id, quantidade))
  } catch (error) { next(error) }
}

export const getRevisao = async (req, res, next) => {
  try {
    const { deckId } = req.query
    res.json(await exercicioService.gerarRevisao(req.user.id, deckId))
  } catch (error) { next(error) }
}

export const getRevisaoMultipla = async (req, res, next) => {
  try {
    res.json(await exercicioService.gerarRevisaoMultipla(req.user.id))
  } catch (error) { next(error) }
}

export const postRevisaoMultipla = async (req, res, next) => {
  try {
    const { token, escolhidoId } = req.body
    res.json(await exercicioService.responderRevisaoMultipla(token, escolhidoId, req.user.id))
  } catch (error) { next(error) }
}

export const getEscreverDefinicao = async (req, res, next) => {
  try {
    const { deckId } = req.params
    const { nivel } = req.query
    res.json(await exercicioService.gerarEscreverDefinicao(deckId, req.user.id, nivel))
  } catch (error) { next(error) }
}

export const getEscreverAudio = async (req, res, next) => {
  try {
    const { deckId } = req.params
    const { nivel } = req.query
    res.json(await exercicioService.gerarEscreverAudio(deckId, req.user.id, nivel))
  } catch (error) { next(error) }
}

export const postVerificarResposta = async (req, res, next) => {
  try {
    const { flashcardId, resposta } = req.body
    res.json(await exercicioService.verificarResposta(flashcardId, resposta, req.user.id))
  } catch (error) { next(error) }
}
