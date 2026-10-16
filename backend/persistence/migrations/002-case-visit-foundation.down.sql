-- Only for an empty, positively identified disposable development target.
-- Once any clinical row exists, preserve schema/data and roll back application wiring.
BEGIN;
LOCK TABLE vip_clinical.cases, vip_clinical.visits,
  vip_clinical.lifecycle_facts, vip_clinical.operation_receipts IN ACCESS EXCLUSIVE MODE;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM vip_clinical.cases)
    OR EXISTS (SELECT 1 FROM vip_clinical.visits)
    OR EXISTS (SELECT 1 FROM vip_clinical.lifecycle_facts)
    OR EXISTS (SELECT 1 FROM vip_clinical.operation_receipts) THEN
    RAISE EXCEPTION 'Refusing to remove nonempty clinical foundation';
  END IF;
END;
$$;
ALTER TABLE vip_clinical.cases DROP CONSTRAINT case_latest_fact;
DROP TABLE vip_clinical.operation_receipts;
DROP TABLE vip_clinical.visits;
DROP TABLE vip_clinical.lifecycle_facts;
DROP TABLE vip_clinical.cases;
DROP FUNCTION vip_clinical.reject_historical_mutation();
DROP SCHEMA vip_clinical;
COMMIT;
