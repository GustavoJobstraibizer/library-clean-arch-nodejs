const ValidationTranslationKeys = require('../shared/errors/ValidationTranslationKeys');
const { Either, AppError } = require('../shared/errors');

module.exports = function cadastrarLivro({ livroRepository }) {
  if (!livroRepository) {
    throw new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR);
  }

  return async function ({ nome, quantidade, autor, genero, ISBN }) {
    const requiredFields = nome && quantidade && autor && genero && ISBN;

    if (!requiredFields) {
      throw new AppError(ValidationTranslationKeys.REQUIRED_FIELD_ERROR);
    }

    const isBookAlreadyRegistered = await livroRepository.existerPorISBN(ISBN);

    if (isBookAlreadyRegistered) {
      return Either.left('Livro já cadastrado');
    }

    const livro = {
      nome,
      quantidade,
      autor,
      genero,
      ISBN,
    };

    await livroRepository.cadastrar(livro);

    return Either.right(null);
  };
};
