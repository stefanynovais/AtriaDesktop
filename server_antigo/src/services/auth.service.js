// Service de autenticação.
// Contém lógica de login e cadastro e faz acesso ao banco SQL via Prisma.

import { prisma } from '../config/database.js'

export const authService = {
  login: async (credentials) => {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    })

    if (!user || user.password !== credentials.password) {
      throw new Error('Credenciais inválidas')
    }

    return { message: 'Login realizado com sucesso', user: { email: user.email, name: user.name } }
  },

  register: async (userData) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    })

    if (existingUser) {
      throw new Error('Usuário já existe')
    }

    const createdUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      },
    })

    return { message: 'Cadastro realizado com sucesso', user: { email: createdUser.email, name: createdUser.name } }
  },
}
