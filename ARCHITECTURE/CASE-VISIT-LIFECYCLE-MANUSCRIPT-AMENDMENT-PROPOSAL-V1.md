# Case / Visit lifecycle — exact Manuscript amendment proposal V1

STATUS = PROPOSED / REQUIRES SEPARATE MOHAMED.K_ROBY AUTHORIZATION
MANUSCRIPT_MODIFIED = NO
BASE = b72192aed65f810b794f6d69b8e49c18622a3945

## Why a higher-authority change is required

Manuscript §13 declares the five states to be Case states and their conceptual transitions defined. C08 §§9–10 and W01 §§2–4/8 reinforce that model. Administrative reopening before arrival cannot truthfully assign Arrived, Awaiting Doctor, With Doctor or Exited — Follow-up Pending. Retaining Completed as its current state would conceal the restored open clinical course. A sixth queue state would be an unapproved shortcut. The proposal separates two dimensions instead of selecting an inaccurate destination. No clinical mutation is implemented while this authority conflict remains.

## Exact proposed edits — NOT applied

Target: ARCHITECTURE/MANUSCRIPT/DR-ROBY-CLINIC-PRODUCT-MANUSCRIPT.md.

### §5 — replace the paragraph beginning “Each patient arrival” with

Each recorded Visit preserves the patient's arrival as part of that encounter. Physical arrival alone does not create a Visit. After physical arrival, the Doctor or an appropriately delegated Nurse deliberately begins recording the Visit. Registration, lookup, opening an unsaved form, creating a Case and administrative Case reopening do not create a Visit. A Visit belongs to one Case and one applicable Clinic Day; the same Case may contain multiple Visits across multiple Clinic Days.

### §13 — replace the section from its heading to immediately before §14 with

## 13. CASE LIFECYCLE AND ENCOUNTER WORKFLOW VISION

The Case represents one complaint or clinical problem's longitudinal clinical course. Its lifecycle is open or completed. The Doctor alone decides continuation, completion and explicit reopening. Patient identity and CPN remain stable; multiple Cases may belong to one Patient.

A Case can remain open without a current Visit or arrival. It may continue for the same complaint across Clinic Days without an elapsed-time cutoff. Visit Exit and Clinic Day closure do not complete it. Completion is an explicit Doctor clinical decision.

Completed is closed by default. For the same clinical complaint, an authenticated authorized Doctor may explicitly reopen it within 90 calendar days of the actual completion-event local date in Africa/Cairo. Closure date is Day0, Day90 is inclusive through that local date, Day91 is outside. The Doctor may instead choose a new Case. A different complaint requires a new Case. Administrative reopening may occur before arrival and creates no Visit, arrival fact, Clinic Day encounter or Visit-count increment.

Every completion and reopening preserves independently identifiable Case, Doctor, event type, actual timestamp, clinic calendar date and applicable completion episode. Reopening never erases a prior completion seal. Repeated cycles remain independently reconstructable.

The familiar five labels remain part of the clinic's historical workflow and interface identity: Arrived — Awaiting Registration; Awaiting Doctor; With Doctor; Exited — Follow-up Pending; Completed. They must not be used to fabricate operational facts. Arrival, registration, Doctor encounter and Exit describe recorded encounter progression; Completed communicates Case completion. When no current encounter exists, show the truthful Case lifecycle separately and do not invent an encounter status. Later contracts must explicitly reconcile legacy state ownership and displays with this distinction, rather than adding a sixth workflow state.

Past History remains distinct from Clinical History, which derives from preserved Visits. Earlier Visits, diagnoses, authorized prescriptions and closed Clinic Days remain preserved. Doctor authority, optional operational Nurse delegation and Doctor-only operation remain mandatory.

Exact transition guards, physical representation, recording minimum fields, concurrency, idempotency, permissions and implementation structures require their applicable contracts and bounded engineering authority. This Manuscript change alone authorizes no implementation, migration, deployment or clinical release.

## Scope preserved

No other Manuscript section is proposed for modification. §17's historical status and §18's historical contract checkpoint remain preserved as chronology; additive reconciliation records would explicitly explain the later amendment rather than rewriting old CLOSED/PROVEN evidence. If owner review requires additional changes, return a revised exact proposal first.
