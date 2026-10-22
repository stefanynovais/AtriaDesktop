// DecksProntos.jsx
//
// Página simples: lista de decks prontos. Cada item baixa o arquivo .apkg.
// Para importar, a pessoa usa o botão de importar na tela inicial.

import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { decksProntos } from "../../data/decksProntos";
import "./style.css";

export default function DecksProntos() {
  const navigate = useNavigate();

  return (
    <DashboardLayout hideHeader hideDots>
      <div className="dp-pagina">
        <div className="dp-coluna">
          <button type="button" className="dp-voltar" onClick={() => navigate("/home")}>
            ← Voltar
          </button>
          <h1 className="dp-titulo">Decks prontos</h1>
          <p className="dp-intro">
            Clique em um deck para baixar. Depois, importe o arquivo na tela inicial.
          </p>

          {decksProntos.map((deck) => (
            <a key={deck.arquivo} className="dp-item" href={deck.arquivo} download>
              <span className="dp-nome">{deck.titulo}</span>
              <span className="dp-baixar">Baixar</span>
            </a>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
