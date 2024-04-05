const { AppError } = require('../shared/errors');
const buscarEmprestimosPendentes = require('./BuscarEmprestimosPendentes');
const ValidationTranslationKeys = require('../shared/errors/ValidationTranslationKeys');

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
    const emprestimos = [
      {
        usuario: { nome: 'Teste', CPF: '123456789-00' },
        livro: { nome: 'Livro 1' },
        data_saida: '2024-01-10',
        data_retorno: '2024-01-17',
      },
      {
        usuario: { nome: 'Teste 2', CPF: '123456789-01' },
        livro: { nome: 'Livro 2' },
        data_saida: '2024-01-12',
        data_retorno: '2024-01-20',
      },
    ];

    emprestimoRepository.buscarPendentes.mockResolvedValue(emprestimos);

    const sut = buscarEmprestimosPendentes({ emprestimoRepository });
    const output = await sut();

    expect(output.right).toEqual(emprestimos);
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
