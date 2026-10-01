# CONTRACT-09 — PATIENT AGE CALCULATION & PRESENTATION

> STATUS: DRAFT / CONTRACT AUTHORING
> PARENT AUTHORITY: A06
> AUTHORITY MODEL: DOB AUTHORITATIVE / AGE DERIVED ONLY
> SCOPE: PATIENT AGE CALCULATION AND PRESENTATION
> FAIL TARGET: 0

---

## 1. PURPOSE

This contract defines the calculation semantics and presentation rules for Patient Age.

Patient Age is a derived temporal value calculated from the Patient's authoritative Date of Birth (DOB).

This contract does not create a new Patient identity authority and does not replace or amend the A06 DOB authority.

---

## 2. PARENT AUTHORITY

A06 establishes:

- Date of Birth (DOB) as an authoritative persistent Patient fact.
- Age as a derived temporal value.
- Age must not be accepted as an authoritative persisted Patient fact.

Contract-09 extends the presentation and calculation semantics of that existing authority.

---

## 3. CORE AUTHORITY RULE

The authoritative input is:

    Patient.dateOfBirth

The derived output is:

    Patient.age

The system MUST NOT treat a user-submitted age value as authoritative Patient data.

The system MUST calculate Age from DOB and the relevant calculation date.

---

## 4. AGE CALCULATION MODEL

Age SHALL be calculated from:

    Date of Birth
    +
    Calculation Date

The calculation MUST account for whether the birthday has occurred within the calculation year.

The calculation MUST NOT rely on a previously stored age value.

Age MUST therefore remain temporally derived.

---

## 5. CALCULATION REPRESENTATION

The canonical derived age representation SHALL support:

- Years
- Months
- Days

The representation is derived at calculation time and does not become an independent persisted Patient fact.

---

## 6. PRESENTATION SEMANTICS

Presentation MAY vary according to the clinical context while preserving the same authoritative source.

Examples:

- Adult presentation MAY emphasize completed years.
- Child presentation MAY use years and months.
- Infant presentation MAY use months and days where clinically appropriate.

Presentation changes MUST NOT create different Age authorities.

All presentation forms MUST derive from the same DOB.

---

## 7. TEMPORAL RULE

Age MUST be evaluated relative to an explicit calculation date.

The calculation date MUST represent the temporal context in which the Age is being displayed or used.

Therefore:

    Same DOB + Different Calculation Date
    =
    Potentially Different Derived Age

This is expected behavior and is not a Patient identity mutation.

---

## 8. PERSISTENCE RULE

Age MUST NOT be introduced as an authoritative persisted Patient field by this contract.

No new authoritative database column for Age is authorized by Contract-09.

The authoritative persisted source remains DOB.

---

## 9. INPUT RULE

Patient registration and Patient persistence MUST continue to treat DOB as the authoritative temporal input.

An age field supplied by a caller MUST NOT override or replace DOB.

Contract-09 does not authorize accepting authoritative Age input.

---

## 10. API / DOMAIN BOUNDARY

Contract-09 does not authorize:

- New Patient identity entities.
- New Patient persistence authorities.
- New database tables.
- New Age database columns.
- Replacement of DOB.
- New authentication or authorization behavior.
- New workflow authority.
- Changes to Case or Encounter contracts.

Any implementation MUST remain bounded to Age calculation and presentation.

---

## 11. A06 COMPATIBILITY

Contract-09 MUST remain compatible with:

    A06 DOB Authority
    +
    Patient Domain Authority
    +
    Patient Persistence Authority

No A06 authority is revoked, replaced, or duplicated.

---

## 12. IMPLEMENTATION BOUNDARY

This manuscript authorizes contract definition only.

It does NOT by itself authorize implementation.

Implementation requires a separate bounded Implementation Authorization and proof gate.

Expected implementation sequence:

    Contract
      ↓
    Review
      ↓
    Implementation Authorization
      ↓
    Tests
      ↓
    Implementation
      ↓
    Proof
      ↓
    UI Integration

---

## 13. NON-GOALS

Contract-09 does NOT define:

- Patient registration redesign.
- Patient retrieval redesign.
- Database migration.
- Authentication.
- Authorization.
- Clinical workflow.
- Clinical History.
- Past History.
- Case management.
- Encounter management.
- Deployment.
- Mobile application architecture.

---

## 14. SUCCESS CRITERIA

Contract-09 is considered structurally valid when:

- DOB remains the sole authoritative temporal Patient input.
- Age remains derived only.
- Age calculation is deterministic for a given DOB and calculation date.
- Presentation derives from the same calculated Age.
- No Age persistence authority is introduced.
- No existing closed authority is contradicted.
- FAIL = 0.

---

## 15. AUTHORITY CHAIN

    A06
      ↓
    DOB = AUTHORITATIVE FACT
      ↓
    CONTRACT-09
      ↓
    AGE = DERIVED ONLY
      ↓
    CALCULATION SEMANTICS
      ↓
    PRESENTATION RULES

---

## 16. STATUS

CONTRACT-09 STATUS:

    DRAFT / CONTRACT AUTHORING

Implementation authorization:

    NOT YET GRANTED

Proof status:

    NOT YET CLAIMED

FAIL:

    0
