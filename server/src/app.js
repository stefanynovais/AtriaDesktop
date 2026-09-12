// app.js
//
// Configura o app Express (middlewares + rotas), mas NÃO chama app.listen().
// Isso existe separado do server.js justamente pra permitir que os testes
// (Vitest + Supertest) importem o app e simulem requisições HTTP sem
// precisar abrir uma porta de rede de verdade.

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import routes from './routes/index.js'
import { errorHandler } from './middlewares/error.middleware.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use('/api', routes)

app.use(errorHandler)

export default app