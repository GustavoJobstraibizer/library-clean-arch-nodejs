const httpResponse = require('../../shared/helpers/http-response');
const { AppError } = require('../../shared/errors');
const ValidationTranslationKeys = require('../../shared/errors/ValidationTranslationKeys');

const { z } = require('zod');

const livroValidator = z.object({
  nome: z.string({ required_error: 'Nome é obrigatório' }),
  quantidade: z.number({ required_error: 'Quantidade é obrigatória' }),
  autor: z.string({ required_error: 'Autor é obrigatório' }),
  genero: z.string({ required_error: 'Gênero é obrigatório' }),
  ISBN: z.string({ required_error: 'ISBN é obrigatório' }),
});

module.exports = async function cadastrarLivro({
  cadastrarLivroUseCase,
  httpRequest,
}) {
  if (!cadastrarLivroUseCase || !httpRequest?.body) {
    throw new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR);
  }

  const { nome, quantidade, autor, genero, ISBN } = livroValidator.parse(
    httpRequest.body,
  );

  const output = await cadastrarLivroUseCase({
    nome,
    quantidade,
    autor,
    genero,
    ISBN,
  });

  return output.fold(
    (error) => httpResponse(400, error?.message),
    () => httpResponse(201, null),
  );
};
