import { useState, useEffect, useRef, useCallback } from 'react';
import {
  FaUsb,
  FaVolumeUp,
  FaVolumeMute,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassEnd,
} from 'react-icons/fa';
import LogoAtria from '../../components/LogoAtria/LogoAtria';
import {
  DECK_ID,
  SEM_SINAL_MS,
  TEMPO_LIMITE,
  TEMPO_RESULTADO_DISPOSITIVO_MS,
  VELOCIDADE_SERIAL,
} from '../../config';
import { chamarAPI, fazerLogin, mensagemDaFalha } from '../../services/api';
import {
  aoCaboDesconectar,
  conectarDispositivo,
  montarMensagemPergunta,
  suportaUSB,
} from '../../services/dispositivo';
import './QuizBentotec.css';

// Quiz físico (dia da Bentotec): a pergunta aparece na tela e a resposta é dada nos botões
// do dispositivo (ESP32) ligado por USB. O protocolo está descrito em services/dispositivo.js.

const NIVEIS = [
  { valor: 'FACIL', titulo: 'Fácil', descricao: 'Começar leve', classe: 'facil' },
  { valor: 'MEDIO', titulo: 'Médio', descricao: 'Desafio equilibrado', classe: 'medio' },
  { valor: 'DIFICIL', titulo: 'Difícil', descricao: 'Modo desafio', classe: 'dificil' },
];

const NOMES_NIVEL = { FACIL: 'FÁCIL', MEDIO: 'MÉDIO', DIFICIL: 'DIFÍCIL' };

const statusDoServidor = (login) =>
  login.ok ? { texto: 'Servidor conectado.', tipo: 'ok' } : { texto: mensagemDaFalha(login), tipo: 'erro' };

export default function QuizBentotec() {
  const [etapa, setEtapa] = useState('usb'); // usb | nivel | pergunta | resultado | tempo-esgotado | erro
  const [statusConexao, setStatusConexao] = useState({ texto: 'Aguardando conexão...', tipo: '' });
  const [statusApi, setStatusApi] = useState({ texto: 'Verificando o servidor...', tipo: '' });
  const [conectando, setConectando] = useState(false);
  const [modoTeste, setModoTeste] = useState(false);
  const [nivelAtual, setNivelAtual] = useState('');
  const [pergunta, setPergunta] = useState(null);
  const [aguardandoDispositivo, setAguardandoDispositivo] = useState(false);
  const [segundos, setSegundos] = useState(TEMPO_LIMITE);
  const [placar, setPlacar] = useState({ acertos: 0, total: 0 });
  const [placarVisivel, setPlacarVisivel] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [mensagemErro, setMensagemErro] = useState('');
  const [somLigado, setSomLigado] = useState(true);
  const [semSinal, setSemSinal] = useState(false);

  // Refs: valores que os "ouvintes" (leitura da USB, cronômetros) precisam enxergar sempre
  // atualizados, sem depender do ciclo de renderização do React.
  const etapaRef = useRef('usb');
  const perguntaRef = useRef(null);
  const nivelRef = useRef('');
  const modoTesteRef = useRef(false);
  const somRef = useRef(true);
  const respondidoRef = useRef(false);
  const requisicaoRef = useRef(0);
  const ultimaMensagemRef = useRef('');
  const dispositivoRef = useRef(null);
  const audioRef = useRef(null);
  const cronometroRef = useRef(null);
  const ultimaRespostaEmRef = useRef(0);
  const semSinalRef = useRef(null);

  const mudarEtapa = useCallback((nova) => {
    etapaRef.current = nova;
    setEtapa(nova);
  }, []);

  // ---------------------------------------------------------------- áudio
  const garantirAudio = useCallback(() => {
    if (!somRef.current) return null;
    if (!audioRef.current) {
      const Contexto = window.AudioContext || window.webkitAudioContext;
      if (!Contexto) return null;
      audioRef.current = new Contexto();
    }
    if (audioRef.current.state === 'suspended') audioRef.current.resume();
    return audioRef.current;
  }, []);

  const tocarBeep = useCallback(
    (frequencia, duracaoMs) => {
      const ctx = garantirAudio();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const ganho = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = frequencia;
      const agora = ctx.currentTime;
      ganho.gain.setValueAtTime(0.2, agora);
      ganho.gain.exponentialRampToValueAtTime(0.001, agora + duracaoMs / 1000);
      osc.connect(ganho);
      ganho.connect(ctx.destination);
      osc.start(agora);
      osc.stop(agora + duracaoMs / 1000);
    },
    [garantirAudio],
  );

  const tocarSomFinal = useCallback(
    (acertou) => {
      const notas = acertou ? [523, 659, 784] : [300, 200];
      const passo = acertou ? 120 : 150;
      notas.forEach((freq, i) => setTimeout(() => tocarBeep(freq, acertou ? 200 : 300), i * passo));
    },
    [tocarBeep],
  );

  const alternarSom = () => {
    somRef.current = !somRef.current;
    setSomLigado(somRef.current);
    if (somRef.current) garantirAudio();
  };

  // ---------------------------------------------------------------- tempo
  const pararTimers = useCallback(() => {
    clearInterval(cronometroRef.current);
    clearTimeout(semSinalRef.current);
    cronometroRef.current = semSinalRef.current = null;
  }, []);

  // Atualiza o número e dá o "tique-taque" que acelera e sobe de tom no fim.
  const atualizarSegundos = useCallback(
    (n) => {
      setSegundos(n);
      if (n >= TEMPO_LIMITE) return;
      if (n <= 3 && n > 0) tocarBeep(440 + (3 - n) * 220, 180);
      else if (n > 3) tocarBeep(330, 100);
    },
    [tocarBeep],
  );

  const sinalRecebido = useCallback(() => {
    clearTimeout(semSinalRef.current);
    semSinalRef.current = null;
    setSemSinal(false);
  }, []);

  const armarAvisoSemSinal = useCallback(() => {
    clearTimeout(semSinalRef.current);
    semSinalRef.current = setTimeout(() => setSemSinal(true), SEM_SINAL_MS);
  }, []);

  // ---------------------------------------------------------------- respostas
  const registrarResposta = useCallback(
    (acertou, foiTimeout) => {
      // só vale se ainda estamos numa pergunta em aberto (evita contar 2x quando o botão e o
      // fim do tempo chegam quase juntos)
      if (etapaRef.current !== 'pergunta' || respondidoRef.current || !perguntaRef.current) return;
      respondidoRef.current = true;
      ultimaRespostaEmRef.current = Date.now();
      pararTimers();
      setSemSinal(false);

      // Tempo esgotado: tela própria, não conta no placar e não salva resposta
      if (foiTimeout) {
        tocarSomFinal(false);
        mudarEtapa('tempo-esgotado');
        return;
      }

      setPlacar((p) => ({ acertos: p.acertos + (acertou ? 1 : 0), total: p.total + 1 }));
      setResultado({ acertou });
      tocarSomFinal(acertou);
      mudarEtapa('resultado');

      // salva no back sem travar a tela
      chamarAPI('/respostas', {
        method: 'POST',
        body: JSON.stringify({ flashcardId: perguntaRef.current.flashcardId, acertou }),
      }).catch((erro) => console.error('Erro ao salvar resposta:', erro));
    },
    [mudarEtapa, pararTimers, tocarSomFinal],
  );

  // Linhas que chegam do ESP32. O relógio da tela segue o do dispositivo, assim os dois
  // nunca ficam diferentes.
  const processarLinha = useCallback(
    (linha) => {
      console.log('Dispositivo disse:', linha);

      if (linha.startsWith('TIMER:')) {
        const n = parseInt(linha.slice(6), 10);
        if (!Number.isNaN(n) && etapaRef.current === 'pergunta' && !respondidoRef.current) {
          sinalRecebido();
          atualizarSegundos(n);
        }
        return;
      }

      if (linha === 'PERGUNTA RECEBIDA') {
        if (etapaRef.current === 'pergunta') sinalRecebido();
        return;
      }

      if (linha.startsWith('R;')) {
        const [, botao, acertouTexto] = linha.split(';');
        if (botao === 'TIMEOUT') registrarResposta(false, true);
        else if (botao === 'V' || botao === 'F') registrarResposta(acertouTexto === '1', false);
      }
    },
    [atualizarSegundos, registrarResposta, sinalRecebido],
  );

  // ---------------------------------------------------------------- fluxo do quiz
  // Só no modo teste (sem dispositivo): quem conta o tempo é a própria página.
  const iniciarCronometroLocal = useCallback(() => {
    let restante = TEMPO_LIMITE;
    setSegundos(restante);
    cronometroRef.current = setInterval(() => {
      restante -= 1;
      atualizarSegundos(restante);
      if (restante <= 0) {
        clearInterval(cronometroRef.current);
        registrarResposta(false, true);
      }
    }, 1000);
  }, [atualizarSegundos, registrarResposta]);

  const proximaPergunta = useCallback(async () => {
    pararTimers();
    const minhaRequisicao = requisicaoRef.current + 1;
    requisicaoRef.current = minhaRequisicao;

    respondidoRef.current = false;
    perguntaRef.current = null;
    setPergunta(null);
    setSemSinal(false);
    setSegundos(TEMPO_LIMITE);
    mudarEtapa('pergunta');

    // O visor do dispositivo fica uns segundos mostrando "CORRETA!/ERRADA!". Se mandássemos a
    // próxima pergunta agora, ela ficaria na fila do Arduino e a tela sairia de sincronia dele.
    if (!modoTesteRef.current) {
      const restante = ultimaRespostaEmRef.current + TEMPO_RESULTADO_DISPOSITIVO_MS - Date.now();
      if (restante > 0) {
        setAguardandoDispositivo(true);
        await new Promise((resolver) => setTimeout(resolver, restante));
        setAguardandoDispositivo(false);
        if (minhaRequisicao !== requisicaoRef.current || etapaRef.current !== 'pergunta') return;
      }
    }

    try {
      const resposta = await chamarAPI(`/exercicios/verdadeiro-falso/${DECK_ID}?nivel=${nivelRef.current}`);
      const dados = await resposta.json().catch(() => ({}));
      // se a pessoa já saiu dessa pergunta (trocou de nível, cabo puxado), descarta
      if (minhaRequisicao !== requisicaoRef.current || etapaRef.current !== 'pergunta') return;
      if (!resposta.ok) throw new Error(dados.message || `O servidor respondeu com erro (${resposta.status}).`);

      perguntaRef.current = dados;
      setPergunta(dados);

      if (modoTesteRef.current) {
        iniciarCronometroLocal();
      } else {
        const mensagem = montarMensagemPergunta(dados);
        ultimaMensagemRef.current = mensagem;
        await dispositivoRef.current?.enviar(mensagem);
        if (minhaRequisicao !== requisicaoRef.current) return;
        armarAvisoSemSinal();
      }
    } catch (erro) {
      if (minhaRequisicao !== requisicaoRef.current) return;
      console.error(erro);
      setMensagemErro(
        erro instanceof TypeError ? mensagemDaFalha({ motivo: 'sem-conexao' }) : erro.message,
      );
      mudarEtapa('erro');
    }
  }, [armarAvisoSemSinal, iniciarCronometroLocal, mudarEtapa, pararTimers]);

  const irParaNiveis = useCallback(() => {
    setPlacarVisivel(true);
    mudarEtapa('nivel');
  }, [mudarEtapa]);

  const voltarNiveis = () => {
    pararTimers();
    requisicaoRef.current += 1;
    irParaNiveis();
  };

  const iniciarQuiz = (nivel) => {
    nivelRef.current = nivel;
    setNivelAtual(nivel);
    proximaPergunta();
  };

  const reenviarPergunta = async () => {
    setSemSinal(false);
    try {
      await dispositivoRef.current?.enviar(ultimaMensagemRef.current);
    } catch (erro) {
      console.error(erro);
    }
    armarAvisoSemSinal();
  };

  const simularResposta = (botao) => {
    const correto = perguntaRef.current?.correto;
    registrarResposta(botao === 'V' ? correto : !correto, false);
  };

  // ---------------------------------------------------------------- conexão
  const verificarServidor = useCallback(async () => {
    setStatusApi(statusDoServidor(await fazerLogin()));
  }, []);

  const encerrarDispositivo = useCallback(async () => {
    const dispositivo = dispositivoRef.current;
    dispositivoRef.current = null;
    if (dispositivo) await dispositivo.desconectar();
  }, []);

  const conectarUSB = async () => {
    verificarServidor(); // reconfere: dá pra ligar o back-end depois de abrir a página

    if (!suportaUSB()) {
      setStatusConexao({
        texto: 'Seu navegador não suporta conexão USB. Use o Google Chrome ou o Microsoft Edge, no computador.',
        tipo: 'erro',
      });
      return;
    }

    try {
      setConectando(true);
      setStatusConexao({ texto: 'Escolha a porta do dispositivo na janela que abriu...', tipo: '' });
      garantirAudio(); // o navegador só libera áudio dentro de um clique

      dispositivoRef.current = await conectarDispositivo({
        velocidade: VELOCIDADE_SERIAL,
        aoReceberLinha: processarLinha,
      });
      modoTesteRef.current = false;
      setModoTeste(false);
      setStatusConexao({ texto: 'Dispositivo conectado com sucesso!', tipo: 'ok' });
      irParaNiveis();
    } catch (erro) {
      console.error(erro);
      await encerrarDispositivo();
      setStatusConexao({
        texto:
          erro?.name === 'NotFoundError'
            ? 'Nenhuma porta foi escolhida. Tente de novo.'
            : 'Não foi possível conectar. Confira o cabo USB e se outro programa não está usando a porta.',
        tipo: 'erro',
      });
    } finally {
      setConectando(false);
    }
  };

  // Modo teste: sem dispositivo, os botões da tela fazem o papel dos físicos.
  const ativarModoTeste = () => {
    verificarServidor();
    garantirAudio();
    modoTesteRef.current = true;
    setModoTeste(true);
    irParaNiveis();
  };

  // ---------------------------------------------------------------- efeitos
  // ao abrir a página, confere se o back-end está no ar
  useEffect(() => {
    let ativo = true;
    fazerLogin().then((login) => {
      if (ativo) setStatusApi(statusDoServidor(login));
    });
    return () => {
      ativo = false;
    };
  }, []);

  // cabo puxado no meio do quiz: volta para a tela de conexão
  useEffect(
    () =>
      aoCaboDesconectar(() => {
        if (!dispositivoRef.current) return;
        pararTimers();
        requisicaoRef.current += 1;
        encerrarDispositivo();
        setStatusConexao({ texto: 'O dispositivo foi desconectado. Conecte de novo para continuar.', tipo: 'erro' });
        setPlacarVisivel(false);
        mudarEtapa('usb');
      }),
    [encerrarDispositivo, mudarEtapa, pararTimers],
  );

  // ao sair da página, solta a porta USB
  useEffect(
    () => () => {
      pararTimers();
      encerrarDispositivo();
    },
    [encerrarDispositivo, pararTimers],
  );

  // ---------------------------------------------------------------- telas
  const classeStatus = (status, extra = '') => ['status', extra, status.tipo].filter(Boolean).join(' ');

  const renderizarTela = () => {
    if (etapa === 'usb') {
      return (
        <section className="tela ativa" id="tela-usb">
          <h1>
            Pronto para <span className="destaque">decolar?</span>
          </h1>
          <p className="subtitulo">
            Conecte o dispositivo físico do quiz ao computador por USB. A pergunta aparece aqui e você
            responde nos botões do dispositivo.
          </p>
          <div className="painel">
            <FaUsb className="icone icone-grande" aria-hidden="true" />
            <button
              className="btn btn-azul"
              id="btnConectar"
              type="button"
              onClick={conectarUSB}
              disabled={conectando}
            >
              Conectar via USB
            </button>
            <p className={classeStatus(statusConexao)} id="statusConexao" role="status">
              {statusConexao.texto}
            </p>
            <p className={classeStatus(statusApi, 'api')} id="statusApi" role="status">
              {statusApi.texto}
            </p>
            <button className="btn btn-fantasma" id="btnTeste" type="button" onClick={ativarModoTeste}>
              Testar sem dispositivo
            </button>
          </div>
        </section>
      );
    }

    if (etapa === 'nivel') {
      return (
        <section className="tela ativa" id="tela-nivel">
          <h1>
            Escolha seu <span className="destaque">nível</span>
          </h1>
          <p className="subtitulo" id="subtituloNivel">
            {modoTeste
              ? 'Modo teste: você responde com os botões da tela.'
              : 'Selecione o nível e responda nos botões do dispositivo.'}
          </p>
          <div className="niveis">
            {NIVEIS.map((nivel) => (
              <button
                key={nivel.valor}
                className={`nivel ${nivel.classe}`}
                type="button"
                data-nivel={nivel.valor}
                onClick={() => iniciarQuiz(nivel.valor)}
              >
                <strong>{nivel.titulo}</strong>
                <small>{nivel.descricao}</small>
              </button>
            ))}
          </div>
        </section>
      );
    }

    if (etapa === 'pergunta') {
      const tenso = segundos <= 3;
      return (
        <section className="tela ativa" id="tela-pergunta">
          <span className="tag" id="tagNivel">
            {NOMES_NIVEL[nivelAtual] || nivelAtual}
          </span>
          {/* a "key" refaz o elemento a cada segundo, o que reinicia a animação de batida */}
          <div
            key={segundos}
            id="cronometro"
            role="timer"
            className={`cronometro${tenso ? ' tenso' : ''}${segundos < TEMPO_LIMITE ? ' batida' : ''}`}
          >
            {segundos}
          </div>
          <div className={`barra${tenso ? ' tenso' : ''}`} aria-hidden="true">
            <div
              className="barra-preenchida"
              id="barraTempo"
              style={{ width: `${Math.max(0, (segundos / TEMPO_LIMITE) * 100)}%` }}
            ></div>
          </div>
          <div className="par">
            <p className="palavra" id="fraseFront">
              {pergunta ? pergunta.front : aguardandoDispositivo ? 'Aguardando o dispositivo...' : 'Carregando...'}
            </p>
            <p className={`palavra traducao${pergunta ? '' : ' oculta'}`} id="fraseBack">
              {pergunta ? pergunta.backMostrado : '?'}
            </p>
          </div>
          <p className="instrucao" id="instrucaoFisica">
            {modoTeste
              ? 'O par está certo? Use os botões abaixo.'
              : 'O par está certo? Aperte VERDADEIRO ou FALSO no dispositivo.'}
          </p>
          {pergunta && modoTeste && (
            <div className="acoes" id="botoesSimulados">
              <button className="btn btn-verde" type="button" data-simular="V" onClick={() => simularResposta('V')}>
                VERDADEIRO
              </button>
              <button className="btn btn-rosa" type="button" data-simular="F" onClick={() => simularResposta('F')}>
                FALSO
              </button>
            </div>
          )}
          {semSinal && !modoTeste && (
            <div className="aviso" id="avisoSemSinal" role="alert">
              <p>O dispositivo não respondeu. Confira o cabo USB e se ele está ligado.</p>
              <button className="btn btn-fantasma" id="btnReenviar" type="button" onClick={reenviarPergunta}>
                Reenviar pergunta
              </button>
            </div>
          )}
        </section>
      );
    }

    const botoes = (
      <div className="acoes">
        <button className="btn btn-azul" type="button" data-acao="proxima" onClick={proximaPergunta}>
          {etapa === 'erro' ? 'Tentar de novo' : 'Próxima pergunta'}
        </button>
        <button className="btn btn-fantasma" type="button" data-acao="niveis" onClick={voltarNiveis}>
          Trocar nível
        </button>
      </div>
    );

    if (etapa === 'resultado') {
      return (
        <section className="tela ativa" id="tela-resultado">
          <div className={`cartao-resultado ${resultado?.acertou ? 'certo' : 'errado'}`} id="cartaoResultado">
            {resultado?.acertou ? (
              <FaCheckCircle className="icone icone-resultado" id="iconeCerto" aria-hidden="true" />
            ) : (
              <FaTimesCircle className="icone icone-resultado" id="iconeErrado" aria-hidden="true" />
            )}
            <h2 id="resultadoTexto">{resultado?.acertou ? 'Correto!' : 'Errado'}</h2>
            <p>Resposta registrada.</p>
          </div>
          {botoes}
        </section>
      );
    }

    if (etapa === 'tempo-esgotado') {
      return (
        <section className="tela ativa" id="tela-tempo-esgotado">
          <div className="cartao-resultado">
            <FaHourglassEnd className="icone icone-resultado" aria-hidden="true" />
            <h2>Tempo esgotado</h2>
            <p>
              A resposta era:{' '}
              <strong id="respostaCorretaTexto">
                {pergunta?.correto
                  ? `Verdadeiro (${pergunta.front} = ${pergunta.backMostrado})`
                  : `Falso (${pergunta?.front} não é ${pergunta?.backMostrado})`}
              </strong>
            </p>
          </div>
          {botoes}
        </section>
      );
    }

    // etapa === 'erro'
    return (
      <section className="tela ativa" id="tela-erro">
        <div className="cartao-resultado">
          <FaTimesCircle className="icone icone-resultado" aria-hidden="true" />
          <h2>Não deu para buscar a pergunta</h2>
          <p id="mensagemErro">{mensagemErro}</p>
        </div>
        {botoes}
      </section>
    );
  };

  return (
    <div className="quiz-pagina">
      <header className="topo">
        <LogoAtria className="logo" />
        <div className="topo-direita">
          {placarVisivel && (
            <span className="placar" id="placar">
              Acertos: <strong id="placarAcertos">{placar.acertos}</strong> /{' '}
              <span id="placarTotal">{placar.total}</span>
            </span>
          )}
          <button
            className="btn-som"
            id="btnSom"
            type="button"
            onClick={alternarSom}
            aria-label={somLigado ? 'Desligar o som' : 'Ligar o som'}
            aria-pressed={!somLigado}
            title={somLigado ? 'Desligar o som' : 'Ligar o som'}
          >
            {somLigado ? (
              <FaVolumeUp className="icone" id="iconeSomLigado" />
            ) : (
              <FaVolumeMute className="icone" id="iconeSomMudo" />
            )}
          </button>
        </div>
      </header>

      {renderizarTela()}
    </div>
  );
}
