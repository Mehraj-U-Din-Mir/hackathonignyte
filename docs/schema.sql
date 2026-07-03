-- ============================================================
-- ignyte 2026 – COMPLETE SUPABASE SQL SCHEMA
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- DROP EXISTING (clean slate)
-- ============================================================
DROP TABLE IF EXISTS audit_log      CASCADE;
DROP TABLE IF EXISTS qr_scans       CASCADE;
DROP TABLE IF EXISTS registrations  CASCADE;
DROP TABLE IF EXISTS admin_users    CASCADE;
DROP VIEW  IF EXISTS school_analytics;
DROP VIEW  IF EXISTS daily_registrations;
DROP VIEW  IF EXISTS registration_summary;

-- ============================================================
-- ADMIN USERS
-- ============================================================
CREATE TABLE admin_users (
  id          UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  email       TEXT        UNIQUE NOT NULL,
  name        TEXT        NOT NULL,
  password    TEXT        NOT NULL,
  role        TEXT        DEFAULT 'admin' CHECK (role IN ('admin','superadmin')),
  is_active   BOOLEAN     DEFAULT true,
  last_login  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- REGISTRATIONS
-- ============================================================
CREATE TABLE registrations (
  id                      UUID    DEFAULT uuid_generate_v4() PRIMARY KEY,
  participant_id          TEXT    UNIQUE NOT NULL,

  -- Personal
  full_name               TEXT    NOT NULL,
  parentage               TEXT    NOT NULL,
  class                   TEXT    NOT NULL CHECK (class IN ('8','9','10','11','12')),
  school_name             TEXT    NOT NULL,
  city                    TEXT    NOT NULL DEFAULT 'Srinagar',
  contact_number          TEXT    NOT NULL,
  email                   TEXT    NOT NULL,

  -- Team
  team_name               TEXT    NOT NULL,
  team_members            TEXT[]  NOT NULL DEFAULT '{}',

  -- Skills & Resources
  skills                  TEXT,
  laptop_available        BOOLEAN DEFAULT true,

  -- Payment
  upi_transaction_id      TEXT    NOT NULL,
  payment_screenshot_url  TEXT,
  payment_verified        BOOLEAN DEFAULT false,

  -- Status: pending | approved | rejected
  status                  TEXT    DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  admin_notes             TEXT,

  -- QR
  qr_code_url             TEXT,
  qr_code_data            TEXT,

  -- Attendance
  attended                BOOLEAN     DEFAULT false,
  attended_at             TIMESTAMPTZ,

  -- Project Submission
  project_title           TEXT,
  project_description     TEXT,
  project_url             TEXT,
  project_file_url        TEXT,
  project_submitted       BOOLEAN     DEFAULT false,
  project_submitted_at    TIMESTAMPTZ,

  -- Timestamps
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW(),
  approved_at             TIMESTAMPTZ
);

-- ============================================================
-- QR SCANS LOG
-- ============================================================
CREATE TABLE qr_scans (
  id             UUID    DEFAULT uuid_generate_v4() PRIMARY KEY,
  participant_id TEXT    NOT NULL,
  scan_result    TEXT    NOT NULL CHECK (scan_result IN ('success','duplicate','invalid','rejected')),
  scanned_by     TEXT,
  notes          TEXT,
  scanned_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOG
-- ============================================================
CREATE TABLE audit_log (
  id          UUID    DEFAULT uuid_generate_v4() PRIMARY KEY,
  action      TEXT    NOT NULL,
  table_name  TEXT    NOT NULL,
  record_id   UUID,
  admin_email TEXT,
  details     JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_reg_email    ON registrations(email);
CREATE INDEX idx_reg_status   ON registrations(status);
CREATE INDEX idx_reg_school   ON registrations(school_name);
CREATE INDEX idx_reg_pid      ON registrations(participant_id);
CREATE INDEX idx_reg_upi      ON registrations(upi_transaction_id);
CREATE INDEX idx_reg_created  ON registrations(created_at DESC);
CREATE INDEX idx_reg_project  ON registrations(project_submitted);

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- VIEWS
-- ============================================================

CREATE OR REPLACE VIEW school_analytics AS
SELECT
  school_name,
  COUNT(*)                                          AS total_registrations,
  COUNT(*) FILTER (WHERE status = 'approved')       AS approved,
  COUNT(*) FILTER (WHERE status = 'pending')        AS pending,
  COUNT(*) FILTER (WHERE status = 'rejected')       AS rejected,
  COUNT(*) FILTER (WHERE attended = true)           AS attended,
  COUNT(*) FILTER (WHERE project_submitted = true)  AS projects_submitted,
  COUNT(DISTINCT team_name)                         AS total_teams
FROM registrations
GROUP BY school_name
ORDER BY total_registrations DESC;

CREATE OR REPLACE VIEW daily_registrations AS
SELECT
  DATE(created_at)                                  AS date,
  COUNT(*)                                          AS total,
  COUNT(*) FILTER (WHERE status = 'approved')       AS approved,
  COUNT(*) FILTER (WHERE status = 'pending')        AS pending
FROM registrations
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW registration_summary AS
SELECT
  r.id,
  r.participant_id,
  r.full_name,
  r.email,
  r.contact_number,
  r.class,
  r.school_name,
  r.city,
  r.team_name,
  r.team_members,
  r.laptop_available,
  r.upi_transaction_id,
  r.payment_verified,
  r.status,
  r.attended,
  r.attended_at,
  r.qr_code_url,
  r.project_submitted,
  r.project_title,
  r.project_url,
  r.created_at,
  r.approved_at,
  CASE
    WHEN r.status = 'approved' AND r.attended = true  THEN 'checked-in'
    WHEN r.status = 'approved' AND r.attended = false THEN 'not-arrived'
    WHEN r.status = 'pending'                          THEN 'awaiting-approval'
    WHEN r.status = 'rejected'                         THEN 'rejected'
    ELSE 'unknown'
  END AS event_status
FROM registrations r
ORDER BY r.created_at DESC;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users   ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log     ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans      ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (register)
CREATE POLICY "public_insert_registrations"
  ON registrations FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Public can SELECT (check email duplicate, verify ID)
CREATE POLICY "public_select_registrations"
  ON registrations FOR SELECT TO anon, authenticated
  USING (true);

-- Authenticated (admin) can UPDATE
CREATE POLICY "admin_update_registrations"
  ON registrations FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- Authenticated can DELETE (admin only)
CREATE POLICY "admin_delete_registrations"
  ON registrations FOR DELETE TO authenticated
  USING (true);

-- Admin users table - only authenticated
CREATE POLICY "admin_all_admin_users"
  ON admin_users FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_audit_log"
  ON audit_log FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_qr_scans"
  ON qr_scans FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Also allow anon to insert audit log (for QR scans at event)
CREATE POLICY "public_insert_audit"
  ON audit_log FOR INSERT TO anon
  WITH CHECK (true);

-- ============================================================
-- DEFAULT ADMIN LOGINS
-- ============================================================
INSERT INTO admin_users (email, name, password, role) VALUES
  ('admin@ignyte2026.com',     'Super Admin',    'ignyte@2026',  'superadmin'),
  ('manager@ignyte2026.com',   'Event Manager',  'Manager@2026',   'admin'),
  ('volunteer@ignyte2026.com', 'Volunteer',      'Volunteer@2026', 'admin');

-- ============================================================
-- SAMPLE REGISTRATIONS (delete before real event)
-- DELETE FROM registrations WHERE email LIKE '%sample.com%';
-- ============================================================
INSERT INTO registrations (
  participant_id, full_name, parentage, class,
  school_name, city, contact_number, email,
  team_name, team_members, skills, laptop_available,
  upi_transaction_id, status, attended,
  project_title, project_description, project_url,
  project_submitted, project_submitted_at
) VALUES
(
  'BF26-0001','Aisha Khan','Mohammad Khan','10',
  'Delhi Public School Srinagar','Srinagar','9876543210','aisha@sample.com',
  'Team Alpha',ARRAY['Aisha Khan','Rahul Sharma','Priya Singh','Adil Wani'],
  'Python, Web Design',true,
  'TXN123456789','approved',true,
  'EcoTrack – Carbon Footprint Monitor',
  'A web app that helps students track their daily carbon footprint and suggests eco-friendly alternatives.',
  'https://github.com/teamalpha/ecotrack',
  true, NOW() - interval '2 hours'
),
(
  'BF26-0002','Rahul Sharma','Suresh Sharma','11',
  'Delhi Public School Srinagar','Srinagar','9876543211','rahul@sample.com',
  'Team Alpha',ARRAY['Aisha Khan','Rahul Sharma','Priya Singh','Adil Wani'],
  'JavaScript, React',true,
  'TXN123456790','approved',true,
  NULL,NULL,NULL,false,NULL
),
(
  'BF26-0003','Zara Mir','Farooq Mir','12',
  'Burn Hall School','Srinagar','9876543212','zara@sample.com',
  'Team Nova',ARRAY['Zara Mir','Omar Bhat','Sara Lone'],
  'AI, Machine Learning',true,
  'TXN123456791','approved',false,
  NULL,NULL,NULL,false,NULL
),
(
  'BF26-0004','Omar Bhat','Ghulam Bhat','12',
  'Burn Hall School','Srinagar','9876543213','omar@sample.com',
  'Team Nova',ARRAY['Zara Mir','Omar Bhat','Sara Lone'],
  'Scratch, Python basics',false,
  'TXN123456792','approved',false,
  NULL,NULL,NULL,false,NULL
),
(
  'BF26-0005','Imran Sheikh','Bashir Sheikh','9',
  'Tyndale Biscoe School','Srinagar','9876543214','imran@sample.com',
  'Team Byte',ARRAY['Imran Sheikh','Faisal Dar','Nadia Qazi','Umar Khan'],
  'No experience, eager to learn',false,
  'TXN123456793','pending',false,
  NULL,NULL,NULL,false,NULL
),
(
  'BF26-0006','Faisal Dar','Abdul Dar','9',
  'Tyndale Biscoe School','Srinagar','9876543215','faisal@sample.com',
  'Team Byte',ARRAY['Imran Sheikh','Faisal Dar','Nadia Qazi','Umar Khan'],
  'Basic computer skills',true,
  'TXN123456794','pending',false,
  NULL,NULL,NULL,false,NULL
),
(
  'BF26-0007','Sana Rashid','Tariq Rashid','8',
  'Army Goodwill School','Baramulla','9876543216','sana@sample.com',
  'Team Spark',ARRAY['Sana Rashid','Bilal Ahmed','Hina Lone'],
  'Art, Creative thinking',false,
  'TXN123456795','pending',false,
  NULL,NULL,NULL,false,NULL
),
(
  'BF26-0008','Adnan Wani','Nazir Wani','11',
  'SP Higher Secondary School','Anantnag','9876543217','adnan@sample.com',
  'Team Glitch',ARRAY['Adnan Wani','Waseem Bhat'],
  'Gaming',true,
  'TXN999999999','rejected',false,
  NULL,NULL,NULL,false,NULL
);

-- ============================================================
-- VERIFY SETUP — run these to confirm everything worked
-- ============================================================
SELECT 'Tables created:' AS info;
SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;

SELECT 'Admin users:' AS info;
SELECT id, email, name, role FROM admin_users;

SELECT 'Sample registrations:' AS info;
SELECT participant_id, full_name, school_name, status, attended, project_submitted FROM registrations ORDER BY participant_id;

-- ============================================================
-- ADMIN LOGIN CREDENTIALS
-- admin@ignyte2026.com      →  ignyte@2026   (superadmin)
-- manager@ignyte2026.com    →  Manager@2026    (admin)
-- volunteer@ignyte2026.com  →  Volunteer@2026  (admin)
--
-- USE IN FRONTEND: http://localhost:3000/admin
-- PASSWORD ENV:    NEXT_PUBLIC_ADMIN_PASSWORD=ignyte2026admin
--
-- TO REMOVE SAMPLE DATA BEFORE REAL EVENT:
-- DELETE FROM registrations WHERE email LIKE '%sample.com%';
-- ============================================================
