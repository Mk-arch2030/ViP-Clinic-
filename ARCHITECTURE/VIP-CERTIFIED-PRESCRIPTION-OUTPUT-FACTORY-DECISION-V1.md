# ViP — Certified Prescription Output Factory Decision V1

Status: FACTORY PRODUCT DECISION
Scope: ViP Product Candidate
Canonical Mutation: NONE
Implementation Authorization: NONE

## 1. Purpose

This decision defines the Product meaning of Certified Prescription Output
within the ViP clinical EMR candidate.

It reconciles the existing ViP prescription implementation with the
Pharmacotherapy Target without silently converting the target into a
Canonical closed technical contract.

## 2. Product Decision

CERTIFIED_PRESCRIPTION_OUTPUT = OUTPUT_ARTIFACT

The Certified Prescription Output is a presentation artifact derived from
the Prescription associated with a Visit.

It is not an independent source of clinical truth.

The authoritative clinical information remains associated with the Visit
and its Prescription.

## 3. Prescription Relationship

The Product recognizes:

Visit
  -> Prescription
    -> Prescription Items
    -> Clinical Counseling
    -> Patient Instructions
    -> Doctor Authorization
    -> Certified Prescription Output

The output does not create a second independent prescription record.

## 4. Certification Boundary

A Prescription Output may be presented as Certified only when the
Prescription has an active Doctor Authorization state.

Doctor Authorization is a clinical authority action.

Nurse operational delegation does not authorize a prescription.

## 5. Authorization Information

The Certified Prescription Output may present:

- Attending Doctor identity
- Authorization state
- Authorization timestamp
- Prescription identity
- Patient identity
- Clinic Patient Number
- Case identity
- Visit date and time

These fields are Product output requirements for the candidate surface.

Their final persistence and technical representation remain subject to
separate technical contracts.

## 6. Output Integrity

The Certified Prescription Output must represent the authorized
Prescription state from which it was generated.

The printing mechanism itself does not constitute certification.

Browser printing, PDF generation, or another rendering mechanism is only
an output mechanism.

Certification is a Product state derived from Doctor Authorization.

## 7. Amendment Boundary

If an authorized Prescription is materially changed, the previous
authorization state must no longer be treated as authorization of the
modified Prescription.

A modified Prescription requires a new Doctor Authorization before a new
Certified Prescription Output may be treated as Certified.

This decision does not define the technical amendment history mechanism.

## 8. Signature Boundary

The Pharmacotherapy Target contains:

Attending MD Authorization / Signature

For the ViP candidate, this is represented as Doctor Authorization and
Doctor identity information.

This decision does not claim a cryptographic digital signature,
qualified electronic signature, certificate authority, or external legal
signature service.

Those are separate technical and legal questions.

## 9. Output Contents

The candidate Certified Prescription Output may contain:

- Clinic identity / letterhead
- Doctor identity and credentials
- Patient name
- Clinic Patient Number
- Patient demographic context required by the output
- Case identity
- Visit date and time
- Diagnosis context when clinically appropriate
- Prescription items
- Medication name
- Strength
- Form
- Dose
- Frequency
- Route
- Duration
- Quantity when present
- Medication instructions
- Clinical counseling
- Patient instructions
- Follow-up information when present
- Doctor authorization information
- Prescription identity

Fields that are not closed Canonical fields remain Product Candidate fields
and do not acquire Canonical authority through this document.

## 10. Explicit Non-Goals

This decision does not authorize:

- Pharmacy inventory
- Medication dispensing
- Pharmacy management
- External pharmacy workflow
- Billing
- Accounting
- AI prescribing
- AI diagnosis
- Digital signature infrastructure
- Cryptographic signing
- Legal e-signature certification
- Database schema changes
- Database migrations
- API implementation
- Authentication implementation
- Authorization infrastructure
- Deployment changes

## 11. Source Of Truth

SOURCE_OF_TRUTH = VISIT_PRESCRIPTION

CERTIFIED_OUTPUT = DERIVED_OUTPUT_ARTIFACT

The printed or rendered output must not become an independent mutable
clinical source of truth.

## 12. ViP Reconciliation

PRODUCT_TARGET = PRESENT

RX_IMPLEMENTATION = PRESENT

CERTIFIED_OUTPUT_SURFACE = PRESENT

CERTIFICATION_PRODUCT_SEMANTICS = CLOSED_FOR_VIP_CANDIDATE

CANONICAL_RX_CONTRACT = NOT_CHANGED

CANONICAL_IMPLEMENTATION_AUTHORIZATION = NOT_CHANGED

PERSISTENCE_AUTHORIZATION = NONE

API_AUTHORIZATION = NONE

AUTHENTICATION_AUTHORIZATION = NONE

RUNTIME_IMPLEMENTATION_AUTHORIZATION = NONE

DATABASE_CHANGE = NONE

RUNTIME_CHANGE = NONE

FAIL = 0

## 13. Factory Boundary

This decision closes the Product meaning of Certified Prescription Output
for the current ViP candidate.

It does not authorize implementation expansion.

Any future Canonical adoption requires explicit reconciliation against the
Canonical contracts and a separate implementation authorization decision.

## 14. Final Decision

DECISION = ACCEPTED_AS_VIP_FACTORY_PRODUCT_SEMANTICS

CERTIFIED_PRESCRIPTION_OUTPUT = DERIVED_FROM_AUTHORIZED_PRESCRIPTION

INDEPENDENT_SOURCE_OF_TRUTH = NO

DOCTOR_AUTHORIZATION_REQUIRED = YES

NURSE_AUTHORIZATION = NO

PRINTING_MECHANISM_EQUALS_CERTIFICATION = NO

CRYPTOGRAPHIC_SIGNATURE_CLAIM = NO

CANONICAL_CONTRACT_MUTATION = NO

IMPLEMENTATION_AUTHORIZATION = NO

FAIL = 0
