# VIP CLINIC DAY — CONTROLLED PERSISTENCE EXECUTION V1

## 1. PURPOSE

This artifact defines the controlled execution procedure for materializing
the already authorized Clinic Day physical persistence target.

The execution is derived from:

- VIP-CLINIC-DAY-REAL-DB-DEFINITION-V1
- VIP-CLINIC-DAY-STRUCTURAL-CONTRACT-V1
- VIP-CLINIC-DAY-BOUNDED-AUTHORITY-V1
- VIP-CLINIC-DAY-LIVE-DATABASE-RECONCILIATION-V1
- VIP-CLINIC-DAY-IMPLEMENTATION-DECISION-V1

This artifact defines execution mechanics only.

It does not expand architectural authority.

## 2. EXECUTION TARGET

DATABASE = vip_clinic
SCHEMA = public
TABLE = clinic_days

TARGET_OBJECT = public.clinic_days

AUTHORIZED_OPERATION = CONTROLLED_TARGET_MATERIALIZATION

## 3. CURRENT AUTHORITY STATE

IMPLEMENTATION_DECISION = CLOSED
CLINIC_DAY_IMPLEMENTATION_ELIGIBILITY = CONDITIONALLY_APPROVED
DATABASE_IMPLEMENTATION_AUTHORIZATION = CONDITIONAL

PRODUCTION_AUTHORIZATION = NONE
FIRST_REAL_USE_AUTHORIZATION = NONE
REAL_PILOT_AUTHORIZATION = NONE

## 4. LIVE PRECONDITION STATUS

LIVE_DATABASE = VERIFIED
LIVE_SCHEMA = public
LIVE_CLINIC_DAY = ABSENT
PATIENT_FOUNDATION = PRESENT
PATIENT_SEQUENCE = PRESENT
PATIENT_ROW_MUTATION = NOT_PERFORMED

LIVE_PRECONDITION_RECHECK = PASS

## 5. DATA PRESERVATION PRINCIPLE

The primary product objective is preservation of data within the system.

The controlled execution must preserve:

- public.patients
- public.clinic_patient_number_seq
- existing Patient data
- existing Patient registration semantics
- all unrelated database objects

No Patient mutation is authorized by this execution.

PATIENT_FOUNDATION_PROTECTION = MANDATORY

DATA_PRESERVATION = MANDATORY

## 6. EXECUTION BOUNDARY

The execution boundary is strictly limited to:

DATABASE = vip_clinic
SCHEMA = public
TABLE = clinic_days

No other table may be created, altered, dropped, replaced, repaired,
reset, migrated, or reconstructed by this execution.

AUTHORITY_EXPANSION = FORBIDDEN

## 7. STRUCTURAL MATERIALIZATION CONTRACT

The target table must materialize exactly according to the established
structural contract.

Required columns:

- clinic_day_id TEXT PRIMARY KEY
- working_date DATE NOT NULL UNIQUE
- status TEXT NOT NULL
- lifecycle TEXT NOT NULL
- counter INT NOT NULL DEFAULT 0
- opened_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
- closed_at TIMESTAMPTZ
- closed_by TEXT

Required status constraint:

status IN ('OPEN', 'CLOSED')

Required lifecycle constraint:

lifecycle IN ('WORKING', 'CONCLUDED')

Required closed_by constraint:

closed_by IS NULL OR closed_by = 'Doctor'

No additional foreign key is authorized.

No Case relationship is authorized.

No Visit relationship is authorized.

No Prescription relationship is authorized.

No Follow-up relationship is authorized.

## 8. ABSENCE REQUIREMENT

Creation is authorized only because the latest live reconciliation
verified that public.clinic_days is absent.

The execution must independently verify absence immediately before
materialization.

ABSENCE_REQUIRED_FOR_CREATION = YES

Blind IF-NOT-EXISTS execution is insufficient.

If the target is found before execution, execution must stop.

## 9. UNEXPECTED TARGET STATE

If public.clinic_days exists unexpectedly:

EXECUTION = STOP

No ALTER is permitted.

No DROP is permitted.

No REPLACE is permitted.

No RESET is permitted.

No RECONSTRUCTION is permitted.

No silent repair is permitted.

STRUCTURAL_MISMATCH_REPAIR = FORBIDDEN

## 10. TRANSACTION BOUNDARY

The physical materialization must execute inside one controlled transaction.

Required conceptual sequence:

BEGIN
    verify live preconditions
    verify target absence
    create target table
    verify target structure
    verify protected Patient foundation
COMMIT

If any required verification fails:

ROLLBACK

The transaction must not commit a partially verified structure.

## 11. PROTECTED OBJECTS

The following objects are read-only protected during execution:

public.patients
public.clinic_patient_number_seq

No INSERT is authorized against public.patients.

No UPDATE is authorized against public.patients.

No DELETE is authorized against public.patients.

No ALTER is authorized against public.patients.

No DROP is authorized against public.patients.

No sequence reset is authorized.

## 12. NO TEST DATA REQUIREMENT

This execution does not require creation of real Patient records.

No synthetic Patient record is required.

No synthetic Clinic Day record is required for physical structural
materialization.

Behavioral persistence has already been covered by controlled tests.

TEST_DATA_INSERTION = NOT_REQUIRED

PATIENT_TEST_DATA = NOT_REQUIRED

CLINIC_DAY_TEST_DATA = NOT_REQUIRED_FOR_STRUCTURAL_MATERIALIZATION

The live database must remain free of unnecessary test records.

## 13. MOCK AND TEST AUTHORITY

Mock or isolated test infrastructure may be used for behavioral proof
where appropriate.

Mock execution must not be represented as live database proof.

Live structural proof must come from the actual vip_clinic database.

MOCK_BEHAVIORAL_PROOF = ALLOWED

MOCK_LIVE_DATABASE_PROOF = FORBIDDEN

LIVE_STRUCTURAL_PROOF = REQUIRED

## 14. EXECUTION SAFETY

The following are mandatory:

STOP_ON_UNEXPECTED_STATE = YES
STOP_ON_CONTRACT_MISMATCH = YES
STOP_ON_PATIENT_DISCREPANCY = YES
STOP_ON_UNEXPECTED_DEPENDENCY = YES
STOP_ON_VERIFICATION_FAILURE = YES
ROLLBACK_ON_FAILURE = YES
SILENT_REPAIR = FORBIDDEN
ASSUMPTION_BASED_EXECUTION = FORBIDDEN

## 15. POST-MATERIALIZATION STRUCTURAL PROOF

After controlled materialization, the following must be verified:

- public.clinic_days exists
- all required columns exist
- required data types match
- required nullability matches
- primary key exists
- working_date unique constraint exists
- status constraint exists
- lifecycle constraint exists
- closed_by constraint exists
- counter default exists
- opened_at default exists
- no unauthorized foreign key exists
- Patient foundation remains unchanged

STRUCTURAL_PROOF = REQUIRED

## 16. BEHAVIORAL PROOF

Physical existence alone does not establish persistence closure.

After structural materialization, repository behavior must be proven
against the real authorized persistence boundary.

Required behaviors:

- Clinic Day creation persists
- persisted Clinic Day can be retrieved
- counter increment persists
- Doctor closure persists
- invalid authority remains rejected
- duplicate working date remains rejected
- persistence failure can rollback

BEHAVIORAL_PROOF = REQUIRED

## 17. ROLLBACK PROOF

Rollback must be demonstrated without corrupting Patient foundation.

Rollback proof must establish:

- failed Clinic Day transaction leaves no partial Clinic Day row
- Patient foundation remains intact
- Patient sequence remains intact
- unrelated objects remain unchanged

ROLLBACK_PROOF = REQUIRED

## 18. DATA RETENTION PROOF

The execution must establish that the materialized Clinic Day structure
does not replace or weaken existing data ownership.

Required result:

PATIENT_DATA_PRESERVED = YES
PATIENT_SCHEMA_PRESERVED = YES
PATIENT_SEQUENCE_PRESERVED = YES
UNRELATED_DATA_PRESERVED = YES

## 19. UNAUTHORIZED SURFACE CONTROL

This execution does not authorize:

- Case persistence
- Visit persistence
- Prescription persistence
- Follow-up persistence
- Patient schema redesign
- authentication
- authorization expansion
- API expansion
- UI expansion
- deployment
- production release
- real clinical use
- pilot operation

UNAUTHORIZED_SURFACE = BLOCKED

## 20. EXECUTION INVALIDATION

Execution authority immediately terminates if:

- target exists unexpectedly
- target structure differs unexpectedly
- Patient foundation differs unexpectedly
- unexpected data is discovered
- unexpected dependency is discovered
- structural contract cannot be verified
- rollback cannot be demonstrated
- protected objects require mutation
- destructive SQL becomes necessary
- implementation requires scope expansion

EXECUTION_VALIDITY = CONDITIONAL

## 21. PROOF ORDER

Proof must follow this order:

1. Live precondition recheck
2. Target absence verification
3. Controlled transaction start
4. Target materialization
5. Structural verification
6. Protected-object verification
7. Commit
8. Post-commit structural proof
9. Behavioral persistence proof
10. Rollback proof
11. Data-preservation proof
12. Final reconciliation

No later proof may be used to justify an earlier unauthorized mutation.

## 22. PRODUCTION SEPARATION

Successful development/live database materialization does not authorize
production deployment.

PRODUCTION_AUTHORIZATION = NONE

FIRST_REAL_USE_AUTHORIZATION = NONE

REAL_PILOT_AUTHORIZATION = NONE

## 23. FINAL EXECUTION DECISION

The controlled Clinic Day physical materialization is permitted only
within the exact bounded scope established by the Implementation Decision.

The execution must be:

- non-destructive
- transactional
- absence-aware
- structurally verified
- data-preserving
- rollback-capable
- independently proven

The execution must not become a generic database migration.

## 24. EXECUTION STATUS

CONTROLLED_PERSISTENCE_EXECUTION = AUTHORIZED_CONDITIONALLY

SQL_MUTATION = NOT_PERFORMED_BY_THIS_ARTIFACT

MATERIALIZATION = NOT_PERFORMED_BY_THIS_ARTIFACT

BEHAVIORAL_PROOF = PENDING

ROLLBACK_PROOF = PENDING

DATA_PRESERVATION_PROOF = PENDING

PRODUCTION_AUTHORIZATION = NONE

FAIL = 0
