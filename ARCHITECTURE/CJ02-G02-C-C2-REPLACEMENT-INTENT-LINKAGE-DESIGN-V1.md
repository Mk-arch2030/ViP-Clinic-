# CJ02-G02-C/C2 — Replacement Intent Linkage Design V1

**Factory:** RobY_BoT_FactorY  
**Product:** ViP Clinic  
**Owner:** MOHAMED.K_ROBY  
**Date:** 2026-11-04  
**Status:** DESIGN PROPOSAL — C2 FOUNDER DECISION PENDING  
**Scope:** Architecture documentation only; no code, SQL, migration, database execution, tests, merge, deployment or clinical release.

## 1. Verified governing decisions

- G02-A A1: Doctor authorizes Patient and Case problem summary, Visit details later.
- G02-A A2: changing Patient/problem requires revoking old pending intent and issuing a new distinct Doctor decision and operation identity; old approved meaning is never edited.
- G02-B B2: Clinic Day is bound to first Visit at registration, not to the original Doctor intent.
- G02-C C1-A: Doctor must select a structured revocation reason; free-text clinical explanation is not mandatory. **Exact reason codes remain unapproved.**
- G02-C design draft: replacement predecessor linkage was an optional proposal, not Founder-approved.

## 2. Design question

When a Doctor issues a fresh FirstRegistrationIntent **as an explicit replacement** for a previously revoked intent, should the new intent carry a reference to the prior revoked intent for authorized historical audit?

The link is historical provenance, not permission to reuse a clinical decision.

## 3. Alternatives

**C2-A — Optional, explicit, auditable predecessor link (RECOMMENDED):** A replacement intent may store `replaces_intent_id` referring to one earlier REVOKED intent. Only an authenticated authorized Doctor replacement action may create this link. An unrelated new intent has no predecessor. The old record remains unchanged.

**C2-B — No direct link:** Old and new intents remain separate and can be reconciled by authorized audit search; no first-class predecessor reference. Simpler structure, weaker direct traceability.

**C2-C — Mandatory link for every new intent:** Not recommended; first-ever intent has no predecessor and unrelated decisions should not be forced into a replacement chain.

## 4. Candidate C2-A invariants — NOT YET APPROVED

1. Link points from **new** intent to **existing REVOKED** predecessor; original intent and original revocation event are immutable.
2. New intent has fresh `intent_id`, Doctor operation identity and meaning fingerprint. Link never transfers old Doctor authorization or old Visit/Case outcome.
3. No link to PENDING or CONSUMED predecessor. An uncertain old consumption outcome requires authoritative recovery first.
4. Validate predecessor belongs to the same authorized clinic scope and is accessible to the acting Doctor. Exact cross-Doctor replacement authority is still G02-C/C5.
5. **Patient change:** G02-A A2 allows a changed Patient after revoke-and-reissue. Therefore a same-patient-only link rule would contradict the approved policy. Cross-patient replacement must be separately protected by strict Doctor authorization, minimal disclosure and audit; it must not silently copy clinical data from predecessor.
6. Link is immutable and single-predecessor per replacement. Multiple successors or forks should be explicitly prevented or governed; recommend at most one committed replacement successor per revoked predecessor, subject to concurrency and recovery proof.
7. Prevent self-links, cycles and stale/forged predecessor IDs. With only one predecessor per new intent, acyclic chronological lineage should be enforced.
8. A revoked replacement may itself be replaced, yielding a chain: `I1(REVOKED) <- I2(REVOKED) <- I3(PENDING)`. No historical record is overwritten.
9. Revocation reason and replacement link are distinct facts. A reason code alone does not establish a successor, and a link alone does not prove that the predecessor was properly revoked.
10. A Clinic Day change alone does not create a replacement link or require intent revocation (B2).
11. Link creation has no Case, Visit, Day, arrival, or counter side effects.
12. Authenticated recovery must show original and successor identities consistently; never invent a successor after timeout or a missing receipt.

## 5. Illustrative audit sequence (not executed)

```text
I-101  Doctor authorizes Patient P-1 / Problem X
  |
  +-- Doctor selects approved structured reason; I-101 -> REVOKED
  |
I-102  New Doctor decision: Patient P-1 / Problem Y
       replaces_intent_id = I-101
       I-102 -> PENDING

I-101 remains historically readable to authorized audit actors.
I-102 is a new decision, not an edit or revival of I-101.
```

If Patient changes, any predecessor link must be subject to additional privacy/authorization review; no automatic Patient identity carryover.

## 6. Outstanding engineering questions

- **C2-01:** Optional versus mandatory link for an explicit replacement operation; whether standalone new intent can omit it.
- **C2-02:** One-successor uniqueness, retries, and whether a revoked successor can later be replaced in a chain.
- **C2-03:** Exact Doctor ownership/clinic scope and cross-patient privacy checks.
- **C2-04:** Link identity in new-intent creation fingerprint and idempotency; do not allow a same-key replay to silently change predecessor.
- **C2-05:** Immutable audit representation, authorized visibility, and historical retention.
- **C2-06:** Transaction race between revocation and replacement; only durably REVOKED predecessor qualifies.
- **C2-07:** Exact schema compatibility and non-interference with legacy CASE_CREATE receipts.

## 7. Future proof matrix — NOT EXECUTED

- New intent without replacement link remains valid.
- Explicit replacement points to exactly one durably revoked predecessor.
- Pending/consumed/unknown predecessor cannot be linked as revoked.
- Doctor unauthorized for predecessor cannot link or disclose it.
- Patient changed replacement does not copy old clinical meaning.
- Self-link, cycle, duplicate successor and conflicting replay denied.
- Chain of multiple revoked replacements preserves all nodes.
- Replaying a new-intent operation with changed predecessor conflicts.
- No Case/Visit/Day/counter side effects.
- Legacy CASE_CREATE and its receipt unchanged.

## 8. Founder decision requested

**C2-A (recommended):** Optional, explicit, immutable link from replacement intent to revoked predecessor, with Doctor authority and audit guards.

**C2-B:** No direct predecessor link; independent intent records.

**C2-C:** Mandatory predecessor linkage for every intent (not recommended).

## 9. Gate register

```text
G02_C_C2 = DESIGN_DOCUMENTED / FOUNDER_DECISION_PENDING
G02_C_C1_A = FOUNDER_APPROVED
G02_A_A1_A2 = FOUNDER_APPROVED
G02_B_B2 = FOUNDER_APPROVED
C2_TECHNICAL_SCHEMA_AND_PROOF = NOT_EXECUTED
G02_C_FULL_GATE_CLOSED = NO
SOURCE_CODE_WRITES = NONE
DATABASE_OR_MIGRATION_EXECUTION = NONE
TESTS_EXECUTED = NONE
MAIN_MERGE = NONE
CLINICAL_RELEASE = NONE
```

MANUSCRIPT IS AUTHORITY. CONTRACTS AUTHORIZE. PROOF VALIDATES. GIT PRESERVES. MOHAMED.K_ROBY DECIDES.
