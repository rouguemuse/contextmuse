import fs from 'fs';
import path from 'path';
import pg from 'pg';

const { Pool } = pg;

// Load .env or .env.local if present
function loadEnv() {
  const envFiles = ['.env', '.env.local', '.env.production.local'];
  for (const f of envFiles) {
    const full = path.resolve(f);
    if (fs.existsSync(full)) {
      const lines = fs.readFileSync(full, 'utf8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const k = trimmed.slice(0, idx).trim();
          const v = trimmed.slice(idx + 1).trim();
          if (!process.env[k]) {
            process.env[k] = v;
          }
        }
      }
    }
  }
}

loadEnv();

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

async function runMigration() {
  console.log('=== Context & Muse Database Migration Runner ===\n');

  if (!connectionString) {
    console.error('DATABASE CONFIGURED: NO');
    console.error('[Error] Neither DATABASE_URL nor POSTGRES_URL is defined in the environment.');
    console.error('Please configure your database connection string and re-run.');
    process.exit(1);
  }

  console.log('DATABASE CONFIGURED: YES (Connection string detected)');

  const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
  const pool = new Pool({
    connectionString,
    ssl: isLocalhost ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
  });

  try {
    const client = await pool.connect();
    console.log('[Connection] Successfully established connection to PostgreSQL server.');

    const ddlPath = path.resolve('scripts/init_leads_db.sql');
    const ddl = fs.readFileSync(ddlPath, 'utf8');

    console.log('[Migration] Executing schema DDL from scripts/init_leads_db.sql...');
    await client.query(ddl);
    console.log('[Migration] Schema execution completed.');

    // Verify columns in leads table
    const colRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'leads' 
      ORDER BY ordinal_position;
    `);

    console.log(`[Verification] 'leads' table verified with ${colRes.rows.length} columns:`);
    colRes.rows.forEach(r => {
      console.log(`  - ${r.column_name} (${r.data_type})`);
    });

    // Verify indexes
    const idxRes = await client.query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'leads';
    `);

    console.log(`\n[Verification] Indexes verified (${idxRes.rows.length} found):`);
    idxRes.rows.forEach(r => {
      console.log(`  - ${r.indexname}`);
    });

    client.release();
    console.log('\n[Success] Database migration and index verification completed successfully.');
  } catch (err) {
    console.error('\n[Migration Failed]', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
