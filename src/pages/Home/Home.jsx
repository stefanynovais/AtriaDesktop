import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import api from '../../services/api';
import logo from '../../assets/logo_atria_branca.png';
import './style.css';

const MSG_SEM_CONEXAO = 'Não foi possível conectar ao servidor. Confira se a API está rodando.';

const NOMES_MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

// Gera os últimos N meses (incluindo o atual), do mais antigo pro mais recente
const gerarMesesRecentes = (quantidade = 3) => {
  const hoje = new Date();
  const meses = [];
  for (let i = quantidade - 1; i >= 0; i--) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    meses.push({ ano: data.getFullYear(), mes: data.getMonth() }); // mes: 0-11
  }
  return meses;
};

const diasNoMes = (ano, mes) => new Date(ano, mes + 1, 0).getDate();

const formatarDataLocal = (ano, mes, dia) => {
  const m = String(mes + 1).padStart(2, '0');
  const d = String(dia).padStart(2, '0');
  return `${ano}-${m}-${d}`;
};

export default function Home() {
  const [decks, setDecks] = useState([]);
  const [carregandoDecks, setCarregandoDecks] = useState(true);
  const [erroDecks, setErroDecks] = useState('');
  const [importando, setImportando] = useState(false);
  const [mensagemImport, setMensagemImport] = useState('');
  const [busca, setBusca] = useState('');

  const [streak, setStreak] = useState(null);
  const [diasAtividade, setDiasAtividade] = useState([]);
  const [carregandoStats, setCarregandoStats] = useState(true);
  const [erroStats, setErroStats] = useState('');

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

  // Busca o streak (atual + mais longa) e o calendário de dias com atividade
  useEffect(() => {
    const carregarStats = async () => {
      try {
        const [respostaStreak, respostaCalendario] = await Promise.all([
          api.get('/streak'),
          api.get('/streak/calendario?meses=3'),
        ]);
        setStreak(respostaStreak.data);
        setDiasAtividade(respostaCalendario.data.dias);
      } catch (error) {
        setErroStats(
          error.response
            ? error.response.data?.message || 'Não foi possível carregar as estatísticas.'
            : MSG_SEM_CONEXAO,
        );
      } finally {
        setCarregandoStats(false);
      }
    };

    carregarStats();
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

  const renderizarStatsBox = () => {
    if (carregandoStats) {
      return <p>Carregando estatísticas...</p>;
    }

    if (erroStats) {
      return <p>{erroStats}</p>;
    }

    // ninguém teve atividade ainda — nem a streak nem o calendário têm nada
    // pra mostrar, mantém a mensagem de boas-vindas original
    if (!streak || streak.currentStreak === 0) {
      return <p>Comece a explorar para ver seu progresso!</p>;
    }

    const diasAtivosSet = new Set(diasAtividade);
    const meses = gerarMesesRecentes(3);

    return (
      <>
        <div className="home-stats-calendario">
          {meses.map(({ ano, mes }) => {
            const totalDias = diasNoMes(ano, mes);
            return (
              <div className="home-stats-mes" key={`${ano}-${mes}`}>
                <span className="home-stats-mes-nome">{NOMES_MESES[mes]}</span>
                <div className="home-stats-grid-dias">
                  {Array.from({ length: totalDias }, (_, i) => i + 1).map((dia) => {
                    const dataStr = formatarDataLocal(ano, mes, dia);
                    const ativo = diasAtivosSet.has(dataStr);
                    return (
                      <div
                        key={dia}
                        className={`home-stats-dia ${ativo ? 'ativo' : ''}`}
                        title={dataStr}
                      ></div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="home-stats-rodape">
          <span>Streak mais longa: {streak.longestStreak}</span>
          <span>Streak atual: {streak.currentStreak}</span>
        </div>
      </>
    );
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

          <div className="home-stats-box">{renderizarStatsBox()}</div>
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
