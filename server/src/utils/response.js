// Utilitário de resposta padrão para a API.
// Ele ajuda a padronizar a formatação do JSON enviado para o cliente.

export const sendSuccess = (res, data, message = 'Operação realizada com sucesso') => {
  res.json({ status: 'success', message, data })
}

export const sendError = (res, message = 'Erro interno do servidor', status = 500) => {
  res.status(status).json({ status: 'error', message })
}
