const ValidationTranslationKeys = require('../shared/errors/ValidationTranslationKeys');
const { AppError, Either } = require('../shared/errors');

module.exports = function emprestimoLivro({
  emprestimoRepository,
  emailService,
}) {
  if (!emprestimoRepository || !emailService) {
    throw new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR);
  }

  return async function ({
    usuario_id,
    livro_id,
    data_retorno,
    data_saida,
    data_devolucao,
  }) {
    const isRequiredFieldsProvided =
      usuario_id && livro_id && data_retorno && data_saida;

    if (!isRequiredFieldsProvided) {
      throw new AppError(ValidationTranslationKeys.REQUIRED_FIELD_ERROR);
    }

    if (data_retorno.getTime() < data_saida.getTime()) {
      return Either.left(
        ValidationTranslationKeys.RETURN_DATE_BEFORE_START_DATE,
      );
    }

    const isBookPendingLent =
      await emprestimoRepository.buscarPorLivroEmprestadoPendenteUsuario({
        usuario_id,
        livro_id,
      });

    if (isBookPendingLent) {
      return Either.left(ValidationTranslationKeys.BOOK_ALREADY_LENT);
    }

    const emprestimoLivroId = await emprestimoRepository.emprestar({
      usuario_id,
      livro_id,
      data_retorno,
      data_saida,
      data_devolucao,
    });

    const { usuario, livro } = await emprestimoRepository.buscarPorId(
      emprestimoLivroId,
    );

    await emailService.send({
      data_saida,
      data_retorno,
      nome: usuario.nome,
      email: usuario.email,
      CPF: usuario.CPF,
      livro: livro.nome,
    });

    return Either.right(null);
  };
};
