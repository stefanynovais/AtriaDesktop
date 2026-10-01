import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import api from '../../services/api';
import logo from '../../assets/logo_atria_branca.png';
import cardBack from '../../assets/card_virado.png';
import './MemoryGame.css';

const MSG_SEM_CONEXAO = 'Não foi possível conectar ao servidor. Confira se a API está rodando.';

export default function MemoryGame() {
  const navigate = useNavigate();
  const { deckId } = useParams();

  const [tituloDeck, setTituloDeck] = useState('');
  const [pecas, setPecas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [reveladas, setReveladas] = useState([]);
  const [encontradas, setEncontradas] = useState([]);
  const [travado, setTravado] = useState(false);

  // Busca o deck (nome) e as peças já embaralhadas e pareadas pelo back
  useEffect(() => {
    let cancelado = false;

    const carregar = async () => {
      try {
        const [respostaDeck, respostaJogo] = await Promise.all([
          api.get(`/decks/${deckId}`),
          api.get(`/exercicios/jogo-memoria/${deckId}`),
        ]);

        if (cancelado) return;

        setTituloDeck(respostaDeck.data.title);
        // traduz o formato do back ({ parId, flashcardId, tipo, texto })
        // pro formato que a tela já usava ({ id, parId, texto })
        setPecas(
          respostaJogo.data.cartas.map((c) => ({
            id: `${c.flashcardId}-${c.tipo}`,
            parId: c.parId,
            texto: c.texto,
          }))
        );
      } catch (error) {
        if (cancelado) return;
        setErro(
          error.response
            ? error.response.data?.message || 'Não foi possível carregar o jogo da memória.'
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

  const jogoConcluido = pecas.length > 0 && encontradas.length === pecas.length;

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

          // Registra a palavra como "acertada" ao encontrar o par — não existe
          // um "errou" correspondente aqui, já que não combinar cartas é parte
          // natural do jogo, não uma resposta errada a uma pergunta.
          api
            .post('/respostas', { flashcardId: pecaA.parId, acertou: true })
            .catch((error) => console.error('Não foi possível registrar a resposta:', error));
        }
        setReveladas([]);
        setTravado(false);
      }, 800);
    }
  };

  const renderizarConteudo = () => {
    if (carregando) {
      return (
        <div className="mg-finished">
          <p>Carregando jogo...</p>
        </div>
      );
    }

    if (erro) {
      return (
        <div className="mg-finished">
          <p>{erro}</p>
          <button className="mg-restart-btn" onClick={() => navigate('/home')}>
            Voltar para os decks
          </button>
        </div>
      );
    }

    if (pecas.length === 0) {
      return (
        <div className="mg-finished">
          <p>Este deck precisa de pelo menos 2 flashcards para o jogo da memória.</p>
          <button className="mg-restart-btn" onClick={() => navigate('/home')}>
            Voltar para os decks
          </button>
        </div>
      );
    }

    if (jogoConcluido) {
      return (
        <div className="mg-finished">
          <p>Parabéns! Você encontrou todos os pares!</p>
          <button className="mg-restart-btn" onClick={() => navigate(`/games/${deckId}`)}>
            Voltar aos modos de estudo
          </button>
        </div>
      );
    }

    return (
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
    );
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
            <p>{tituloDeck}</p>
          </div>

          <img src={logo} alt="Atria" className="mg-logo" />
        </header>

        <div className="mg-content">{renderizarConteudo()}</div>
      </div>
    </DashboardLayout>
  );
}

