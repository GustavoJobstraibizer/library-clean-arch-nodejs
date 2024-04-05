const { IsNull } = require('typeorm');
const { typeOrmServer } = require('../setup');

const typeOrmEmprestimoRepository = typeOrmServer.getRepository('Emprestimo');

const emprestimoRepository = () => {
  const emprestar = async ({
    data_saida,
    data_retorno,
    usuario_id,
    livro_id,
  }) => {
    await typeOrmEmprestimoRepository.save({
      data_saida,
      data_retorno,
      usuario_id,
      livro_id,
    });
  };

  const buscarPorLivroEmprestadoPendenteUsuario = async ({
    usuario_id,
    livro_id,
  }) => {
    const existePendente = await typeOrmEmprestimoRepository.count({
      where: { usuario_id, livro_id, data_devolucao: IsNull() },
    });

    return existePendente > 0;
  };

  const buscarPorId = async (id) => {
    return await typeOrmEmprestimoRepository.findOne({
      where: { id },
      relations: ['usuario', 'livro'],
      select: {
        id: true,
        data_saida: true,
        data_retorno: true,
        usuario: {
          nome_completo: true,
          email: true,
          CPF: true,
        },
        livro: {
          nome: true,
        },
      },
    });
  };

  const buscarPendentes = async () => {
    return await typeOrmEmprestimoRepository.find({
      where: { data_devolucao: IsNull() },
      relations: ['usuario', 'livro'],
      select: {
        id: true,
        data_saida: true,
        data_retorno: true,
        usuario: {
          nome_completo: true,
          CPF: true,
        },
        livro: {
          nome: true,
        },
      },
    });
  };

  const devolver = async ({ emprestimo_id, data_devolucao }) => {
    await typeOrmEmprestimoRepository.update(emprestimo_id, {
      data_devolucao,
    });

    const { data_retorno } = await typeOrmEmprestimoRepository.findOneBy({
      id: emprestimo_id,
    });

    return { data_retorno };
  };

  return {
    emprestar,
    buscarPorLivroEmprestadoPendenteUsuario,
    devolver,
    buscarPorId,
    buscarPendentes,
  };
};

module.exports = { emprestimoRepository, typeOrmEmprestimoRepository };
