const httpResponse = require('../../shared/helpers/http-response');
const { AppError } = require('../../shared/errors');
const ValidationTranslationKeys = require('../../shared/errors/ValidationTranslationKeys');

const { z } = require('zod');

const livroValidator = z.object({
  valor: z.string({ required_error: 'Valor é obrigatório' }),
});

module.exports = async function buscarLivroNomeOuISBN({
  buscarLivroNomeOuISBNUseCase,
  httpRequest,
}) {
  if (!buscarLivroNomeOuISBNUseCase || !httpRequest?.query) {
    throw new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR);
  }

  const { valor } = livroValidator.parse(httpRequest.query);

  const output = await buscarLivroNomeOuISBNUseCase({
    valor,
  });

  return output.fold(
    (error) => httpResponse(400, error.message),
    (livro) => httpResponse(200, livro),
  );
};
