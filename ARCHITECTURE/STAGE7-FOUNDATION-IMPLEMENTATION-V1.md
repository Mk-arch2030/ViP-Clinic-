# Stage 7 foundation — bounded implementation V1

Owner: MOHAMED.K_ROBY. Authority: Stage 7 Controlled Execution Directive,
2026-10-13. Baseline: ccc13cb52c208ce6f9bd09e76e46d29ff7d1a876.
Status: IMPLEMENTED STRUCTURAL SOURCE / REAL POSTGRESQL ACCEPTANCE NOT PROVEN.
This is not clinical release, Stage 7 closure, or permission to publish a branch.

## Authority and chronology

Manuscript §§5/13 and CASE-LIFECYCLE-POLICY-B-RECONCILIATION-V2.md govern the
independent lifecycle. CONTRACTS/CASE-LIFECYCLE-POLICY-B-CONTROLLED-AMENDMENT-V2.md
defines current facts, recording, receipts, locking and remaining gates. The new
owner directive grants bounded implementation that those historical documents
explicitly deferred. Their earlier NOT AUTHORIZED statements remain historical;
no original document or proof is edited. CONTRACT-01 §§3–7, CONTRACT-02 §§4–6 and
Start amendment, CONTRACT-03 §§3–8, CONTRACT-05 §§2–13 and CONTRACT-08 §7 remain
binding within the V2 supersession map. PERSISTENCE-SCHEMA-DEFINITION-V1.md §§6/8
and PERSISTENCE-PHYSICAL-STRUCTURAL-DEFINITION-V1.md §§7/8 supply Visit condition,
type and protection values. No new clinical content defaults are selected.

## Implemented boundary

Migration 002 is additive reviewed source, NOT executed or startup-connected.
It creates only vip_clinical.cases, visits, lifecycle_facts and operation_receipts.
Case/Visit UUIDs are distinct from stable Patient UUID/CPN; Clinic Day uses the
existing TEXT key. No replacement Patient store, CPN allocation, opening Day,
arrival timestamp, queue entry or counter is created by a Case structure.

Case OPEN/COMPLETED is independent of Visit operational/protection values.
Version zero represents creation without a lifecycle event; completion/reopening
increments the lifecycle version, preserving independent seals. Odd/even version
constraints express only the alternating COMPLETED/REOPENED event sequence, not
encounter progression. Versions are bounded positive PostgreSQL integers;
overflow must reject before any future effect, never wrap.

Facts preserve actor UUID, real instant, Cairo date, transition, episode link,
operation and canonical fingerprint. FK/uniqueness constraints bind Case/version,
prevent duplicate episode consumption and keep current state tied to a fact.
Statement triggers reject UPDATE/DELETE/TRUNCATE on facts and receipts. These
are bounded history protections, not a generic audit platform. Database owners
can bypass database protections; deployment must later grant a non-owner runtime
role only its reviewed privileges. No grants or credentials are created here.

The migration is a structural foundation, not complete executable enforcement:
Doctor authority, latest unmatched episode, fresh server time, full Case/receipt
cross-consistency, open-Day locking and transaction atomicity still require the
secured application service and real database proof. No application writes are
exposed against these incomplete boundaries. A schema constraint is never a
substitute for current-session authorization.

clinical-foundation.js validates complete ordered lifecycle evidence and current
state consistency, latest episode and historical calendar eligibility. It does
not authenticate a supplied actor or establish that caller evidence is trusted.
It accepts normalized database timestamps and refuses fabricated/missing facts.
Its fingerprint format explicitly binds kind, version and canonical request
meaning. Only CASE_CREATE and CASE_REOPEN intent shapes are currently defined;
completion/recording requests are not invented while policies remain gated.
Receipt comparison is pure: reauthorize before use; absent receipt is UNKNOWN;
changed meaning conflicts; same meaning returns a detached original result.

clinical-read-repository.js accepts the existing transaction client, never a pool
fallback and never COMMIT. It derives Patient ownership through Case, uses bound
parameters and stable chronological UUID tie-breaks. Its Visit read is only the
structural encounter index, NOT complete Clinical History content. There are no
new API routes, authorization capability grants, UI controls or browser metadata.

## Future service integration requirements

Reuse AuthRepository.transaction and its auth serialization. Authenticate and
authorize a NEW clinical capability; do not reuse PATIENT_REGISTER/RETRIEVE.
Validate origin/CSRF/session, lock Case, evaluate current trusted evidence, bind
operation actor/UUID, and commit effect plus receipt on that same client.
Use Day-before-Case locks when recording; administrative Case actions require no
Day. Receipt replay must reauthorize and return the original result even after
later state/Day/calendar changes. Lost COMMIT response remains UNKNOWN until
same-intent reconciliation. No new operation ID solely because of a timeout.

## Four clinical decision gates — recommendations, not approvals

| Gate / exact contract basis | Alternatives and consequences | Recommendation / execution boundary |
|---|---|---|
| Completion with active Visit or zero Visits; V2 Lifecycle operations and Remaining clinical gates; CONTRACT-03 §8, CONTRACT-05 §9 | Permit independent completion in either context, or require at least one exited Visit and no active Visit. The first needs explicit handling of clinical content still underway; the second leaves unused administrative Cases open. | Initially require a recorded, exited Visit and no active Visit. Owner must decide both questions; completion command is absent until then. Do not silently convert unused Cases into completed Cases. |
| Active Day / overnight; CONTRACT-02 §§2/5 and Start amendment; V2 Visit durable boundary | One clinic-wide OPEN Day carried past midnight until explicit closure, versus multiple selectable open working dates. Multiple Days increase ambiguity and locking complexity. | One OPEN working Day, no automatic midnight closure; explicit reviewed working-date selection after closure. Owner approval required; no Visit recording implementation. Existing getCurrentClinicDay ordering is not an approved selection policy. |
| Simultaneous / same-day Visits; CONTRACT-01 §4, CONTRACT-05 §10, CONTRACT-08 §7; V2 remaining gates | One active Visit per Patient with explicit same-day repeat after Exit, versus one per Case or concurrent encounters. Per-Case permits simultaneous encounters for the same person. Historical later-Day wording needs explicit qualification if same-day repeats are permitted. | One active Visit per Patient; same-day repeat only after Exit and explicit Doctor initiation. Owner must choose. No unique index silently decides this policy and no recording command is exposed. |
| Nurse recording/Exit; CONTRACT-03 §§4–6, CONTRACT-05 §12; V2 normative recording rules | Doctor-only initial implementation, versus separately enumerated Nurse capabilities with current delegation. The latter requires revocation/mode tests and must not transfer clinical linkage/Rx/completion authority. | Doctor-only first runtime slice; add Nurse operational commands only after an exact delegated matrix is approved. No Nurse capability enabled here. |

## Migration, rollback and stop conditions

No environment URL is inspected or used. No database is connected. Run migration
only after provenance confirms a newly created disposable database with synthetic
schema prerequisites; schema.sql depends on PostgreSQL uuidv7 availability.
Apply 002 once using ON_ERROR_STOP. Existing vip_clinical schema is a collision:
stop and inspect; no IF NOT EXISTS masking, destructive repair or fixture copying.

The down script locks all four tables, refuses any rows, and removes only the
new empty objects without CASCADE. It is source, not executed proof. With any
data, preserve it and disable application wiring; never drop history to roll back.
Backup/restore and populated recovery require real PG acceptance before runtime.
Golden V1, its manifests/evidence, existing patient/history/actors/Day tables,
Manuscript, original UI, historical domain modules and Standalone remain unchanged.

## Evidence boundaries and next increment

The new unit tests verify evidence rejection, repeated episode preservation,
calendar-bound history, canonical meaning and replay comparison. The read-adapter
test uses an explicitly fake query client; it proves query construction only.
No SQL parser/engine, FK/trigger execution, transaction rollback, real lock race,
backup/restore, HTTP auth or real browser acceptance is claimed by these tests.
No test skips or new runner exclusions are introduced. Historical P37A stays the
single official exclusion. New tests must be indexed before the tracked runner.

Next: prove migration/up/down and immutable graph constraints in disposable real
PostgreSQL; then implement authenticated Doctor CASE_CREATE + durable receipt as
the first independent service slice. It needs no Visit/Day clinical decisions.
Completion/recording remain blocked on the four decisions. UI follows proven API
and persistence. Remote Stage 7 publication needs separate owner authorization.
