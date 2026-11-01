# CJ-01 authorization increment and decision gates

Baseline: 75048590fdcbdc31f2662066a196e5d7b20ac233.
Branch: work/clinical-journey-visit-history. Date: 2026-10-28.
Owner's CJ-01 Founder Review authorizes the explicit grant and forward-only
migration. Implementation is not acceptance. No push, merge or release.

## Implemented boundary

Authorization recognizes VISIT_START but requires explicit membership for
Nurse in FULL as well as LIMITED, with the existing active grantor, identity,
mode and current session checks. CASE_CREATE remains Doctor Only.
Migration 003 extends the existing named PostgreSQL CHECK constraint inside
one transaction. It performs no grant UPDATE, backfill or deletion. It fails
if the expected constraint is absent. Historical schema and migrations are
unchanged. This is source only: no migration was executed here. A forward-only
migration has no automatic down/reset path.
No Visit endpoint/service or browser command is enabled by this increment.

## Remaining founder decisions — no implementation of these proposals

1. Doctor confirmation evidence: migration 002 has type_confirmed_by on a
   Visit but no pre-Visit durable confirmation. Proposed minimal new relation:
   confirmation UUID, Case FK, Doctor FK, server timestamp, visit type,
   intended Visit ordinal and durable operation identity; immutable and
   consumed at most once through a unique Visit reference. Authenticated
   Doctor command records it; Nurse cannot supply a Doctor UUID as proof.
   Scope/binding (ordinal, Day, lifetime and revocation) must be reviewed before
   schema/API work. No such relation or command has been created.
2. Working date and repeated/concurrent Visits: Policy B V2 'Remaining clinical
   gates' still reserves active-Day/overnight and simultaneous/same-day rules.
   CONTRACT-02 says Day does not close merely at midnight. Equating working_date
   with today's Cairo date would invent a restriction. Founder must specify
   valid working-day selection/overnight behavior and repeated Visit policy.
3. History access for Nurse: current outer gate admits Doctor only. A Nurse
   browser journey and patient-scoped clinical read permission need a bounded
   authority/UI decision; VISIT_START alone must not silently grant all history
   access or CASE_CREATE. Existing Doctor gate has not been weakened.

No time-based delegation expiry added. Session expiry and grant removal are
covered; no claim of a nonexistent delegation expiry timestamp.

## Proof and limitations

Focused tests use the existing memory auth store and pure authorization;
not PostgreSQL proof. PostgreSQL and Chromium tooling are not available in
this Work environment; no connection to Termux was attempted. Database writes=0.
Migration acceptance still needs a fresh verified disposable database: apply
historical schemas then 003; compare preexisting grant rows, accept explicit
VISIT_START storage, reject unknown capability, prove old FULL cannot start,
and preserve CASE_CREATE denial. No automatic migration at startup.
WebDriver/real browser/Visit persistence and history UI acceptance NOT RUN.

First focused and regression attempts failed because the new test passed
undefined to a helper parameter defaulting to the valid token. This did not
exercise missing authentication. Corrected test passes an empty token; no
production assertion weakened. Initial regression: 342 pass / 1 fail / 343.
Historical exclusion remains src/services/clinic-authority-p37a.test.ts.

Final Work execution: Node v24.22.1, npm 11.9.0.
- node --test backend/auth/visit-start-authorization.test.cjs backend/auth/auth-service.test.js: 30/30, exit 0.
- npm run test:all: 343/343, zero failures/skips, exit 0; new test staged for tracked-file discovery.
- npm run lint: exit 0.
- npm run build: exit 0.
Logs and SHA256SUMS: evidence/cj01-authorization/.
The 30 focused tests are included in 343, not additional totals.
Warnings retained in logs; no runtime/PG/browser PASS inferred.

Diff validation initially flagged a trailing blank line in the TypeScript log;
only that trailing blank line was removed in the delivery copy. Original log
remains at /tmp/cj01-types-final.log. Final diff check passes.
