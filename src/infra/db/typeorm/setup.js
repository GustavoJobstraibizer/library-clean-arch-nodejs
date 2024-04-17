const { resolve } = require('path');
const typeorm = require('typeorm');

let typeOrmServer;

if (process.env.NODE_ENV === 'test') {
  typeOrmServer = new typeorm.DataSource({
    type: 'sqlite',
    database: 'db:sqlite',
    synchronize: true,
    dropSchema: true,
    entities: [resolve(__dirname, 'entities', '*.js')],
  });
} else if (process.env.NODE_ENV === 'integration') {
  typeOrmServer = new typeorm.DataSource({
    type: 'postgres',
    database: 'biblioteca_test',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    synchronize: true,
    entities: [resolve(__dirname, 'entities', '*.js')],
  });
}

module.exports = { typeOrmServer };
