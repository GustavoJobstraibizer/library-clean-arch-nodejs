const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Emprestimo',
  tableName: 'emprestimos',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    data_saida: {
      type: 'date',
    },
    data_devolucao: {
      type: 'date',
      nullable: true,
    },
    data_retorno: {
      type: 'date',
    },
    usuario_id: {
      type: 'int',
    },
    livro_id: {
      type: 'int',
    },
  },
  relations: {
    usuario: {
      target: 'Usuario',
      type: 'many-to-one',
      joinColumn: {
        name: 'usuario_id',
        referencedColumnName: 'id',
      },
    },
    livro: {
      target: 'Livro',
      type: 'many-to-one',
      joinColumn: {
        name: 'livro_id',
        referencedColumnName: 'id',
      },
    },
  },
});
