-- Context & Muse Lead Capture Infrastructure
-- PostgreSQL Schema Initialization
-- Compatible with Neon, Supabase, Vercel Postgres, AWS RDS, and local PostgreSQL

CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(64) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(32) DEFAULT 'new',
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

-- Index for chronological sorting and pipeline management
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Index for searching and deduplication by email
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Index for filtering by form and inquiry type
CREATE INDEX IF NOT EXISTS idx_leads_form_id ON leads(form_id);
CREATE INDEX IF NOT EXISTS idx_leads_inquiry_type ON leads(inquiry_type);

-- Index for distinguishing simulated/test leads
CREATE INDEX IF NOT EXISTS idx_leads_is_test ON leads(is_test);

-- Index for filtering by notification status
CREATE INDEX IF NOT EXISTS idx_leads_notification_status ON leads(notification_status);

