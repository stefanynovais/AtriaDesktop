// Preferências do usuário (modo de letras da alfabetização).
import { prisma } from '../config/database.js';

const MODOS_VALIDOS = ['MAIUSCULAS', 'MISTO'];

export const preferenciasService = {
  getModoLetras: async (userId) => {
    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      select: { modoLetras: true },
    });
    return usuario?.modoLetras ?? null;
  },

  setModoLetras: async (userId, modo) => {
    if (!MODOS_VALIDOS.includes(modo)) {
      throw new Error('Modo de letras inválido');
    }
    await prisma.user.update({ where: { id: userId }, data: { modoLetras: modo } });
    return modo;
  },
};
