const httpResponse = require('../../shared/helpers/http-response');
const { AppError } = require('../../shared/errors');
const ValidationTranslationKeys = require('../../shared/errors/ValidationTranslationKeys');

const { z } = require('zod');

const emprestimoLivroValidator = z.object({
  livro_id: z.number({ required_error: 'Livro é obrigatório' }),
  usuario_id: z.number({ required_error: 'Usuário é obrigatório' }),
  data_retorno: z.string({ required_error: 'Data de retorno é obrigatória' }),
  data_saida: z.string({ required_error: 'Data de saída é obrigatória' }),
});

module.exports = async function emprestarLivro({
  emprestarLivroUseCase,
  httpRequest,
}) {
  if (!emprestarLivroUseCase || !httpRequest?.body) {
    throw new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR);
  }

  const { usuario_id, livro_id, data_retorno, data_saida } =
    emprestimoLivroValidator.parse(httpRequest.body);

  const output = await emprestarLivroUseCase({
    usuario_id,
    livro_id,
    data_retorno: new Date(data_retorno),
    data_saida: new Date(data_saida),
  });

  return output.fold(
    (error) => httpResponse(400, error.message),
    () => httpResponse(201, null),
  );
};
