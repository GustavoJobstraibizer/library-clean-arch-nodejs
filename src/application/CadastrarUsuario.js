const ValidationTranslationKeys = require('../shared/errors/ValidationTranslationKeys');
const { AppError, Either } = require('../shared/errors');

module.exports = function cadastrarUsuario({ usuarioRepository }) {
  if (!usuarioRepository) {
    throw new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR);
  }

  return async function ({ nome_completo, CPF, telefone, endereco, email }) {
    const validateRequiredFields =
      nome_completo && CPF && telefone && endereco && email;

    if (!validateRequiredFields) {
      return Either.left('Campos obrigatórios não informados');
    }

    const isCPFAlreadyExists = await usuarioRepository.existePorCPF(CPF);

    if (isCPFAlreadyExists) {
      return Either.left('CPF já cadastrado');
    }

    const isEmailAlreadyExists = await usuarioRepository.existerPorEmail(email);

    if (isEmailAlreadyExists) {
      return Either.left('E-mail já cadastrado');
    }

    await usuarioRepository.cadastrar({
      nome_completo,
      CPF,
      telefone,
      endereco,
      email,
    });

    return Either.right(null);
  };
};
