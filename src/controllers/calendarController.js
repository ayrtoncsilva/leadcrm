import { google } from 'googleapis';
import { createOAuthClient } from '../config/googleAuth.js';
import { Token } from '../models/Token.js';

async function getAuthedClient() {
  const token = await Token.get();
  if (!token) return null;

  const client = createOAuthClient();
  client.setCredentials({
    access_token:  token.access_token,
    refresh_token: token.refresh_token,
    expiry_date:   token.expiry_date ? Number(token.expiry_date) : undefined,
  });

  // persiste novo access_token se for renovado automaticamente
  client.on('tokens', async (newTokens) => {
    if (newTokens.access_token) {
      await Token.save({ ...token, ...newTokens });
    }
  });

  return client;
}

export async function getStatus(_req, res) {
  const token = await Token.get();
  res.json({ connected: !!token });
}

export async function getEvents(_req, res) {
  try {
    const client = await getAuthedClient();
    if (!client) return res.status(401).json({ error: 'not_connected' });

    const calendar = google.calendar({ version: 'v3', auth: client });
    const now = new Date();
    const until = new Date(now);
    until.setDate(until.getDate() + 30);

    const { data } = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: until.toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime',
    });

    res.json(data.items || []);
  } catch (err) {
    console.error('Calendar events error:', err);
    const status = err?.code === 401 || err?.status === 401 ? 401 : 500;
    res.status(status).json({ error: status === 401 ? 'token_expired' : 'Erro ao buscar eventos.' });
  }
}
