const { usuarioRepository, typeOrmUsuarioRepository } = require('./Usuario');

describe('Usuario Repository', () => {
  let sut;

  beforeEach(async () => {
    await typeOrmUsuarioRepository.delete({});
  });

  beforeAll(() => {
    sut = usuarioRepository();
  });

  const usuarioDTO = {
    nome_completo: 'Nome Completo',
    CPF: '123.456.789-02',
    endereco: 'Endereço teste',
    telefone: '(00) 90000-0000',
    email: 'teste1@teste.com',
  };

  it('deve retornar void ao criar um usuario', async () => {
    const usuario = await sut.cadastrar({
      nome_completo: 'Nome Completo',
      CPF: '123.456.789-00',
      endereco: 'Endereço teste',
      telefone: '(00) 90000-0000',
      email: 'teste@teste.com',
    });

    expect(usuario).toBeUndefined();
  });

  it('deve retornar um usuario ao buscar por CPF', async () => {
    await typeOrmUsuarioRepository.save(usuarioDTO);

    const usuario = await sut.buscarPorCPF('123.456.789-02');

    expect(usuario.id).toBeDefined();
    expect(usuario.nome_completo).toBe('Nome Completo');
  });

  it('deve retornar null ao buscar por CPF inexistente', async () => {
    const usuario = await sut.buscarPorCPF('123.456.789-03');

    expect(usuario).toBeNull();
  });

  it('deve retornar true ao buscar por email', async () => {
    await typeOrmUsuarioRepository.save(usuarioDTO);

    const usuario = await sut.existerPorEmail('teste1@teste.com');

    expect(usuario).toBe(true);
  });

  it('deve retornar false ao buscar por email inexistente', async () => {
    const usuario = await sut.existerPorEmail('email_invalido@teste.com');

    expect(usuario).toBe(false);
  });

  it('deve retornar true ao verificar se existe um usuario por CPF', async () => {
    await typeOrmUsuarioRepository.save(usuarioDTO);

    const usuario = await sut.existePorCPF('123.456.789-02');

    expect(usuario).toBe(true);
  });

  it('deve retornar false ao verificar se existe um usuario por CPF inexistente', async () => {
    const usuario = await sut.existePorCPF('123.456.789-03');

    expect(usuario).toBe(false);
  });
});
