const ValidationTranslationKeys = require('../../shared/errors/ValidationTranslationKeys');
const { Either, AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http-response');
const buscarEmprestimosPendentes = require('./BuscarEmprestimosPendentes');
const emprestimosPendentes = require('../../../tests/__mocks__/emprestimos-pendentes');

describe('BuscarEmprestimosPendentes Controller', () => {
  const buscarEmprestimosPendentesUseCase = jest.fn();

  it('deve retornar httpStatus code 200 com uma lista de emprestimos pendentes', async () => {
    buscarEmprestimosPendentesUseCase.mockResolvedValue(
      Either.right(emprestimosPendentes),
    );

    const output = await buscarEmprestimosPendentes({
      buscarEmprestimosPendentesUseCase,
    });

    expect(output).toEqual(httpResponse(200, emprestimosPendentes));
    expect(buscarEmprestimosPendentesUseCase).toHaveBeenCalledTimes(1);
  });

  it('deve retornar um AppError se as dependências não forem fornecidas', async () => {
    expect(() => buscarEmprestimosPendentes({})).rejects.toThrow(
      new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR),
    );
  });
});
