// Configuração do quiz — ajuste esses valores antes do dia da Bentotec.

export const API_URL = 'http://localhost:4000/api';
export const EMAIL_PROFESSOR = 'professor@teste.com';
export const SENHA = '123456';

export const DECK_ID = 2; // id do deck "Quiz Bentotec - Inglês" (o seed mostra "Deck id: N" no final)
export const TEMPO_LIMITE = 10; // segundos (precisa ser igual ao do ESP32)
export const VELOCIDADE_SERIAL = 9600; // precisa ser igual ao Serial.begin() do ESP32
export const SEM_SINAL_MS = 4000; // sem notícia do dispositivo por esse tempo, mostra um aviso

// Quanto tempo o visor do dispositivo fica mostrando "CORRETA!" / "ERRADA!" / "TEMPO ESGOTADO!".
// Precisa ser igual ao TEMPO_RESULTADO_MS do código do Arduino. O site espera esse tempo antes de
// mandar a próxima pergunta, pra tela e o dispositivo ficarem sempre juntos.
export const TEMPO_RESULTADO_DISPOSITIVO_MS = 4000;
