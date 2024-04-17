const cadastrarLivroUseCase = require('../../../application/CadastrarLivro');
const { Router } = require('express');
const {
  livroRepository,
} = require('../../../infra/db/typeorm/repositories/Livro');
const cadastrarLivroController = require('../../../interface-adapters/controllers/CadastrarLivro');
const buscarLivroUseCase = require('../../../application/BuscarLivro');
const buscarLivroNomeOuISBNController = require('../../../interface-adapters/controllers/BuscarLivroNomeOuISBN');

const livrosRoutes = Router();

livrosRoutes.post('/', async (req, res) => {
  const httpRequest = {
    body: req.body,
  };

  const livroRepositoryFn = livroRepository();
  const cadastrarLivroUseCaseFn = cadastrarLivroUseCase({
    livroRepository: livroRepositoryFn,
  });

  const { statusCode, body } = await cadastrarLivroController({
    cadastrarLivroUseCase: cadastrarLivroUseCaseFn,
    httpRequest,
  });

  return res.status(statusCode).json(body);
});

livrosRoutes.get('/', async (req, res) => {
  const httpRequest = {
    query: req.query,
  };

  const livroRepositoryFn = livroRepository();
  const buscarLivroPorNomeISBNUseCaseFn = buscarLivroUseCase({
    livroRepository: livroRepositoryFn,
  });

  const { statusCode, body } = await buscarLivroNomeOuISBNController({
    buscarLivroNomeOuISBNUseCase: buscarLivroPorNomeISBNUseCaseFn,
    httpRequest,
  });

  return res.status(statusCode).json(body);
});

module.exports = { livrosRoutes };
