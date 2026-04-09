import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // إعداد قاعدة البيانات
  const db = await open({
    filename: './salon.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS staff (id TEXT PRIMARY KEY, staffId TEXT, name TEXT, contact TEXT, email TEXT, role TEXT, image TEXT);
    CREATE TABLE IF NOT EXISTS clients (id TEXT PRIMARY KEY, name TEXT, contact TEXT, address TEXT, gender TEXT, isNew INTEGER, notes TEXT);
    CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, productId TEXT, barcodeId TEXT, brand TEXT, name TEXT, price REAL, stock INTEGER, image TEXT);
    CREATE TABLE IF NOT EXISTS services (id TEXT PRIMARY KEY, name TEXT, price REAL, duration INTEGER, category TEXT, type TEXT);
    CREATE TABLE IF NOT EXISTS appointments (id TEXT PRIMARY KEY, staffId TEXT, clientName TEXT, serviceId TEXT, startTime TEXT, endTime TEXT, status TEXT);
    CREATE TABLE IF NOT EXISTS sales (id TEXT PRIMARY KEY, data TEXT, timestamp INTEGER);
  `);

  // API Routes
  app.get('/api/staff', async (req, res) => res.json(await db.all('SELECT * FROM staff')));
  app.get('/api/clients', async (req, res) => res.json(await db.all('SELECT * FROM clients')));
  app.get('/api/products', async (req, res) => res.json(await db.all('SELECT * FROM products')));
  app.get('/api/services', async (req, res) => res.json(await db.all('SELECT * FROM services')));
  app.get('/api/appointments', async (req, res) => res.json(await db.all('SELECT * FROM appointments')));
  app.get('/api/sales', async (req, res) => {
    const sales = await db.all('SELECT * FROM sales');
    res.json(sales.map(s => JSON.parse(s.data)));
  });

  app.post('/api/clients', async (req, res) => {
    const { id, name, contact, address, gender, isNew, notes } = req.body;
    await db.run('INSERT INTO clients (id, name, contact, address, gender, isNew, notes) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, name, contact, address, gender, isNew ? 1 : 0, notes]);
    res.json({ success: true });
  });

  app.post('/api/sales', async (req, res) => {
    const { id, timestamp } = req.body;
    await db.run('INSERT INTO sales (id, data, timestamp) VALUES (?, ?, ?)', [id, JSON.stringify(req.body), timestamp]);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));
}

startServer().catch(err => console.error(err));