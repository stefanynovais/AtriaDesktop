import { exercicioService } from '../services/exercicio.service.js'

export const getCartoesClassicos = async (req, res, next) => {
  try {
    const { deckId } = req.params
    const resultado = await exercicioService.gerarCartoesClassicos(deckId, req.user.id)
    res.json(resultado)
  } catch (error) {
    next(error)
  }
}

export const getVerdadeiroFalso = async (req, res, next) => {
  try {
    const { deckId } = req.params
    const pergunta = await exercicioService.gerarVerdadeiroFalso(deckId, req.user.id)
    res.json(pergunta)
  } catch (error) {
    next(error)
  }
}

export const getJogoDaMemoria = async (req, res, next) => {
  try {
    const { deckId } = req.params
    const { quantidade } = req.query
    const resultado = await exercicioService.gerarJogoDaMemoria(deckId, req.user.id, quantidade)
    res.json(resultado)
  } catch (error) {
    next(error)
  }
}

export const getCombinarPares = async (req, res, next) => {
  try {
    const { deckId } = req.params
    const { quantidade } = req.query
    const resultado = await exercicioService.gerarCombinarPares(deckId, req.user.id, quantidade)
    res.json(resultado)
  } catch (error) {
    next(error)
  }
}
