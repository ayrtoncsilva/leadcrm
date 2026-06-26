import { db } from '../config/database.js';

function toPlain(row) {
  return {
    id: Number(row.id),
    data: row.data,
    nome: row.nome,
    origem: row.origem,
    qualificado: row.qualificado ?? '',
    ativado: row.ativado ?? '',
    respondeu: row.respondeu ?? '',
    vendido: row.vendido ?? '',
    agendado: row.agendado ?? '',
    remarcado: row.remarcado ?? '',
    faltou: row.faltou ?? '',
    datas_agendamento: JSON.parse(row.datas_agendamento || '[]'),
    modulos: JSON.parse(row.modulos || '[]'),
    placas: row.placas ?? '',
  };
}

const ALL_FIELDS = 'data, nome, origem, qualificado, ativado, respondeu, vendido, agendado, remarcado, faltou, datas_agendamento, modulos, placas';
const PLACEHOLDERS = '?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?';

function toArgs({ data, nome, origem, qualificado, ativado, respondeu, vendido,
                  agendado, remarcado, faltou, datas_agendamento, modulos, placas }) {
  return [
    data, nome, origem,
    qualificado ?? '', ativado ?? '', respondeu ?? '', vendido ?? '',
    agendado ?? '', remarcado ?? '', faltou ?? '',
    JSON.stringify(Array.isArray(datas_agendamento) ? datas_agendamento : []),
    JSON.stringify(Array.isArray(modulos) ? modulos : []),
    placas ?? '',
  ];
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

  async create(fields) {
    const result = await db.execute({
      sql: `INSERT INTO contacts (${ALL_FIELDS}) VALUES (${PLACEHOLDERS})`,
      args: toArgs(fields),
    });
    return Number(result.lastInsertRowid);
  },

  async update(id, fields) {
    const setClauses = ALL_FIELDS.split(', ').map(f => `${f} = ?`).join(', ');
    const result = await db.execute({
      sql: `UPDATE contacts SET ${setClauses} WHERE id = ?`,
      args: [...toArgs(fields), Number(id)],
    });
    return result.rowsAffected;
  },

  async delete(id) {
    const result = await db.execute({
      sql: 'DELETE FROM contacts WHERE id = ?',
      args: [Number(id)],
    });
    return result.rowsAffected;
  },
};
