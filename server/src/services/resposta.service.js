// Service de respostas individuais por flashcard.
// Cada vez que o aluno responde UM card (em qualquer modo de exercício),
// isso é registrado aqui. É a base pra saber quais palavras foram
// aprendidas e quais precisam de revisão.

import { prisma } from '../config/database.js'

export const respostaService = {
  registrar: async (flashcardId, acertou, userId) => {
    return prisma.respostaFlashcard.create({
      data: {
        userId,
        flashcardId: Number(flashcardId),
        acertou: Boolean(acertou),
      },
    })
  },
}
