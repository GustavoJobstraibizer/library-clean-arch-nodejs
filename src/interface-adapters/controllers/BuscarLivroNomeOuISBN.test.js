const httpResponse = require('../../shared/helpers/http-response');
const { Either, AppError } = require('../../shared/errors');
const buscarLivroNomeOuISBN = require('./BuscarLivroNomeOuISBN');
const ValidationTranslationKeys = require('../../shared/errors/ValidationTranslationKeys');
const { ZodError } = require('zod');

describe('BuscarLivroNomeOuISBN Controller', () => {
  const buscarLivroNomeOuISBNUseCase = jest.fn();

  it('deve retornar um livro com o statusCode 200 ao buscar um livro por nome ou ISBN', async () => {
    const livrosDTO = [
      {
        nome: 'Livro Teste',
        quantidade: 1,
        autor: 'Autor Teste',
        genero: 'Genero Teste',
        ISBN: 'ISBN Teste',
      },
      {
        nome: 'Livro Teste 2',
        quantidade: 1,
        autor: 'Autor Teste 2',
        genero: 'Genero Teste 2',
        ISBN: 'ISBN Teste 2',
      },
    ];

    buscarLivroNomeOuISBNUseCase.mockResolvedValue(Either.right(livrosDTO));

    const httpRequest = {
      query: {
        valor: 'Livro Teste',
      },
    };

    const response = await buscarLivroNomeOuISBN({
      buscarLivroNomeOuISBNUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(200, livrosDTO));
    expect(buscarLivroNomeOuISBNUseCase).toHaveBeenCalledWith(
      httpRequest.query,
    );
  });

  it('deve retornar um httpCode 200 com o body com um array vazio se nao encontrar livros', async () => {
    buscarLivroNomeOuISBNUseCase.mockResolvedValue(Either.right([]));

    const httpRequest = {
      query: {
        valor: 'Livro Teste',
      },
    };

    const response = await buscarLivroNomeOuISBN({
      buscarLivroNomeOuISBNUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(200, []));
    expect(buscarLivroNomeOuISBNUseCase).toHaveBeenCalledWith(
      httpRequest.query,
    );
  });

  it('deve retornar um erro com o statusCode 400 ao buscar um livro com dados invalidos', async () => {
    buscarLivroNomeOuISBNUseCase.mockResolvedValue(
      Either.left({ message: 'Livro não encontrado' }),
    );

    const httpRequest = {
      query: {
        valor: 'Livro Teste',
      },
    };

    const response = await buscarLivroNomeOuISBN({
      buscarLivroNomeOuISBNUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(400, 'Livro não encontrado'));
  });

  it('deve retornar um AppError se as dependencias nao forem fornecidas', async () => {
    expect(() => buscarLivroNomeOuISBN({})).rejects.toThrow(
      new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR),
    );
  });

  it('deve retornar um erro de validacao do Zod caso o valor nao seja fornecido', async () => {
    const httpRequest = {
      query: {},
    };

    expect(() =>
      buscarLivroNomeOuISBN({
        buscarLivroNomeOuISBNUseCase,
        httpRequest,
      }),
    ).rejects.toBeInstanceOf(ZodError);
  });
});
