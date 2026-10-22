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

// Turma do professor logado (lança erro se não for dele ou não existir)
const buscarTurmaDoProfessor = async (turmaId, professorId) => {
  const turma = await prisma.turma.findFirst({
    where: { id: Number(turmaId), professorId },
    include: { decks: true },
  });
  if (!turma) {
    throw new Error('Turma não encontrada');
  }
  return turma;
};

// Respostas de um aluno apenas nos flashcards dos baralhos da turma
const respostasDaTurma = (userId, deckIds) =>
  prisma.respostaFlashcard.findMany({
    where: { userId, flashcard: { deckId: { in: deckIds } } },
    include: { flashcard: { select: { id: true, front: true, back: true, deckId: true } } },
    orderBy: { respondidoEm: 'desc' },
  });

export const estatisticaService = {
  getEstatisticasAluno: async (userId) => {
    const respostas = await prisma.respostaFlashcard.findMany({
      where: { userId },
      include: { flashcard: { select: { id: true, front: true, back: true } } },
      orderBy: { respondidoEm: 'desc' },
    });

    return calcularEstatisticasDeUsuario(respostas);
  },

  // Só o professor DONO da turma pode ver. Conta só as respostas dos
  // baralhos vinculados à turma (não todo o histórico do aluno).
  getEstatisticasTurma: async (turmaId, professorId) => {
    const turma = await buscarTurmaDoProfessor(turmaId, professorId);
    const deckIds = turma.decks.map((td) => td.deckId);

    const membros = await prisma.turmaMembro.findMany({
      where: { turmaId: turma.id },
      include: { user: { select: { id: true, name: true } } },
    });

    const estatisticasPorAluno = await Promise.all(
      membros.map(async (membro) => {
        const respostas = await respostasDaTurma(membro.userId, deckIds);
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

  // Detalhe de um aluno dentro da turma: cada resposta, com o flashcard
  getRespostasAlunoNaTurma: async (turmaId, professorId, alunoId) => {
    const turma = await buscarTurmaDoProfessor(turmaId, professorId);
    const deckIds = turma.decks.map((td) => td.deckId);

    const vinculo = await prisma.turmaMembro.findUnique({
      where: { turmaId_userId: { turmaId: turma.id, userId: Number(alunoId) } },
      include: { user: { select: { id: true, name: true } } },
    });
    if (!vinculo) {
      throw new Error('Aluno não encontrado nesta turma');
    }

    const respostas = await respostasDaTurma(Number(alunoId), deckIds);

    return {
      aluno: vinculo.user,
      respostas: respostas.map((r) => ({
        respondidoEm: r.respondidoEm,
        acertou: r.acertou,
        front: r.flashcard.front,
        back: r.flashcard.back,
        revisao: r.revisao,
      })),
    };
  },
};
