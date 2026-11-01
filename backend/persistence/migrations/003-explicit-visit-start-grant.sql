-- CJ-01: forward-only capability vocabulary extension; no existing grant update.
-- Apply only to a verified disposable acceptance database under owner authority.
-- Historical auth-schema.sql and migrations are preserved.
BEGIN;
ALTER TABLE vip_auth.delegations
  DROP CONSTRAINT delegations_capabilities_check;
ALTER TABLE vip_auth.delegations
  ADD CONSTRAINT delegations_capabilities_check CHECK
  (capabilities <@ ARRAY['ARRIVAL','PATIENT_DATA_RECORDING','EXIT',
    'DOCTOR_NOTIFICATION','VISIT_START']::TEXT[]);
COMMIT;
-- No down migration: never delete grants to restore the older vocabulary.
-- Application startup must not apply this file automatically.
