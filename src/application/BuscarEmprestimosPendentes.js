const ValidationTranslationKeys = require('../shared/errors/ValidationTranslationKeys');
const { Either, AppError } = require('../shared/errors');

module.exports = function buscarEmprestimosPendentes({ emprestimoRepository }) {
  if (!emprestimoRepository) {
    throw new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR);
  }

  return async () => {
    const emprestimosPendentes = await emprestimoRepository.buscarPendentes();

    return Either.right(emprestimosPendentes);
  };
};
