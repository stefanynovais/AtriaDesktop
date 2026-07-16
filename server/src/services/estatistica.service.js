// Service de estatísticas.
// Registra os resultados de exercícios e calcula desempenho agregado
// por aluno ou por turma.

import { prisma } from '../config/database.js'

export const estatisticaService = {
  registrarResultado: async (resultadoData, userId) => {
    return prisma.resultadoExercicio.create({
      data: {
        userId,
        deckId: Number(resultadoData.deckId),
        totalCards: resultadoData.totalCards,
        acertos: resultadoData.acertos,
        erros: resultadoData.erros,
      },
    })
  },

  getEstatisticasAluno: async (userId) => {
    const resultados = await prisma.resultadoExercicio.findMany({
      where: { userId },
      include: { deck: { select: { title: true } } },
      orderBy: { realizadoEm: 'desc' },
    })

    const totalExercicios = resultados.length
    const totalAcertos = resultados.reduce((soma, r) => soma + r.acertos, 0)
    const totalCards = resultados.reduce((soma, r) => soma + r.totalCards, 0)
    const aproveitamento = totalCards > 0 ? Number(((totalAcertos / totalCards) * 100).toFixed(1)) : 0

    return { totalExercicios, totalAcertos, totalCards, aproveitamento, resultados }
  },

  getEstatisticasTurma: async (turmaId) => {
    const membros = await prisma.turmaMembro.findMany({
      where: { turmaId: Number(turmaId) },
      include: { user: { select: { id: true, name: true } } },
    })

    const estatisticasPorAluno = await Promise.all(
      membros.map(async (membro) => {
        const resultados = await prisma.resultadoExercicio.findMany({
          where: { userId: membro.userId },
        })
        const totalAcertos = resultados.reduce((soma, r) => soma + r.acertos, 0)
        const totalCards = resultados.reduce((soma, r) => soma + r.totalCards, 0)
        const aproveitamento = totalCards > 0 ? Number(((totalAcertos / totalCards) * 100).toFixed(1)) : 0

        return {
          aluno: membro.user,
          totalExercicios: resultados.length,
          aproveitamento,
        }
      })
    )

    return estatisticasPorAluno
  },
}
