const ValidationTranslationKeys = require('../shared/errors/ValidationTranslationKeys');
const { Either, AppError } = require('../shared/errors');

module.exports = function buscarUsuario({ usuarioRepository }) {
  if (!usuarioRepository) {
    throw new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR);
  }

  return async function ({ CPF }) {
    if (!CPF) {
      throw new AppError(ValidationTranslationKeys.REQUIRED_FIELD_ERROR);
    }

    const usuario = await usuarioRepository.buscarPorCPF(CPF);

    return Either.right(usuario ?? null);
  };
};
