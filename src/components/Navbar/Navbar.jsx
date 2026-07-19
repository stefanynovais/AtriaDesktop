import './styles.css';
import { FaSearch, FaSignOutAlt } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [termo, setTermo] = useState('');
  const [decksEncontrados, setDecksEncontrados] = useState([]);
  const [flashcardsEncontrados, setFlashcardsEncontrados] = useState([]);
  const [buscando, setBuscando] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // guarda o "id" do timeout do debounce entre re-renders
  const debounceRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Toda vez que o termo digitado muda, espera 400ms sem digitar
  // (debounce) antes de buscar de verdade — evita mandar uma requisição
  // pra cada letra digitada.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (termo.trim() === '') {
      setDecksEncontrados([]);
      setFlashcardsEncontrados([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setBuscando(true);
      try {
        const [respDecks, respFlashcards] = await Promise.all([
          api.get('/decks', { params: { search: termo } }),
          api.get('/flashcards/buscar', { params: { search: termo } }),
        ]);
        setDecksEncontrados(respDecks.data);
        setFlashcardsEncontrados(respFlashcards.data);
      } catch (error) {
        console.error('Erro ao buscar:', error);
      } finally {
        setBuscando(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [termo]);

  const temResultados = decksEncontrados.length > 0 || flashcardsEncontrados.length > 0;

  return (
    <div className="navbar">
      {showSearch && (
        <div className="wrap-search">
          <input
            type="text"
            placeholder="Pesquisar decks ou cards..."
            className="search-input"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            autoFocus
          />

          <span className="focus-search"></span>

          {termo.trim() !== '' && (
            <div className="search-results">
              {buscando && <p className="search-status">Buscando...</p>}

              {!buscando && !temResultados && (
                <p className="search-status">Nenhum resultado encontrado.</p>
              )}

              {decksEncontrados.length > 0 && (
                <div className="search-group">
                  <span className="search-group-title">Decks</span>
                  {decksEncontrados.map((deck) => (
                    <div
                      key={`deck-${deck.id}`}
                      className="search-result-item"
                      onClick={() => {
                        setShowSearch(false);
                        setTermo('');
                        navigate('/decks');
                      }}
                    >
                      {deck.title}
                    </div>
                  ))}
                </div>
              )}

              {flashcardsEncontrados.length > 0 && (
                <div className="search-group">
                  <span className="search-group-title">Flashcards</span>
                  {flashcardsEncontrados.map((card) => (
                    <div
                      key={`card-${card.id}`}
                      className="search-result-item"
                      onClick={() => {
                        setShowSearch(false);
                        setTermo('');
                        navigate('/decks');
                      }}
                    >
                      {card.front} → {card.back}
                      <span className="search-result-deck"> ({card.deck.title})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <FaSearch className="search-icon" onClick={() => setShowSearch(!showSearch)} />

      {user && (
        <span className="navbar-user-name" title={user.email}>
          {user.name}
        </span>
      )}

      <FaSignOutAlt className="logout-icon" title="Sair" onClick={handleLogout} />
    </div>
  );
}
