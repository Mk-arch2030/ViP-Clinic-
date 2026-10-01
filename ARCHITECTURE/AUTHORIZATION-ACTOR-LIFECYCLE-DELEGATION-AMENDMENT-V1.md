# DR. ROBY CLINIC — AUTHORIZATION / ACTOR LIFECYCLE / DELEGATION AMENDMENT V1

STATUS = CLOSED + PROVEN
IMPLEMENTATION_AUTHORIZED = NO

## 1. PURPOSE

This controlled amendment reconciles the approved Doctor/Nurse delegation
model with Actor lifecycle behavior.

It does not authorize authentication, database, API, UI, or runtime
implementation.

## 2. DOCTOR AUTHORITY

The Doctor remains:

- Main Admin
- Clinical Authority
- System Owner
- Authority over Nurse delegation
- Authority to review all Cases
- Exclusive authority to establish Case Completion
- Exclusive authority to close the Clinic Day

## 3. NURSE DELEGATION

The Doctor may assign Nurse operational authority using:

- FULL OPERATIONAL DELEGATION
- LIMITED OPERATIONAL DELEGATION

Delegation may authorize operational/data-entry capabilities only.

Delegation never transfers:

- Clinical Authority
- Main Admin authority
- System Ownership
- Case Completion authority
- Clinic Day Closure authority
- clinical decision authority

## 4. DOCTOR REVIEW

All Cases remain subject to Doctor review.

Nurse operational execution does not remove or replace the Doctor's
clinical review responsibility.

## 5. CASE COMPLETION

Case Completion remains Doctor-only.

Nurse delegation can never include Case Completion.

## 6. CLINIC DAY CLOSURE

Clinic Day Closure remains Doctor-only.

Nurse delegation can never include Clinic Day Closure.

Clinic Day Closure does not complete an open Case.

## 7. NURSE ACTOR LIFECYCLE

A Nurse Actor has an operational lifecycle:

- ACTIVE
- DEACTIVATED

A Nurse may be DEACTIVATED by authorized Doctor administration.

DEACTIVATION:

- removes the Nurse from active operational participation;
- does not delete the Nurse Actor;
- does not destroy Actor Identity;
- does not erase historical association with prior operational activity;
- does not rewrite prior product records.

## 8. NURSE DELETION

Nurse Account deletion is NOT an approved product operation.

DELETE_NURSE = PROHIBITED

Physical destruction, purge, trash storage, or retention implementation
details remain outside this amendment.

## 9. REACTIVATION

Reactivation is a future lifecycle operation requiring deliberate
authorization definition before implementation.

No automatic reactivation is implied.

## 10. ACTOR IDENTITY

Nurse identity remains an independent Actor Identity even when the Nurse
is DEACTIVATED.

Lifecycle status is distinct from:

- Actor Identity
- Actor Role
- Authority Context
- Delegated Permission Scope
- Authentication State

## 11. CROSS-CONTRACT INVARIANTS

The amendment preserves:

- Doctor ownership
- Doctor clinical authority
- Doctor Case Completion authority
- Doctor Clinic Day Closure authority
- Nurse operational delegation
- FULL delegation boundary
- LIMITED delegation boundary
- No Nurse self-expansion
- No authority transfer
- Doctor + Nurse operating mode
- Doctor-only operating mode

## 12. IMPLEMENTATION BOUNDARY

This amendment does not authorize implementation.

AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO
AUTHENTICATION_IMPLEMENTATION_AUTHORIZED = NO
DATABASE_IMPLEMENTATION_AUTHORIZED = NO
API_IMPLEMENTATION_AUTHORIZED = NO
UI_IMPLEMENTATION_AUTHORIZED = NO

## 13. CLOSURE

ACTOR_LIFECYCLE = DEFINED
NURSE_DEACTIVATION = DEFINED
NURSE_DELETION = PROHIBITED
NURSE_DELEGATION = DEFINED
DOCTOR_CASE_COMPLETION = EXCLUSIVE
DOCTOR_CLINIC_DAY_CLOSURE = EXCLUSIVE
DOCTOR_REVIEW_OF_CASES = REQUIRED
AUTHORITY_TRANSFER = NO
IMPLEMENTATION = NOT AUTHORIZED

AMENDMENT_STATUS = CLOSED + PROVEN
