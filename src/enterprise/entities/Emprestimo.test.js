const ValidationTranslationKeys = require('../../shared/errors/ValidationTranslationKeys');
const { AppError } = require('../../shared/errors');
const emprestimoEntity = require('./Emprestimo');

describe('Emprestimo Entity', () => {
  it('deve calcular a multa de um empréstimo sem atraso', () => {
    const data_retorno = '2024-01-15';
    const data_devolucao = '2024-01-10';

    const output = emprestimoEntity.calcularMulta({
      data_retorno,
      data_devolucao,
    });

    expect(output).toBeNull();
  });

  it('deve calcular a multa de um empréstimo com atraso', () => {
    const data_retorno = '2024-01-10';
    const data_devolucao = '2024-01-11';

    const output = emprestimoEntity.calcularMulta({
      data_retorno,
      data_devolucao,
    });

    expect(output).toEqual({ multa: 10, currency: 'BRL' });
  });

  it('deve retornar um AppError se data_retorno ou data_devolucao não forem fornecidos', () => {
    const output = emprestimoEntity.calcularMulta({});

    expect(output).toBeInstanceOf(AppError);
    expect(output.message).toBe(ValidationTranslationKeys.REQUIRED_FIELD_ERROR);
  });
});
