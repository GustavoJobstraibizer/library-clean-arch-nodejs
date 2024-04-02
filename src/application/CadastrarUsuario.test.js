const AppError = require('../shared/errors/AppError');
const CadastrarUsuario = require('./CadastrarUsuario');

describe('CadastrarUsuario UseCase', () => {
  const usuarioRepository = {
    cadastrar: jest.fn(),
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

    expect(output).toBeUndefined();
    expect(usuarioRepository.cadastrar).toHaveBeenCalledTimes(1);
    expect(usuarioRepository.cadastrar).toHaveBeenCalledWith(usuarioDTO);
  });

  it('deve lançar um erro se o repositório não for fornecido', async () => {
    expect(() => CadastrarUsuario({})).toThrow(
      new AppError(AppError.dependencyError),
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

    await expect(() => sut(usuarioDTO)).rejects.toThrow(
      new AppError(AppError.requiredFieldError),
    );
  });
});
