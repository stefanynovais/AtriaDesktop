// Service de respostas individuais por flashcard.
// Cada vez que o aluno responde UM card (em qualquer modo de exercício),
// isso é registrado aqui. Também é o gatilho que atualiza a Streak do dia.

import { prisma } from '../config/database.js';
import { streakService } from './streak.service.js';

export const respostaService = {
  registrar: async (flashcardId, acertou, userId) => {
    const resposta = await prisma.respostaFlashcard.create({
      data: {
        userId,
        flashcardId: Number(flashcardId),
        acertou: Boolean(acertou),
      },
    });

    const streakAtualizado = await streakService.atualizarAposAtividade(userId);

    return { ...resposta, streak: streakAtualizado };
  },
};
