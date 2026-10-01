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

// Formata uma data como "YYYY-MM-DD", usando os componentes LOCAIS (não UTC)
// — evita que uma atividade feita tarde da noite "escorregue" pro dia
// seguinte só por causa do fuso horário.
const paraDataLocal = (data) => {
  const d = new Date(data);
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
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

    // a "maior streak" só sobe, nunca desce — mesmo quando a atual quebra
    const novoLongest = Math.max(user.longestStreak, novoStreak);

    const atualizado = await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: novoStreak,
        longestStreak: novoLongest,
        lastActivityDate: hoje,
      },
    });

    return {
      currentStreak: atualizado.currentStreak,
      longestStreak: atualizado.longestStreak,
      lastActivityDate: atualizado.lastActivityDate,
    };
  },

  getStreak: async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentStreak: true, longestStreak: true, lastActivityDate: true },
    });
    return user;
  },

  // ------------------------------------------------------------
  // NOVO: devolve os dias (só a data, sem hora) em que o usuário teve
  // pelo menos uma atividade, dentro dos últimos "meses" meses — é o que
  // alimenta o calendário tipo "GitHub" no frontend.
  // ------------------------------------------------------------
  getCalendarioAtividade: async (userId, meses = 3) => {
    const dataLimite = new Date();
    dataLimite.setMonth(dataLimite.getMonth() - Number(meses));
    dataLimite.setHours(0, 0, 0, 0);

    const respostas = await prisma.respostaFlashcard.findMany({
      where: {
        userId,
        respondidoEm: { gte: dataLimite },
      },
      select: { respondidoEm: true },
    });

    // reduz pra uma lista de dias ÚNICOS (um dia com 10 respostas conta
    // como 1 dia de atividade, não 10)
    const diasUnicos = new Set(respostas.map((r) => paraDataLocal(r.respondidoEm)));

    return {
      dias: [...diasUnicos].sort(), // ex: ["2026-07-03", "2026-07-04", ...]
    };
  },
}