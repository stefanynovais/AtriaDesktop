// dispositivo.js
//
// Conversa com o ESP32 pela USB (Web Serial API — só Chrome/Edge, no computador).
//
// Protocolo:
//   Site -> ESP32 :  Q;<1|0>;<linha 1>;<linha 2>      (1 = o par está certo)
//   ESP32 -> Site :  PERGUNTA RECEBIDA
//                    TIMER: <10..0>                    (a cada segundo)
//                    R;V;<1|0>  /  R;F;<1|0>           (botão apertado; 1 = acertou)
//                    R;TIMEOUT;0                       (acabou o tempo)

export const suportaUSB = () => 'serial' in navigator;

// Texto que vai para o dispositivo: sem acento (o visor LCD não tem), sem ";" nem quebra de
// linha (são separadores do protocolo) e no máximo 16 caracteres (largura do LCD).
const paraDispositivo = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[;\r\n]/g, ' ')
    .trim()
    .slice(0, 16);

export const montarMensagemPergunta = ({ correto, front, backMostrado }) =>
  `Q;${correto ? '1' : '0'};${paraDispositivo(front)};${paraDispositivo(backMostrado)}`;

// Lê tudo que o ESP32 manda, linha por linha, e entrega cada linha pra função aoReceberLinha.
async function lerLinhas(leitor, aoReceberLinha) {
  let buffer = '';
  try {
    while (true) {
      const { value, done } = await leitor.read();
      if (done) break;
      buffer += value;

      let quebra = buffer.indexOf('\n');
      while (quebra >= 0) {
        const linha = buffer.slice(0, quebra).trim();
        buffer = buffer.slice(quebra + 1);
        if (linha) aoReceberLinha(linha);
        quebra = buffer.indexOf('\n');
      }
    }
  } catch (erro) {
    console.error('Erro lendo a serial:', erro);
  }
}

// Abre a janela do navegador pra escolher a porta, conecta e devolve { enviar, desconectar }.
// Se a pessoa fechar a janela sem escolher, lança um erro com name === 'NotFoundError'.
export async function conectarDispositivo({ velocidade, aoReceberLinha }) {
  const porta = await navigator.serial.requestPort();
  await porta.open({ baudRate: velocidade });

  const codificador = new TextEncoderStream();
  const escritaFechada = codificador.readable.pipeTo(porta.writable);
  const escritor = codificador.writable.getWriter();

  const decodificador = new TextDecoderStream();
  const leituraFechada = porta.readable.pipeTo(decodificador.writable);
  const leitor = decodificador.readable.getReader();

  lerLinhas(leitor, aoReceberLinha);

  let encerrado = false;
  return {
    enviar: (mensagem) => escritor.write(`${mensagem}\n`),

    // solta a porta (se não soltar, ela fica "presa" até recarregar a página)
    desconectar: async () => {
      if (encerrado) return;
      encerrado = true;
      try {
        await leitor.cancel();
      } catch {
        /* já encerrado */
      }
      await leituraFechada.catch(() => {});
      try {
        await escritor.close();
      } catch {
        /* já encerrado */
      }
      await escritaFechada.catch(() => {});
      try {
        await porta.close();
      } catch {
        /* já fechada */
      }
    },
  };
}

// Avisa quando o cabo é puxado. Devolve uma função que cancela o aviso.
export function aoCaboDesconectar(funcao) {
  if (!suportaUSB()) return () => {};
  navigator.serial.addEventListener('disconnect', funcao);
  return () => navigator.serial.removeEventListener('disconnect', funcao);
}
