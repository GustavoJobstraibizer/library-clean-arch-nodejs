const httpResponse = require('../../shared/helpers/http-response');
const { Either, AppError } = require('../../shared/errors');
const buscarUsuarioCPF = require('./BuscarUsuarioCPF');
const ValidationTranslationKeys = require('../../shared/errors/ValidationTranslationKeys');
const { ZodError } = require('zod');

describe('BuscarUsuarioCPF Controller', () => {
  const buscarUsuarioCPFUseCase = jest.fn();

  it('deve retornar um usuario ao buscar por CPF com o status da resposta 200', async () => {
    const usuarioDTO = {
      id: '123',
      nome_completo: 'Teste',
      endereco: 'Rua das Flores, 123',
      CPF: '123.456.789-00',
      email: 'teste@teste.com',
      telefone: '12341234123',
    };

    buscarUsuarioCPFUseCase.mockResolvedValue(Either.right(usuarioDTO));

    const httpRequest = {
      params: {
        CPF: '123.456.789-00',
      },
    };

    const reponse = await buscarUsuarioCPF({
      buscarUsuarioCPFUseCase,
      httpRequest,
    });

    expect(reponse).toEqual(httpResponse(200, usuarioDTO));
  });

  it('deve retornar um httpCode 200 se nao retornar usuario com o body null', async () => {
    buscarUsuarioCPFUseCase.mockResolvedValue(Either.right(null));

    const httpRequest = {
      params: {
        CPF: '123.456.789-00',
      },
    };

    const reponse = await buscarUsuarioCPF({
      buscarUsuarioCPFUseCase,
      httpRequest,
    });

    expect(reponse).toEqual(httpResponse(200, null));
  });

  it('deve retornar um AppError se as dependencias nao forem injetadas', async () => {
    await expect(buscarUsuarioCPF({})).rejects.toThrow(
      new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR),
    );
  });

  it('deve retornar um AppError se existir um httpRequest sem os params', async () => {
    await expect(
      buscarUsuarioCPF({ buscarUsuarioCPFUseCase, httpRequest: {} }),
    ).rejects.toThrow(new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR));
  });

  it('deve retornar um error do Zod validator se o CPF nao for fornecido', async () => {
    const httpRequest = {
      params: {},
    };

    await expect(
      buscarUsuarioCPF({ buscarUsuarioCPFUseCase, httpRequest }),
    ).rejects.toBeInstanceOf(ZodError);
  });
});
