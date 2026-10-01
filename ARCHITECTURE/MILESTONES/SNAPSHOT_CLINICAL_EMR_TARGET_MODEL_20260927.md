# Dr.Roby Clinic — Clinical EMR Target Model Snapshot

SNAPSHOT_STATUS = RECORDED
SNAPSHOT_TYPE = PRODUCT_TARGET / CLINICAL_OPERATING_MODEL
DATE = 2026-09-27

PURPOSE:
Record the closest current representation of the real Dr. Roby Clinic
clinical operating model and the expected long-term product destination.

SOURCE:
- Real clinic operating understanding provided by the system owner.
- Public Dr_Roby_Clinic repository and current regression evidence.
- External reconstruction/visualization produced from that evidence.
- Human correction and reconciliation by the system owner.
- Six-page Clinical EMR target representation reviewed page-by-page.

TARGET_CLINICAL_SPINE:
Patient -> Case / Episode -> Encounter -> Day Census

TARGET_PRODUCT:
Longitudinal Clinical EMR & Practice System

CLINICAL_SCOPE:
1. Clinical Encounters & Day Census
2. Cumulative Patient Record (EMR)
3. Patient Intake & CPN Allocation
4. Physical Exam & Clinical Encounter
5. Pharmacotherapy & Rx Regimen
6. Clinical Integrity Audit & DB

AUTHORITY_MODEL:
ATTENDING_MD = FULL_CLINICAL_AUTHORITY
ATTENDING_MD = MEDICAL_DIRECTORSHIP
STAFF_NURSE = CLINICAL_NURSING_TRIAGE / OPERATIONAL_PARTICIPANT
NURSE_CLINICAL_DECISION_AUTHORITY = NO

LONGITUDINAL_RECORD:
PATIENT_IDENTITY = STABLE
CPN = PERMANENT_CLINIC_CHART_IDENTITY
CASE_OR_EPISODE = CLINICAL_CONTEXT
ENCOUNTER = INDIVIDUAL_CLINICAL_EVENT
CLINICAL_HISTORY = LONGITUDINAL_RECORD_DERIVED_FROM_ENCOUNTERS

ENCOUNTER_TARGET:
- Chief Complaint / HPI
- Vital Signs
- Objective Physical Examination
- Clinical Procedures / Interventions
- Definitive Clinical Diagnosis / Impression
- Attending MD Clinical Decision
- Encounter Authorization / Signature

PHARMACOTHERAPY_TARGET:
- Prescribed Medication
- Dose
- Frequency
- Duration
- Administration / Patient Instructions
- Clinical Counseling
- Attending MD Authorization / Signature
- Certified Prescription Output

CLINICAL_DAY_TARGET:
- Daily Encounter Census
- Active Encounters
- Triage Queue
- In-Exam State
- Follow-up / Resolution State
- Day Seal / Close under MD Authority

INTEGRITY_TARGET:
- Bounded Transactions
- PostgreSQL Persistence
- CPN Allocation
- Longitudinal Record Integrity
- Regression Evidence
- 0 FAIL

CURRENT_ENGINEERING_EVIDENCE_AT_SNAPSHOT:
PATIENT_REGISTRATION = PROVEN
PATIENT_RETRIEVAL = PROVEN
PATIENT_REPOSITORY = PROVEN
REAL_SQL_PATIENT_INCREMENT = PROVEN
REGRESSION = 9/9 PASS
FAIL = 0

IMPORTANT_BOUNDARY:
This snapshot records the expected clinical/product destination.
It does NOT authorize implementation of any unimplemented domain,
persistence, API, UI, authentication, authorization, workflow,
pharmacotherapy, encounter, case, clinic-day, or history capability.

IMPLEMENTATION_AUTHORIZATION:
NOT_GRANTED_BY_THIS_SNAPSHOT

CANONICAL_AUTHORITY:
Architecture, contracts, authorization decisions, and implementation
proof remain authoritative for build sequencing and scope.

HISTORICAL_MEANING:
This snapshot preserves the closest current representation of the
real clinic's operating model as understood on 2026-09-27 and may be
used as a future reconciliation waypoint when extending the system.

ENGINEERING_PRINCIPLE:
REALITY -> ARCHITECTURE -> EVIDENCE -> BUILD -> PROVE

SNAPSHOT_IS_HISTORICAL_EVIDENCE = YES
SNAPSHOT_AUTHORIZES_NEW_IMPLEMENTATION = NO
PRODUCT_SCOPE_EXPANSION = NO
CONTRACT_MUTATION = NO
AUTHORITY_TRANSFER = NO
FAIL = 0
