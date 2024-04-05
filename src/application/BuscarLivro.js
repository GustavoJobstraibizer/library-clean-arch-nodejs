const ValidationTranslationKeys = require('../shared/errors/ValidationTranslationKeys');
const { Either, AppError } = require('../shared/errors');

module.exports = function buscarLivro({ livroRepository }) {
  if (!livroRepository) {
    throw new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR);
  }

  return async function ({ valor }) {
    if (!valor) {
      throw new AppError(ValidationTranslationKeys.REQUIRED_FIELD_ERROR);
    }

    const livros = await livroRepository.buscarPorNomeOuISBN(valor);

    return Either.right(livros);
  };
};
