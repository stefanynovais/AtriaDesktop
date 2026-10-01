import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaVolumeUp } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import api from '../../services/api';
import logo from '../../assets/logo_atria_branca.png';
import './PresentCards.css';

const MSG_SEM_CONEXAO = 'Não foi possível conectar ao servidor. Confira se a API está rodando.';

export default function PresentCards() {
  const navigate = useNavigate();
  const { deckId } = useParams();

  const [tituloDeck, setTituloDeck] = useState('');
  const [cartoes, setCartoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [indiceAtual, setIndiceAtual] = useState(0);
  const [mostrandoVerso, setMostrandoVerso] = useState(false);

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
            frente: c.front,
            verso: c.back,
            imagem: c.imagemUrl,
          }))
        );
      } catch (error) {
        if (cancelado) return;
        setErro(
          error.response
            ? error.response.data?.message || 'Não foi possível carregar o deck.'
            : MSG_SEM_CONEXAO
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

  const cartaoAtual = cartoes[indiceAtual];

  const irParaAnterior = () => {
    setMostrandoVerso(false);
    setIndiceAtual((prev) => Math.max(prev - 1, 0));
  };

  const irParaProximo = () => {
    setMostrandoVerso(false);
    setIndiceAtual((prev) => Math.min(prev + 1, cartoes.length - 1));
  };

  // Pronúncia por texto-pra-voz (Web Speech API) — não existe arquivo de
  // áudio nenhum no back, o navegador que "fala" a palavra da frente do
  // cartão.
  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window) || !cartaoAtual) return;

    window.speechSynthesis.cancel(); // evita sobrepor falas
    const utterance = new SpeechSynthesisUtterance(cartaoAtual.frente);
    utterance.lang = 'en-US'; // a "frente" do card é a palavra no idioma estudado
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const renderizarConteudo = () => {
    if (carregando) {
      return <p className="presentcards-status">Carregando cartões...</p>;
    }

    if (erro) {
      return (
        <>
          <p className="presentcards-status">{erro}</p>
          <button className="presentcards-nav-btn" onClick={() => navigate('/home')}>
            Voltar para os decks
          </button>
        </>
      );
    }

    if (cartoes.length === 0) {
      return (
        <>
          <p className="presentcards-status">Este deck ainda não tem flashcards.</p>
          <button className="presentcards-nav-btn" onClick={() => navigate('/home')}>
            Voltar para os decks
          </button>
        </>
      );
    }

    return (
      <>
        <div
          className="presentcards-card"
          onMouseDown={() => setMostrandoVerso(true)}
          onMouseUp={() => setMostrandoVerso(false)}
          onMouseLeave={() => setMostrandoVerso(false)}
          onTouchStart={() => setMostrandoVerso(true)}
          onTouchEnd={() => setMostrandoVerso(false)}
        >
          <p>{mostrandoVerso ? cartaoAtual.verso : cartaoAtual.frente}</p>
        </div>

        <div className="presentcards-media-row">
          <div className="presentcards-image-box">
            {cartaoAtual.imagem ? (
              <img src={cartaoAtual.imagem} alt="Imagem do cartão" />
            ) : (
              <span className="presentcards-image-placeholder">Sem imagem</span>
            )}
          </div>

          <div className="presentcards-audio-column">
            <button className="presentcards-audio-btn" onClick={handlePlayAudio}>
              <FaVolumeUp />
            </button>

            <div className="presentcards-nav-buttons">
              <button
                className="presentcards-nav-btn"
                onClick={irParaAnterior}
                disabled={indiceAtual === 0}
              >
                ←
              </button>
              <button
                className="presentcards-nav-btn"
                onClick={irParaProximo}
                disabled={indiceAtual === cartoes.length - 1}
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div className="presentcards-progress">
          {cartoes.map((_, index) => (
            <div
              key={index}
              className={`presentcards-progress-bar ${
                index < indiceAtual
                  ? 'presentcards-progress-passed'
                  : index === indiceAtual
                  ? 'presentcards-progress-current'
                  : 'presentcards-progress-upcoming'
              }`}
            ></div>
          ))}
        </div>
      </>
    );
  };

  return (
    <DashboardLayout hideHeader hideDots>
      <div className="presentcards-page">
        <div className="presentcards-stars-overlay"></div>

        <header className="presentcards-header">
          <button className="presentcards-back-btn" onClick={() => navigate(`/games/${deckId}`)}>
            ←
          </button>

          <div className="presentcards-titles">
            <h1>Apresentar cartões</h1>
            <p>{tituloDeck}</p>
          </div>

          <img src={logo} alt="Atria" className="presentcards-logo" />
        </header>

        <div className="presentcards-content">{renderizarConteudo()}</div>
      </div>
    </DashboardLayout>
  );
}
