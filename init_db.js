import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false // Important for many cloud-hosted databases
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sqlPath = path.join(__dirname, 'database.sql');
const sql = fs.readFileSync(sqlPath).toString();

pool.query(sql, (err, res) => {
  if (err) {
    console.error('Error executing query', err.stack);
  } else {
    console.log('Tables created successfully');
  }
  pool.end();
});
