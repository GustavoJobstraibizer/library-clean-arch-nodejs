const ValidationTranslationKeys = require('../shared/errors/ValidationTranslationKeys');
const { Either, AppError } = require('../shared/errors');
const emprestimoEntity = require('../enterprise/entities/Emprestimo');

module.exports = function devolverLivro({ emprestimoRepository }) {
  if (!emprestimoRepository) {
    throw new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR);
  }

  return async function ({ emprestimo_id, data_devolucao }) {
    if (!emprestimo_id || !data_devolucao) {
      throw new AppError(ValidationTranslationKeys.REQUIRED_FIELD_ERROR);
    }

    const { data_retorno } = await emprestimoRepository.devolver({
      emprestimo_id,
      data_devolucao,
    });

    if (!data_retorno) {
      throw new AppError(ValidationTranslationKeys.NOT_FOUND);
    }

    const calcularMulta = emprestimoEntity.calcularMulta({
      data_retorno,
      data_devolucao,
    });

    return Either.right(calcularMulta);
  };
};
