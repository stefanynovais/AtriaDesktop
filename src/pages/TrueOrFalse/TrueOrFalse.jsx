import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import logo from '../../assets/logo_atria_branca.png';
import certoImg from '../../assets/botao_certo.png';
import erradoImg from '../../assets/botao_errado.png';
import './TrueOrFalse.css';

const mockDeck = {
  id: 1,
  nome: 'Ingles_Frutas',
  cartoes: [
    { id: 1, frente: 'Apple', verso: 'Maçã', imagem: null },
    { id: 2, frente: 'Banana', verso: 'Banana', imagem: null },
    { id: 3, frente: 'Strawberry', verso: 'Morango', imagem: null },
    { id: 4, frente: 'Grape', verso: 'Uva', imagem: null },
    { id: 5, frente: 'Orange', verso: 'Laranja', imagem: null },
  ],
};

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
    const ehVerdadeiro = Math.random() < 0.5;

    let versoExibido = cartao.verso;

    if (!ehVerdadeiro) {
      const outros = cartoes.filter((c) => c.id !== cartao.id);
      const versoErrado = outros[Math.floor(Math.random() * outros.length)];
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

  const deck = mockDeck;

  const rodadas = useMemo(() => embaralhar(gerarRodadas(deck.cartoes)), [deck]);

  const [indiceAtual, setIndiceAtual] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const rodadaAtual = rodadas[indiceAtual];
  const finalizado = indiceAtual >= rodadas.length;

  const responder = (respostaUsuario) => {
    if (feedback) return;

    const acertou = respostaUsuario === rodadaAtual.correto;
    setFeedback(acertou ? 'acertou' : 'errou');

    setTimeout(() => {
      setFeedback(null);
      setIndiceAtual((prev) => prev + 1);
    }, 700);
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
            <p>{deck.nome}</p>
          </div>

          <img src={logo} alt="Atria" className="tof-logo" />
        </header>

        <div className="tof-content">
          {finalizado ? (
            <div className="tof-finished">
              <p>Você concluiu todos os cartões deste deck!</p>
              <button className="tof-restart-btn" onClick={() => navigate(`/games/${deckId}`)}>
                Voltar aos modos de estudo
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
