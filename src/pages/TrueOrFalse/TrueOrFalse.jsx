import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import api from '../../services/api';
import logo from '../../assets/logo_atria_branca.png';
import certoImg from '../../assets/botao_certo.png';
import erradoImg from '../../assets/botao_errado.png';
import './TrueOrFalse.css';

const MSG_SEM_CONEXAO = 'Não foi possível conectar ao servidor. Confira se a API está rodando.';

function embaralhar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function gerarRodadas(cartoes) {
  return cartoes.map((cartao) => {
    // Só entram como "verso errado" os cartões com verso DIFERENTE do certo.
    // Senão a rodada "falsa" poderia mostrar um verso que na verdade está certo.
    const versosDiferentes = cartoes.filter((c) => c.verso !== cartao.verso);

    // Se não existe nenhum verso diferente (ex: deck com 1 cartão), a rodada
    // é sempre verdadeira.
    const ehVerdadeiro = versosDiferentes.length === 0 || Math.random() < 0.5;

    let versoExibido = cartao.verso;

    if (!ehVerdadeiro) {
      const versoErrado = versosDiferentes[Math.floor(Math.random() * versosDiferentes.length)];
      versoExibido = versoErrado.verso;
    }

    return {
      id: cartao.id,
      imagem: cartao.imagem,
      frente: cartao.frente,
      versoExibido,
      correto: ehVerdadeiro,
    };
  });
}

export default function TrueOrFalse() {
  const navigate = useNavigate();
  const { deckId } = useParams();

  const [tituloDeck, setTituloDeck] = useState('');
  const [cartoes, setCartoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [indiceAtual, setIndiceAtual] = useState(0);
  const [feedback, setFeedback] = useState(null);

  // Busca o deck (nome) e os cartões (já embaralhados pelo back) ao abrir a tela
  useEffect(() => {
    let cancelado = false;

    const carregar = async () => {
      try {
        const [respostaDeck, respostaCartoes] = await Promise.all([
          api.get(`/decks/${deckId}`),
          api.get(`/exercicios/cartoes/${deckId}`),
        ]);

        if (cancelado) return;

        setTituloDeck(respostaDeck.data.title);
        // traduz o formato do back pro formato que a tela já usava
        setCartoes(
          respostaCartoes.data.cartoes.map((c) => ({
            id: c.flashcardId,
            frente: c.front,
            verso: c.back,
            imagem: c.imagemUrl,
          })),
        );
      } catch (error) {
        if (cancelado) return;
        setErro(
          error.response
            ? error.response.data?.message || 'Não foi possível carregar o deck.'
            : MSG_SEM_CONEXAO,
        );
      } finally {
        if (!cancelado) setCarregando(false);
      }
    };

    carregar();

    return () => {
      cancelado = true;
    };
  }, [deckId]);

  const rodadas = useMemo(() => embaralhar(gerarRodadas(cartoes)), [cartoes]);

  const rodadaAtual = rodadas[indiceAtual];
  const finalizado = indiceAtual >= rodadas.length;

  const responder = (respostaUsuario) => {
    if (feedback) return;

    const acertou = respostaUsuario === rodadaAtual.correto;
    setFeedback(acertou ? 'acertou' : 'errou');

    // Registra a resposta no back (alimenta estatísticas, revisão e streak).
    // Roda em segundo plano: se falhar, o jogo não é interrompido.
    api
      .post('/respostas', { flashcardId: rodadaAtual.id, acertou })
      .catch((error) => console.error('Não foi possível registrar a resposta:', error));

    setTimeout(() => {
      setFeedback(null);
      setIndiceAtual((prev) => prev + 1);
    }, 700);
  };

  const renderizarConteudo = () => {
    if (carregando) {
      return (
        <div className="tof-finished">
          <p>Carregando cartões...</p>
        </div>
      );
    }

    if (erro) {
      return (
        <div className="tof-finished">
          <p>{erro}</p>
          <button className="tof-restart-btn" onClick={() => navigate('/home')}>
            Voltar para os decks
          </button>
        </div>
      );
    }

    if (rodadas.length === 0) {
      return (
        <div className="tof-finished">
          <p>Este deck ainda não tem flashcards.</p>
          <button className="tof-restart-btn" onClick={() => navigate('/home')}>
            Voltar para os decks
          </button>
        </div>
      );
    }

    if (finalizado) {
      return (
        <div className="tof-finished">
          <p>Você concluiu todos os cartões deste deck!</p>
          <button className="tof-restart-btn" onClick={() => navigate(`/games/${deckId}`)}>
            Voltar aos modos de estudo
          </button>
        </div>
      );
    }

    return (
      <>
        <div className={`tof-round ${feedback ? `tof-feedback-${feedback}` : ''}`}>
          <div className="tof-image-box">
            {rodadaAtual.imagem ? (
              <img src={rodadaAtual.imagem} alt="Imagem do cartão" />
            ) : (
              <span className="tof-image-placeholder">Sem imagem</span>
            )}
          </div>

          <div className="tof-words">
            <p className="tof-word-original">{rodadaAtual.frente}</p>
            <p className="tof-word-translated">{rodadaAtual.versoExibido}</p>
          </div>
        </div>

        <div className="tof-progress">
          {rodadas.map((_, index) => (
            <div
              key={index}
              className={`tof-progress-bar ${
                index < indiceAtual
                  ? 'tof-progress-passed'
                  : index === indiceAtual
                  ? 'tof-progress-current'
                  : 'tof-progress-upcoming'
              }`}
            ></div>
          ))}
        </div>

        <div className="tof-answer-buttons">
          <button className="tof-answer-btn" onClick={() => responder(false)}>
            <img src={erradoImg} alt="Errado" />
          </button>
          <button className="tof-answer-btn" onClick={() => responder(true)}>
            <img src={certoImg} alt="Certo" />
          </button>
        </div>
      </>
    );
  };

  return (
    <DashboardLayout hideHeader hideDots>
      <div className="tof-page">
        <div className="tof-stars-overlay"></div>

        <header className="tof-header">
          <button className="tof-back-btn" onClick={() => navigate(`/games/${deckId}`)}>
            ←
          </button>

          <div className="tof-titles">
            <h1>Verdadeiro ou falso</h1>
            <p>{tituloDeck}</p>
          </div>

          <img src={logo} alt="Atria" className="tof-logo" />
        </header>

        <div className="tof-content">{renderizarConteudo()}</div>
      </div>
    </DashboardLayout>
  );
}
