const ValidationTranslationKeys = require('../../shared/errors/ValidationTranslationKeys');
const { AppError } = require('../../shared/errors');

const emprestimoEntity = () => {
  const calcularDiasAtraso = (data_retorno, data_devolucao) => {
    return (
      new Date(data_retorno).getTime() < new Date(data_devolucao).getTime()
    );
  };

  const calcularMulta = ({ data_retorno, data_devolucao }) => {
    if (!data_retorno || !data_devolucao) {
      return new AppError(ValidationTranslationKeys.REQUIRED_FIELD_ERROR);
    }

    const diasAtraso = calcularDiasAtraso(data_retorno, data_devolucao);
    return diasAtraso ? { multa: 10, currency: 'BRL' } : null;
  };

  return {
    calcularMulta,
  };
};

module.exports = emprestimoEntity();
