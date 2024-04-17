const cadastrarUsuarioUseCase = require('../../../application/CadastrarUsuario');
const buscarUsuarioCPFUseCase = require('../../../application/BuscarUsuario');
const { Router } = require('express');
const {
  usuarioRepository,
} = require('../../../infra/db/typeorm/repositories/Usuario');
const cadastrarUsuarioController = require('../../../interface-adapters/controllers/CadastrarUsuario');
const buscarUsuarioCPFController = require('../../../interface-adapters/controllers/BuscarUsuarioCPF');

const usuarioRoutes = Router();

usuarioRoutes.post('/', async (req, res) => {
  const httpRequest = {
    body: req.body,
  };

  const usuarioRepositoryFn = usuarioRepository();
  const cadastrarUsuarioUseCaseFn = cadastrarUsuarioUseCase({
    usuarioRepository: usuarioRepositoryFn,
  });

  const { statusCode, body } = await cadastrarUsuarioController({
    cadastrarUsuarioUseCase: cadastrarUsuarioUseCaseFn,
    httpRequest,
  });

  return res.status(statusCode).json(body);
});

usuarioRoutes.get('/cpf/:CPF', async (req, res) => {
  const httpRequest = {
    params: req.params,
  };

  const usuarioRepositoryFn = usuarioRepository();
  const buscarUsuarioCPFUseCaseFn = buscarUsuarioCPFUseCase({
    usuarioRepository: usuarioRepositoryFn,
  });

  const { statusCode, body } = await buscarUsuarioCPFController({
    buscarUsuarioCPFUseCase: buscarUsuarioCPFUseCaseFn,
    httpRequest,
  });

  return res.status(statusCode).json(body);
});

module.exports = { usuarioRoutes };
