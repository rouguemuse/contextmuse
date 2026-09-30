import pg from 'pg';

const { Pool } = pg;

let pool = null;
let tableInitialized = false;

// In-memory mock store strictly for local test execution when LEAD_STORAGE_MOCK === 'true'
const mockStore = new Map();

/**
 * Returns true if a PostgreSQL connection string is configured in the environment.
 */
export function isDbConfigured() {
  if (process.env.LEAD_STORAGE_MOCK === 'true') return true;
  const uri = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  return Boolean(uri && uri.trim().length > 0);
}

/**
 * Gets or creates the PostgreSQL connection pool.
 */
export function getDbPool() {
  if (process.env.LEAD_STORAGE_MOCK === 'true') {
    return null;
  }

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    return null;
  }

  if (!pool) {
    const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
    pool = new Pool({
      connectionString,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('[DB Pool Error]', err.message);
    });
  }

  return pool;
}

/**
 * Auto-creates or upgrades the leads table if not already present.
 */
export async function ensureLeadsTable() {
  if (process.env.LEAD_STORAGE_MOCK === 'true') {
    tableInitialized = true;
    return;
  }

  if (tableInitialized) return;

  const db = getDbPool();
  if (!db) {
    throw new Error('DATABASE_UNCONFIGURED: DATABASE_URL or POSTGRES_URL environment variable is missing.');
  }

  const ddl = `
    CREATE TABLE IF NOT EXISTS leads (
      id VARCHAR(64) PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(32) DEFAULT 'received',
      is_test BOOLEAN DEFAULT FALSE,
      form_id VARCHAR(64) NOT NULL,
      source_page VARCHAR(255) NOT NULL,
      inquiry_type VARCHAR(64) NOT NULL DEFAULT 'other',
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(64),
      company VARCHAR(255),
      website VARCHAR(512),
      message TEXT,
      budget_range VARCHAR(64),
      timeline VARCHAR(64),
      answers_json JSONB,
      utm_source VARCHAR(128),
      utm_medium VARCHAR(128),
      utm_campaign VARCHAR(128),
      utm_content VARCHAR(128),
      referrer VARCHAR(512),
      notification_status VARCHAR(32) DEFAULT 'pending',
      schema_version VARCHAR(16) DEFAULT 'v1',
      client_ip_hash VARCHAR(64),
      user_agent VARCHAR(512),
      idempotency_hash VARCHAR(64) UNIQUE
    );
    CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
    CREATE INDEX IF NOT EXISTS idx_leads_inquiry_type ON leads(inquiry_type);
    CREATE INDEX IF NOT EXISTS idx_leads_form_id ON leads(form_id);
    CREATE INDEX IF NOT EXISTS idx_leads_is_test ON leads(is_test);

    -- Ensure schema backward-compatibility for existing deployments
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS status VARCHAR(32) DEFAULT 'received';
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_test BOOLEAN DEFAULT FALSE;
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_page VARCHAR(255);
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS inquiry_type VARCHAR(64) DEFAULT 'other';
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone VARCHAR(64);
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget_range VARCHAR(64);
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS timeline VARCHAR(64);
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS answers_json JSONB;
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source VARCHAR(128);
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium VARCHAR(128);
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign VARCHAR(128);
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_content VARCHAR(128);
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS referrer VARCHAR(512);
  `;

  await db.query(ddl);
  tableInitialized = true;
}

/**
 * Health check helper for database connectivity.
 */
export async function checkDbHealth() {
  if (process.env.LEAD_STORAGE_MOCK === 'true') {
    return { ok: true, status: 'mock_active', total_leads: mockStore.size };
  }

  const db = getDbPool();
  if (!db) {
    return {
      ok: false,
      status: 'unconfigured',
      message: 'DATABASE_URL or POSTGRES_URL environment variable is missing in server environment.'
    };
  }

  try {
    const res = await db.query('SELECT NOW() as current_time, COUNT(*)::int as lead_count FROM leads;');
    return {
      ok: true,
      status: 'connected',
      current_time: res.rows[0].current_time,
      total_leads: res.rows[0].lead_count
    };
  } catch (err) {
    if (err.message && err.message.includes('relation "leads" does not exist')) {
      try {
        await ensureLeadsTable();
        return { ok: true, status: 'connected_initialized', total_leads: 0 };
      } catch (initErr) {
        return { ok: false, status: 'init_failed', error: initErr.message };
      }
    }
    return { ok: false, status: 'connection_error', error: err.message };
  }
}

/**
 * Looks up existing lead by idempotency hash within recent window.
 */
export async function findLeadByIdempotency(idempotencyHash) {
  if (process.env.LEAD_STORAGE_MOCK === 'true') {
    for (const lead of mockStore.values()) {
      if (lead.idempotency_hash === idempotencyHash) {
        return lead;
      }
    }
    return null;
  }

  const db = getDbPool();
  if (!db) return null;

  const query = 'SELECT id, created_at, status, email, name, notification_status FROM leads WHERE idempotency_hash = $1 LIMIT 1;';
  const res = await db.query(query, [idempotencyHash]);
  return res.rows[0] || null;
}

/**
 * Inserts a validated lead record into the database.
 */
export async function insertLead(lead) {
  const nowIso = new Date().toISOString();
  const completeLead = {
    ...lead,
    created_at: lead.created_at || nowIso,
    updated_at: lead.updated_at || nowIso,
    status: lead.status || 'new',
    is_test: Boolean(lead.is_test),
    inquiry_type: lead.inquiry_type || 'other',
    notification_status: lead.notification_status || 'pending',
    schema_version: lead.schema_version || 'v1'
  };

  if (process.env.LEAD_STORAGE_MOCK === 'true') {
    mockStore.set(completeLead.id, completeLead);
    return completeLead;
  }

  const db = getDbPool();
  if (!db) {
    throw new Error('DATABASE_UNCONFIGURED: DATABASE_URL or POSTGRES_URL environment variable is missing.');
  }

  const query = `
    INSERT INTO leads (
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
      message,
      budget_range,
      timeline,
      answers_json,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      referrer,
      notification_status,
      schema_version,
      client_ip_hash,
      user_agent,
      idempotency_hash
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
    )
    RETURNING id, created_at, status, notification_status;
  `;

  const values = [
    completeLead.id,
    completeLead.created_at,
    completeLead.updated_at,
    completeLead.status,
    completeLead.is_test,
    completeLead.form_id,
    completeLead.source_page,
    completeLead.inquiry_type,
    completeLead.name,
    completeLead.email,
    completeLead.phone || null,
    completeLead.company || null,
    completeLead.website || null,
    completeLead.message || null,
    completeLead.budget_range || null,
    completeLead.timeline || null,
    JSON.stringify(completeLead.answers_json || {}),
    completeLead.utm_source || null,
    completeLead.utm_medium || null,
    completeLead.utm_campaign || null,
    completeLead.utm_content || null,
    completeLead.referrer || null,
    completeLead.notification_status,
    completeLead.schema_version,
    completeLead.client_ip_hash || null,
    completeLead.user_agent || null,
    completeLead.idempotency_hash
  ];

  const res = await db.query(query, values);
  return {
    ...completeLead,
    created_at: res.rows[0].created_at,
    status: res.rows[0].status,
    notification_status: res.rows[0].notification_status
  };
}

/**
 * Updates notification status for a lead.
 */
export async function updateNotificationStatus(leadId, status) {
  if (process.env.LEAD_STORAGE_MOCK === 'true') {
    const lead = mockStore.get(leadId);
    if (lead) {
      lead.notification_status = status;
      lead.updated_at = new Date().toISOString();
      mockStore.set(leadId, lead);
    }
    return;
  }

  const db = getDbPool();
  if (!db) return;

  try {
    await db.query('UPDATE leads SET notification_status = $1, updated_at = NOW() WHERE id = $2;', [status, leadId]);
  } catch (err) {
    console.error('[Notification Status Update Failed]', err.message);
  }
}

/**
 * Mock Store test utilities
 */
export function getMockLeads() {
  return Array.from(mockStore.values());
}

export function clearMockLeads() {
  mockStore.clear();
}

