const httpResponse = require('../../shared/helpers/http-response');
const { Either, AppError } = require('../../shared/errors');
const emprestarLivro = require('./EmprestarLivro');
const ValidationTranslationKeys = require('../../shared/errors/ValidationTranslationKeys');
const { ZodError } = require('zod');

describe('EmprestarLivro Controller', () => {
  const emprestarLivroUseCase = jest.fn();

  it('deve retornar httpStatus code 201 com o body null', async () => {
    const httpRequest = {
      body: {
        usuario_id: 1,
        livro_id: 1,
        data_retorno: '2024-10-25',
        data_saida: '2024-10-22',
      },
    };

    const emprestimoLivroDTO = {
      body: {
        ...httpRequest.body,
        data_retorno: expect.any(Date),
        data_saida: expect.any(Date),
      },
    };

    emprestarLivroUseCase.mockResolvedValueOnce(Either.right(null));

    const output = await emprestarLivro({ emprestarLivroUseCase, httpRequest });

    expect(output).toEqual(httpResponse(201, null));
    expect(emprestarLivroUseCase).toHaveBeenCalledWith(emprestimoLivroDTO.body);
  });

  it('deve retornar httpStatus code 400 com a mensagem de erro', async () => {
    const httpRequest = {
      body: {
        usuario_id: 1,
        livro_id: 1,
        data_retorno: '2024-10-25',
        data_saida: '2024-10-22',
      },
    };

    const emprestimoLivroDTO = {
      body: {
        ...httpRequest.body,
        data_retorno: expect.any(Date),
        data_saida: expect.any(Date),
      },
    };

    emprestarLivroUseCase.mockResolvedValueOnce(
      Either.left({ message: 'Erro ao cadastrar emprestimo' }),
    );

    const output = await emprestarLivro({ emprestarLivroUseCase, httpRequest });

    expect(output).toEqual(httpResponse(400, 'Erro ao cadastrar emprestimo'));
    expect(emprestarLivroUseCase).toHaveBeenCalledWith(emprestimoLivroDTO.body);
  });

  it('deve retornar um AppError se as dependencias nao forem fornecidas', async () => {
    expect(() => emprestarLivro({})).rejects.toThrow(
      new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR),
    );
  });

  it('deve retornar um erro do zod se os dados nao forem validos', async () => {
    const httpRequest = {
      body: {},
    };

    expect(() =>
      emprestarLivro({ emprestarLivroUseCase, httpRequest }),
    ).rejects.toBeInstanceOf(ZodError);
  });
});
