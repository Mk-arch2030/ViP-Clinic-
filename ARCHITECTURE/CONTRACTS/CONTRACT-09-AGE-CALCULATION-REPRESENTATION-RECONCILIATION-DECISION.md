# CONTRACT-09 AGE CALCULATION REPRESENTATION RECONCILIATION DECISION

> STATUS: RECONCILIATION DECISION
> PARENT AUTHORITY: CONTRACT-09
> PARENT AUTHORITY CHAIN: A06 -> DOB AUTHORITATIVE -> CONTRACT-09
> SCOPE: Age calculation representation, compatibility, calendar semantics, and presentation boundary

---

## 1. PURPOSE

This decision resolves the Contract-09 semantic gap between:

1. the existing production calculateAge() behavior, which returns completed years as an integer;
2. Contract-09, which requires a canonical derived Age representation supporting Years, Months, and Days;
3. the existing Patient.age field and downstream compatibility;
4. presentation forms that may expose different portions of the same derived Age.

This decision is authoritative for the bounded Contract-09 implementation scope.

This decision MUST NOT modify production implementation by itself.

---

## 2. EXISTING PRODUCTION FACT

The current production calculateAge(dateOfBirth, referenceDate) returns a completed-years integer.

The current Patient domain assigns:

Patient.age = calculateAge(dateOfBirth, ageReferenceDate)

Existing persistence/read paths also derive age through the existing calculateAge() primitive.

Therefore, the existing integer-years behavior is a compatibility surface already consumed by the current system.

---

## 3. DECISION: COMPATIBILITY PRIMITIVE

The existing calculateAge() SHALL remain the Years-only compatibility primitive for the current production domain surface.

It SHALL NOT be changed from:

integer completed years

to:

{ years, months, days }

as part of the first Contract-09 implementation step.

Reason:

Changing the return contract of the existing primitive would create an unnecessary compatibility break across already-proven Patient and persistence behavior.

Contract-09 therefore introduces a separate additive canonical detailed-age calculation capability rather than redefining the existing primitive in place.

---

## 4. CANONICAL DETAILED AGE

Contract-09 SHALL introduce a bounded canonical detailed-age calculation capability.

Its conceptual result SHALL be:

{
  years,
  months,
  days
}

The result is:

- derived;
- temporal;
- calculated from DOB + Calculation Date;
- deterministic for the same DOB + Calculation Date;
- never an independent persisted Patient fact.

The canonical detailed result SHALL be the authority from which Contract-09 presentation forms derive.

---

## 5. CALENDAR DIFFERENCE DEFINITION

The canonical detailed Age SHALL represent a calendar-based elapsed age using sequential calendar components:

1. determine completed calendar years;
2. determine completed calendar months after those years;
3. determine remaining calendar days after those months.

The calculation MUST preserve the invariant:

DOB + canonical Age components = Calculation Date

under the defined calendar arithmetic rules.

The calculation MUST NOT derive Months or Days by converting elapsed milliseconds into approximate calendar units.

The calculation MUST NOT use fixed assumptions such as:

- 30 days = 1 month;
- 365 days = 1 year;
- 12 months = a fixed number of days.

Calendar month lengths and leap years MUST be respected.

---

## 6. BIRTHDAY BOUNDARY

Completed Years SHALL increase only when the applicable birthday anniversary has been reached under the canonical calendar rules.

Before the birthday anniversary:

years = completed years before that anniversary

On the birthday anniversary:

years = completed years

After the birthday anniversary:

years = completed years

Months and Days SHALL represent the remaining calendar interval after the completed-year component.

---

## 7. LEAP-DAY RECONCILIATION

For a DOB of February 29, when the Calculation Date occurs in a non-leap year, the canonical calculation MUST use an explicit anniversary rule.

Contract-09 SHALL treat February 28 as the applicable birthday anniversary in a non-leap year for a February-29 DOB.

Therefore:

- before February 28 -> the new yearly anniversary has not occurred;
- on February 28 -> the yearly anniversary has occurred;
- after February 28 -> the yearly anniversary has occurred.

This rule SHALL be tested explicitly.

The implementation MUST NOT create a different leap-day authority at the presentation layer.

---

## 8. PATIENT.AGE RELATIONSHIP

The existing Patient.age field SHALL remain the existing completed-years compatibility representation during the bounded Contract-09 implementation.

It remains derived from DOB and the applicable calculation/reference date.

It MUST NOT become an authoritative persisted Age field.

The canonical detailed Age SHALL NOT be persisted as an independent Patient fact by Contract-09.

The relationship SHALL therefore be:

Authoritative DOB
       |
       +--> Contract-09 canonical detailed Age
       |       |
       |       +--> Years / Months / Days
       |               |
       |               +--> Presentation forms
       |
       +--> Existing compatibility calculation
               |
               +--> Patient.age = completed years

Both paths derive from the same authoritative DOB.

Neither path creates a second Age authority.

---

## 9. PRESENTATION RELATIONSHIP

Presentation forms SHALL NOT calculate independent Age values.

Presentation SHALL consume or derive from the canonical Contract-09 Age authority.

Authorized representations include:

- Years;
- Years + Months;
- Years + Months + Days;
- Months + Days where clinically appropriate.

Presentation MUST NOT:

- accept submitted Age as authoritative;
- persist presentation Age as a new authority;
- recalculate Age using a different DOB;
- create a competing age algorithm;
- create a second temporal authority.

---

## 10. CALCULATION DATE

The canonical detailed-age capability SHALL accept an explicit Calculation Date.

When an explicit Calculation Date is supplied:

- the system MUST use that date;
- the system MUST NOT depend on the current system clock;
- the result MUST be deterministic for identical DOB + Calculation Date inputs.

The existing compatibility primitive retains its existing reference-date behavior unless separately authorized.

---

## 11. PERSISTENCE BOUNDARY

Contract-09 does NOT authorize:

- an Age database column;
- an Age migration;
- an Age persistence repository;
- an Age table;
- replacement of DOB with Age;
- persistence of canonical Years/Months/Days as an independent Patient fact.

DOB remains the authoritative persistent temporal Patient fact.

---

## 12. IMPLEMENTATION BOUNDARY

This reconciliation decision authorizes semantic direction only.

It does NOT by itself authorize implementation outside the already-closed Contract-09 Implementation Authorization.

The bounded implementation may address:

- canonical detailed-age calculation;
- explicit Calculation Date;
- leap-day rule;
- automated Contract-09 tests;
- bounded presentation derivation where separately proven.

No changes are authorized to:

- P0;
- P1;
- P2;
- P3;
- authentication;
- authorization;
- workflow;
- Case;
- Encounter;
- Clinical History;
- Past History;
- persistence authority;
- database schema;
- API routes;
- unrelated domains.

---

## 13. COMPATIBILITY PRINCIPLE

Contract-09 SHALL be additive with respect to the existing Years-only compatibility primitive.

The canonical detailed-age capability is the Contract-09 semantic authority for detailed Age representation.

The existing calculateAge() primitive remains the compatibility surface until a separate bounded decision explicitly authorizes replacing it.

No compatibility break SHALL be introduced merely to satisfy Contract-09 detailed presentation.

---

## 14. RECONCILIATION OUTCOME

QUESTION 1:
Does calculateAge() remain Years-only?

DECISION:
YES. Existing calculateAge() remains the compatibility primitive.

QUESTION 2:
Does Contract-09 require a canonical detailed representation?

DECISION:
YES. A separate bounded detailed-age calculation capability shall be introduced.

QUESTION 3:
What is the calendar model?

DECISION:
Calendar-based Years -> Months -> Days, not fixed-day approximation.

QUESTION 4:
How is February 29 handled in a non-leap year?

DECISION:
February 28 is the applicable birthday anniversary.

QUESTION 5:
What is Patient.age?

DECISION:
Existing derived completed-years compatibility representation.

QUESTION 6:
What is the detailed Age authority?

DECISION:
The Contract-09 canonical derived Years/Months/Days calculation.

QUESTION 7:
Can presentation create another Age authority?

DECISION:
NO. All presentation forms derive from the same Contract-09 authority.

---

## 15. AUTHORITY CHAIN

A06
 |
 v
DOB = authoritative persistent Patient fact
 |
 v
CONTRACT-09
 |
 v
Canonical detailed Age calculation
 |
 v
Years / Months / Days
 |
 v
Presentation forms

Compatibility path:

DOB
 |
 v
Existing calculateAge()
 |
 v
Patient.age = completed years

The compatibility path MUST NOT become a competing authoritative source.

---

## 16. PRODUCTION IMPLEMENTATION STATUS

At the time of this decision:

RECONCILIATION_DECISION = CLOSED + PROVEN
CANONICAL_DETAILED_AGE_IMPLEMENTED = NO
PRODUCTION_MODIFIED_BY_THIS_DECISION = NO
PATIENT_AGE_COMPATIBILITY_PRESERVED = YES
PERSISTENCE_AUTHORITY_CHANGED = NO
API_AUTHORITY_CHANGED = NO
FAIL = 0

---

## 17. NEXT GATE

The next gate is:

CONTRACT-09 CANONICAL DETAILED AGE CALCULATION TEST RECONCILIATION

The existing failing detailed-age tests SHALL NOT be treated as production defects until their expected calendar semantics are aligned with this decision.

Production implementation SHALL begin only after the reconciled test specification is proven against these semantics.

---

## 18. CLOSURE

This document closes the Contract-09 representation semantics gap.

No production source file is modified by this decision.

FAIL = 0
