# VIP CLINIC DAY — IMPLEMENTATION DECISION V1

## 1. PURPOSE

This artifact defines the bounded implementation decision for the already
reconciled Clinic Day physical persistence target.

The decision is derived from:

- VIP-CLINIC-DAY-REAL-DB-DEFINITION-V1
- VIP-CLINIC-DAY-STRUCTURAL-CONTRACT-V1
- VIP-CLINIC-DAY-BOUNDED-AUTHORITY-V1
- VIP-CLINIC-DAY-LIVE-DATABASE-RECONCILIATION-V1

The implementation target is strictly bounded to:

DATABASE = vip_clinic
SCHEMA = public
TABLE = clinic_days

No other database, schema, table, domain, or deployment surface is included.

## 2. CURRENT LIVE PRECONDITION

LIVE_DATABASE = VERIFIED
TARGET_OBJECT = public.clinic_days
LIVE_CLINIC_DAY = ABSENT
PATIENT_FOUNDATION = PROTECTED

## 3. DECISION STATUS

IMPLEMENTATION_DECISION = IN_PROGRESS

SQL_IMPLEMENTATION = NOT_PERFORMED
MIGRATION = NOT_PERFORMED
REPAIR = NOT_PERFORMED
PRODUCTION_AUTHORIZATION = NONE

FAIL = 0


## 4. FACTORY PRODUCT CLOSURE PRINCIPLE

ViP Clinic is treated as a controlled data-preserving product.

The purpose of persistence implementation is not merely to make a physical
database object exist.

The purpose is to establish a controlled product boundary in which domain
data is stored by the system according to an explicit ownership model,
physical contract, integrity constraints, and verifiable persistence behavior.

Therefore:

PRODUCT_PERSISTENCE_GOAL = DATA_PRESERVATION_WITHIN_SYSTEM

VIBE_CODING_AUTHORITY = NONE

IMPLEMENTATION_MUST_FOLLOW_FACTORY_ARTIFACTS = YES

## 5. DATA OWNERSHIP PRINCIPLE

Clinic Day data is owned by the ViP Clinic persistence boundary.

The physical representation must remain bounded to:

DATABASE = vip_clinic
SCHEMA = public
TABLE = clinic_days

No implicit persistence target is permitted.

No fallback database is permitted.

No local-only persistence substitute is permitted for the bounded physical
Clinic Day implementation.

No unrelated database may become an alternate authority.

## 6. DATA INTEGRITY PRINCIPLE

The implementation must preserve the declared Clinic Day structural contract.

Required physical integrity includes:

- clinic_day_id as the primary key
- working_date as a unique business date
- valid status values
- valid lifecycle values
- counter persistence
- opened_at persistence
- nullable closed_at
- bounded closed_by ownership
- consistency with the declared domain representation

The implementation must not weaken or silently replace these constraints.

## 7. PATIENT DATA PROTECTION PRINCIPLE

The existing Patient foundation is outside the Clinic Day implementation mutation
scope.

The following must remain unchanged:

- public.patients
- public.clinic_patient_number_seq
- existing Patient data
- Patient registration semantics

Clinic Day materialization must not delete, reset, reconstruct, replace, or
implicitly alter the Patient foundation.

PATIENT_DATA_PROTECTION = REQUIRED

## 8. PRODUCT-LEVEL PROOF PRINCIPLE

A successful implementation shall not be considered complete merely because
public.clinic_days exists.

Product-level closure requires evidence that:

1. the physical structure matches the contract;
2. domain writes persist into the intended live database;
3. persisted values can be retrieved correctly;
4. lifecycle transitions remain bounded;
5. counter updates persist correctly;
6. rollback behavior is proven;
7. Patient data remains protected;
8. no unauthorized persistence surface is introduced.

Therefore:

PHYSICAL_EXISTENCE_ALONE = INSUFFICIENT

PERSISTENCE_BEHAVIOR_PROOF = REQUIRED

DATA_RETENTION_PROOF = REQUIRED

ROLLBACK_PROOF = REQUIRED

UNAUTHORIZED_SURFACE_PROOF = REQUIRED


## 9. FACTORY CONSTRUCTION METHOD

ViP Clinic implementation follows the factory construction method rather than
unbounded vibe coding.

The implementation sequence is evidence-driven and artifact-driven.

The system is constructed from established authority toward controlled runtime
behavior.

The implementation sequence for this bounded persistence case is:

PROVEN DOMAIN ARTIFACT
        ↓
REAL DB DEFINITION
        ↓
STRUCTURAL CONTRACT
        ↓
BOUNDED AUTHORITY
        ↓
LIVE DATABASE RECONCILIATION
        ↓
IMPLEMENTATION DECISION
        ↓
CONTROLLED PERSISTENCE MATERIALIZATION
        ↓
PERSISTENCE BEHAVIOR PROOF
        ↓
RUNTIME INTEGRATION
        ↓
FUNCTIONAL WORKFLOW PROOF

Each transition requires its preceding evidence to remain valid.

No implementation step may bypass an unresolved authority boundary.

No implementation step may replace missing evidence with assumption.

No implementation step may convert technical capability into architectural
authority.

## 10. ARTIFACT-FIRST CONSTRUCTION RULE

Architectural movement is measured by completed and proven artifacts.

Gates are checkpoints and evidence controls.

An artifact defines, proves, reconciles, or authorizes a bounded architectural
fact.

Therefore:

ARCHITECTURAL_PROGRESS_UNIT = ARTIFACT

GATE_ROLE = CHECKPOINT_AND_EVIDENCE_CONTROL

VIBE_CODING = EXECUTION_MECHANISM_ONLY

FACTORY_METHOD = AUTHORITATIVE_CONSTRUCTION_METHOD

## 11. DATA-FIRST PRODUCT RULE

The product is not considered structurally complete because code executes.

The product boundary advances only when the intended data ownership,
persistence behavior, integrity constraints, and recovery properties are
proven.

Therefore:

CODE_EXECUTION = INSUFFICIENT_FOR_PRODUCT_CLOSURE

DATA_PERSISTENCE = CORE_PRODUCT_REQUIREMENT

DATA_OWNERSHIP = EXPLICIT

DATA_INTEGRITY = REQUIRED

DATA_RECOVERY = REQUIRED

DATA_RETENTION = REQUIRED

## 12. HISTORICAL FACTORY ROADMAP ALIGNMENT

The historical Clinic architecture established the following product-building
direction:

ARCHITECTURE
    ↓
DOMAIN / CONTRACTS
    ↓
CANONICAL AUTHORITY SYNC
    ↓
PATIENT PERSISTENCE
    ↓
PATIENT REPOSITORY + BOUNDED SQL + PROOF
    ↓
API RUNTIME + REAL DB + FUNCTIONAL FLOW
    ↓
AUTHENTICATION + AUTHORIZATION + WORKFLOW
    ↓
LIVE UI + REAL API + E2E
    ↓
SAFETY
    ↓
FIRST REAL USE
    ↓
REAL PILOT

ViP Clinic preserves this engineering principle while adapting the sequence
to the actual evidence state of each domain.

The historical roadmap is therefore treated as a factory design precedent,
not as an instruction to bypass current evidence.

## 13. FACTORY CLOSURE STANDARD

The final objective is a product whose behavior and data persistence are
understood, bounded, proven, and recoverable.

A green test result alone does not establish factory closure.

Factory closure requires:

ARCHITECTURAL_AUTHORITY = PROVEN
DATA_OWNERSHIP = PROVEN
PERSISTENCE_BOUNDARY = PROVEN
RUNTIME_BEHAVIOR = PROVEN
DATA_RETENTION = PROVEN
ROLLBACK = PROVEN
SAFETY = PROVEN

FAIL = 0

## 14. EXACT IMPLEMENTATION SCOPE

The implementation decision is limited to materializing the already-defined
physical Clinic Day structure in the verified target database.

AUTHORIZED_TARGET_DATABASE = vip_clinic
AUTHORIZED_TARGET_SCHEMA = public
AUTHORIZED_TARGET_TABLE = clinic_days

AUTHORIZED_OPERATION = CREATE_TARGET_TABLE_IF_ABSENT

The authorized physical structure must match the established Structural
Contract exactly.

No alternative table name is permitted.

No alternative schema is permitted.

No alternative database is permitted.

No additional domain table may be created as part of this decision.

## 15. PRE-EXECUTION CONDITIONS

Controlled implementation may begin only if all conditions below remain true
at execution time:

1. DATABASE = vip_clinic
2. SCHEMA = public
3. TARGET_OBJECT = public.clinic_days
4. LIVE_CLINIC_DAY = ABSENT
5. public.patients = PRESENT
6. public.clinic_patient_number_seq = PRESENT
7. PATIENT_FOUNDATION_MUTATION = NOT_PERFORMED
8. STRUCTURAL_CONTRACT = PROVEN
9. BOUNDED_AUTHORITY = DEFINED
10. LIVE_RECONCILIATION = CLOSED
11. PRODUCTION_AUTHORIZATION = NONE
12. No unexpected dependency requires modification of an out-of-scope object.

If any pre-execution condition differs from the reconciled state, execution
must stop.

## 16. TRANSACTION BOUNDARY

The physical materialization must execute within a controlled database
transaction where supported by the selected SQL operation.

The transaction boundary must ensure that a failed implementation does not
leave a partially materialized Clinic Day structure.

Expected transaction behavior:

BEGIN
    controlled Clinic Day structural materialization
    structural verification
COMMIT

If structural verification fails:

ROLLBACK

No unrelated database object may be included in the transaction.

## 17. ROLLBACK REQUIREMENT

Rollback is a mandatory implementation property.

Rollback must demonstrate that an unsuccessful controlled implementation does
not leave an unintended Clinic Day physical state.

Rollback verification must remain bounded to:

DATABASE = vip_clinic
SCHEMA = public
TABLE = clinic_days

Rollback must not modify:

- public.patients
- public.clinic_patient_number_seq
- unrelated tables
- unrelated schemas
- unrelated databases

ROLLBACK_SCOPE = CLINIC_DAY_ONLY

## 18. POST-EXECUTION VERIFICATION

A successful implementation is not closed by CREATE success alone.

Post-execution verification must establish:

1. public.clinic_days exists;
2. the physical structure matches the Structural Contract;
3. required constraints are present;
4. Patient foundation remains unchanged;
5. no unauthorized target object was introduced;
6. the repository can persist a bounded Clinic Day record;
7. the persisted record can be retrieved;
8. rollback behavior remains proven.

POST_EXECUTION_VERIFICATION = REQUIRED

PHYSICAL_SCHEMA_VERIFICATION = REQUIRED

BEHAVIORAL_PERSISTENCE_VERIFICATION = REQUIRED

PATIENT_NON_INTERFERENCE_VERIFICATION = REQUIRED

## 19. STOP CONDITIONS

Execution must stop immediately if any of the following is observed:

- target database mismatch;
- target schema mismatch;
- target object already exists with unexpected structure;
- Patient foundation differs unexpectedly;
- unexpected existing data is discovered;
- unexpected dependency is discovered;
- required constraint cannot be established without weakening the contract;
- implementation requires modification outside the bounded authority;
- destructive SQL is required;
- migration behavior is required;
- generic schema tooling is required;
- rollback cannot be demonstrated;
- post-execution verification cannot establish contract alignment.

STOP_ON_UNEXPECTED_STATE = REQUIRED

SILENT_REPAIR = FORBIDDEN

ASSUMPTION_BASED_EXECUTION = FORBIDDEN

## 20. DECISION BOUNDARY

This artifact defines the conditions under which a bounded implementation action
may be considered.

It does not itself execute SQL.

It does not create public.clinic_days.

It does not authorize production deployment.

It does not authorize Case, Visit, Prescription, Follow-up, API, UI,
authentication, authorization, migration, ORM, or generic persistence work.

IMPLEMENTATION_EXECUTION = NOT_PERFORMED

PRODUCTION_AUTHORIZATION = NONE


## 21. ABSENCE-ONLY MATERIALIZATION RULE

The implementation scope permits materialization only when the target physical
object has been independently verified as absent immediately before execution.

The phrase:

AUTHORIZED_OPERATION = CREATE_TARGET_TABLE_IF_ABSENT

does not authorize blind use of a permissive existence operator as a substitute
for structural verification.

The implementation must distinguish between:

CASE_A = TARGET_OBJECT_ABSENT
CASE_B = TARGET_OBJECT_PRESENT_AND_CONTRACT_ALIGNED
CASE_C = TARGET_OBJECT_PRESENT_AND_CONTRACT_MISMATCHED

Required handling:

CASE_A:
Controlled materialization may proceed if all other pre-execution conditions
remain satisfied.

CASE_B:
Creation must not be attempted. Existing aligned structure must be reconciled
and implementation must stop without unnecessary mutation.

CASE_C:
Execution must stop immediately.

No ALTER, DROP, REPLACE, RESET, RECONSTRUCT, or destructive repair is authorized
to resolve CASE_C.

Therefore:

ABSENCE_REQUIRED_FOR_CREATION = YES

BLIND_IF_NOT_EXISTS_SEMANTICS = INSUFFICIENT

STRUCTURAL_MISMATCH_REPAIR = FORBIDDEN

SILENT_REPLACEMENT = FORBIDDEN

## 22. DATA-PRESERVATION-FIRST EXECUTION RULE

The implementation is subordinate to preservation of existing system data.

Before any mutation:

TARGET_OBJECT_STATE = VERIFIED

PATIENT_FOUNDATION_STATE = VERIFIED

UNEXPECTED_DATA = ABSENT

UNEXPECTED_DEPENDENCY = ABSENT

If the observed state differs from the established reconciliation, execution
must stop before mutation.

No implementation convenience may override the data-preservation boundary.

DATA_PRESERVATION_PRIORITY = ABSOLUTE

## 23. IMPLEMENTATION DECISION NON-EXPANSION

Approval of the bounded Clinic Day physical materialization does not expand
authority to any other persistence domain.

Specifically, this decision does not authorize:

- Case persistence
- Visit persistence
- Prescription persistence
- Follow-up persistence
- Patient schema mutation
- Patient data migration
- Generic migration framework
- ORM adoption
- Generic repository generation
- API changes
- UI changes
- authentication changes
- authorization changes
- deployment changes

CLINIC_DAY_SCOPE = BOUNDED

AUTHORITY_EXPANSION = FORBIDDEN


## 24. IMPLEMENTATION DECISION OUTCOME

Based on the established architecture, domain contract, bounded authority,
and current live database reconciliation, a bounded Clinic Day physical
materialization is technically eligible for controlled execution.

This eligibility is conditional.

It applies only to the verified target:

DATABASE = vip_clinic
SCHEMA = public
TABLE = clinic_days

The decision does not authorize blind execution.

The decision does not authorize execution if the live preconditions change.

The decision does not authorize repair of an unexpected structure.

The decision does not authorize any operation outside the bounded Clinic Day
physical persistence scope.

Therefore:

CLINIC_DAY_IMPLEMENTATION_ELIGIBILITY = CONDITIONALLY_APPROVED

IMPLEMENTATION_SCOPE = vip_clinic.public.clinic_days

IMPLEMENTATION_MODE = CONTROLLED_NON_DESTRUCTIVE

DATA_PRESERVATION = MANDATORY

PATIENT_FOUNDATION_PROTECTION = MANDATORY

STRUCTURAL_CONTRACT_COMPLIANCE = MANDATORY

LIVE_PRECONDITION_RECHECK = MANDATORY

POST_EXECUTION_PROOF = MANDATORY

ROLLBACK_PROOF = MANDATORY

## 25. AUTHORIZATION SEPARATION

This decision distinguishes implementation authorization from production
authorization.

The decision may authorize a controlled implementation action against the
verified ViP Clinic development/live database boundary.

It does not authorize production deployment or first real clinical use.

Therefore:

DATABASE_IMPLEMENTATION_AUTHORIZATION = CONDITIONAL

PRODUCTION_AUTHORIZATION = NONE

FIRST_REAL_USE_AUTHORIZATION = NONE

REAL_PILOT_AUTHORIZATION = NONE

## 26. DECISION LIMIT

The conditional approval terminates immediately if the actual database state
differs from the established live reconciliation.

The following conditions invalidate the decision:

- public.clinic_days already exists unexpectedly;
- public.clinic_days exists with contract mismatch;
- Patient foundation differs unexpectedly;
- unexpected data is discovered;
- unexpected dependency is discovered;
- destructive change becomes necessary;
- rollback cannot be established;
- contract compliance cannot be verified;
- an out-of-scope object must be modified.

DECISION_VALIDITY = CONDITIONAL_ON_RECONCILED_STATE

DECISION_EXPIRY_ON_STATE_CHANGE = YES

## 27. FINAL DECISION STATEMENT

The factory authorizes a narrowly bounded, non-destructive Clinic Day
materialization action only when the verified live preconditions remain true.

The factory does not authorize a generic schema migration.

The factory does not authorize blind database mutation.

The factory does not authorize production release.

The factory does not authorize real clinical use.

The next permitted engineering action is a controlled implementation execution
followed by structural, behavioral, rollback, and data-preservation proof.

IMPLEMENTATION_DECISION = CLOSED

CLINIC_DAY_IMPLEMENTATION_ELIGIBILITY = CONDITIONALLY_APPROVED

IMPLEMENTATION_EXECUTION = NOT_PERFORMED

PRODUCTION_AUTHORIZATION = NONE

FAIL = 0

