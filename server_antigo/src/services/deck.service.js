// Service de decks.
// Contém regras de negócio e acesso ao banco SQL via Prisma.

import { prisma } from '../config/database.js'

export const deckService = {
  getAllDecks: async () => {
    return prisma.deck.findMany()
  },

  getDeckById: async (id) => {
    const deck = await prisma.deck.findUnique({
      where: { id: Number(id) },
    })
    if (!deck) {
      throw new Error('Deck não encontrado')
    }
    return deck
  },

  createDeck: async (deckData) => {
    return prisma.deck.create({
      data: {
        title: deckData.title,
        cards: deckData.cards,
      },
    })
  },

  updateDeck: async (id, deckData) => {
    return prisma.deck.update({
      where: { id: Number(id) },
      data: {
        title: deckData.title,
        cards: deckData.cards,
      },
    })
  },

  deleteDeck: async (id) => {
    await prisma.deck.delete({
      where: { id: Number(id) },
    })
  },
}
