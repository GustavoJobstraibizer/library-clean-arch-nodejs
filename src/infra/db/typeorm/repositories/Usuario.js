const { typeOrmServer } = require('../setup');

const typeOrmUsuarioRepository = typeOrmServer.getRepository('Usuario');

const usuarioRepository = function () {
  const cadastrar = async ({
    nome_completo,
    CPF,
    telefone,
    email,
    endereco,
  }) => {
    await typeOrmUsuarioRepository.save({
      nome_completo,
      CPF,
      telefone,
      email,
      endereco,
    });
  };

  const buscarPorCPF = async (CPF) => {
    return await typeOrmUsuarioRepository.findOne({ where: { CPF } });
  };

  const existePorCPF = async (CPF) => {
    const usuario = await typeOrmUsuarioRepository.count({ where: { CPF } });

    return usuario > 0;
  };

  const existerPorEmail = async (email) => {
    const usuario = await typeOrmUsuarioRepository.count({ where: { email } });

    return usuario > 0;
  };

  return { cadastrar, buscarPorCPF, existerPorEmail, existePorCPF };
};

module.exports = { usuarioRepository, typeOrmUsuarioRepository };
