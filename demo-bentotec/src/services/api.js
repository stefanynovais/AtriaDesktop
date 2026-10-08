// api.js
//
// Conversa com o back-end da Atria. O quiz não tem tela de login: ele entra sozinho com a
// conta de professor definida em config.js e guarda o token só na memória.

import { API_URL, EMAIL_PROFESSOR, SENHA } from '../config';

let token = null;

// Erro lançado quando não dá nem pra entrar na API; a mensagem já explica a causa.
export class ErroApi extends Error {}

// Texto que explica por que o login falhou. "motivo" é um destes:
//   'sem-conexao'     o servidor não respondeu (back-end desligado ou endereço errado)
//   'login-recusado'  o servidor respondeu, mas recusou o email/senha (ex: a conta não existe)
//   'erro-servidor'   o servidor respondeu com erro 5xx (ex: o banco de dados caiu)
export function mensagemDaFalha(falha) {
  if (falha.motivo === 'login-recusado') {
    return `O servidor está no ar, mas recusou o login de ${EMAIL_PROFESSOR} (${falha.detalhe}). Confira EMAIL_PROFESSOR e SENHA em src/config.js e se essa conta existe no banco.`;
  }
  if (falha.motivo === 'erro-servidor') {
    return `O servidor respondeu com erro (${falha.detalhe}). Olhe o terminal do back-end: o banco de dados pode estar fora do ar.`;
  }
  return `Servidor fora do ar. Ligue o back-end (${API_URL.replace('/api', '')}) e tente de novo.`;
}

// Entra na API. Devolve { ok: true } ou { ok: false, motivo, detalhe } (motivos acima).
export async function fazerLogin() {
  let resposta;
  try {
    resposta = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL_PROFESSOR, password: SENHA }),
    });
  } catch (erro) {
    console.error('Login na API falhou (sem conexão):', erro);
    token = null;
    return { ok: false, motivo: 'sem-conexao', detalhe: '' };
  }

  const dados = await resposta.json().catch(() => ({}));
  if (resposta.ok && dados.token) {
    token = dados.token;
    return { ok: true };
  }

  token = null;
  const detalhe = dados.message || `erro ${resposta.status}`;
  console.error('Login na API falhou:', resposta.status, detalhe);
  return { ok: false, motivo: resposta.status >= 500 ? 'erro-servidor' : 'login-recusado', detalhe };
}

// Faz uma chamada já com o token. Se o token venceu (401), entra de novo sozinho e repete
// a chamada uma vez. Se nem o login funcionar, lança um ErroApi explicando o motivo.
export async function chamarAPI(caminho, opcoes = {}, jaTentouDeNovo = false) {
  if (!token) {
    const login = await fazerLogin();
    if (!login.ok) throw new ErroApi(mensagemDaFalha(login));
  }

  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      ...(opcoes.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (resposta.status === 401 && !jaTentouDeNovo) {
    token = null;
    return chamarAPI(caminho, opcoes, true);
  }
  return resposta;
}
