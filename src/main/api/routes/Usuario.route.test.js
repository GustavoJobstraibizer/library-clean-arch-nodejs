const request = require('supertest');
const { app } = require('../app');
const {
  typeOrmUsuarioRepository,
} = require('../../../infra/db/typeorm/repositories/Usuario');

describe('Routes: Usuario', () => {
  beforeEach(async () => {
    await typeOrmUsuarioRepository.query('DELETE FROM usuarios');
  });

  it('deve cadastrar um usuario com sucesso e retornar statusCode 201', async () => {
    const { statusCode, body } = await request(app).post('/usuarios').send({
      nome_completo: 'Fulano de Tal',
      email: 'teste@teste.com',
      telefone: '999999999',
      CPF: '123.456.789-00',
      endereco: 'Rua dos Testes, 123',
    });

    expect(statusCode).toBe(201);
    expect(body).toBeNull();
  });

  it('deve retornar um erro com os campos obrigatorios', async () => {
    const { statusCode, body } = await request(app).post('/usuarios').send({});

    expect(statusCode).toBe(400);
    expect(body.message).toBe('Validation error');
    expect(body.errors.fieldErrors).toEqual({
      nome_completo: ['Nome completo é obrigatório'],
      CPF: ['CPF é obrigatório'],
      endereco: ['Endereço é obrigatório'],
      email: ['Email é obrigatório'],
      telefone: ['Telefone é obrigatório'],
    });
  });

  it('deve retornar um usuario ao buscar por CPF', async () => {
    const usuarioDTO = {
      nome_completo: 'Fulano de Tal',
      email: 'test@teste.com',
      telefone: '999999999',
      CPF: '123.456.789-00',
      endereco: 'Rua dos Testes, 123',
    };

    await typeOrmUsuarioRepository.save(usuarioDTO);

    const { statusCode, body } = await request(app).get(
      `/usuarios/cpf/${usuarioDTO.CPF}`,
    );
    expect(body.id).toBeDefined();
    expect(statusCode).toBe(200);
    expect(body).toEqual(expect.objectContaining(usuarioDTO));
  });

  it('deve retornar null ao buscar por CPF', async () => {
    const { statusCode, body } = await request(app).get(
      `/usuarios/cpf/123.456.789-00`,
    );

    expect(statusCode).toBe(200);
    expect(body).toBeNull();
  });

  it('deve retornar um erro com os campos obrigatorios', async () => {
    const { statusCode, body } = await request(app).get('/usuarios/cpf/123');

    expect(statusCode).toBe(400);
    expect(body.message).toBe('Validation error');
    expect(body.errors.fieldErrors).toEqual({
      CPF: ['CPF inválido'],
    });
  });
});
