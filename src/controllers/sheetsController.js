import { google } from 'googleapis';
import { createOAuthClient } from '../config/googleAuth.js';
import { Token } from '../models/Token.js';

const SHEET_ID = process.env.GOOGLE_SHEETS_ID || '1HNmxrQLb0lGNMoF8zEe084DaFi2Uz3sGRUxbMLYbR0I';

export async function getLeads(req, res) {
  try {
    const token = await Token.get();
    if (!token) return res.status(401).json({ error: 'Não conectado ao Google.' });

    const client = createOAuthClient();
    client.setCredentials(token);
    client.on('tokens', async (t) => {
      await Token.save({ ...token, ...t });
    });

    const sheets = google.sheets({ version: 'v4', auth: client });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'A:Z',
    });

    const rows = response.data.values || [];
    if (!rows.length) return res.json({ headers: [], rows: [] });

    res.json({ headers: rows[0], rows: rows.slice(1) });
  } catch (err) {
    console.error(err);
    const code = err.code || err.status;
    if (code === 403) return res.status(403).json({ error: 'scope_missing' });
    if (code === 401) return res.status(401).json({ error: 'Não autenticado.' });
    res.status(500).json({ error: 'Erro ao acessar planilha.' });
  }
}
