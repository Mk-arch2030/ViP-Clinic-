-- Stage 7 Increment A. Source only; never loaded by application startup.
-- Apply only to a positively identified disposable database, after schema.sql.
-- No backfill, fixture import, existing table alteration, or automatic grants.
BEGIN;
CREATE SCHEMA vip_clinical;
REVOKE ALL ON SCHEMA vip_clinical FROM PUBLIC;

CREATE TABLE vip_clinical.cases (
  case_id UUID PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(patient_id) ON DELETE RESTRICT,
  problem_summary TEXT NOT NULL CHECK (length(btrim(problem_summary)) > 0),
  created_by UUID NOT NULL REFERENCES public.actors(actor_id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL,
  lifecycle TEXT NOT NULL DEFAULT 'OPEN' CHECK (lifecycle IN ('OPEN','COMPLETED')),
  lifecycle_version INTEGER NOT NULL DEFAULT 0 CHECK (lifecycle_version >= 0),
  latest_event_id UUID,
  CHECK ((lifecycle_version = 0 AND lifecycle = 'OPEN' AND latest_event_id IS NULL)
      OR (lifecycle_version > 0 AND latest_event_id IS NOT NULL)),
  CHECK ((lifecycle = 'OPEN' AND lifecycle_version % 2 = 0)
      OR (lifecycle = 'COMPLETED' AND lifecycle_version % 2 = 1))
);
CREATE INDEX cases_patient_chronology ON vip_clinical.cases(patient_id, created_at, case_id);

CREATE TABLE vip_clinical.lifecycle_facts (
  event_id UUID PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES vip_clinical.cases(case_id) ON DELETE RESTRICT,
  doctor_id UUID NOT NULL REFERENCES public.actors(actor_id) ON DELETE RESTRICT,
  event_type TEXT NOT NULL CHECK (event_type IN ('COMPLETED','REOPENED')),
  occurred_at TIMESTAMPTZ NOT NULL,
  policy_timezone TEXT NOT NULL CHECK (policy_timezone = 'Africa/Cairo'),
  policy_date DATE NOT NULL,
  policy_version TEXT NOT NULL CHECK (policy_version = 'POLICY_B_V2'),
  from_lifecycle TEXT NOT NULL,
  to_lifecycle TEXT NOT NULL,
  resulting_version INTEGER NOT NULL CHECK (resulting_version > 0),
  previous_version INTEGER,
  completion_event_id UUID,
  completion_type TEXT,
  same_complaint_confirmed BOOLEAN,
  operation_id UUID NOT NULL,
  meaning_fingerprint TEXT NOT NULL CHECK (meaning_fingerprint ~ '^[0-9a-f]{64}$'),
  UNIQUE(case_id, resulting_version),
  UNIQUE(case_id, event_id, event_type),
  UNIQUE(case_id, event_id, resulting_version, to_lifecycle),
  UNIQUE(doctor_id, operation_id),
  UNIQUE(completion_event_id),
  CHECK (policy_date = (occurred_at AT TIME ZONE 'Africa/Cairo')::date),
  CHECK ((resulting_version = 1 AND previous_version IS NULL)
      OR (resulting_version > 1 AND previous_version IS NOT NULL AND previous_version = resulting_version - 1)),
  FOREIGN KEY (case_id, previous_version)
    REFERENCES vip_clinical.lifecycle_facts(case_id, resulting_version) ON DELETE RESTRICT,
  FOREIGN KEY (case_id, completion_event_id, completion_type)
    REFERENCES vip_clinical.lifecycle_facts(case_id, event_id, event_type) ON DELETE RESTRICT,
  CHECK ((event_type = 'COMPLETED' AND from_lifecycle = 'OPEN' AND to_lifecycle = 'COMPLETED'
      AND resulting_version % 2 = 1 AND completion_event_id IS NULL
      AND completion_type IS NULL AND same_complaint_confirmed IS NULL)
    OR (event_type = 'REOPENED' AND from_lifecycle = 'COMPLETED' AND to_lifecycle = 'OPEN'
      AND resulting_version % 2 = 0 AND completion_event_id IS NOT NULL
      AND completion_type IS NOT NULL AND completion_type = 'COMPLETED' AND same_complaint_confirmed IS TRUE))
);
ALTER TABLE vip_clinical.cases ADD CONSTRAINT case_latest_fact
  FOREIGN KEY(case_id, latest_event_id, lifecycle_version, lifecycle)
  REFERENCES vip_clinical.lifecycle_facts(case_id, event_id, resulting_version, to_lifecycle)
  DEFERRABLE INITIALLY DEFERRED;

-- Arrival confirmation is an assertion, never an invented physical arrival timestamp.
-- No creation repository or route is exposed while recording decisions remain gated.
CREATE TABLE vip_clinical.visits (
  visit_id UUID PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES vip_clinical.cases(case_id) ON DELETE RESTRICT,
  clinic_day_id TEXT NOT NULL REFERENCES public.clinic_days(clinic_day_id) ON DELETE RESTRICT,
  recorded_by UUID NOT NULL REFERENCES public.actors(actor_id) ON DELETE RESTRICT,
  recorded_at TIMESTAMPTZ NOT NULL,
  arrival_confirmed BOOLEAN NOT NULL CHECK (arrival_confirmed IS TRUE),
  arrival_condition TEXT NOT NULL CHECK (arrival_condition IN
    ('Normal','Moderately Unwell','Severely Unwell')),
  current_complaint TEXT NOT NULL CHECK (length(btrim(current_complaint)) > 0),
  visit_type TEXT NOT NULL CHECK (visit_type = 'Visit & Consultation'),
  type_confirmed_by UUID NOT NULL REFERENCES public.actors(actor_id) ON DELETE RESTRICT,
  encounter_status TEXT NOT NULL CHECK (encounter_status IN ('AWAITING_DOCTOR','WITH_DOCTOR','EXITED')),
  protection_state TEXT NOT NULL CHECK (protection_state IN ('OPEN','PROTECTED')),
  operation_id UUID NOT NULL,
  UNIQUE(recorded_by, operation_id)
);
CREATE INDEX visits_case_chronology ON vip_clinical.visits(case_id, recorded_at, visit_id);
CREATE INDEX visits_day_cases ON vip_clinical.visits(clinic_day_id, case_id);

-- Durable committed results only. Absence never proves a pending operation failed.
CREATE TABLE vip_clinical.operation_receipts (
  actor_id UUID NOT NULL REFERENCES public.actors(actor_id) ON DELETE RESTRICT,
  operation_id UUID NOT NULL,
  operation_kind TEXT NOT NULL CHECK (operation_kind IN
    ('CASE_CREATE','CASE_COMPLETE','CASE_REOPEN','VISIT_START')),
  schema_version INTEGER NOT NULL CHECK (schema_version = 1),
  meaning_fingerprint TEXT NOT NULL CHECK (meaning_fingerprint ~ '^[0-9a-f]{64}$'),
  case_id UUID NOT NULL REFERENCES vip_clinical.cases(case_id) ON DELETE RESTRICT,
  event_id UUID REFERENCES vip_clinical.lifecycle_facts(event_id) ON DELETE RESTRICT,
  visit_id UUID REFERENCES vip_clinical.visits(visit_id) ON DELETE RESTRICT,
  resulting_version INTEGER NOT NULL CHECK (resulting_version >= 0),
  committed_result JSONB NOT NULL CHECK (jsonb_typeof(committed_result) = 'object'),
  recorded_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY(actor_id, operation_id),
  CHECK ((operation_kind = 'CASE_CREATE' AND event_id IS NULL AND visit_id IS NULL)
    OR (operation_kind IN ('CASE_COMPLETE','CASE_REOPEN') AND event_id IS NOT NULL AND visit_id IS NULL)
    OR (operation_kind = 'VISIT_START' AND event_id IS NULL AND visit_id IS NOT NULL))
);

-- Bounded seal/receipt protection, not a generic event-sourcing framework.
CREATE FUNCTION vip_clinical.reject_historical_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Immutable clinical fact or receipt' USING ERRCODE = '55000';
END;
$$;
CREATE TRIGGER lifecycle_facts_immutable BEFORE UPDATE OR DELETE OR TRUNCATE
  ON vip_clinical.lifecycle_facts FOR EACH STATEMENT
  EXECUTE FUNCTION vip_clinical.reject_historical_mutation();
CREATE TRIGGER operation_receipts_immutable BEFORE UPDATE OR DELETE OR TRUNCATE
  ON vip_clinical.operation_receipts FOR EACH STATEMENT
  EXECUTE FUNCTION vip_clinical.reject_historical_mutation();
REVOKE ALL ON ALL TABLES IN SCHEMA vip_clinical FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA vip_clinical FROM PUBLIC;
COMMIT;
