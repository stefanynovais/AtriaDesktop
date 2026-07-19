// Service de decks.
// Contém regras de negócio e acesso ao banco SQL via Prisma.

import { prisma } from '../config/database.js';

export const deckService = {
  // "search" é opcional: se vier preenchido, filtra por título (sem
  // diferenciar maiúscula/minúscula). Se não vier, devolve todos os decks.
  getAllDecks: async (ownerId, search) => {
    return prisma.deck.findMany({
      where: {
        ownerId,
        ...(search ? { title: { contains: search, mode: 'insensitive' } } : {}),
      },
      include: { flashcards: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  getDeckById: async (id, ownerId) => {
    const deck = await prisma.deck.findFirst({
      where: { id: Number(id), ownerId },
      include: { flashcards: true },
    });
    if (!deck) {
      throw new Error('Deck não encontrado');
    }
    return deck;
  },

  createDeck: async (deckData, ownerId) => {
    return prisma.deck.create({
      data: {
        title: deckData.title,
        origem: deckData.origem,
        ownerId,
        pastaId: deckData.pastaId ?? null,
      },
    });
  },

  updateDeck: async (id, deckData, ownerId) => {
    // garante que o deck pertence ao usuário antes de atualizar
    await deckService.getDeckById(id, ownerId);

    return prisma.deck.update({
      where: { id: Number(id) },
      data: {
        title: deckData.title,
        origem: deckData.origem,
        pastaId: deckData.pastaId ?? null,
      },
    });
  },

  deleteDeck: async (id, ownerId) => {
    // garante que o deck pertence ao usuário antes de apagar
    await deckService.getDeckById(id, ownerId);

    await prisma.deck.delete({
      where: { id: Number(id) },
    });
  },
};
