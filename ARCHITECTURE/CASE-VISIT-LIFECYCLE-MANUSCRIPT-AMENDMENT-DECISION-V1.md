# Case / Visit lifecycle — owner amendment decision V1

OWNER = MOHAMED.K_ROBY
AUTHORIZATION_DATE = 2026-10-13 / Africa/Cairo
AUTHORITY = EXPLICIT OWNER DIRECTIVE: AUTHORIZED MANUSCRIPT AMENDMENT & ENGINEERING PRESERVATION
PRODUCT_MODEL = OWNER APPROVED
MANUSCRIPT_AMENDMENT = APPLIED EXACTLY
RUNTIME_COMPLIANCE = NOT ESTABLISHED BY THIS RECORD
NEXT_CLINICAL_POSTGRESQL_IMPLEMENTATION = NOT AUTHORIZED

## 1. Exact owner grant and source

The owner's current directive §2 approves the complete wording in CASE-VISIT-LIFECYCLE-MANUSCRIPT-AMENDMENT-PROPOSAL-V1.md: the specified paragraph in §5 and complete §13 replacement only. It authorizes downstream bounded contract reconciliation and recovery/test/Git preservation; §9 requires STOP before the next Case/Visit PostgreSQL build. Local commits and a verified safe isolated-branch push are permitted; protected branch merges, PRs, deployment, production/owner data or credential changes are not.

Prior Manuscript: ARCHITECTURE/MANUSCRIPT/DR-ROBY-CLINIC-PRODUCT-MANUSCRIPT.md at b72192aed65f810b794f6d69b8e49c18622a3945. Prior bytes SHA-256: 3459294cbe575a07b9dc98423b94aa8860e981d831ac2d829491993bbf5eca49. Approved amended bytes SHA-256: 3c0daf1f212d4bbca8eaaee0b3d1efa38eac03aac12789da815d4db3829be1be.

## 2. Applied scope and rationale

Replaced only the paragraph beginning “Each patient arrival” in §5, and only the section beginning “## 13.” through immediately before “## 14.”. The replacement matches the complete approved proposal, without paraphrase. Inverting those two replacements reproduces the prior file byte for byte. All other sections, including historical §17/§18 chronology, remain unchanged.

The Doctor may administratively reopen a longitudinal Case before arrival. Such a Case is OPEN without a current Visit; no arrival, queue, encounter, exit, Clinic Day or Visit-count fact may be fabricated. Case lifecycle and Visit progression are therefore distinct. Default completion finality is qualified only by explicit Doctor Policy B reopening for the same complaint within inclusive Day0…Day90 in Africa/Cairo, anchored to actual completion event. Historical seals, signatures and records remain intact.

## 3. Downstream authority and preservation

Effective bounded definitions are CASE-LIFECYCLE-POLICY-B-CONTROLLED-AMENDMENT-V2.md and CASE-LIFECYCLE-POLICY-B-RECONCILIATION-V2.md. Their exact supersession map qualifies legacy Case-state ownership/finality and current-only completion representation. It does not rewrite old CLOSED/PROVEN contracts, historical domain source, audits, authority maps, original clinic, Golden fixtures/manifests/source captures/evidence or owner-local protected files.

Historical §17/§18 statements retain chronology; they do not cancel this separately registered owner-approved product amendment. No claim is made that missing historical authority commits have become recoverable. The current explicit owner grant is the authority for this amendment and preservation operation.

## 4. Proof and implementation boundary

An exact-text/documentary check proves only the amendment/preservation scope. Unit/DOM/fake-SQL tests prove only their named development behavior. They do not prove actual clinical state transitions, PostgreSQL transactions, browser acceptance, recovery or clinical readiness. The pure calendar helper is not a reopening service. The registration browser marker is not a server idempotency receipt.

No Case/Visit tables, clinical migrations, lifecycle repositories/services/endpoints or production UI wiring may be built under this directive. Remaining clinical guards stay explicit decision gates. Separate owner authorization and verified disposable infrastructure are required for the next bounded implementation slice. Evidence of Gates A–E is registered separately after execution; no automatic CLOSED + PROVEN runtime promotion.
