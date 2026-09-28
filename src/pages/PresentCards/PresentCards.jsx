import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaVolumeUp } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import logo from '../../assets/logo_atria_branca.png';
import './PresentCards.css';

//mock temporário:
const mockDeck = {
  id: 1,
  nome: 'Ingles_Frutas',
  cartoes: [
    { id: 1, frente: 'Apple', verso: 'Maçã', imagem: null, audio: null },
    { id: 2, frente: 'Banana', verso: 'Banana', imagem: null, audio: '/audio/banana.mp3' },
    { id: 3, frente: 'Strawberry', verso: 'Morango', imagem: '/img/strawberry.png', audio: null },
    { id: 4, frente: 'Grape', verso: 'Uva', imagem: null, audio: null },
    {
      id: 5,
      frente: 'Orange',
      verso: 'Laranja',
      imagem: '/img/orange.png',
      audio: '/audio/orange.mp3',
    },
  ],
};

export default function PresentCards() {
  const navigate = useNavigate();
  const { deckId } = useParams();

  const [indiceAtual, setIndiceAtual] = useState(0);
  const [mostrandoVerso, setMostrandoVerso] = useState(false);

  const deck = mockDeck; //futuramente buscar deck pelo deckId
  const cartaoAtual = deck.cartoes[indiceAtual];

  const irParaAnterior = () => {
    setMostrandoVerso(false);
    setIndiceAtual((prev) => Math.max(prev - 1, 0));
  };

  const irParaProximo = () => {
    setMostrandoVerso(false);
    setIndiceAtual((prev) => Math.min(prev + 1, deck.cartoes.length - 1));
  };

  const handlePlayAudio = () => {
    if (!cartaoAtual.audio) return;
    const audio = new Audio(cartaoAtual.audio);
    audio.play();
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
            <p>{deck.nome}</p>
          </div>

          <img src={logo} alt="Atria" className="presentcards-logo" />
        </header>

        <div className="presentcards-content">
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
              <button
                className="presentcards-audio-btn"
                onClick={handlePlayAudio}
                style={{ visibility: cartaoAtual.audio ? 'visible' : 'hidden' }}
              >
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
                  disabled={indiceAtual === deck.cartoes.length - 1}
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="presentcards-progress">
            {deck.cartoes.map((_, index) => (
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
        </div>
      </div>
    </DashboardLayout>
  );
}
