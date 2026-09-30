/**
 * Context & Muse — Lead Export Utility
 * Usage:
 *   node scripts/export_leads.js [--format=json|csv] [--limit=100] [--out=leads.json]
 * Requires DATABASE_URL or POSTGRES_URL environment variable.
 */

import fs from 'fs';
import path from 'path';
import pg from 'pg';

// Lightweight .env loader if present
const envFiles = ['.env', '.env.local', '.env.production.local'];
for (const envFile of envFiles) {
  const envPath = path.resolve(envFile);
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const idx = trimmed.indexOf('=');
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
let format = 'json';
let limit = 100;
let outFile = null;
let isMock = process.env.LEAD_STORAGE_MOCK === 'true';

for (const arg of args) {
  if (arg.startsWith('--format=')) {
    format = arg.split('=')[1].toLowerCase();
  } else if (arg.startsWith('--limit=')) {
    limit = parseInt(arg.split('=')[1], 10) || 100;
  } else if (arg.startsWith('--out=')) {
    outFile = arg.split('=')[1];
  } else if (arg === '--mock') {
    isMock = true;
  }
}

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString && !isMock) {
  console.error('[Error] Neither DATABASE_URL nor POSTGRES_URL is configured in environment.');
  console.error('Please configure your database connection string or set it via environment variable:');
  console.error('  export DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"');
  console.error('Or use --mock to verify export formatting with synthetic data.');
  process.exit(1);
}

const { Pool } = pg;
const pool = connectionString ? new Pool({
  connectionString,
  ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
}) : null;

async function run() {
  try {
    const query = `
      SELECT 
        id, 
        created_at, 
        updated_at,
        status,
        is_test,
        form_id, 
        source_page, 
        inquiry_type, 
        name, 
        email, 
        phone,
        company, 
        website, 
        budget_range, 
        timeline,
        message, 
        notification_status
      FROM leads
      ORDER BY created_at DESC
      LIMIT $1;
    `;
    let rows = [];
    if (isMock) {
      rows = [
        {
          id: 'lead_mock_001',
          created_at: '2026-09-29T15:30:00.000Z',
          status: 'new',
          is_test: true,
          form_id: 'contact-wizard',
          source_page: '/contact/',
          inquiry_type: 'contact',
          name: 'Context Muse QA Test',
          email: 'qa-test@example.com',
          phone: '+1 713 555 0199',
          company: 'Acme Test Corp, LLC',
          website: 'https://example.com',
          budget_range: '$5,000 - $10,000',
          timeline: 'Within 30 days',
          message: 'Production lead persistence verification.\nLine 2 with "quotes", commas, & special symbols: ñ, é, 🚀',
          notification_status: 'pending'
        }
      ];
    } else {
      const res = await pool.query(query, [limit]);
      rows = res.rows;
    }

    let output = '';
    if (format === 'csv') {
      const headers = ['id', 'created_at', 'status', 'is_test', 'form_id', 'source_page', 'inquiry_type', 'name', 'email', 'phone', 'company', 'website', 'budget_range', 'timeline', 'message', 'notification_status'];
      const csvLines = [headers.join(',')];
      for (const row of rows) {
        const line = headers.map(h => {
          const val = row[h] !== null && row[h] !== undefined ? String(row[h]).replace(/"/g, '""') : '';
          return `"${val}"`;
        }).join(',');
        csvLines.push(line);
      }
      output = csvLines.join('\n');
    } else {
      output = JSON.stringify(rows, null, 2);
    }

    if (outFile) {
      fs.writeFileSync(outFile, output, 'utf8');
      console.log(`[Success] Exported ${rows.length} leads to ${outFile} (${format})`);
    } else {
      console.log(output);
    }
  } catch (err) {
    console.error('[Export Failed]', err.message);
    process.exit(1);
  } finally {
    if (pool) await pool.end();
  }
}

run();
