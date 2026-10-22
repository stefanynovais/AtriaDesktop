// Botão do perfil para trocar o modo de letras. Ao passar o mouse, mostra
// a explicação do modo para o qual a pessoa vai trocar.
import { useEffect, useState } from "react";
import { MAIUSCULAS, MISTO, buscarModoLetras, lerModoSalvo, salvarModoLetras } from "../../services/letras";

export default function BotaoModoLetras() {
  const [modo, setModo] = useState(lerModoSalvo() || MISTO);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let cancelado = false;
    buscarModoLetras()
      .then((m) => {
        if (!cancelado && m) setModo(m);
      })
      .catch(() => {});
    return () => {
      cancelado = true;
    };
  }, []);

  const alternar = async () => {
    const novo = modo === MAIUSCULAS ? MISTO : MAIUSCULAS;
    setSalvando(true);
    try {
      await salvarModoLetras(novo);
      setModo(novo);
    } catch {
      /* mantém o modo atual se não conseguir salvar */
    } finally {
      setSalvando(false);
    }
  };

  const estaEmMaiusculas = modo === MAIUSCULAS;
  const rotulo = estaEmMaiusculas ? "Usar maiúsculas e minúsculas" : "Modo alfabetização";
  const dica = estaEmMaiusculas
    ? "Voltar para o modo com letras maiúsculas e minúsculas."
    : "Todas as letras ficam em maiúsculas, para ajudar quem está aprendendo a ler.";

  return (
    <div className="ml-botao-area">
      <button
        type="button"
        className="ml-botao"
        onClick={alternar}
        disabled={salvando}
        data-dica={dica}
      >
        {rotulo}
      </button>
    </div>
  );
}
