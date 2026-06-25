import dotenv from 'dotenv'

dotenv.config()

// Carrega variáveis de ambiente do .env e expõe um objeto de configuração.
export const env = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/atria',
  nodeEnv: process.env.NODE_ENV || 'development',
}
