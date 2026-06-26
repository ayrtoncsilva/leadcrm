import { db } from '../config/database.js';

export const Token = {
  async get() {
    const result = await db.execute('SELECT * FROM tokens WHERE id = 1');
    return result.rows[0] || null;
  },

  async save({ access_token, refresh_token, expiry_date }) {
    await db.execute({
      sql: `
        INSERT INTO tokens (id, access_token, refresh_token, expiry_date)
        VALUES (1, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          access_token  = excluded.access_token,
          refresh_token = COALESCE(excluded.refresh_token, tokens.refresh_token),
          expiry_date   = excluded.expiry_date
      `,
      args: [access_token, refresh_token ?? null, expiry_date ? Number(expiry_date) : null],
    });
  },

  async clear() {
    await db.execute('DELETE FROM tokens WHERE id = 1');
  },
};
