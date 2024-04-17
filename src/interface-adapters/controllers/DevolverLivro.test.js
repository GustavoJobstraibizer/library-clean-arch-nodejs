const ValidationTranslationKeys = require('../../shared/errors/ValidationTranslationKeys');
const { Either, AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http-response');
const devolverLivro = require('./DevolverLivro');
const { ZodError } = require('zod');

describe('DevolverLivro Controller', () => {
  const devolverLivroUseCase = jest.fn();

  it('deve retornar httpStatus code 200 com o body null', async () => {
    const httpRequest = {
      body: {
        data_devolucao: '2021-10-10',
      },
      params: {
        emprestimo_id: 1,
      },
    };

    devolverLivroUseCase.mockResolvedValueOnce(Either.right(null));

    const output = await devolverLivro({ devolverLivroUseCase, httpRequest });

    expect(output).toEqual(httpResponse(200, null));
    expect(devolverLivroUseCase).toHaveBeenCalledWith({
      emprestimo_id: httpRequest.params.emprestimo_id,
      data_devolucao: httpRequest.body.data_devolucao,
    });
  });

  it('deve retornar httpStatus code 200 com a multa aplicada', async () => {
    const httpRequest = {
      body: {
        data_devolucao: '2021-10-22',
      },
      params: {
        emprestimo_id: 1,
      },
    };

    devolverLivroUseCase.mockResolvedValueOnce(
      Either.right({ multa: 10, currency: 'BRL' }),
    );

    const output = await devolverLivro({ devolverLivroUseCase, httpRequest });

    expect(output).toEqual(httpResponse(200, { multa: 10, currency: 'BRL' }));
    expect(devolverLivroUseCase).toHaveBeenCalledWith({
      emprestimo_id: httpRequest.params.emprestimo_id,
      data_devolucao: httpRequest.body.data_devolucao,
    });
  });

  it('deve retornar httpStatus code 400 caso haja algum erro', async () => {
    const httpRequest = {
      body: {
        data_devolucao: '2021-10-10',
      },
      params: {
        emprestimo_id: 1,
      },
    };

    devolverLivroUseCase.mockResolvedValueOnce(
      Either.left({ message: 'Não foi possível devolver o livro.' }),
    );

    const output = await devolverLivro({ devolverLivroUseCase, httpRequest });

    expect(output).toEqual(
      httpResponse(400, 'Não foi possível devolver o livro.'),
    );
    expect(devolverLivroUseCase).toHaveBeenCalledWith({
      emprestimo_id: httpRequest.params.emprestimo_id,
      data_devolucao: httpRequest.body.data_devolucao,
    });
  });

  it('deve retornar um AppError se as dependencias nao forem fornecidas', async () => {
    expect(() => devolverLivro({})).rejects.toThrow(
      new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR),
    );
  });

  it('deve retornar um erro de validacao do zod caso os campos obrigatorios nao sejam fornecidos', async () => {
    const httpRequest = {
      body: {},
      params: {
        emprestimo_id: 1,
      },
    };

    expect(() =>
      devolverLivro({ devolverLivroUseCase, httpRequest }),
    ).rejects.toBeInstanceOf(ZodError);
  });
});
