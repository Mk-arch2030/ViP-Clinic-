# CONTRACT-09 — PATIENT AGE TEST SPECIFICATION

> STATUS: TEST SPECIFICATION
> PARENT AUTHORITY: CONTRACT-09
> IMPLEMENTATION AUTHORITY: CONTRACT-09 IMPLEMENTATION AUTHORIZATION
> FAIL TARGET: 0

---

## 1. PURPOSE

Define the minimum behavioral proof surface for Patient Age calculation and presentation before implementation.

---

## 2. AUTHORITATIVE INPUT

Every calculation test MUST use:

    Date of Birth
    +
    Explicit Calculation Date

Age input MUST NOT be used as an authoritative source.

---

## 3. CALCULATION TEST MATRIX

The implementation MUST be tested against:

### TEST-01 — Exact Birthday

DOB and calculation date share the same month and day.

Expected:
- Birthday boundary is handled correctly.
- Completed years are correct.

### TEST-02 — Before Birthday

Calculation date occurs before the birthday within the calculation year.

Expected:
- Completed years are one less than the raw year difference.

### TEST-03 — After Birthday

Calculation date occurs after the birthday within the calculation year.

Expected:
- Completed years equal the year difference.

### TEST-04 — Month Boundary

DOB and calculation date produce a month transition.

Expected:
- Months and days are calculated according to the selected temporal semantics.
- No off-by-one error is introduced at the month boundary.

### TEST-05 — Day Boundary

Calculation date is immediately before or after a relevant day boundary.

Expected:
- Derived Age changes only according to the actual elapsed calendar relationship.

### TEST-06 — Leap-Year / February Boundary

DOB or calculation date involves a February leap-year boundary where applicable.

Expected:
- The implementation follows deterministic calendar semantics.
- No invalid date arithmetic is introduced.

---

## 4. REPRESENTATION TEST MATRIX

### TEST-07 — Infant / Early Age

Expected:
- Presentation MAY use months and days where clinically appropriate.
- Output remains derived from DOB.

### TEST-08 — Child Age

Expected:
- Presentation MAY use years and months.
- Output remains derived from DOB.

### TEST-09 — Adult Age

Expected:
- Presentation MAY emphasize completed years.
- Output remains derived from DOB.

---

## 5. EXPLICIT CALCULATION DATE

### TEST-10 — Fixed Calculation Date

Given identical DOB and identical explicit calculation date:

Expected:
- Identical derived Age.

The test MUST NOT depend on the system clock.

---

## 6. AUTHORITATIVE AGE INPUT PROTECTION

### TEST-11 — Submitted Age Must Not Become Authority

Given DOB plus a conflicting submitted Age:

Expected:
- DOB remains authoritative.
- Submitted Age does not override DOB.
- Derived Age is calculated from DOB and calculation date.

---

## 7. PERSISTENCE PROTECTION

### TEST-12 — No Age Persistence Authority

Expected:

- No Age database column is required.
- No Age persistence repository is required.
- No Age migration is required.
- DOB remains the persisted authoritative temporal Patient fact.

---

## 8. DETERMINISM

### TEST-13 — Same Inputs, Same Result

Given:

    same DOB
    +
    same calculation date

Expected:

    same derived Age

---

## 9. REGRESSION REQUIREMENT

All existing authorized Patient tests MUST remain PASS.

Required invariant:

    Existing Regression
        +
    Contract-09 Age Tests
        =
    FAIL 0

---

## 10. TEST BOUNDARY

This specification authorizes test creation and execution for Contract-09 only.

It does NOT authorize:

- Database changes.
- API redesign.
- Patient repository changes.
- Authentication changes.
- Authorization changes.
- Workflow changes.
- Case changes.
- Encounter changes.
- Clinical History changes.
- Past History changes.
- Mobile implementation.
- Deployment.
- Reopening closed contracts.

---

## 11. STATUS

TEST SPECIFICATION:

    READY FOR TEST IMPLEMENTATION

AGE PRODUCTION IMPLEMENTATION:

    NOT YET IMPLEMENTED

FAIL:

    0
