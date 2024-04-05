const { typeOrmServer } = require('./setup');

beforeAll(async () => {
  await typeOrmServer.initialize();
});

afterAll(async () => {
  await typeOrmServer.destroy();
});
