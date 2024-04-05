const {
  emprestimoRepository,
  typeOrmEmprestimoRepository,
} = require('./Emprestimo');
const { typeOrmLivroRepository } = require('./Livro');
const { typeOrmUsuarioRepository } = require('./Usuario');

describe('Emprestimo Repository', () => {
  let sut;

  const usuarioDTO = {
    nome_completo: 'teste',
    email: 'teste@teste.com',
    CPF: '12345678900',
    telefone: '123456789',
    endereco: 'Rua teste',
  };

  const livroDTO = {
    nome: 'livro teste',
    quantidade: 2,
    autor: 'teste',
    genero: 'ficção',
    ISBN: '123456789',
  };

  beforeAll(async () => {
    sut = emprestimoRepository();
  });

  beforeEach(async () => {
    await typeOrmEmprestimoRepository.delete({});
    await typeOrmUsuarioRepository.delete({});
    await typeOrmLivroRepository.delete({});
  });

  it('deve criar um emprestimo com sucesso', async () => {
    const usuario = await typeOrmUsuarioRepository.save(usuarioDTO);
    const livro = await typeOrmLivroRepository.save(livroDTO);

    const emprestimo = await sut.emprestar({
      data_saida: '2024-01-10',
      data_retorno: '2024-01-15',
      usuario_id: usuario.id,
      livro_id: livro.id,
    });

    expect(emprestimo).toBeUndefined();
  });

  it('deve retornar a data de retorno corretamente', async () => {
    const usuario = await typeOrmUsuarioRepository.save(usuarioDTO);
    const livro = await typeOrmLivroRepository.save(livroDTO);

    const emprestimo = await typeOrmEmprestimoRepository.save({
      data_saida: '2024-01-10',
      data_retorno: '2024-01-15',
      usuario_id: usuario.id,
      livro_id: livro.id,
    });

    const devolver = await sut.devolver({
      emprestimo_id: emprestimo.id,
      data_devolucao: '2024-01-15',
    });

    expect(devolver.data_retorno).toBe(emprestimo.data_retorno);
  });

  it('deve atualizar a data de devolucao corretamente', async () => {
    const usuario = await typeOrmUsuarioRepository.save(usuarioDTO);
    const livro = await typeOrmLivroRepository.save(livroDTO);

    const emprestimo = await typeOrmEmprestimoRepository.save({
      data_saida: '2024-01-10',
      data_retorno: '2024-01-15',
      usuario_id: usuario.id,
      livro_id: livro.id,
    });

    await sut.devolver({
      emprestimo_id: emprestimo.id,
      data_devolucao: '2024-01-15',
    });

    const emprestimoAtualizado = await typeOrmEmprestimoRepository.findOneBy({
      id: emprestimo.id,
    });

    expect(emprestimoAtualizado.data_devolucao).toBe('2024-01-15');
  });

  it('deve retornar os emprestismos pendentes', async () => {
    const usuario = await typeOrmUsuarioRepository.save(usuarioDTO);
    const livro = await typeOrmLivroRepository.save(livroDTO);

    await typeOrmEmprestimoRepository.save([
      {
        data_saida: '2024-01-10',
        data_retorno: '2024-01-15',
        data_devolucao: '2024-01-15',
        usuario_id: usuario.id,
        livro_id: livro.id,
      },
      {
        data_saida: '2024-01-10',
        data_retorno: '2024-01-15',
        usuario_id: usuario.id,
        livro_id: livro.id,
      },
    ]);

    const emprestimosPendentes = await sut.buscarPendentes();

    expect(emprestimosPendentes).toHaveLength(1);
    expect(emprestimosPendentes[0].data_devolucao).toBeUndefined();
    expect(emprestimosPendentes[0].id).toBeDefined();
    expect(emprestimosPendentes[0].usuario.CPF).toBe(usuario.CPF);
    expect(emprestimosPendentes[0].livro.nome).toBe(livro.nome);
  });

  it('deve retornar true se existir emprestimo pendentes referente a um usuario', async () => {
    const usuario = await typeOrmUsuarioRepository.save(usuarioDTO);
    const livro = await typeOrmLivroRepository.save(livroDTO);

    await typeOrmEmprestimoRepository.save([
      {
        data_saida: '2024-01-10',
        data_retorno: '2024-01-15',
        data_devolucao: '2024-01-15',
        usuario_id: usuario.id,
        livro_id: livro.id,
      },
      {
        data_saida: '2024-01-10',
        data_retorno: '2024-01-15',
        usuario_id: usuario.id,
        livro_id: livro.id,
      },
    ]);

    const existePendente = await sut.buscarPorLivroEmprestadoPendenteUsuario({
      usuario_id: usuario.id,
      livro_id: livro.id,
    });

    expect(existePendente).toBe(true);
  });

  it('deve retornar false se não existir emprestimo pendentes referente a um usuario', async () => {
    const usuario = await typeOrmUsuarioRepository.save(usuarioDTO);
    const livro = await typeOrmLivroRepository.save(livroDTO);

    await typeOrmEmprestimoRepository.save({
      data_saida: '2024-01-10',
      data_retorno: '2024-01-15',
      data_devolucao: '2024-01-15',
      usuario_id: usuario.id,
      livro_id: livro.id,
    });

    const existePendente = await sut.buscarPorLivroEmprestadoPendenteUsuario({
      usuario_id: usuario.id,
      livro_id: livro.id,
    });

    expect(existePendente).toBe(false);
  });

  it('deve retornar os emprestimos pendentes por dado um emprestimo_id', async () => {
    const usuario = await typeOrmUsuarioRepository.save(usuarioDTO);
    const livro = await typeOrmLivroRepository.save(livroDTO);

    const emprestimo = await typeOrmEmprestimoRepository.save({
      data_saida: '2024-01-10',
      data_retorno: '2024-01-15',
      usuario_id: usuario.id,
      livro_id: livro.id,
    });

    const emprestimosPendentes = await sut.buscarPorId(emprestimo.id);

    expect(emprestimosPendentes).toEqual({
      id: emprestimo.id,
      data_saida: '2024-01-10',
      data_retorno: '2024-01-15',
      usuario: {
        nome_completo: usuario.nome_completo,
        email: usuario.email,
        CPF: usuario.CPF,
      },
      livro: {
        nome: livro.nome,
      },
    });
  });
});
