import express from 'express'
import { registrarResposta } from '../controllers/resposta.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(authMiddleware)

router.post('/', registrarResposta)

export default router
