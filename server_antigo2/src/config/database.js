import { PrismaClient } from '@prisma/client'
import { env } from './env.js'

// Inicializa o cliente Prisma para conexão ao banco SQL.
// Ele será reutilizado por toda a aplicação.
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.databaseUrl,
    },
  },
})
