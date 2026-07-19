import express from 'express';
import {
  getEstatisticasAluno,
  getEstatisticasTurma,
} from '../controllers/estatistica.controller.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/aluno', getEstatisticasAluno);
router.get('/turma/:id', requireRole('PROFESSOR'), getEstatisticasTurma);

export default router;
