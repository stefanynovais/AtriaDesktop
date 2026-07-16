// Service de flashcards.
// Cada flashcard pertence a um deck. Validamos a posse do deck via ownerId
// para garantir que um usuário não mexa em cards de deck alheio.

import { prisma } from '../config/database.js'

const verificarPosseDoDeck = async (deckId, ownerId) => {
  const deck = await prisma.deck.findFirst({
    where: { id: Number(deckId), ownerId },
  })
  if (!deck) {
    throw new Error('Deck não encontrado')
  }
  return deck
}

export const flashcardService = {
  getByDeck: async (deckId, ownerId) => {
    await verificarPosseDoDeck(deckId, ownerId)
    return prisma.flashcard.findMany({
      where: { deckId: Number(deckId) },
    })
  },

  create: async (flashcardData, ownerId) => {
    await verificarPosseDoDeck(flashcardData.deckId, ownerId)
    return prisma.flashcard.create({
      data: {
        front: flashcardData.front,
        back: flashcardData.back,
        deckId: Number(flashcardData.deckId),
      },
    })
  },

  update: async (id, flashcardData, ownerId) => {
    const flashcard = await prisma.flashcard.findUnique({ where: { id: Number(id) } })
    if (!flashcard) {
      throw new Error('Flashcard não encontrado')
    }
    await verificarPosseDoDeck(flashcard.deckId, ownerId)

    return prisma.flashcard.update({
      where: { id: Number(id) },
      data: {
        front: flashcardData.front,
        back: flashcardData.back,
      },
    })
  },

  delete: async (id, ownerId) => {
    const flashcard = await prisma.flashcard.findUnique({ where: { id: Number(id) } })
    if (!flashcard) {
      throw new Error('Flashcard não encontrado')
    }
    await verificarPosseDoDeck(flashcard.deckId, ownerId)

    await prisma.flashcard.delete({ where: { id: Number(id) } })
  },
}
