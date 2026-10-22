// Regras de acesso à leitura de baralhos.
// Quem pode LER um baralho: o dono dele OU um aluno de uma turma à qual o
// baralho foi vinculado. Editar e apagar continua sendo só do dono.

export const condicaoLeituraDeck = (userId) => ({
  OR: [
    { ownerId: userId },
    { turmas: { some: { turma: { membros: { some: { userId } } } } } },
  ],
})
