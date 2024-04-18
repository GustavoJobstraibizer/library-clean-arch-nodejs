const { Router } = require('express');
const { usuarioRoutes } = require('./Usuario.route');
const { livrosRoutes } = require('./Livros.route');
const { emprestimosRoutes } = require('./Emprestimos.route');

const routes = Router();

routes.use('/usuarios', usuarioRoutes);
routes.use('/livros', livrosRoutes);
routes.use('/emprestimos', emprestimosRoutes);

module.exports = { routes };
