import { deckService } from '../services/deck.service.js'

// Controller que responde às requisições de decks.
// Ele recebe a requisição, chama o serviço apropriado e envia a resposta.
// Todas as rotas exigem usuário autenticado (req.user vem do authMiddleware).

export const getAllDecks = async (req, res, next) => {
  try {
    const decks = await deckService.getAllDecks(req.user.id)
    res.json(decks)
  } catch (error) {
    next(error)
  }
}

export const getDeckById = async (req, res, next) => {
  try {
    const { id } = req.params
    const deck = await deckService.getDeckById(id, req.user.id)
    res.json(deck)
  } catch (error) {
    next(error)
  }
}

export const createDeck = async (req, res, next) => {
  try {
    const deckData = req.body
    const newDeck = await deckService.createDeck(deckData, req.user.id)
    res.status(201).json(newDeck)
  } catch (error) {
    next(error)
  }
}

export const updateDeck = async (req, res, next) => {
  try {
    const { id } = req.params
    const deckData = req.body
    const updatedDeck = await deckService.updateDeck(id, deckData, req.user.id)
    res.json(updatedDeck)
  } catch (error) {
    next(error)
  }
}

export const deleteDeck = async (req, res, next) => {
  try {
    const { id } = req.params
    await deckService.deleteDeck(id, req.user.id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
