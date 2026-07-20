// Service de turmas.
// Um professor cria turmas e recebe um código de acesso gerado automaticamente.
// Alunos entram na turma informando esse código.

import { prisma } from '../config/database.js';

const gerarCodigo = () => {
  // código simples de 6 caracteres alfanuméricos, ex: "K3F9QZ"
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const turmaService = {
  // Lista turmas relevantes para o usuário logado:
  // - se professor: turmas que ele criou
  // - se aluno: turmas em que está inscrito
  getMinhasTurmas: async (user) => {
    if (user.role === 'PROFESSOR') {
      return prisma.turma.findMany({
        where: { professorId: user.id },
        include: { membros: true, decks: { include: { deck: true } } },
      });
    }

    return prisma.turma.findMany({
      where: { membros: { some: { userId: user.id } } },
      include: { decks: { include: { deck: true } } },
    });
  },

  getTurmaById: async (id) => {
    const turma = await prisma.turma.findUnique({
      where: { id: Number(id) },
      include: {
        membros: { include: { user: { select: { id: true, name: true, email: true } } } },
        decks: { include: { deck: true } },
      },
    });
    if (!turma) {
      throw new Error('Turma não encontrada');
    }
    return turma;
  },

  createTurma: async (turmaData, professorId) => {
    // garante um código único, tentando de novo em caso de colisão rara
    let codigo = gerarCodigo();
    let existente = await prisma.turma.findUnique({ where: { codigo } });
    while (existente) {
      codigo = gerarCodigo();
      existente = await prisma.turma.findUnique({ where: { codigo } });
    }

    return prisma.turma.create({
      data: {
        nome: turmaData.nome,
        codigo,
        professorId,
      },
    });
  },

  updateTurma: async (turmaId, turmaData, professorId) => {
    // garante que a turma existe e pertence a esse professor antes de atualizar
    const turma = await prisma.turma.findFirst({
      where: { id: Number(turmaId), professorId },
    });
    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    return prisma.turma.update({
      where: { id: Number(turmaId) },
      data: { nome: turmaData.nome },
    });
  },

  entrarNaTurma: async (codigo, userId) => {
    const turma = await prisma.turma.findUnique({ where: { codigo } });
    if (!turma) {
      throw new Error('Código de turma inválido');
    }

    const jaMembro = await prisma.turmaMembro.findUnique({
      where: { turmaId_userId: { turmaId: turma.id, userId } },
    });
    if (jaMembro) {
      throw new Error('Você já está nesta turma');
    }

    await prisma.turmaMembro.create({
      data: { turmaId: turma.id, userId },
    });

    return turma;
  },

  vincularDeck: async (turmaId, deckId, professorId) => {
    const turma = await prisma.turma.findFirst({
      where: { id: Number(turmaId), professorId },
    });
    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    return prisma.turmaDeck.create({
      data: { turmaId: Number(turmaId), deckId: Number(deckId) },
    });
  },

  deleteTurma: async (turmaId, professorId) => {
    // garante que a turma existe e pertence a esse professor antes de apagar
    const turma = await prisma.turma.findFirst({
      where: { id: Number(turmaId), professorId },
    });
    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    // apaga membros e vínculos de deck primeiro (o onDelete: Cascade do
    // schema já faria isso sozinho, mas deixamos explícito aqui por clareza)
    await prisma.turma.delete({
      where: { id: Number(turmaId) },
    });
  },
};
