# DR. ROBY CLINIC — AUTHORIZATION TECHNICAL CONTRACT V1

DOCUMENT = AUTHORIZATION TECHNICAL CONTRACT
VERSION = V1
PHASE = TECHNICAL CONTRACT DEFINITION
STATUS = CLOSED + PROVEN

AUTHORIZATION_CONTRACT_AUTHORITY = APPLICATION CAPABILITY CONTRACT V1 + PERSISTENCE TECHNICAL CONTRACT V1
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO
AUTHENTICATION_IMPLEMENTATION_AUTHORIZED = NO
DATABASE_SCHEMA_IMPLEMENTATION_AUTHORIZED = NO
API_IMPLEMENTATION_AUTHORIZED = NO
UI_IMPLEMENTATION_AUTHORIZED = NO

## 1. PURPOSE

This contract defines the technical authorization boundary for the approved
Doctor and Nurse authority model.

This contract defines authority and delegation boundaries only.

It does not authorize authentication, session, token, database, API, UI, or
other implementation.

## 2. DOCTOR AUTHORITY

The Doctor is:

- Main Admin;
- Clinical Authority;
- System Owner.

The Doctor retains authority over:

- clinical decisions;
- diagnosis;
- investigation decisions;
- treatment decisions;
- clinical information modification requiring Doctor authority;
- Case Completion;
- Clinic Day Closure;
- clinic operating mode;
- operational delegation.

The Doctor may personally perform operational workflow.

## 3. NURSE AUTHORITY

The Nurse is an Operational Workflow Participant.

The Nurse may execute operational workflow only through Doctor-authorized
delegation within the approved operational authorization boundary.

Nurse delegation does not transfer:

- Clinical Authority;
- Main Admin authority;
- System Ownership;
- Case Completion authority;
- clinical decision authority.

The Nurse cannot elevate, expand, or transfer the Nurse's own authority.

## 4. APPROVED DELEGABLE OPERATIONAL CAPABILITIES

The following operational participation is established by the closed
Application Capability Contract:

- Patient Entry / Arrival;
- Patient Data Recording;
- Patient Exit;
- Doctor Notification.

The following are not automatically included merely by being described as
"operational":

- any additional operational capability not deliberately authorized by the
  applicable contract.

## 5. DELEGATION MODEL

Operational delegation is controlled by the Doctor.

The Doctor may assign the Nurse one of two delegation modes:

### 5.1 FULL OPERATIONAL DELEGATION

FULL OPERATIONAL DELEGATION means that the Nurse receives execution authority
for all operational capabilities that are explicitly classified as delegable
by this Authorization Contract.

FULL does not mean full system authority.

FULL does not include:

- Clinical Authority;
- Main Admin authority;
- System Ownership;
- Case Completion authority;
- clinical decision authority;
- any other non-delegable authority established by the approved contracts.

### 5.2 LIMITED OPERATIONAL DELEGATION

LIMITED OPERATIONAL DELEGATION means that the Doctor selects a defined subset
of the operational capabilities explicitly classified as delegable by this
Authorization Contract.

The Nurse may execute only the selected delegated capabilities.

The Nurse may not execute a capability outside the selected delegation scope
unless the Doctor changes the delegation scope through the authorized
mechanism.

## 6. DELEGATION PRINCIPLE

Delegation means operational execution authority within the approved boundary.

Delegation does not mean transfer of ownership or clinical authority.

The authority owner remains the Doctor.

The delegated Nurse remains an operational participant.

## 7. AUTHORIZATION PERMISSION MATRIX

The approved delegable operational permission set is:

| Capability | Doctor | Nurse - FULL | Nurse - LIMITED |
|---|---|---|---|
| Patient Entry / Arrival | YES | YES | Only when selected by Doctor |
| Patient Data Recording | YES | YES | Only when selected by Doctor |
| Patient Exit | YES | YES | Only when selected by Doctor |
| Doctor Notification | YES | YES | Only when selected by Doctor |

FULL OPERATIONAL DELEGATION grants execution authority for all four approved
delegable operational capabilities.

LIMITED OPERATIONAL DELEGATION grants execution authority only for the
capabilities explicitly selected by the Doctor from the four approved
delegable operational capabilities.

The Nurse cannot execute a capability outside the active delegated scope.

The following authorities are never included in FULL or LIMITED Nurse
delegation:

- Clinical Authority;
- clinical decision authority;
- Main Admin authority;
- System Ownership;
- Case Completion authority.

No additional Nurse permission is authorized by this matrix.

## 7. AUTHORITY PROTECTION

The following authorities remain Doctor-only and cannot be granted through
Nurse operational delegation:

- Clinical Authority;
- clinical decision authority;
- Main Admin authority;
- System Ownership;
- Case Completion authority.

Any capability requiring explicit Doctor Authority remains subject to Doctor
Authority even when a Nurse has operational delegation.

## 8. OPERATIONAL MODE

The system supports:

- Doctor-only operation;
- Doctor + Nurse operation.

Doctor-only operation does not reduce Doctor authority.

Doctor + Nurse operation introduces delegated operational execution only.

The presence of a Nurse does not change:

- Clinical Authority;
- Main Admin authority;
- System Ownership;
- Case Completion authority.

## 9. DELEGATION CHANGE

The Doctor controls the Nurse delegation scope.

A change from FULL to LIMITED, LIMITED to FULL, or one LIMITED capability
selection to another is a Doctor-controlled authorization decision.

The Nurse cannot modify the Nurse's own delegation scope.

## 10. AUTHORIZATION BOUNDARY

This contract defines authorization authority and delegation boundaries.

It does not define:

- authentication;
- passwords;
- sessions;
- tokens;
- database tables;
- database schema;
- SQL;
- migrations;
- ORM;
- repositories;
- API routes;
- UI controls;
- deployment;
- runtime implementation.

## 11. IMPLEMENTATION PROHIBITION

No implementation is authorized by this contract.

AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO
AUTHENTICATION_IMPLEMENTATION_AUTHORIZED = NO
DATABASE_SCHEMA_IMPLEMENTATION_AUTHORIZED = NO
API_IMPLEMENTATION_AUTHORIZED = NO
UI_IMPLEMENTATION_AUTHORIZED = NO

## 12. CLOSURE

AUTHORIZATION CONTRACT CLOSURE DECISION:

- Doctor authority boundary is defined.
- Nurse authority boundary is defined.
- Four approved delegable operational capabilities are defined.
- FULL OPERATIONAL DELEGATION is defined.
- LIMITED OPERATIONAL DELEGATION is defined.
- Doctor controls Nurse delegation scope.
- Nurse self-expansion is prohibited.
- Non-delegable Doctor authority is protected.
- Authentication implementation remains unauthorized.
- Authorization implementation remains unauthorized.
- Database implementation remains unauthorized.
- API implementation remains unauthorized.
- UI implementation remains unauthorized.

AUTHORIZATION_TECHNICAL_CONTRACT_V1 = CLOSED + PROVEN

IMPLEMENTATION = NOT AUTHORIZED

## CONTROLLED AMENDMENT — A01-A04

STATUS = CONTROLLED AMENDMENT
IMPLEMENTATION_AUTHORIZED = NO

A01 — ARRIVAL PATIENT CONDITION
Uses existing Nurse Patient Entry / Arrival delegation.
No new Nurse permission.

A02 — NURSE CURRENT COMPLAINT INTAKE
Uses existing Nurse Patient Data Recording delegation.
No new Nurse permission.

A03 — NURSE INITIAL PAST HISTORY COLLECTION
Uses existing Nurse Patient Data Recording delegation.
Collection does not grant Past History authority.
Doctor remains authoritative.

A04 — SEND TO DOCTOR
Uses existing Nurse Doctor Notification delegation.
No new Nurse permission.

AUTHORITY_TRANSFER = NO
ADDITIONAL_NURSE_PERMISSION = NO
CROSS_CONTRACT_INVARIANTS_PRESERVED = YES
CONTRACT_MUTATION = PERFORMED
IMPLEMENTATION = NOT AUTHORIZED
