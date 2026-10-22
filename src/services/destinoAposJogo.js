// Depois de terminar um jogo: se o aluno tem palavras para revisar,
// vai para a página de revisão de erros; senão, volta para a home.
import api from './api';

export async function destinoAposJogo() {
  try {
    const resposta = await api.get('/estatisticas/aluno');
    return resposta.data.numeroPalavrasParaRevisar > 0 ? '/revisao-erros' : '/home';
  } catch {
    return '/home';
  }
}
