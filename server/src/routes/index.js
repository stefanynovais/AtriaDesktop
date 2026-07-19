import express from 'express';
import authRoutes from './auth.routes.js';
import deckRoutes from './deck.routes.js';
import flashcardRoutes from './flashcard.routes.js';
import turmaRoutes from './turma.routes.js';
import estatisticaRoutes from './estatistica.routes.js';
import exercicioRoutes from './exercicio.routes.js';
import respostaRoutes from './resposta.routes.js';
import streakRoutes from './streak.routes.js';

// Cria o roteador principal da API e monta as rotas de cada recurso
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/decks', deckRoutes);
router.use('/flashcards', flashcardRoutes);
router.use('/turmas', turmaRoutes);
router.use('/estatisticas', estatisticaRoutes);
router.use('/exercicios', exercicioRoutes);
router.use('/respostas', respostaRoutes);
router.use('/streak', streakRoutes);

export default router;
