const ValidationTranslationKeys = require('../shared/errors/ValidationTranslationKeys');
const { AppError } = require('../shared/errors');
const EmprestimoLivro = require('./EmprestimoLivro');

describe('EmprestimoLivro UseCase', () => {
  const emprestimoRepository = {
    emprestar: jest.fn(),
    buscarPorLivroEmprestadoPendenteUsuario: jest.fn(),
    buscarPorId: jest.fn(),
  };

  const emailService = {
    send: jest.fn(),
  };

  it('deve poder emprestar um livro', async () => {
    const emprestimoLivroId = 1;

    const emprestimoLivroDTO = {
      usuario_id: 1,
      livro_id: 1,
      data_saida: new Date('2024-02-15'),
      data_retorno: new Date('2024-02-20'),
    };

    const emprestimoLivroResponse = {
      usuario: {
        email: 'teste@teste.com',
        CPF: '12345678901',
        nome: 'Teste',
      },
      livro: {
        nome: 'Teste',
      },
    };

    emprestimoRepository.emprestar.mockResolvedValue(emprestimoLivroId);
    emprestimoRepository.buscarPorId.mockResolvedValue(emprestimoLivroResponse);

    const sut = EmprestimoLivro({ emprestimoRepository, emailService });

    const output = await sut(emprestimoLivroDTO);

    expect(output.right).toBeNull();
    expect(emprestimoRepository.emprestar).toHaveBeenCalledWith(
      emprestimoLivroDTO,
    );
    expect(emprestimoRepository.emprestar).toHaveBeenCalledTimes(1);
    expect(emailService.send).toHaveBeenCalledWith({
      data_saida: emprestimoLivroDTO.data_saida,
      data_retorno: emprestimoLivroDTO.data_retorno,
      email: emprestimoLivroResponse.usuario.email,
      CPF: emprestimoLivroResponse.usuario.CPF,
      nome: emprestimoLivroResponse.usuario.nome,
      livro: emprestimoLivroResponse.livro.nome,
    });
    expect(emailService.send).toHaveBeenCalledTimes(1);
    expect(emprestimoRepository.buscarPorId).toHaveBeenCalledWith(
      emprestimoLivroId,
    );
  });

  it('deve retornar um AppError se o repositório não for injetado', () => {
    expect(() => EmprestimoLivro({})).toThrow(
      new AppError(ValidationTranslationKeys.DEPENDENCY_ERROR),
    );
  });
  it('deve retornar um AppError se os campos obrigatórios não forem informados', async () => {
    const sut = EmprestimoLivro({ emprestimoRepository, emailService });

    await expect(() => sut({})).rejects.toThrow(
      new AppError(ValidationTranslationKeys.REQUIRED_FIELD_ERROR),
    );
  });

  it('deve retornar um Either.left se a data de retorno for anterior a data de saída', async () => {
    const emprestimo = {
      usuario_id: 1,
      livro_id: 1,
      data_retorno: new Date('2024-01-01'),
      data_saida: new Date('2024-01-02'),
      data_devolucao: new Date('2024-01-03'),
    };

    const sut = EmprestimoLivro({ emprestimoRepository, emailService });

    const output = await sut(emprestimo);

    expect(output.left).toBe(
      ValidationTranslationKeys.RETURN_DATE_BEFORE_START_DATE,
    );
  });

  it('deve retornar um Either.left se o livro já estiver emprestado', async () => {
    const emprestimo = {
      usuario_id: 1,
      livro_id: 1,
      data_saida: new Date('2024-02-15'),
      data_retorno: new Date('2024-02-18'),
    };

    emprestimoRepository.buscarPorLivroEmprestadoPendenteUsuario.mockResolvedValueOnce(
      true,
    );

    const sut = EmprestimoLivro({ emprestimoRepository, emailService });

    const output = await sut(emprestimo);

    expect(output.left).toBe(ValidationTranslationKeys.BOOK_ALREADY_LENT);
    expect(
      emprestimoRepository.buscarPorLivroEmprestadoPendenteUsuario,
    ).toHaveBeenCalledWith({
      usuario_id: emprestimo.usuario_id,
      livro_id: emprestimo.livro_id,
    });
    expect(
      emprestimoRepository.buscarPorLivroEmprestadoPendenteUsuario,
    ).toHaveBeenCalledTimes(1);
  });
});
