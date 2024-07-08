import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false // Important for many cloud-hosted databases
  }
});

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
