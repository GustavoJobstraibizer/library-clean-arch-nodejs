const { AppError } = require('../shared/errors');
const buscarEmprestimosPendentes = require('./BuscarEmprestimosPendentes');
const ValidationTranslationKeys = require('../shared/errors/ValidationTranslationKeys');
const emprestimosPendentes = require('../../tests/__mocks__/emprestimos-pendentes');

describe('BuscarEmprestimosPendentes UseCase', () => {
  const emprestimoRepository = {
    buscarPendentes: jest.fn(),
  };

  it('deve retornar um AppError se o repositório não for injetado', () => {
    expect(() => buscarEmprestimosPendentes({})).toThrow(
      new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR),
    );
  });

  it('deve retornar um lista com os emprestimos pendentes', async () => {
    emprestimoRepository.buscarPendentes.mockResolvedValue(
      emprestimosPendentes,
    );

    const sut = buscarEmprestimosPendentes({ emprestimoRepository });
    const output = await sut();

    expect(output.right).toEqual(emprestimosPendentes);
    expect(output.right).toHaveLength(2);
    expect(emprestimoRepository.buscarPendentes).toHaveBeenCalledTimes(1);

    expect(output.right[0].usuario.nome).toBe('Teste');
    expect(output.right[0].usuario.CPF).toBe('123456789-00');
    expect(output.right[0].livro.nome).toBe('Livro 1');
    expect(output.right[0].data_saida).toBe('2024-01-10');
    expect(output.right[0].data_retorno).toBe('2024-01-17');

    expect(output.right[1].usuario.nome).toBe('Teste 2');
    expect(output.right[1].usuario.CPF).toBe('123456789-01');
    expect(output.right[1].livro.nome).toBe('Livro 2');
    expect(output.right[1].data_saida).toBe('2024-01-12');
    expect(output.right[1].data_retorno).toBe('2024-01-20');
  });

  it('deve retornar uma lista vazia se não houver emprestimos pendentes', async () => {
    emprestimoRepository.buscarPendentes.mockResolvedValue([]);

    const sut = buscarEmprestimosPendentes({ emprestimoRepository });
    const output = await sut();

    expect(output.right).toEqual([]);
    expect(output.right).toHaveLength(0);
    expect(emprestimoRepository.buscarPendentes).toHaveBeenCalledTimes(1);
  });
});
