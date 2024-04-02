const AppError = require('../shared/errors/AppError');

module.exports = function cadastrarUsuario({ usuarioRepository }) {
  if (!usuarioRepository) {
    throw new AppError(AppError.dependencyError);
  }

  return async function ({ nome_completo, CPF, telefone, endereco, email }) {
    const validateRequiredFields =
      nome_completo && CPF && telefone && endereco && email;

    if (!validateRequiredFields) {
      throw new AppError(AppError.requiredFieldError);
    }

    await usuarioRepository.cadastrar({
      nome_completo,
      CPF,
      telefone,
      endereco,
      email,
    });
  };
};
