// ProtectedRoute.jsx
//
// Envolve qualquer página que exija login. Se o usuário não estiver
// autenticado, redireciona pra /login automaticamente.
// Se ele usar o botão voltar do navegador numa página protegida, pergunta
// antes de sair: "Deseja realmente sair?". Sim = sai e vai pro login.
//
// Uso no AppRouter:
//   <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

import { useEffect, useState } from 'react';
import { Navigate, useBlocker, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ModalConfirmacao from '../ModalConfirmacao/ModalConfirmacao';
import PopupAlfabetizacao from '../ModoLetras/PopupAlfabetizacao';
import '../ModoLetras/style.css';
import { aplicarModoLetras, buscarModoLetras, lerModoSalvo } from '../../services/letras';

export const ProtectedRoute = ({ children }) => {
  const { estaLogado, carregando, logout } = useAuth();
  const navigate = useNavigate();
  const [precisaEscolherLetras, setPrecisaEscolherLetras] = useState(false);

  // Aplica o modo de letras da conta (e pergunta uma vez, se ainda não escolheu)
  useEffect(() => {
    if (!estaLogado) return;
    const salvo = lerModoSalvo();
    if (salvo) aplicarModoLetras(salvo);

    let cancelado = false;
    buscarModoLetras()
      .then((modo) => {
        if (cancelado) return;
        if (modo) aplicarModoLetras(modo);
        else setPrecisaEscolherLetras(true);
      })
      .catch(() => {});

    return () => {
      cancelado = true;
      aplicarModoLetras(null);
    };
  }, [estaLogado]);

  // Segura só a navegação "voltar" (POP) enquanto o usuário está logado.
  const blocker = useBlocker(({ historyAction }) => historyAction === 'POP' && estaLogado);

  // Enquanto o AuthContext ainda está checando se existe um token salvo
  // (acontece só um instante, ao abrir o app), não decide nada ainda —
  // evita "piscar" a tela de login antes de confirmar que já tem sessão.
  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (!estaLogado) {
    return <Navigate to="/login" replace />;
  }

  const sair = () => {
    blocker.reset();
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {children}
      <ModalConfirmacao
        aberto={blocker.state === 'blocked'}
        mensagem="Deseja realmente sair?"
        onSim={sair}
        onNao={() => blocker.reset()}
      />
      {precisaEscolherLetras && (
        <PopupAlfabetizacao
          onEscolher={() => setPrecisaEscolherLetras(false)}
        />
      )}
    </>
  );
};

