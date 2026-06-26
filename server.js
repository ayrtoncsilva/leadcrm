import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import contactRoutes  from './src/routes/contacts.js';
import authRoutes     from './src/routes/auth.js';
import calendarRoutes from './src/routes/calendar.js';
import sheetsRoutes   from './src/routes/sheets.js';
import { initDb } from './src/config/database.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Inicializa o banco uma vez por instância (funciona local e serverless)
let dbReady = false;
app.use(async (_req, _res, next) => {
  if (!dbReady) {
    await initDb();
    dbReady = true;
  }
  next();
});

app.use('/api/contacts',  contactRoutes);
app.use('/api/v1/auth',   authRoutes);
app.use('/api/calendar',  calendarRoutes);
app.use('/api/sheets',    sheetsRoutes);

// Local: sobe o servidor normalmente
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`CRM ileva → http://localhost:${PORT}`));
}

// Vercel: exporta o app como handler
export default app;
