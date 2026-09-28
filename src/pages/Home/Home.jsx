import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import logo from '../../assets/logo_atria_branca.png';
import './style.css';

const decksRecentes = [
  //apenas para teste do visual
  { id: 1, nome: 'Ingles_Frutas', importadoEm: '2026-08-30T14:00:00' },
  { id: 2, nome: 'Japones_Pronomes', importadoEm: '2026-08-28T10:00:00' },
  { id: 3, nome: 'Espanhol_Direcoes', importadoEm: '2026-08-25T09:00:00' },
  { id: 4, nome: 'Alemao_Lugares', importadoEm: '2026-08-20T18:00:00' },
  { id: 5, nome: 'Frances_Verbos', importadoEm: '2026-08-15T11:00:00' },
];

export default function Home() {
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();

  const handleImportClick = () => {
    document.getElementById('import-file-input').click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log('Arquivo selecionado:', file.name);
  };

  const decksFiltrados = decksRecentes
    .filter((deck) => deck.nome.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => new Date(b.importadoEm) - new Date(a.importadoEm));

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
          <button className="home-import-btn" onClick={handleImportClick}>
            <span className="home-import-plus">+</span>
            <span className="home-import-label">Importar deck</span>
          </button>
          <input
            id="import-file-input"
            type="file"
            accept=".apkg,.txt"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <div className="home-stats-box">
            <p>Comece a explorar para ver seu progresso!</p>
          </div>
        </div>

        <div className="home-recent-section">
          <h2>Recentes</h2>

          <div className="home-recent-list">
            {decksFiltrados.length > 0 ? (
              decksFiltrados.map((deck) => (
                <div
                  key={deck.id}
                  className="home-recent-item"
                  onClick={() => navigate(`/games/${deck.id}`)}
                >
                  {deck.nome}
                </div>
              ))
            ) : (
              <p className="home-recent-empty">Nenhum deck encontrado.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
