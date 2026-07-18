import express from 'express'
import {
  registrarResultado,
  getEstatisticasAluno,
  getEstatisticasTurma,
} from '../controllers/estatistica.controller.js'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/aluno', getEstatisticasAluno)
router.get('/turma/:id', requireRole('PROFESSOR'), getEstatisticasTurma)
router.post('/', registrarResultado)

export default router
