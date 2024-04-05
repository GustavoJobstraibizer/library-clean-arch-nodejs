const { typeOrmLivroRepository, livroRepository } = require('./Livro');

describe('Livro Repository', () => {
  let sut;

  beforeEach(async () => {
    await typeOrmLivroRepository.delete({});
  });

  beforeAll(() => {
    sut = livroRepository();
  });

  const livroDTO = {
    nome: 'Nome do Livro',
    genero: 'Ficção',
    autor: 'Autor do Livro',
    quantidade: 10,
    ISBN: '1234567890123',
  };

  it('deve retornar void ao criar um livro', async () => {
    const livro = await sut.cadastrar({
      nome: 'Nome do Livro',
      genero: 'Ficção',
      autor: 'Autor do Livro',
      quantidade: 10,
      ISBN: '123456789012',
    });

    expect(livro).toBeUndefined();
  });

  it('deve retornar um livro ao buscar por ISBN', async () => {
    await typeOrmLivroRepository.save(livroDTO);

    const livro = await sut.existerPorISBN('1234567890123');

    expect(livro).toBe(true);
  });

  it('deve retornar null ao buscar por ISBN inexistente', async () => {
    const livro = await sut.existerPorISBN('1234567890124');

    expect(livro).toBe(false);
  });

  it('deve retornar uma lista de livros ao buscar por nome ou ISBN', async () => {
    await typeOrmLivroRepository.save(livroDTO);
    const nomeLivro = 'Nome do Livro';

    const livros = await sut.buscarPorNomeOuISBN(nomeLivro);

    expect(livros).toHaveLength(1);
    expect(livros[0].nome).toBe(nomeLivro);

    expect(livros[0].ISBN).toBe('1234567890123');
  });

  it('deve retornar uma lista vazia ao buscar por nome ou ISBN inexistente', async () => {
    const livros = await sut.buscarPorNomeOuISBN('Nome do Livro 2');

    expect(livros).toHaveLength(0);
  });

  it('deve retornar uma lista de livros ao buscar por ISBN', async () => {
    await typeOrmLivroRepository.save(livroDTO);

    const livros = await sut.buscarPorNomeOuISBN('1234567890123');

    expect(livros).toHaveLength(1);
    expect(livros[0].ISBN).toBe('1234567890123');
  });
});
