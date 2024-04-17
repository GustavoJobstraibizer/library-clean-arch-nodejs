const httpResponse = require('../../shared/helpers/http-response');
const { AppError } = require('../../shared/errors');
const ValidationTranslationKeys = require('../../shared/errors/ValidationTranslationKeys');

const { z } = require('zod');

const devolverLivroValidatorBody = z.object({
  data_devolucao: z.string({
    required_error: 'Data de devolução é obrigatória',
  }),
});

module.exports = async function devolverLivro({
  devolverLivroUseCase,
  httpRequest,
}) {
  if (!devolverLivroUseCase || !httpRequest?.body || !httpRequest?.params) {
    throw new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR);
  }

  const { data_devolucao } = devolverLivroValidatorBody.parse(httpRequest.body);
  const { emprestimo_id } = httpRequest.params;

  const output = await devolverLivroUseCase({
    emprestimo_id,
    data_devolucao,
  });

  return output.fold(
    (error) => httpResponse(400, error.message),
    (success) => httpResponse(200, success),
  );
};
