// Service de autenticação.
// Contém lógica de login e cadastro, hash de senha e emissão de token JWT.

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/database.js'
import { env } from '../config/env.js'

const gerarToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  )
}

const paraDTO = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
})

export const authService = {
  login: async (credentials) => {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    })

    if (!user) {
      throw new Error('Credenciais inválidas')
    }

    const senhaValida = await bcrypt.compare(credentials.password, user.password)
    if (!senhaValida) {
      throw new Error('Credenciais inválidas')
    }

    const token = gerarToken(user)
    return { message: 'Login realizado com sucesso', token, user: paraDTO(user) }
  },

  register: async (userData) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    })

    if (existingUser) {
      throw new Error('Usuário já existe')
    }

    const senhaHash = await bcrypt.hash(userData.password, 10)

    const createdUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: senhaHash,
        role: userData.role === 'PROFESSOR' ? 'PROFESSOR' : 'COMUM',
      },
    })

    const token = gerarToken(createdUser)
    return { message: 'Cadastro realizado com sucesso', token, user: paraDTO(createdUser) }
  },

  getProfile: async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new Error('Usuário não encontrado')
    }
    return paraDTO(user)
  },
}
