// Middleware de tratamento de erros.
// Ele captura erros lançados pelos controllers e devolve resposta JSON padronizada.

export const errorHandler = (err, req, res, next) => {
  console.error(err)
  res.status(500).json({
    status: 'error',
    message: err.message || 'Erro interno do servidor',
  })
}
