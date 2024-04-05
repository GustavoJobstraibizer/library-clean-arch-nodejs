const ValidationTranslationKeys = require('../shared/errors/ValidationTranslationKeys');
const { AppError } = require('../shared/errors');
const buscarLivro = require('./BuscarLivro');

describe('BuscarLivro UseCase', () => {
  const livroRepository = {
    buscarPorNomeOuISBN: jest.fn(),
  };

  it('deve retornar um livro por ISBN ou nome existente', async () => {
    const nomeISBNDTO = {
      valor: 'valor_valido',
    };

    const livroDTO = [
      {
        nome: 'Livro de Teste',
        quantidade: 10,
        autor: 'Autor Teste',
        genero: 'Terror',
        ISBN: 'valor_valido',
      },
    ];

    livroRepository.buscarPorNomeOuISBN.mockResolvedValueOnce(livroDTO);

    const sut = buscarLivro({ livroRepository });
    const output = await sut(nomeISBNDTO);

    expect(output.right).toEqual(livroDTO);
    expect(livroRepository.buscarPorNomeOuISBN).toHaveBeenCalledTimes(1);
    expect(livroRepository.buscarPorNomeOuISBN).toHaveBeenCalledWith(
      nomeISBNDTO.valor,
    );
  });

  it('deve retornar um Array vazio se não encontrar livro', async () => {
    const nomeISBNDTO = {
      valor: 'valor_invalido',
    };

    livroRepository.buscarPorNomeOuISBN.mockResolvedValueOnce([]);

    const sut = buscarLivro({ livroRepository });
    const output = await sut(nomeISBNDTO);

    expect(output.right).toEqual([]);
    expect(livroRepository.buscarPorNomeOuISBN).toHaveBeenCalledTimes(1);
    expect(livroRepository.buscarPorNomeOuISBN).toHaveBeenCalledWith(
      nomeISBNDTO.valor,
    );
  });

  it('deve retornar um AppError se o repositório não for injetado', () => {
    expect(() => buscarLivro({})).toThrow(
      new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR),
    );
  });

  it('deve retornar um AppError se o valor não for informado', async () => {
    const sut = buscarLivro({ livroRepository });

    await expect(() => sut({})).rejects.toThrow(
      new AppError(ValidationTranslationKeys.REQUIRED_FIELD_ERROR),
    );
  });
});
