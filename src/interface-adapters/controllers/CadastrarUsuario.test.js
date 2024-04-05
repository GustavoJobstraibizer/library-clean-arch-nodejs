const ValidationTranslationKeys = require('../../shared/errors/ValidationTranslationKeys');
const { Either, AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http-response');
const CadastrarUsuario = require('./CadastrarUsuario');
const { ZodError } = require('zod');

describe('CadastrarUsuario Controller', () => {
  const cadastrarUsuarioUseCase = jest.fn();

  it('deve retornar um httpResponse 201 quando o cadastro for bem-sucedido', async () => {
    const httpRequest = {
      body: {
        nome_completo: 'Teste',
        endereco: 'Rua das Flores, 123',
        CPF: '123.456.789-00',
        email: 'teste@teste.com',
        telefone: '12341234123',
      },
    };

    cadastrarUsuarioUseCase.mockResolvedValueOnce(Either.right(null));

    const response = await CadastrarUsuario({
      cadastrarUsuarioUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(201, null));
    expect(cadastrarUsuarioUseCase).toHaveBeenCalledWith(httpRequest.body);
    expect(cadastrarUsuarioUseCase).toHaveBeenCalledTimes(1);
  });

  it('deve retornar um AppError se as dependencias nao forem injetadas', async () => {
    await expect(CadastrarUsuario({})).rejects.toThrow(
      new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR),
    );
  });

  it('deve retornar um httpResponse 400 se o cadastro falhar', async () => {
    const httpRequest = {
      body: {
        nome_completo: 'Teste',
        endereco: 'Rua das Flores, 123',
        CPF: '123.456.789-00',
        email: 'teste@teste.com',
        telefone: '12341234123',
      },
    };

    const errorMessage = 'email já cadastrado';

    cadastrarUsuarioUseCase.mockResolvedValueOnce(
      Either.left({ message: errorMessage }),
    );

    const response = await CadastrarUsuario({
      cadastrarUsuarioUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(400, errorMessage));
    expect(cadastrarUsuarioUseCase).toHaveBeenCalledWith(httpRequest.body);
    expect(cadastrarUsuarioUseCase).toHaveBeenCalledTimes(1);
  });

  it('deve retornar um error do zod se a validacao falhar', async () => {
    const httpRequest = {
      body: {},
    };

    expect(
      CadastrarUsuario({ cadastrarUsuarioUseCase, httpRequest }),
    ).rejects.toBeInstanceOf(ZodError);
  });
});
