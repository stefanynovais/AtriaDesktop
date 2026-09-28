import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import logo from '../../assets/logo_atria_branca.png';
import cardBack from '../../assets/card_virado.png';
import './MemoryGame.css';

//mock temporário
const mockDeck = {
  id: 1,
  nome: 'Ingles_Frutas',
  cartoes: [
    { id: 1, frente: 'Apple', verso: 'Maçã' },
    { id: 2, frente: 'Banana', verso: 'Banana' },
    { id: 3, frente: 'Strawberry', verso: 'Morango' },
    { id: 4, frente: 'Grape', verso: 'Uva' },
    { id: 5, frente: 'Orange', verso: 'Laranja' },
    { id: 6, frente: 'Watermelon', verso: 'Melancia' },
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

function gerarPecas(cartoes) {
  const pecas = cartoes.flatMap((cartao) => [
    { id: `${cartao.id}-frente`, parId: cartao.id, texto: cartao.frente },
    { id: `${cartao.id}-verso`, parId: cartao.id, texto: cartao.verso },
  ]);
  return embaralhar(pecas);
}

export default function MemoryGame() {
  const navigate = useNavigate();
  const { deckId } = useParams();

  const deck = mockDeck; //futuramente: buscar deck pelo deckId

  const [pecas] = useState(() => gerarPecas(deck.cartoes));
  const [reveladas, setReveladas] = useState([]);
  const [encontradas, setEncontradas] = useState([]);
  const [travado, setTravado] = useState(false);

  const jogoConcluido = encontradas.length === pecas.length;

  const handleClickPeca = (peca) => {
    if (travado) return;
    if (reveladas.includes(peca.id)) return;
    if (encontradas.includes(peca.id)) return;
    if (reveladas.length === 2) return;

    const novasReveladas = [...reveladas, peca.id];
    setReveladas(novasReveladas);

    if (novasReveladas.length === 2) {
      setTravado(true);

      const [idA, idB] = novasReveladas;
      const pecaA = pecas.find((p) => p.id === idA);
      const pecaB = pecas.find((p) => p.id === idB);

      const formamPar = pecaA.parId === pecaB.parId;

      setTimeout(() => {
        if (formamPar) {
          setEncontradas((prev) => [...prev, idA, idB]);
        }
        setReveladas([]);
        setTravado(false);
      }, 800);
    }
  };

  return (
    <DashboardLayout hideHeader hideDots>
      <div className="mg-page">
        <div className="mg-stars-overlay"></div>

        <header className="mg-header">
          <button className="mg-back-btn" onClick={() => navigate(`/games/${deckId}`)}>
            ←
          </button>

          <div className="mg-titles">
            <h1>Jogo da memória</h1>
            <p>{deck.nome}</p>
          </div>

          <img src={logo} alt="Atria" className="mg-logo" />
        </header>

        <div className="mg-content">
          {jogoConcluido ? (
            <div className="mg-finished">
              <p>Parabéns! Você encontrou todos os pares!</p>
              <button className="mg-restart-btn" onClick={() => navigate(`/games/${deckId}`)}>
                Voltar aos modos de estudo
              </button>
            </div>
          ) : (
            <div className="mg-grid">
              {pecas.map((peca) => {
                const virada = reveladas.includes(peca.id) || encontradas.includes(peca.id);
                const resolvida = encontradas.includes(peca.id);

                return (
                  <button
                    key={peca.id}
                    className={`mg-card ${virada ? 'mg-card-flipped' : ''} ${
                      resolvida ? 'mg-card-solved' : ''
                    }`}
                    onClick={() => handleClickPeca(peca)}
                    disabled={resolvida}
                  >
                    <div className="mg-card-inner">
                      <div className="mg-card-back">
                        <img src={cardBack} alt="Verso do cartão" />
                      </div>
                      <div className="mg-card-front">
                        <p>{peca.texto}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
