import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import api from '../../services/api';
import logo from '../../assets/logo_atria_branca.png';
import './style.css';

const MSG_SEM_CONEXAO = 'Não foi possível conectar ao servidor. Confira se a API está rodando.';

export default function Home() {
  const [decks, setDecks] = useState([]);
  const [carregandoDecks, setCarregandoDecks] = useState(true);
  const [erroDecks, setErroDecks] = useState('');
  const [importando, setImportando] = useState(false);
  const [mensagemImport, setMensagemImport] = useState('');
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();

  // Busca os decks do usuário logado assim que a tela abre
  useEffect(() => {
    const carregarDecks = async () => {
      try {
        const resposta = await api.get('/decks');
        setDecks(resposta.data);
      } catch (error) {
        setErroDecks(
          error.response
            ? error.response.data?.message || 'Não foi possível carregar os decks.'
            : MSG_SEM_CONEXAO,
        );
      } finally {
        setCarregandoDecks(false);
      }
    };

    carregarDecks();
  }, []);

  const handleImportClick = () => {
    document.getElementById('import-file-input').click();
  };

  const handleFileChange = async (e) => {
    const arquivo = e.target.files[0];
    e.target.value = ''; // permite escolher o mesmo arquivo de novo depois
    if (!arquivo) return;

    setMensagemImport('');
    setImportando(true);

    try {
      const formData = new FormData();
      formData.append('arquivo', arquivo);
      // usa o nome do arquivo (sem .apkg) como título do deck
      formData.append('titulo', arquivo.name.replace(/\.apkg$/i, ''));

      const resposta = await api.post('/importar/apkg', formData);
      const { deck, totalFlashcardsImportados } = resposta.data;

      setDecks((atuais) => [deck, ...atuais]);
      setMensagemImport(
        `Deck "${deck.title}" importado com ${totalFlashcardsImportados} flashcards.`,
      );
    } catch (error) {
      setMensagemImport(
        error.response
          ? error.response.data?.message || 'Não foi possível importar o deck.'
          : MSG_SEM_CONEXAO,
      );
    } finally {
      setImportando(false);
    }
  };

  const decksFiltrados = decks
    .filter((deck) => deck.title.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const renderizarLista = () => {
    if (carregandoDecks) {
      return <p className="home-recent-empty">Carregando decks...</p>;
    }
    if (erroDecks) {
      return <p className="home-recent-empty">{erroDecks}</p>;
    }
    if (decks.length === 0) {
      return <p className="home-recent-empty">Você ainda não importou nenhum deck.</p>;
    }
    if (decksFiltrados.length === 0) {
      return <p className="home-recent-empty">Nenhum deck encontrado.</p>;
    }
    return decksFiltrados.map((deck) => (
      <div key={deck.id} className="home-recent-item" onClick={() => navigate(`/games/${deck.id}`)}>
        {deck.title}
      </div>
    ));
  };

  return (
    <DashboardLayout hideHeader hideDots>
      <div className="home-page">
        <div className="home-stars-overlay"></div>

        <header className="home-header">
          <img src={logo} alt="Atria" className="home-logo" />

          <div className="home-search-box">
            <input
              type="text"
              placeholder="Pesquisar decks..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <span className="home-search-icon">🔍</span>
          </div>
        </header>

        <div className="home-main-row">
          <button className="home-import-btn" onClick={handleImportClick} disabled={importando}>
            <span className="home-import-plus">+</span>
            <span className="home-import-label">
              {importando ? 'Importando...' : 'Importar deck'}
            </span>
          </button>
          <input
            id="import-file-input"
            type="file"
            accept=".apkg"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <div className="home-stats-box">
            <p>Comece a explorar para ver seu progresso!</p>
          </div>
        </div>

        {mensagemImport && <p className="home-recent-empty">{mensagemImport}</p>}

        <div className="home-recent-section">
          <h2>Recentes</h2>

          <div className="home-recent-list">{renderizarLista()}</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
