# CONTRACT-09 — PATIENT AGE CALCULATION & PRESENTATION
# IMPLEMENTATION AUTHORIZATION

> STATUS: CLOSED + PROVEN
> PARENT AUTHORITY: CONTRACT-09
> IMPLEMENTATION SCOPE: BOUNDED AGE CALCULATION & PRESENTATION
> FAIL TARGET: 0

---

## 1. AUTHORIZATION DECISION

Implementation is authorized only within the bounded scope defined by Contract-09.

This authorization does not create a new Patient authority.

This authorization does not modify the A06 Date of Birth authority.

---

## 2. AUTHORIZED OBJECTIVE

The implementation MAY:

- Calculate Patient Age from authoritative DOB.
- Use an explicit calculation date.
- Represent derived Age as Years, Months, and Days.
- Provide presentation formatting derived from the calculated Age.
- Add automated tests for calculation and presentation semantics.
- Integrate the derived Age into an already authorized Patient presentation surface where explicitly bounded.

---

## 3. AUTHORITATIVE SOURCE

The sole authoritative temporal Patient input is:

    Patient.dateOfBirth

The implementation MUST NOT use a persisted Age value as its authoritative source.

---

## 4. AGE INPUT PROHIBITION

The implementation MUST NOT:

- Accept user-submitted Age as authoritative Patient data.
- Allow submitted Age to override DOB.
- Persist submitted Age as an authoritative Patient fact.
- Reconstruct DOB from Age.

---

## 5. PERSISTENCE BOUNDARY

The implementation is NOT authorized to:

- Add an Age database column.
- Add an Age persistence table.
- Add an Age persistence repository.
- Add an Age migration.
- Replace DOB persistence.
- Change existing Patient persistence authority.

Age remains derived at calculation time.

---

## 6. CALCULATION BOUNDARY

The implementation SHALL calculate Age from:

    DOB + Calculation Date

The implementation MUST handle birthday boundaries correctly.

The implementation MUST be deterministic for the same DOB and calculation date.

The implementation MUST NOT depend on the current system clock when an explicit calculation date is supplied.

---

## 7. PRESENTATION BOUNDARY

The implementation MAY expose derived Age in presentation forms including:

- Years.
- Years and Months.
- Years, Months, and Days.
- Months and Days where clinically appropriate.

Different presentation forms MUST derive from the same Age calculation authority.

Presentation MUST NOT create separate Age values or authorities.

---

## 8. TEST AUTHORIZATION

Automated tests are authorized before production/UI integration.

Tests SHALL cover at minimum:

- Exact birthday.
- Before birthday.
- After birthday.
- Month boundary.
- Day boundary.
- Leap-year / February boundary where applicable.
- Infant/child representation.
- Adult representation.
- Explicit calculation date.
- Rejection/non-use of authoritative Age input.
- Absence of Age persistence authority.

---

## 9. AUTHORIZED FILE SCOPE

Implementation MAY introduce or modify only files required for:

- Age calculation logic.
- Age presentation logic.
- Age-specific automated tests.
- Bounded UI presentation integration after separate proof authorization.

Existing Patient domain, persistence, API, authentication, authorization, workflow, Case, Encounter, Clinical History, and Past History authorities MUST remain unchanged unless separately authorized by a new evidence-backed gate.

---

## 10. PROHIBITED SCOPE

This authorization does NOT authorize:

- Database schema changes.
- SQL changes.
- PostgreSQL persistence changes.
- Patient repository redesign.
- New API routes.
- Authentication changes.
- Authorization changes.
- Workflow changes.
- Case changes.
- Encounter changes.
- Clinical History changes.
- Past History changes.
- Mobile application implementation.
- PWA architecture changes.
- Deployment changes.
- Unrelated UI redesign.
- Reopening P0.
- Reopening P1.
- Reopening P2.
- Reopening P3.
- Replacing or amending A06.

---

## 11. REGRESSION REQUIREMENT

All existing authorized tests MUST remain green.

Required invariant:

    Existing baseline
        +
    Contract-09 tests
        =
    FAIL 0

Any regression blocks implementation closure.

---

## 12. IMPLEMENTATION SEQUENCE

The authorized sequence is:

    Contract-09
        ↓
    Implementation Authorization
        ↓
    Age Tests
        ↓
    Age Implementation
        ↓
    Age Proof
        ↓
    Bounded Presentation Integration
        ↓
    Regression Proof

No implementation step may skip the corresponding proof gate.

---

## 13. CLOSURE CONDITIONS

Implementation authorization may be considered CLOSED + PROVEN only when:

- Scope is verified.
- No prohibited authority is modified.
- Age calculation tests pass.
- Age presentation tests pass.
- Existing regression remains PASS.
- No Age persistence authority is introduced.
- DOB remains authoritative.
- Age remains derived only.
- FAIL = 0.

---

## 14. AUTHORITY CHAIN

    A06
      ↓
    DOB = AUTHORITATIVE FACT
      ↓
    CONTRACT-09
      ↓
    IMPLEMENTATION AUTHORIZATION
      ↓
    AGE = DERIVED ONLY
      ↓
    CALCULATION
      ↓
    PRESENTATION
      ↓
    PROOF

---

## 15. CURRENT STATUS

CONTRACT-09:

    CLOSED + PROVEN

IMPLEMENTATION AUTHORIZATION:

    CLOSED + PROVEN

AGE IMPLEMENTATION:

    AUTHORIZED WITHIN BOUNDED CONTRACT-09 SCOPE

AGE PROOF:

    NOT CLAIMED

FAIL:

    0
