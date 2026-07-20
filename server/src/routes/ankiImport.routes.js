import express from 'express';
import multer from 'multer';
import { importarApkg } from '../controllers/ankiImport.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// guarda o arquivo em memória (buffer), não salva no disco —
// o .apkg é processado e descartado na hora, não precisa persistir o arquivo original
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // limite de 20MB por arquivo
});

router.use(authMiddleware);

// campo do formulário precisa se chamar "arquivo"
router.post('/apkg', upload.single('arquivo'), importarApkg);

export default router;
