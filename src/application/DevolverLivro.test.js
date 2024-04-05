const { AppError } = require('../shared/errors');
const DevolverLivro = require('./DevolverLivro');
const ValidationTranslationKeys = require('../shared/errors/ValidationTranslationKeys');

describe('DevolverLivro UseCase', () => {
  const emprestimoRepository = {
    devolver: jest.fn(),
  };

  it('deve ser possivel devolver um livro sem atraso', async () => {
    const devolverLivroDTO = {
      emprestimo_id: 1,
      data_devolucao: new Date('2024-01-10'),
    };

    emprestimoRepository.devolver.mockReturnValueOnce({
      data_retorno: new Date('2024-01-15'),
    });

    const sut = DevolverLivro({ emprestimoRepository });
    const output = await sut(devolverLivroDTO);

    expect(output.right).toBeNull();
    expect(emprestimoRepository.devolver).toHaveBeenCalledWith(
      devolverLivroDTO,
    );
    expect(emprestimoRepository.devolver).toHaveBeenCalledTimes(1);
  });

  it('deve lançar um AppError se o repositório não for fornecido', () => {
    expect(() => DevolverLivro({})).toThrow(
      new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR),
    );
  });

  it('deve ser possivel devolver um livro com multa', async () => {
    const devolverLivroDTO = {
      emprestimo_id: 1,
      data_devolucao: new Date('2024-01-11'),
    };

    emprestimoRepository.devolver.mockResolvedValue({
      data_retorno: new Date('2024-01-10'),
    });

    const sut = DevolverLivro({ emprestimoRepository });
    const output = await sut(devolverLivroDTO);

    expect(output.right).toEqual({ multa: 10, currency: 'BRL' });
    expect(emprestimoRepository.devolver).toHaveBeenCalledWith(
      devolverLivroDTO,
    );
    expect(emprestimoRepository.devolver).toHaveBeenCalledTimes(1);
  });

  it('deve retornar um AppError se emprestimo_id ou data_devolucao não forem fornecidos', async () => {
    const sut = DevolverLivro({ emprestimoRepository });

    await expect(sut({})).rejects.toThrow(
      new AppError(ValidationTranslationKeys.REQUIRED_FIELD_ERROR),
    );
  });

  it('deve retornar um AppError se não encontrar o empréstimo', async () => {
    const devolverLivroDTO = {
      emprestimo_id: 1,
      data_devolucao: new Date('2024-01-10'),
    };

    emprestimoRepository.devolver.mockResolvedValue({ data_retorno: null });

    const sut = DevolverLivro({ emprestimoRepository });

    await expect(sut(devolverLivroDTO)).rejects.toThrow(
      new AppError(ValidationTranslationKeys.NOT_FOUND),
    );

    expect(emprestimoRepository.devolver).toHaveBeenCalledWith(
      devolverLivroDTO,
    );
    expect(emprestimoRepository.devolver).toHaveBeenCalledTimes(1);
  });
});
