// Service de estatísticas.
// Fonte única de verdade: RespostaFlashcard (uma linha por resposta
// individual do aluno a um flashcard). Todo o resto (total de acertos,
// aproveitamento, palavras aprendidas/para revisar) é CALCULADO a partir
// dela — não existe mais um registro "resumido" separado.

import { prisma } from '../config/database.js';

// Agrupa as respostas de um usuário e devolve os números já calculados
const calcularEstatisticasDeUsuario = (respostas) => {
  const totalRespostas = respostas.length;
  const totalAcertos = respostas.filter((r) => r.acertou).length;
  const totalErros = totalRespostas - totalAcertos;
  const aproveitamento =
    totalRespostas > 0 ? Number(((totalAcertos / totalRespostas) * 100).toFixed(1)) : 0;

  // fica só com a resposta mais recente de cada flashcard
  // (respostas já devem vir ordenadas da mais nova pra mais antiga)
  const ultimaRespostaPorFlashcard = new Map();
  for (const resposta of respostas) {
    if (!ultimaRespostaPorFlashcard.has(resposta.flashcardId)) {
      ultimaRespostaPorFlashcard.set(resposta.flashcardId, resposta);
    }
  }

  const palavrasAprendidas = [];
  const palavrasParaRevisar = [];

  for (const resposta of ultimaRespostaPorFlashcard.values()) {
    const alvo = resposta.acertou ? palavrasAprendidas : palavrasParaRevisar;
    alvo.push({
      flashcardId: resposta.flashcard.id,
      front: resposta.flashcard.front,
      back: resposta.flashcard.back,
    });
  }

  return {
    totalRespostas,
    totalAcertos,
    totalErros,
    aproveitamento,
    numeroPalavrasAprendidas: palavrasAprendidas.length,
    numeroPalavrasParaRevisar: palavrasParaRevisar.length,
    palavrasAprendidas,
    palavrasParaRevisar,
  };
};

export const estatisticaService = {
  getEstatisticasAluno: async (userId) => {
    const respostas = await prisma.respostaFlashcard.findMany({
      where: { userId },
      include: { flashcard: { select: { id: true, front: true, back: true } } },
      orderBy: { respondidoEm: 'desc' },
    });

    return calcularEstatisticasDeUsuario(respostas);
  },

  getEstatisticasTurma: async (turmaId) => {
    const membros = await prisma.turmaMembro.findMany({
      where: { turmaId: Number(turmaId) },
      include: { user: { select: { id: true, name: true } } },
    });

    const estatisticasPorAluno = await Promise.all(
      membros.map(async (membro) => {
        const respostas = await prisma.respostaFlashcard.findMany({
          where: { userId: membro.userId },
          include: { flashcard: { select: { id: true, front: true, back: true } } },
          orderBy: { respondidoEm: 'desc' },
        });

        const stats = calcularEstatisticasDeUsuario(respostas);

        return {
          aluno: membro.user,
          totalRespostas: stats.totalRespostas,
          aproveitamento: stats.aproveitamento,
          numeroPalavrasAprendidas: stats.numeroPalavrasAprendidas,
          numeroPalavrasParaRevisar: stats.numeroPalavrasParaRevisar,
        };
      }),
    );

    return estatisticasPorAluno;
  },
};
