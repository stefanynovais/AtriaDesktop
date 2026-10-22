// ModalConfirmacao.jsx
//
// Caixa de confirmação genérica (ex.: "Deseja realmente sair?").
// Fica por cima de tudo quando "aberto" é true.

import './ModalConfirmacao.css';

export default function ModalConfirmacao({ aberto, mensagem, onSim, onNao }) {
  if (!aberto) return null;

  return (
    <div className="modal-fundo" role="dialog" aria-modal="true">
      <div className="modal-caixa">
        <p className="modal-mensagem">{mensagem}</p>
        <div className="modal-botoes">
          <button type="button" className="modal-btn modal-btn-secundario" onClick={onNao}>
            Não
          </button>
          <button type="button" className="modal-btn" onClick={onSim}>
            Sim
          </button>
        </div>
      </div>
    </div>
  );
}
