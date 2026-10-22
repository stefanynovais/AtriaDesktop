// Modo de letras (alfabetização): salva na conta e aplica no site inteiro.
import api from './api';

export const MAIUSCULAS = 'MAIUSCULAS';
export const MISTO = 'MISTO';

const CHAVE = 'atria_modo_letras';

// Liga/desliga a classe no body. Com modo null, remove a classe.
export const aplicarModoLetras = (modo) => {
  document.body.classList.toggle('modo-maiusculas', modo === MAIUSCULAS);
};

// Último modo conhecido neste navegador (para aplicar na hora, sem piscar)
export const lerModoSalvo = () => {
  try {
    return localStorage.getItem(CHAVE);
  } catch {
    return null;
  }
};

const guardarModo = (modo) => {
  try {
    localStorage.setItem(CHAVE, modo);
  } catch {
    /* navegador sem armazenamento: segue sem o cache */
  }
};

export const buscarModoLetras = async () => {
  const resposta = await api.get('/preferencias/letras');
  const modo = resposta.data.modoLetras ?? null;
  if (modo) guardarModo(modo);
  return modo;
};

export const salvarModoLetras = async (modo) => {
  await api.put('/preferencias/letras', { modo });
  guardarModo(modo);
  aplicarModoLetras(modo);
};
