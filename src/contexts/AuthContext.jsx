// AuthContext.jsx
//
// Guarda o estado de autenticação (usuário logado + token) em um lugar só,
// acessível por qualquer componente do app através do hook useAuth().
//
// Responsabilidades:
//   - Login e Registro (chamam a API e salvam o token)
//   - Logout (limpa o token)
//   - Ao abrir o app, verifica se já existe um token salvo (localStorage)
//     e recupera o usuário logado automaticamente, sem pedir login de novo

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

// O back só conhece dois perfis: COMUM e PROFESSOR.
// No front, o perfil de professor aparece como "institucional".
const traduzirPerfil = (role) =>
  role === 'INSTITUCIONAL' || role === 'PROFESSOR' ? 'PROFESSOR' : 'COMUM';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [carregando, setCarregando] = useState(true); // true enquanto verifica se já tem login salvo

  // Ao carregar o app pela primeira vez, verifica se já existe um token salvo
  useEffect(() => {
    const verificarLoginSalvo = async () => {
      const token = localStorage.getItem('atria_token');

      if (!token) {
        setCarregando(false);
        return;
      }

      try {
        const resposta = await api.get('/auth/profile');
        setUser(resposta.data);
      } catch (error) {
        // Só apaga o token se o back disse que ele é inválido ou expirou (401).
        // Se a API estiver fora do ar, mantém o token pra tentar de novo depois.
        if (error.response?.status === 401) {
          localStorage.removeItem('atria_token');
        }
        setUser(null);
      } finally {
        setCarregando(false);
      }
    };

    verificarLoginSalvo();
  }, []);

  const login = async (email, password) => {
    const resposta = await api.post('/auth/login', { email, password });
    localStorage.setItem('atria_token', resposta.data.token);
    setUser(resposta.data.user);
    return resposta.data.user;
  };

  const registrar = async (name, email, password, role, codigoEtec = null) => {
    const payload = { name, email, password, role: traduzirPerfil(role) };

    // Manda o código da ETEC sempre que ele existir; quem decide se ele é
    // obrigatório é o back.
    if (codigoEtec) {
      payload.codigoEtec = codigoEtec;
    }

    const resposta = await api.post('/auth/register', payload);
    localStorage.setItem('atria_token', resposta.data.token);
    setUser(resposta.data.user);
    return resposta.data.user;
  };

  const logout = () => {
    localStorage.removeItem('atria_token');
    setUser(null);
  };

  const valor = {
    user,
    carregando,
    estaLogado: !!user,
    login,
    registrar,
    logout,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
};

// Hook usado pelos componentes: const { user, login, logout } = useAuth()
export const useAuth = () => {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth precisa ser usado dentro de um <AuthProvider>');
  }
  return contexto;
};
