import { createClient } from '@libsql/client';

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contacts (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      data      TEXT    NOT NULL,
      nome      TEXT    NOT NULL,
      origem    TEXT    NOT NULL,
      qualificado TEXT  NOT NULL DEFAULT 'não',
      ativado   TEXT    NOT NULL DEFAULT 'não',
      respondeu TEXT    NOT NULL DEFAULT 'pendente',
      created_at TEXT   DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tokens (
      id            INTEGER PRIMARY KEY,
      access_token  TEXT    NOT NULL,
      refresh_token TEXT,
      expiry_date   INTEGER
    )
  `);
  // migração: adiciona coluna vendido em tabelas já existentes
  try {
    await db.execute(`ALTER TABLE contacts ADD COLUMN vendido TEXT NOT NULL DEFAULT 'não'`);
  } catch { /* coluna já existe */ }
  console.log('Banco Turso pronto.');
}
