const ValidationTranslationKeys = require('../shared/errors/ValidationTranslationKeys');
const { AppError } = require('../shared/errors');
const BuscarUsuario = require('./BuscarUsuario');

describe('BuscarUsuario UseCase', () => {
  const usuarioRepository = {
    buscarPorCPF: jest.fn(),
  };

  it('deve retornar um usuario', async () => {
    const userDTO = {
      nome_completo: 'Jhon Doe',
      CPF: '123.456.789-00',
      telefone: '(11) 98765-4321',
      endereco: 'Rua dos Testes, 123',
      email: 'teste@teste.com',
    };

    usuarioRepository.buscarPorCPF.mockResolvedValueOnce(userDTO);

    const sut = BuscarUsuario({ usuarioRepository });
    const output = await sut({ CPF: userDTO.CPF });

    expect(output.right).toStrictEqual(userDTO);
    expect(usuarioRepository.buscarPorCPF).toHaveBeenCalledTimes(1);
    expect(usuarioRepository.buscarPorCPF).toHaveBeenCalledWith(userDTO.CPF);
  });

  it('deve retornar null se o usuário não for encontrado', async () => {
    const CPF = '123.456.789-00';

    usuarioRepository.buscarPorCPF.mockResolvedValueOnce(null);

    const sut = BuscarUsuario({ usuarioRepository });
    const output = await sut({ CPF });

    expect(output.right).toBeNull();
    expect(usuarioRepository.buscarPorCPF).toHaveBeenCalledTimes(1);
    expect(usuarioRepository.buscarPorCPF).toHaveBeenCalledWith(CPF);
  });

  it('deve retornar um trhow AppError se o repositório não for injetado', () => {
    expect(() => BuscarUsuario({})).toThrow(
      new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR),
    );
  });

  it('deve retornar um trhow AppError se o CPF não for informado', async () => {
    const sut = BuscarUsuario({ usuarioRepository });

    await expect(sut({})).rejects.toThrow(
      new AppError(ValidationTranslationKeys.REQUIRED_FIELD_ERROR),
    );
  });
});
