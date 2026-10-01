# CONTRACT-09 AGE TEST RECONCILIATION DECISION

> STATUS: RECONCILIATION DECISION
> PARENT AUTHORITY: CONTRACT-09
> SEMANTIC PARENT: CONTRACT-09 AGE CALCULATION REPRESENTATION RECONCILIATION DECISION
> SCOPE: Reconciliation of the 13 Contract-09 age tests with the canonical age authority

---

## 1. PURPOSE

This decision reconciles the existing 13 Contract-09 behavioral tests with the closed Contract-09 representation semantics.

The existing test artifact currently calls the production `calculateAge()` function and expects a `{ years, months, days }` object.

That expectation conflicts with the closed compatibility decision.

The purpose of this document is to resolve that test-authority mismatch before any production implementation change.

No production source file is modified by this decision.

---

## 2. AUTHORITATIVE SEMANTICS

Contract-09 defines two related but distinct derived surfaces:

### Compatibility surface

Existing:

`calculateAge(dateOfBirth, referenceDate)`

remains a Years-only compatibility primitive returning:

`completed years`

### Canonical detailed-age surface

Contract-09 introduces a separate bounded canonical detailed-age calculation capability returning:

```text
{
  years,
  months,
  days
}

The detailed result is derived from:

DOB + explicit Calculation Date

and is not persisted.


---

3. TEST AUTHORITY RULE

The 13 tests MUST NOT all call the existing Years-only compatibility primitive.

The tests SHALL be divided by responsibility:

compatibility tests verify existing calculateAge() Years-only behavior;

canonical detailed-age tests verify the new Contract-09 { years, months, days } capability;

protection tests verify authority and persistence boundaries.


A test MUST NOT require an unapproved return-shape change from an existing compatibility primitive.


---

4. TEST-01 RECONCILIATION

Existing expectation

The existing test calls calculateAge() and expects:

{ years: 36, months: 0, days: 0 }

Decision

The test SHALL target the canonical detailed-age capability.

Inputs:

DOB = 1990-02-01
Calculation Date = 2026-02-01

Expected canonical result:

{
  years: 36,
  months: 0,
  days: 0
}

The existing calculateAge() compatibility primitive is NOT changed by this test.


---

5. TEST-02 RECONCILIATION

Inputs:

DOB = 1990-02-01
Calculation Date = 2026-01-31

Expected canonical result:

{
  years: 35,
  months: 11,
  days: 30
}

Reason:

1990-02-01
 + 35 years
 = 2025-02-01

 + 11 months
 = 2026-01-01

 + 30 days
 = 2026-01-31


---

6. TEST-03 RECONCILIATION

Inputs:

DOB = 1990-02-01
Calculation Date = 2026-02-02

Expected canonical result:

{
  years: 36,
  months: 0,
  days: 1
}


---

7. TEST-04 RECONCILIATION

Inputs:

DOB = 2025-01-15
Calculation Date = 2025-02-15

Expected canonical result:

{
  years: 0,
  months: 1,
  days: 0
}


---

8. TEST-05 RECONCILIATION

Inputs:

DOB = 2025-01-15
Calculation Date = 2025-01-16

Expected canonical result:

{
  years: 0,
  months: 0,
  days: 1
}


---

9. TEST-06 RECONCILIATION — FEBRUARY 29

Inputs:

DOB = 2024-02-29
Calculation Date = 2025-02-28

The closed Contract-09 leap-day rule states:

February 28 is the applicable birthday anniversary
in a non-leap year for a February-29 DOB.

Therefore the canonical result SHALL be:

{
  years: 1,
  months: 0,
  days: 0
}

The previous expectation:

{
  years: 0,
  months: 11,
  days: 30
}

is REJECTED as inconsistent with the closed leap-day rule.

This is a test expectation correction, not a production defect.


---

10. TEST-07 RECONCILIATION

Inputs:

DOB = 2026-01-01
Calculation Date = 2026-03-01

Expected canonical result:

{
  years: 0,
  months: 2,
  days: 0
}

The presentation layer MAY choose a clinically appropriate months/days representation.


---

11. TEST-08 RECONCILIATION

Inputs:

DOB = 2018-06-10
Calculation Date = 2026-06-10

Expected canonical result:

{
  years: 8,
  months: 0,
  days: 0
}

Presentation MAY emphasize Years + Months.


---

12. TEST-09 RECONCILIATION

Inputs:

DOB = 1990-02-01
Calculation Date = 2026-09-30

Expected canonical result:

{
  years: 36,
  months: 7,
  days: 29
}

The adult presentation MAY emphasize completed Years.

The detailed canonical result remains the same underlying derived authority.


---

13. TEST-10 RECONCILIATION

The test verifies explicit Calculation Date behavior.

Identical inputs:

DOB = 1990-02-01
Calculation Date = 2026-09-30

MUST produce identical canonical results.

The test MUST NOT depend on the current system clock.


---

14. TEST-11 RECONCILIATION

Submitted Age SHALL NOT be an authoritative calculation input.

The test SHALL verify that:

DOB = authoritative input
submitted Age = non-authoritative input
Calculation Date = authoritative calculation context

A conflicting submitted Age MUST NOT alter the canonical result.

The test MUST NOT assume that the existing calculateAge() compatibility primitive returns the canonical object.


---

15. TEST-12 RECONCILIATION

The persistence protection test remains valid.

It SHALL verify:

no authoritative Age database column;

no Age migration;

no Age persistence repository;

DOB remains the persisted authoritative temporal Patient fact.


No production persistence change is authorized.


---

16. TEST-13 RECONCILIATION

Determinism SHALL apply to the canonical detailed-age capability.

Given identical:

DOB + Calculation Date

the canonical detailed result MUST be identical.

The existing compatibility primitive remains deterministic as already proven.


---

17. CALENDAR ARITHMETIC RULE

Canonical detailed Age SHALL use calendar components:

Years -> Months -> Days

The result MUST NOT be based on fixed-day approximations.

The canonical result SHALL preserve the calendar relationship between DOB and Calculation Date under the Contract-09 anniversary rules.

The February-29 rule defined by the parent reconciliation decision is authoritative.


---

18. PRODUCTION BOUNDARY

This test reconciliation does NOT authorize:

changing calculateAge();

changing Patient.age;

changing repository behavior;

changing database schema;

changing API routes;

changing persistence authority;

changing authentication;

changing authorization;

changing workflow;

changing Case;

changing Encounter;

changing Clinical History;

changing Past History.


Production implementation remains a separate bounded gate.


---

19. CURRENT TEST ARTIFACT STATUS

The existing 13-test file is recognized as:

SEMANTICALLY OUT OF ALIGNMENT WITH THE CLOSED REPRESENTATION DECISION

because it currently expects the existing calculateAge() primitive to return the canonical detailed object.

This does NOT mean the Contract-09 contract is defective.

The test artifact SHALL be reconciled before execution is considered Contract-09 behavioral proof.


---

20. RECONCILIATION OUTCOME

TEST-01 = CANONICAL DETAILED AGE
TEST-02 = CANONICAL DETAILED AGE
TEST-03 = CANONICAL DETAILED AGE
TEST-04 = CANONICAL DETAILED AGE
TEST-05 = CANONICAL DETAILED AGE
TEST-06 = CANONICAL DETAILED AGE + FEB-29 RULE
TEST-07 = CANONICAL DETAILED AGE + INFANT PRESENTATION
TEST-08 = CANONICAL DETAILED AGE + CHILD PRESENTATION
TEST-09 = CANONICAL DETAILED AGE + ADULT PRESENTATION
TEST-10 = CANONICAL DETAILED AGE + EXPLICIT DATE
TEST-11 = AUTHORITY PROTECTION
TEST-12 = PERSISTENCE PROTECTION
TEST-13 = CANONICAL DETAILED AGE + DETERMINISM

The existing calculateAge() primitive remains a separate compatibility surface.


---

21. NEXT GATE

The next gate is:

CONTRACT-09 TEST ARTIFACT RECONCILIATION

That gate SHALL update the test artifact so that:

1. detailed-age tests target the canonical detailed-age capability;


2. compatibility behavior remains protected;


3. TEST-06 uses the closed February-29 rule;


4. no production source is modified;


5. no production implementation is claimed;


6. FAIL remains 0 for the reconciliation gate itself.




---

22. CLOSURE STATUS

At creation time:

TEST_RECONCILIATION_DECISION = READY FOR STRUCTURAL REVIEW
PRODUCTION_IMPLEMENTATION = NOT CHANGED
PRODUCTION_AGE_SEMANTICS = NOT CHANGED
FAIL = 0

