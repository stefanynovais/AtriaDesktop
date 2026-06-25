import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import apiRouter from './routes/index.js'
import { errorHandler } from './middlewares/error.middleware.js'

// Carrega variáveis de ambiente do arquivo .env
dotenv.config()

const app = express()
const port = process.env.PORT || 4000

// Middlewares globais do servidor
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Rota base para a API
app.use('/api', apiRouter)

// Tratamento centralizado de erros
app.use(errorHandler)

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`)
})
