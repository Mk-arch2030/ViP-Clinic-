-- Apply only in a new synthetic auth-proof database, after the existing schema.
-- No Actor, Patient, CPN or historical-table definition is changed here.
CREATE SCHEMA vip_auth;
CREATE TABLE vip_auth.credentials (
  actor_id UUID PRIMARY KEY REFERENCES public.actors(actor_id) ON DELETE RESTRICT,
  login_label TEXT NOT NULL UNIQUE CHECK (login_label ~ '^[A-Z0-9/_-]{3,64}$'),
  verifier TEXT NOT NULL CHECK (length(verifier) = 80 AND verifier ~ '^vip-scrypt-v1\$[A-Za-z0-9_-]{22}\$[A-Za-z0-9_-]{43}$'),
  version INTEGER NOT NULL CHECK (version > 0),
  enabled BOOLEAN NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE vip_auth.sessions (
  digest TEXT PRIMARY KEY CHECK (digest ~ '^[0-9a-f]{64}$'),
  actor_id UUID NOT NULL REFERENCES vip_auth.credentials(actor_id) ON DELETE RESTRICT,
  credential_version INTEGER NOT NULL CHECK (credential_version > 0),
  csrf TEXT NOT NULL CHECK (csrf ~ '^[A-Za-z0-9_-]{43}$'),
  issued_at BIGINT NOT NULL,
  last_seen_at BIGINT NOT NULL,
  idle_deadline BIGINT NOT NULL,
  absolute_deadline BIGINT NOT NULL,
  revoked_at BIGINT,
  CHECK (issued_at <= last_seen_at AND last_seen_at < idle_deadline AND idle_deadline <= absolute_deadline)
);
CREATE INDEX sessions_actor_idx ON vip_auth.sessions(actor_id, issued_at, digest);
CREATE TABLE vip_auth.operating_mode (
  singleton BOOLEAN PRIMARY KEY CHECK (singleton),
  mode TEXT NOT NULL CHECK (mode IN ('DOCTOR_ONLY', 'DOCTOR_NURSE'))
);
CREATE TABLE vip_auth.delegations (
  nurse_id UUID PRIMARY KEY REFERENCES public.actors(actor_id) ON DELETE RESTRICT,
  doctor_id UUID NOT NULL REFERENCES public.actors(actor_id) ON DELETE RESTRICT,
  mode TEXT NOT NULL CHECK (mode IN ('FULL', 'LIMITED')),
  capabilities TEXT[] NOT NULL CHECK (capabilities <@ ARRAY['ARRIVAL','PATIENT_DATA_RECORDING','EXIT','DOCTOR_NOTIFICATION']::TEXT[]),
  version INTEGER NOT NULL CHECK (version > 0),
  CHECK (nurse_id <> doctor_id)
);
CREATE TABLE vip_auth.login_attempts (
  key TEXT PRIMARY KEY CHECK (key ~ '^(SOURCE|LABEL):[0-9a-f]{64}$'),
  count INTEGER NOT NULL CHECK (count > 0),
  expires_at BIGINT NOT NULL
);
REVOKE ALL ON SCHEMA vip_auth FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA vip_auth FROM PUBLIC;
