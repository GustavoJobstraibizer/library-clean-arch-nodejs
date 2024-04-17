const ValidationTranslationKeys = require('../../shared/errors/ValidationTranslationKeys');
const { Either, AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http-response');
const cadastrarLivro = require('./CadastrarLivro');
const { ZodError } = require('zod');

describe('CadastrarLivro Controller', () => {
  const cadastrarLivroUseCase = jest.fn();

  it('deve retornar null com o statusCode 200 ao cadastrar um livro com sucesso', async () => {
    cadastrarLivroUseCase.mockResolvedValue(Either.right(null));

    const httpRequest = {
      body: {
        nome: 'Livro Teste',
        quantidade: 10,
        autor: 'Autor Teste',
        genero: 'Genero Teste',
        ISBN: '1234567890',
      },
    };

    const response = await cadastrarLivro({
      cadastrarLivroUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(201, null));
    expect(cadastrarLivroUseCase).toHaveBeenCalledWith(httpRequest.body);
  });

  it('deve retornar um erro com o statusCode 400 ao tentar cadastrar um livro com dados invalidos', async () => {
    cadastrarLivroUseCase.mockResolvedValue(
      Either.left({ message: 'Livro já cadastrado' }),
    );

    const httpRequest = {
      body: {
        nome: 'Livro Teste',
        quantidade: 10,
        autor: 'Autor Teste',
        genero: 'Genero Teste',
        ISBN: '978-3-16-148410-0',
      },
    };

    const response = await cadastrarLivro({
      cadastrarLivroUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(400, 'Livro já cadastrado'));
  });

  it('deve retornar um AppError se as dependencias nao forem fornecidas', async () => {
    expect(() => cadastrarLivro({})).rejects.toThrow(
      new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR),
    );
  });

  it('deve retornar um error do Zod se os campos obrigatorios nao forem fornecidos', async () => {
    const httpRequest = {
      body: {},
    };

    expect(() =>
      cadastrarLivro({
        cadastrarLivroUseCase,
        httpRequest,
      }),
    ).rejects.toBeInstanceOf(ZodError);
  });
});
