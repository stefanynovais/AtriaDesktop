// api.js
//
// Instância central do Axios usada por todo o app pra falar com a API.
// Todo componente que precisa chamar o backend importa "api" daqui,
// em vez de usar axios direto — assim o token é anexado automaticamente
// em toda requisição, sem precisar repetir esse código em cada tela.

import axios from 'axios';

// Em produção, a URL do servidor vem da variável VITE_API_URL (definida no build).
// Sem ela, usa o servidor local, então o desenvolvimento continua igual.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

// Roda ANTES de toda requisição sair. Pega o token salvo no localStorage
// (se existir) e gruda ele no cabeçalho Authorization.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('atria_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;