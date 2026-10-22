import { preferenciasService } from '../services/preferencias.service.js';

export const getModoLetras = async (req, res, next) => {
  try {
    const modoLetras = await preferenciasService.getModoLetras(req.user.id);
    res.json({ modoLetras });
  } catch (error) {
    next(error);
  }
};

export const putModoLetras = async (req, res, next) => {
  try {
    const modo = await preferenciasService.setModoLetras(req.user.id, req.body?.modo);
    res.json({ modoLetras: modo });
  } catch (error) {
    next(error);
  }
};
