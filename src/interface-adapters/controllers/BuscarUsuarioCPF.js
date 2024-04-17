const ValidationTranslationKeys = require('../../shared/errors/ValidationTranslationKeys');
const { AppError } = require('../../shared/errors');

const { z } = require('zod');
const httpResponse = require('../../shared/helpers/http-response');

const validator = z.object({
  CPF: z
    .string({ required_error: 'CPF é obrigatório' })
    .refine((value) => /^(\d{3}.\d{3}.\d{3}-\d{2})$/.test(value), {
      message: 'CPF inválido',
    }),
});

module.exports = async function buscarUsuarioCPF({
  buscarUsuarioCPFUseCase,
  httpRequest,
}) {
  if (!buscarUsuarioCPFUseCase || !httpRequest?.params) {
    throw new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR);
  }

  const { CPF } = validator.parse(httpRequest.params);

  const output = await buscarUsuarioCPFUseCase({ CPF });

  return output.fold(
    (error) => httpResponse(400, error.message),
    (usuario) => httpResponse(200, usuario),
  );
};
