// ProtectedRoute.jsx
//
// Envolve qualquer página que exija login. Se o usuário não estiver
// autenticado, redireciona pra /login automaticamente.
//
// Uso no AppRouter:
//   <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { estaLogado, carregando } = useAuth();

  // Enquanto o AuthContext ainda está checando se existe um token salvo
  // (acontece só um instante, ao abrir o app), não decide nada ainda —
  // evita "piscar" a tela de login antes de confirmar que já tem sessão.
  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (!estaLogado) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
