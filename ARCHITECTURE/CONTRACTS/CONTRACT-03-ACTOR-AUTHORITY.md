# DR. ROBY CLINIC — CONTRACT-03
# ACTOR & AUTHORITY CONTRACT

## 1. PURPOSE

This Contract defines the product-level authority and actor boundaries
for Dr.Roby Clinic.

It converts the approved Product Manuscript and Domain Specification
into mandatory authority rules.

This Contract does not define technical authentication,
authorization implementation, database schema, API contracts,
UI contracts, deployment, or security mechanisms.

---

## 2. AUTHORITY MODEL

The Doctor is the Main Admin, Clinical Authority, and Actor of the clinic.

The Doctor owns the clinic system and retains authority over the clinic
and its operational delegation.

The Nurse is an Operational Workflow Participant whose operational work
comes from delegation by the Doctor.

Delegation of operational work does not transfer clinical authority
or system ownership from the Doctor.

---

## 3. DOCTOR

The Doctor has the following product-level responsibilities:

- Clinical Authority.
- Main Admin.
- Actor within the clinic workflow.
- Authority over clinic settings and options.
- Authority to delegate operational workflow to Nurse(s).
- Authority to perform clinical decisions.
- Authority to review daily clinic data.
- Authority to explicitly close a Clinic Day.
- Authority to establish Case completion.

The Doctor may personally perform operational workflow actions
when the Doctor chooses to do so.

The Doctor may also delegate operational workflow to Nurse(s),
fully or under supervision.

---

## 4. NURSE

The Nurse is an Operational Workflow Participant.

The current approved operational scope is:

- Patient Entry / Arrival.
- Patient Data Recording.
- Patient Exit.
- Doctor Notification.

The Nurse may perform delegated operational workflow under the
Doctor's authority.

The Nurse does not replace the Doctor as Clinical Authority.

The Nurse does not become the owner of the clinic system through
delegation.

The Nurse may operate fully under delegation or under Doctor supervision,
according to the clinic's operating choice.

Detailed technical permissions are intentionally not defined by this
Contract.

---

## 5. DELEGATION PRINCIPLE

The governing product principle is:

Delegation of Work ≠ Delegation of System Ownership.

The Doctor delegates operational workflow execution.

The Doctor does not delegate away clinical authority or system ownership
through that operational delegation.

---

## 6. CLINICAL AUTHORITY

Clinical decisions remain under the Doctor's authority.

The operational participation of a Nurse does not change who holds
clinical authority.

The Nurse may record information or execute delegated operational steps,
but this Contract does not authorize the Nurse to become the clinical
decision-maker.

---

## 7. CLINIC DAY AUTHORITY

The Doctor reviews daily clinic data before explicitly closing a Clinic Day.

Closing a Clinic Day is an operational action under the Doctor's authority.

Delegated operational execution may be considered later under a dedicated
authorization contract, but this Contract does not define technical
delegation permissions.

Closing a Clinic Day does not automatically complete an open Case.

---

## 8. CASE COMPLETION AUTHORITY

Case completion is established by the Doctor.

A Nurse may execute delegated operational steps associated with workflow,
but Case completion remains a Doctor clinical authority decision.

---

## 9. SETTINGS / OPTIONS AUTHORITY

Settings and Options are under Doctor / Main Admin authority.

This Contract does not define the technical structure or individual
technical permissions of Settings or Options.

The currently defined product-level setting includes:

- Data protection mode: IMMEDIATE OR 3 DAYS.

Further Settings / Options require deliberate design and contract decisions.

---

## 10. OPERATING MODE

The clinic may operate:

- Doctor only.
- Doctor + Nurse.

These are operating modes of the same product.

They do not create a second owner of the clinic system.

The presence of a Nurse does not reduce or transfer the Doctor's
clinical authority or Main Admin ownership.

---

## 11. AUTHORITY BOUNDARY

This Contract authorizes only the product-level authority model described
above.

It does not authorize:

- Database schema or migrations.
- Authentication implementation.
- Authorization implementation.
- Technical roles or permission matrices.
- API contracts.
- UI contracts.
- Session implementation.
- Security mechanisms.
- Deployment architecture.
- Multi-clinic or multi-branch authority.
- Multi-tenant authority.
- Hospital authority models.
- Any capability outside the approved Dr.Roby Clinic scope.

---

## 12. CONTRACT DEPENDENCIES

This Contract is derived from:

- Product Manuscript.
- Domain Specification.
- CONTRACT-01 — Patient / Case / Visit.
- CONTRACT-02 — Clinic Day.

The referenced contracts remain authoritative and are not modified by this
Contract.

---

## 13. IMPLEMENTATION DISCIPLINE

No implementation is authorized by the existence of this Contract alone.

Database schema, API, UI, authentication, authorization, deployment,
and technical workflow implementation require their own deliberate
contracts and gates.

The manuscript and approved contracts remain the governing boundaries.

---

## 14. CLOSURE CRITERIA

CONTRACT-03 may be considered PASS only when its required authority rules
are explicitly proven against the approved source landmarks.

Until closure:

- Implementation remains unauthorized.
- Database schema remains unauthorized.
- API remains unauthorized.
- UI remains unauthorized.
- Technical authorization implementation remains unauthorized.

