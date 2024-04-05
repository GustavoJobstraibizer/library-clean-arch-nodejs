const ValidationTranslationKeys = require('../shared/errors/ValidationTranslationKeys');
const { AppError } = require('../shared/errors');
const cadastrarLivro = require('./CadastrarLivro');

describe('CadastrarLivro UseCase', () => {
  const livroRepository = {
    existerPorISBN: jest.fn(),
    cadastrar: jest.fn(),
  };

  it('deve lançar um erro se o repositório não for injetado', () => {
    expect(() => cadastrarLivro({})).toThrow(
      new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR),
    );
  });

  it('deve cadastrar um livro', async () => {
    const livroDTO = {
      nome: 'Livro de Teste',
      quantidade: 10,
      autor: 'Autor Teste',
      genero: 'Terror',
      ISBN: '1234567890',
    };

    const sut = cadastrarLivro({ livroRepository });
    const output = await sut(livroDTO);

    expect(output.right).toBeNull();
    expect(livroRepository.cadastrar).toHaveBeenCalledTimes(1);
    expect(livroRepository.cadastrar).toHaveBeenCalledWith(livroDTO);
  });

  it('deve retornar um Either.left se o livro já estiver cadastrado', async () => {
    const livroDTO = {
      nome: 'Livro de Teste',
      quantidade: 10,
      autor: 'Autor Teste',
      genero: 'Ficção',
      ISBN: '1234567890',
    };

    livroRepository.existerPorISBN.mockResolvedValueOnce(true);

    const sut = cadastrarLivro({ livroRepository });
    const output = await sut(livroDTO);

    expect(output.left).toBe('Livro já cadastrado');
    expect(livroRepository.existerPorISBN).toHaveBeenCalledTimes(1);
    expect(livroRepository.existerPorISBN).toHaveBeenCalledWith(livroDTO.ISBN);
  });

  it('deve retornar throw AppError se os campos obrigatórios não forem informados', async () => {
    const sut = cadastrarLivro({ livroRepository });

    await expect(() => sut({})).rejects.toThrow(
      new AppError(ValidationTranslationKeys.REQUIRED_FIELD_ERROR),
    );
  });
});
