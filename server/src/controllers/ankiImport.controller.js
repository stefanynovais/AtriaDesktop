import { ankiImportService } from '../services/ankiImport.service.js';

export const importarApkg = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'Nenhum arquivo .apkg foi enviado' });
    }

    const titulo = req.body.titulo || req.file.originalname.replace('.apkg', '');

    const resultado = await ankiImportService.importarApkg(req.file.buffer, titulo, req.user.id);

    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};
