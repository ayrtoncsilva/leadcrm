import { db } from '../config/database.js';

function toPlain(row) {
  return {
    id: Number(row.id),
    data: row.data,
    nome: row.nome,
    origem: row.origem,
    qualificado: row.qualificado,
    ativado: row.ativado,
    respondeu: row.respondeu,
  };
}

export const Contact = {
  async findAll({ origem, de, ate } = {}) {
    let sql = 'SELECT * FROM contacts WHERE 1=1';
    const args = [];
    if (origem) { sql += ' AND origem = ?'; args.push(origem); }
    if (de)     { sql += ' AND data >= ?'; args.push(de); }
    if (ate)    { sql += ' AND data <= ?'; args.push(ate); }
    sql += ' ORDER BY data ASC, id ASC';
    const result = await db.execute({ sql, args });
    return result.rows.map(toPlain);
  },

  async create({ data, nome, origem, qualificado, ativado, respondeu }) {
    const result = await db.execute({
      sql: 'INSERT INTO contacts (data, nome, origem, qualificado, ativado, respondeu) VALUES (?, ?, ?, ?, ?, ?)',
      args: [data, nome, origem, qualificado, ativado, respondeu],
    });
    return Number(result.lastInsertRowid);
  },

  async delete(id) {
    const result = await db.execute({
      sql: 'DELETE FROM contacts WHERE id = ?',
      args: [Number(id)],
    });
    return result.rowsAffected;
  },
};
