const request = require('supertest');
const { app } = require('../app');

const {
  typeOrmLivroRepository,
} = require('../../../infra/db/typeorm/repositories/Livro');

describe('Routes: Livros', () => {
  beforeEach(async () => {
    await typeOrmLivroRepository.query('DELETE FROM livros');
  });

  it('deve cadastrar um livro com sucesso', async () => {
    const { statusCode, body } = await request(app).post('/livros').send({
      nome: 'Livro Teste',
      quantidade: 10,
      autor: 'Autor Teste',
      genero: 'Genero Teste',
      ISBN: '1234567890',
    });

    expect(statusCode).toBe(201);
    expect(body).toBeNull();
  });

  it('deve retornar um erro com os campos obrigatorios', async () => {
    const { statusCode, body } = await request(app).post('/livros').send({});

    expect(statusCode).toBe(400);
    expect(body.message).toBe('Validation error');
    expect(body.errors.fieldErrors).toEqual({
      nome: ['Nome é obrigatório'],
      quantidade: ['Quantidade é obrigatória'],
      autor: ['Autor é obrigatório'],
      genero: ['Gênero é obrigatório'],
      ISBN: ['ISBN é obrigatório'],
    });
  });

  it('deve retornar um livro ao buscar por ISBN', async () => {
    const livroDTO = {
      nome: 'Livro Teste',
      quantidade: 10,
      autor: 'Autor Teste',
      genero: 'Genero Teste',
      ISBN: '1234567890',
    };

    await typeOrmLivroRepository.save(livroDTO);

    const { statusCode, body } = await request(app)
      .get(`/livros`)
      .query({ valor: livroDTO.ISBN });
    expect(body[0].id).toBeDefined();
    expect(statusCode).toBe(200);
    expect(body[0]).toEqual(expect.objectContaining(livroDTO));
  });

  it('deve retornar uma lista de livros ao buscar por nome', async () => {
    const livroDTO = {
      nome: 'Livro Teste',
      quantidade: 10,
      autor: 'Autor Teste',
      genero: 'Genero Teste',
      ISBN: '1234567890',
    };

    await typeOrmLivroRepository.save(livroDTO);

    const { statusCode, body } = await request(app)
      .get(`/livros`)
      .query({ valor: livroDTO.nome });
    expect(body[0].id).toBeDefined();
    expect(statusCode).toBe(200);
    expect(body[0]).toEqual(expect.objectContaining(livroDTO));
  });

  it('deve retornar uma lista vazia ao buscar por nome ou ISBN', async () => {
    const { statusCode, body } = await request(app)
      .get(`/livros`)
      .query({ valor: 'Livro Teste' });

    expect(statusCode).toBe(200);
    expect(body).toEqual([]);
  });

  it('deve retornar erro quando o campo valor não for fornecido', async () => {
    const { statusCode, body } = await request(app).get(`/livros`).query({});

    expect(statusCode).toBe(400);
    expect(body.errors).toBeDefined();
    expect(body.errors.fieldErrors).toEqual({ valor: ['Valor é obrigatório'] });
  });
});
