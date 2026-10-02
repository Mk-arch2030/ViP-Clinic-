# VIP Clinic — Clinic Day Bounded Authority V1

**DOCUMENT:** VIP-CLINIC-DAY-BOUNDED-AUTHORITY-V1
**PROJECT:** ViP Clinic
**DOMAIN:** Clinic Day
**INCREMENT:** Clinic Day Bounded Authority
**STATUS:** DRAFTING
**DATE:** 2026-10-02

---

## 1. AUTHORITY IDENTITY

This document defines the bounded authority scope for the ViP Clinic Day physical persistence structure.

The authority is derived from the already-established Clinic Day persistence proof, Real DB Definition, and Structural Contract.

This document does not create new domain behavior.

This document does not authorize unrestricted PostgreSQL access.

This document does not authorize generic persistence implementation.

This document does not authorize production deployment.

---

## 2. GOVERNING TARGET

The bounded authority target is:

`DATABASE = vip_clinic`

The bounded physical object is:

`SCHEMA = public`

`TABLE = clinic_days`

Therefore the effective structural target is:

`public.clinic_days`

No other database, schema, or unrelated table is included by this authority definition.

---

## 3. AUTHORITY SOURCE CHAIN

The bounded authority is derived from:

1. Proven Clinic Day PostgreSQL persistence behavior.
2. ViP Clinic Day Real DB Definition.
3. ViP Clinic Day Structural Contract.
4. PostgreSQL authority scope forensic closure.
5. Live database forensic reconciliation.

The source chain establishes the intended target and its boundaries.

It does not establish that the target object currently exists in the live database.

---

## 4. AUTHORITY PRINCIPLE

Authority is bounded by the proven structural artifact.

Therefore:

`PROVEN_ARTIFACT_SCOPE = AUTHORITY_BOUNDARY`

and not:

`POSTGRESQL_SERVER_ACCESS = GENERIC_AUTHORITY`

The existence of database credentials or server access does not expand the authority defined here.

---

## 5. ALLOWED AUTHORITY SCOPE

The bounded authority permits only activities directly required to establish the proven Clinic Day persistence structure within the declared target:

`vip_clinic.public.clinic_days`

The bounded scope may include:

- inspection of the declared target database;
- verification of existing `public.clinic_days` state;
- non-destructive structural reconciliation;
- verification of structural compatibility against the Structural Contract;
- controlled materialization of the already-defined Clinic Day structure, only when separately authorized by the applicable implementation decision;
- behavioral verification limited to the Clinic Day persistence boundary;
- rollback verification limited to the same bounded operation.

No activity outside this declared scope becomes authorized by implication.

---

## 6. EXCLUDED AUTHORITY

The following remain outside the bounded Clinic Day authority:

- other PostgreSQL databases;
- other application projects;
- unrelated schemas;
- unrelated tables;
- Patient schema mutation;
- Patient sequence mutation;
- Case persistence;
- Visit persistence;
- Prescription persistence;
- Follow-up persistence;
- generic ORM adoption;
- generic migration framework adoption;
- generic repository expansion;
- API implementation;
- UI implementation;
- authentication architecture;
- authorization architecture;
- deployment architecture;
- production rollout.

The presence of any excluded object on the same PostgreSQL server does not place it inside this authority scope.

---

## 7. PATIENT NON-INTERFERENCE AUTHORITY

The existing proven Patient foundation remains protected.

The bounded Clinic Day authority does not permit:

- alteration of `public.patients`;
- alteration of `clinic_patient_number_seq`;
- deletion of Patient rows;
- Patient identifier reconstruction;
- CPN sequence reset;
- Patient schema redesign;
- implicit foreign-key introduction.

Any future Clinic Day relationship with Patient requires an independent structural and authority decision.

---

## 8. NON-DESTRUCTIVE PRINCIPLE

Any controlled activity under this bounded authority must be non-destructive.

The authority does not permit:

- `DROP TABLE`;
- destructive table replacement;
- `TRUNCATE`;
- bulk deletion;
- database reset;
- schema reset;
- destructive reconstruction;
- silent mutation of existing unrelated structures.

If an unexpected existing object or incompatible state is discovered, execution must stop and the discrepancy must be documented as evidence rather than repaired implicitly.

---

## 9. IMPLEMENTATION DECISION BOUNDARY

The existence of bounded authority does not by itself authorize physical implementation.

Implementation requires a separate explicit decision establishing:

- the exact target database;
- the exact target schema and object;
- the exact structural contract to be materialized;
- the allowed SQL operation set;
- the pre-execution live state;
- the non-destructive execution boundary;
- the verification procedure;
- the rollback procedure;
- the post-execution reconciliation requirement.

The implementation decision must remain traceable to this bounded authority and the governing Structural Contract.

---

## 10. LIVE STATE PRECONDITION

Before any controlled materialization, the live target must be inspected again.

The currently established evidence is:

`DATABASE = vip_clinic`

`PHYSICAL_OBJECT = public.clinic_days`

`LIVE_CLINIC_DAY = ABSENT`

This state is evidence, not an execution instruction.

If the live state differs from the established evidence at the time of implementation, execution must stop until the discrepancy is reconciled.

---

## 11. EXECUTION NARROWING PRINCIPLE

Any future implementation must use the smallest operation set capable of materializing the already-defined structure.

No broader migration is permitted merely because broader access is technically available.

The implementation must not:

- modify unrelated tables;
- modify Patient persistence;
- modify unrelated sequences;
- introduce future-domain tables;
- introduce generic migration infrastructure;
- introduce ORM infrastructure;
- alter API or UI behavior;
- modify deployment configuration.

Technical capability must not be interpreted as architectural authority.

---

## 12. VERIFICATION AUTHORITY

After any separately authorized implementation, verification must be limited to proving:

1. the intended Clinic Day object exists;
2. the physical structure matches the Structural Contract;
3. the declared constraints are present;
4. the existing Patient foundation remains unchanged;
5. no unauthorized objects were introduced;
6. the bounded persistence behavior remains consistent;
7. rollback behavior remains understood and controlled.

Verification evidence must be recorded separately from implementation authorization.

---

## 13. AUTHORITY NON-EXPANSION RULE

No authority expansion may occur implicitly.

The following events do not expand this bounded authority:

- discovery of additional PostgreSQL databases;
- discovery of additional schemas;
- discovery of additional tables;
- availability of broader database credentials;
- existence of historical implementation artifacts;
- existence of related architecture in other products;
- technical ability to execute unrestricted SQL;
- successful execution of an unrelated operation.

Any scope expansion requires a new explicit bounded decision.

---

## 14. PRODUCTION SEPARATION

Production authorization is not included in this bounded authority.

The following remain independently controlled:

`DEVELOPMENT_AUTHORITY`

`LIVE_DATABASE_IMPLEMENTATION_AUTHORITY`

`PRODUCTION_AUTHORITY`

A successful development or live-database verification does not automatically establish production authorization.

---

## 15. FAILURE AND STOP CONDITION

`FAIL = 0` applies to the evidence proven by this artifact.

If any future controlled activity encounters:

- unexpected existing structure;
- incompatible column definition;
- unexpected data;
- unexpected dependency;
- unexpected constraint;
- unauthorized object;
- destructive requirement;
- ambiguous ownership;
- mismatch with the Structural Contract;

the operation must stop.

The discrepancy must be recorded as evidence before any further decision.

No silent repair is permitted.

---

## 16. FINAL BOUNDED AUTHORITY STATE

`BOUNDED_AUTHORITY = DEFINED`

`AUTHORITY_SCOPE = vip_clinic.public.clinic_days`

`PATIENT_FOUNDATION = PROTECTED`

`OTHER_DATABASES = OUT_OF_SCOPE`

`OTHER_TABLES = OUT_OF_SCOPE`

`CASE_AUTHORITY = NOT_GRANTED`

`VISIT_AUTHORITY = NOT_GRANTED`

`SQL_IMPLEMENTATION_AUTHORIZATION = NOT_GRANTED_BY_THIS_ARTIFACT`

`MIGRATION_IMPLEMENTATION_AUTHORIZATION = NOT_GRANTED_BY_THIS_ARTIFACT`

`LIVE_RECONCILIATION = REQUIRED_BEFORE_IMPLEMENTATION`

`PRODUCTION_AUTHORIZATION = NONE`

`FAIL = 0`

---

**END OF BOUNDED AUTHORITY**
