const { Router } = require('express');
const { usuarioRoutes } = require('./Usuario.route');
const { livrosRoutes } = require('./Livros.route');

const routes = Router();

routes.use('/usuarios', usuarioRoutes);
routes.use('/livros', livrosRoutes);

module.exports = { routes };
