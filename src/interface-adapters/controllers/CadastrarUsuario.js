const { AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http-response');
const ValidationTranslationKeys = require('../../shared/errors/ValidationTranslationKeys');

const { z } = require('zod');

const CadastrarUsuarioSchema = z.object({
  nome_completo: z.string({ required_error: 'Nome completo é obrigatório' }),
  CPF: z
    .string({ required_error: 'CPF é obrigatório' })
    .refine((value) => /^(\d{3}.\d{3}.\d{3}-\d{2})$/.test(value)),
  endereco: z.string({ required_error: 'Endereço é obrigatório' }),
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email({ message: 'Email inválido' }),
  telefone: z.string({ required_error: 'Telefone é obrigatório' }),
});

module.exports = async function cadastrarUsuario({
  cadastrarUsuarioUseCase,
  httpRequest,
}) {
  if (!cadastrarUsuarioUseCase || !httpRequest?.body) {
    throw new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR);
  }

  const { nome_completo, endereco, CPF, email, telefone } =
    CadastrarUsuarioSchema.parse(httpRequest.body);

  const output = await cadastrarUsuarioUseCase({
    nome_completo,
    endereco,
    CPF,
    email,
    telefone,
  });

  return output.fold(
    (error) => httpResponse(400, error.message),
    () => httpResponse(201, null),
  );
};
