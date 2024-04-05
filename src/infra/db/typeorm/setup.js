const typeorm = require('typeorm');

const typeOrmServer = new typeorm.DataSource({
  type: 'sqlite',
  database: 'db:sqlite',
  synchronize: true,
  dropSchema: true,
  entities: [
    require('./entities/Usuario'),
    require('./entities/Livro'),
    require('./entities/Emprestimo'),
  ],
});

module.exports = { typeOrmServer };
