import { createOAuthClient, SCOPES } from '../config/googleAuth.js';
import { Token } from '../models/Token.js';

export function redirectToGoogle(_req, res) {
  const client = createOAuthClient();
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
  res.redirect(url);
}

export async function handleCallback(req, res) {
  const { code, error } = req.query;
  if (error) return res.redirect('/?error=auth_denied');

  try {
    const client = createOAuthClient();
    const { tokens } = await client.getToken(code);
    await Token.save(tokens);
    res.redirect('/?view=agenda&auth=success');
  } catch (err) {
    console.error('Google callback error:', err);
    res.redirect('/?error=auth_failed');
  }
}

export async function disconnect(_req, res) {
  try {
    await Token.clear();
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Erro ao desconectar.' });
  }
}
