const { Like } = require('typeorm');
const { typeOrmServer } = require('../setup');

const typeOrmLivroRepository = typeOrmServer.getRepository('Livro');

const livroRepository = () => {
  const cadastrar = async ({ nome, genero, autor, quantidade, ISBN }) => {
    await typeOrmLivroRepository.save({
      nome,
      genero,
      autor,
      quantidade,
      ISBN,
    });
  };

  const existerPorISBN = async (ISBN) => {
    const booksCount = await typeOrmLivroRepository.count({
      where: { ISBN },
    });

    return booksCount > 0;
  };

  const buscarPorNomeOuISBN = async (valor) => {
    return await typeOrmLivroRepository.find({
      where: [{ nome: Like(`%${valor}%`) }, { ISBN: valor }],
    });
  };

  return { cadastrar, existerPorISBN, buscarPorNomeOuISBN };
};

module.exports = { livroRepository, typeOrmLivroRepository };
