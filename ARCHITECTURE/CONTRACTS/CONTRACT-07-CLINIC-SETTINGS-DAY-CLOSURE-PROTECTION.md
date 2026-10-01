# CONTRACT-07 — Clinic Settings, Day Closure & Data Protection

## 1. Purpose

This contract defines the approved product behavior for:

- Clinic Settings and Options under the Doctor / Main Admin
- Clinic Day end-of-day preservation
- Doctor review and explicit Clinic Day closure
- Higher protection following Clinic Day closure
- Different levels of control for editing clinical information

This contract defines behavioral and authority boundaries only.

It does not define technical protection or editing mechanisms.

## 2. Authority

The Doctor is the Main Admin and owns authority over Clinic Settings and Options.

The Doctor remains the Clinical Authority for clinical information.

Operational delegation to a Nurse does not transfer System Ownership or Clinical Authority.

## 3. Settings and Options

Settings and Options are under the authority of the Doctor / Main Admin.

The exact complete list of Settings and Options is not defined by this contract.

Future Settings must remain consistent with the Doctor's Main Admin authority and the product's approved scope.

## 4. Clinic Day End

When the Clinic Day's work ends:

1. The daily data must be preserved.
2. The Doctor reviews the daily data.
3. The Doctor explicitly closes the Clinic Day.
4. Higher protection follows according to the selected protection mode.

The end of the calendar day does not by itself close the Clinic Day.

This preserves the explicit-closure rule established by CONTRACT-02.

## 5. Protection Modes

The approved product-level protection choices are:

- IMMEDIATE
- 3 DAYS

### IMMEDIATE

After the Doctor reviews and explicitly closes the Clinic Day, higher protection applies immediately.

### 3 DAYS

Daily data remains preserved while the Doctor has the defined three-day period for review and permitted correction before higher protection applies.

The product-level meaning of the two modes is defined here.

The technical mechanism that provides higher protection is intentionally not defined by this contract.

## 6. Preservation vs Higher Protection

Data preservation and higher protection are distinct concepts.

Preservation means that the day's recorded information remains retained.

Higher protection means that the product applies a stronger level of control to subsequent modification according to the selected protection mode.

This contract does not prescribe how that control is technically implemented.

## 7. Open Cases

Closing a Clinic Day does not automatically complete an open Case.

An open Case remains preserved according to the existing Case and Visit contracts.

Case completion remains governed by the Doctor's clinical completion decision established by the closed contracts.

## 8. Clinical Diagnosis Editing

Initial and final diagnosis information may require correction or modification when the Doctor determines that such modification is clinically necessary.

Such modification requires an explicit command from the Doctor.

The Doctor remains the authority for such modification.

This contract does not define the technical editing mechanism.

## 9. Treatment Editing

Treatment information has a stronger editing-control requirement than ordinary clinical information.

A treatment modification requires a stronger explicit command from the Doctor.

The Nurse does not gain clinical authority to authorize such modification through operational delegation.

The technical mechanism for the stronger control is not defined by this contract.

## 10. Investigation Editing

Investigation information has a stronger editing-control requirement than ordinary clinical information.

An investigation modification requires a stronger explicit command from the Doctor.

The Nurse does not gain clinical authority to authorize such modification through operational delegation.

The technical mechanism for the stronger control is not defined by this contract.

## 11. Data Importance and Edit Control

The product distinguishes:

- the importance of preserving information; and
- the authority and level of control required to modify information.

A higher protection level does not redefine who owns the clinical decision.

The Doctor remains the Clinical Authority.

## 12. Nurse Boundary

The Nurse remains an Operational Workflow Participant.

The Nurse may perform delegated operational workflow according to the approved operating mode.

Delegation does not authorize the Nurse to:

- make clinical decisions;
- authorize clinical diagnosis modification;
- authorize treatment modification;
- authorize investigation modification;
- change Clinic Settings owned by the Doctor / Main Admin.

## 13. Doctor-Only Operation

The Clinic remains valid when operated entirely by the Doctor without a Nurse.

All authority defined by this contract remains with the Doctor.

## 14. Relationship to Closed Contracts

This contract does not redefine:

- Patient identity
- Patient / Case / Visit relationship
- Clinic Day core identity and lifecycle
- Doctor / Nurse authority
- Clinical History
- Visit workflow
- Clinical Decision and Treatment scope

Those remain governed by CONTRACT-01 through CONTRACT-06.

## 15. Explicit Non-Definition

This contract does not define:

- Database schema
- SQL implementation
- API routes
- API contracts
- UI contracts
- JWT implementation
- Authentication implementation
- Authorization implementation
- Technical permission matrices
- Technical locking mechanisms
- Audit implementation
- Encryption implementation
- Database triggers
- Background jobs
- Deployment mechanisms
- Exact complete Settings list
- Exact workflow state machine
- Exact technical implementation of the three-day protection period
- Exact technical implementation of stronger clinical editing control

## 16. Explicit Out-of-Scope Boundaries

The following remain outside the product:

- AI diagnosis
- AI clinical decision support
- LIMS
- Laboratory information system
- Pharmacy system
- Hospital system
- Billing or accounting
- Multi-clinic operation
- Multi-branch operation
- Multi-tenant operation

## 17. Acceptance Target

CONTRACT-07 is acceptable only when:

1. Clinic Day data is preserved at the end of the working day.
2. The Doctor reviews the daily data.
3. The Doctor explicitly closes the Clinic Day.
4. Protection can follow the approved IMMEDIATE or 3 DAYS product behavior.
5. Open Cases remain preserved after Clinic Day closure.
6. Diagnosis modification requires an explicit Doctor command.
7. Treatment modification requires a stronger explicit Doctor command.
8. Investigation modification requires a stronger explicit Doctor command.
9. Data importance and edit-control level remain distinct concepts.
10. Nurse delegation does not transfer Clinical Authority or Main Admin ownership.
11. No technical mechanism is invented by this contract.

---

IMPLEMENTATION_AUTHORIZED=NO
SCHEMA_AUTHORIZED=NO
API_AUTHORIZED=NO
UI_AUTHORIZED=NO
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED=NO
