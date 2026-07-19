// Service de Streak (sequência de dias seguidos com atividade).
// É atualizado toda vez que o aluno responde um flashcard (ver resposta.service.js).

import { prisma } from '../config/database.js';

// zera hora/minuto/segundo, deixando só a data (pra comparar dias, não horários)
const apenasData = (data) => {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
};

const diferencaEmDias = (dataMaisNova, dataMaisAntiga) => {
  const umDiaEmMs = 1000 * 60 * 60 * 24;
  return Math.round((dataMaisNova.getTime() - dataMaisAntiga.getTime()) / umDiaEmMs);
};

export const streakService = {
  // Chamada sempre que o usuário faz alguma atividade (responder um flashcard).
  // Atualiza e devolve o streak já recalculado.
  atualizarAposAtividade: async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const hoje = apenasData(new Date());

    let novoStreak;

    if (!user.lastActivityDate) {
      // primeira atividade registrada de todas
      novoStreak = 1;
    } else {
      const ultimaData = apenasData(user.lastActivityDate);
      const diasDeDiferenca = diferencaEmDias(hoje, ultimaData);

      if (diasDeDiferenca === 0) {
        // já teve atividade hoje, mantém o streak como está
        novoStreak = user.currentStreak;
      } else if (diasDeDiferenca === 1) {
        // atividade em dias consecutivos, incrementa
        novoStreak = user.currentStreak + 1;
      } else {
        // ficou mais de 1 dia sem atividade, quebra a sequência
        novoStreak = 1;
      }
    }

    const atualizado = await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: novoStreak,
        lastActivityDate: hoje,
      },
    });

    return {
      currentStreak: atualizado.currentStreak,
      lastActivityDate: atualizado.lastActivityDate,
    };
  },

  getStreak: async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentStreak: true, lastActivityDate: true },
    });
    return user;
  },
};
