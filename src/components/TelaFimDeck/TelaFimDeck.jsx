// TelaFimDeck.jsx
//
// Tela mostrada quando o aluno termina os cartões de um deck. Diz o nome
// do deck e, se houver erros, leva para a revisão; senão, para a home.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { destinoAposJogo } from "../../services/destinoAposJogo";
import "./style.css";

export default function TelaFimDeck({ nomeDeck }) {
  const navigate = useNavigate();
  const [destino, setDestino] = useState(null);

  useEffect(() => {
    let cancelado = false;
    destinoAposJogo().then((d) => {
      if (!cancelado) setDestino(d);
    });
    return () => {
      cancelado = true;
    };
  }, []);

  if (!destino) {
    return (
      <div className="tfd-caixa">
        <p className="tfd-texto">Carregando...</p>
      </div>
    );
  }

  const temErros = destino === "/revisao-erros";

  return (
    <div className="tfd-caixa">
      <p className="tfd-pequeno">Você terminou os cartões do deck</p>
      <h2 className="tfd-deck">{nomeDeck || "Deck"}</h2>

      {temErros ? (
        <>
          <p className="tfd-texto">Agora vamos revisar os seus erros.</p>
          <button type="button" className="tfd-botao" onClick={() => navigate("/revisao-erros")}>
            Começar revisão
          </button>
        </>
      ) : (
        <>
          <p className="tfd-texto">Você não tem erros para revisar. Muito bem!</p>
          <button type="button" className="tfd-botao" onClick={() => navigate("/home")}>
            Voltar ao início
          </button>
        </>
      )}
    </div>
  );
}
