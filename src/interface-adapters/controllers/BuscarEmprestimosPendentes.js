const ValidationTranslationKeys = require('../../shared/errors/ValidationTranslationKeys');
const httpResponse = require('../../shared/helpers/http-response');
const { AppError } = require('../../shared/errors');

module.exports = async function buscarEmprestimosPendentes({
  buscarEmprestimosPendentesUseCase,
}) {
  if (!buscarEmprestimosPendentesUseCase) {
    throw new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR);
  }

  const output = await buscarEmprestimosPendentesUseCase();

  return output.fold(
    (error) => httpResponse(400, error?.message),
    (emprestimos) => httpResponse(200, emprestimos),
  );
};
