// Pop-up que aparece uma vez, quando a pessoa ainda não escolheu o modo.
import { useState } from "react";
import { MAIUSCULAS, MISTO, salvarModoLetras, aplicarModoLetras } from "../../services/letras";

export default function PopupAlfabetizacao({ onEscolher }) {
  const [enviando, setEnviando] = useState(false);

  const escolher = async (modo) => {
    setEnviando(true);
    try {
      await salvarModoLetras(modo);
    } catch {
      // se não salvar, aplica só agora; o pop-up pode aparecer de novo depois
      aplicarModoLetras(modo);
    } finally {
      onEscolher(modo);
    }
  };

  return (
    <div className="ml-overlay">
      <div className="ml-caixa" role="dialog" aria-modal="true">
        <h2 className="ml-titulo">Alfabetização Atria</h2>
        <p className="ml-texto">
          Quer usar o Atria com letras maiúsculas? Todo o site fica em maiúsculas, o que ajuda
          quem está aprendendo a ler e a reconhecer as letras. Você pode mudar isso quando
          quiser pelo botão no seu perfil.
        </p>
        <div className="ml-botoes">
          <button
            type="button"
            className="ml-btn-principal"
            onClick={() => escolher(MAIUSCULAS)}
            disabled={enviando}
          >
            Quero
          </button>
          <button
            type="button"
            className="ml-btn-secundario"
            onClick={() => escolher(MISTO)}
            disabled={enviando}
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}
