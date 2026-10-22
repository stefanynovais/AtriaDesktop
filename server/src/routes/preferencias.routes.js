import express from 'express';
import { getModoLetras, putModoLetras } from '../controllers/preferencias.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/letras', getModoLetras);
router.put('/letras', putModoLetras);

export default router;
