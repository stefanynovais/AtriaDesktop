import express from 'express'
import {
  getMinhasTurmas,
  getTurmaById,
  createTurma,
  entrarNaTurma,
  vincularDeck,
} from '../controllers/turma.controller.js'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/', getMinhasTurmas)
router.get('/:id', getTurmaById)
router.post('/', requireRole('PROFESSOR'), createTurma)
router.post('/entrar', entrarNaTurma)
router.post('/:id/decks', requireRole('PROFESSOR'), vincularDeck)

export default router
