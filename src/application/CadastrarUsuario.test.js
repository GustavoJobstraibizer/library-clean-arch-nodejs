const ValidationTranslationKeys = require('../shared/errors/ValidationTranslationKeys');
const { AppError } = require('../shared/errors');
const CadastrarUsuario = require('./CadastrarUsuario');

describe('CadastrarUsuario UseCase', () => {
  const usuarioRepository = {
    cadastrar: jest.fn(),
    buscarPorCPF: jest.fn(),
    existerPorEmail: jest.fn(),
    existePorCPF: jest.fn(),
  };

  it('deve cadastrar um usuário', async () => {
    const usuarioDTO = {
      nome_completo: 'Jhon Doe',
      CPF: '123.456.789-00',
      telefone: '(11) 98765-4321',
      endereco: 'Rua dos Testes, 123',
      email: 'jhondoe@teste.com',
    };

    // system under test (sut)
    const sut = CadastrarUsuario({ usuarioRepository });
    const output = await sut(usuarioDTO);

    expect(output.right).toBeNull();
    expect(usuarioRepository.cadastrar).toHaveBeenCalledTimes(1);
    expect(usuarioRepository.cadastrar).toHaveBeenCalledWith(usuarioDTO);
  });

  it('deve lançar um erro se o repositório não for fornecido', async () => {
    expect(() => CadastrarUsuario({})).toThrow(
      new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR),
    );
  });

  it('deve lançar um erro se algum campo obrigatório não for fornecido', async () => {
    const usuarioDTO = {
      nome_completo: 'Jhon Doe',
      CPF: '123.456.789-00',
      telefone: '(11) 98765-4321',
      endereco: 'Rua dos Testes, 123',
    };

    const sut = CadastrarUsuario({ usuarioRepository });
    const output = await sut(usuarioDTO);

    expect(output.left).toBe('Campos obrigatórios não informados');
    expect(output.right).toBeNull();
  });

  it('deve retornar um Either.left se o CPF já estiver cadastrado', async () => {
    const usuarioDTO = {
      nome_completo: 'Jhon Doe',
      CPF: '123.456.789-00',
      telefone: '(11) 98765-4321',
      endereco: 'Rua dos Testes, 123',
      email: 'test@teste.com',
    };

    usuarioRepository.existePorCPF.mockResolvedValueOnce(true);

    const sut = CadastrarUsuario({ usuarioRepository });
    const output = await sut(usuarioDTO);

    expect(output.left).toBe('CPF já cadastrado');
    expect(output.right).toBeNull();
    expect(usuarioRepository.existePorCPF).toHaveBeenCalledTimes(1);
    expect(usuarioRepository.existePorCPF).toHaveBeenCalledWith(usuarioDTO.CPF);
  });

  it('deve lançar um Either.left se o email já estiver cadastrado', async () => {
    const usuarioDTO = {
      nome_completo: 'Jhon Doe',
      CPF: '123.456.789-00',
      telefone: '(11) 98765-4321',
      endereco: 'Rua dos Testes, 123',
      email: 'teste@teste.com',
    };

    usuarioRepository.buscarPorCPF.mockResolvedValueOnce(false);
    usuarioRepository.existerPorEmail.mockResolvedValueOnce(true);

    const sut = CadastrarUsuario({ usuarioRepository });
    const output = await sut(usuarioDTO);

    expect(output.left).toBe('E-mail já cadastrado');
    expect(output.right).toBeNull();
    expect(usuarioRepository.existerPorEmail).toHaveBeenCalledTimes(1);
    expect(usuarioRepository.existerPorEmail).toHaveBeenCalledWith(
      usuarioDTO.email,
    );
  });
});
