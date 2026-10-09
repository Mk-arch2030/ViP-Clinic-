# Retrieve Existing Patient — Isolated PostgreSQL GET Runtime Proof Milestone V1

STATUS: BOUNDED_TEST_PROOF_PASSED
SCOPE: GET /patients/:patientId in a GET-only Fastify test composition
PRODUCTION_GET_AUTHORITY: NOT_GRANTED
CLINICAL_AUTHORITY: NOT_GRANTED
HISTORICAL_CLUSTER: PROTECTED

## Authority and isolation

The owner separately authorized bounded Decisions A, B, C, and D.
The historical PostgreSQL cluster was excluded from execution.
A new PostgreSQL 18 test cluster was created under
$HOME/vip-retrieve-proof-isolated/data, using an isolated Unix socket
and port 55439 with TCP listening disabled.

Test database: roby_retrieve_proof_c
Synthetic patient ID: 55555555-5555-4555-8555-555555555555
Synthetic clinic patient number: CPN-9001
Synthetic date of birth: 1990-02-01

This synthetic fixture is distinct from preserved P4 UI mock data and A06
historical test fixtures.

## Evidence received from Termux

Decision A: GET-only fake-client test harness, 3/3 PASS.
Decision B: isolated PostgreSQL cluster started and identity verified.
Decision C: schema applied; exactly one synthetic patient inserted.
Decision D: real PostgreSQL connection through PatientRepository and
retrieveExistingPatientController in GET-only Fastify injection.

Decision D observed:
- DATABASE_IDENTITY=PASS
- BASELINE=VERIFIED
- HTTP_FOUND_200=PASS
- HTTP_MISSING_404=PASS
- POST_GET_DATA_AND_SEQUENCE_PRESERVATION=PASS
- POST_ROUTE_ABSENT=PASS
- REAL_POSTGRESQL_GET_PROOF=PASS_FOR_TESTED_PATHS
- Final patient row count: 1
- Final sequence state: last_value=1, is_called=false

External proof runner (not committed):
$HOME/vip-retrieve-proof-isolated/decision-d-get-proof.cjs

External proof runner SHA256:
3e34e6b0c5a792e6ada9816a54c06410f648c4f8a428e7ae182ecc4014b92eca

## Boundaries

The evidence is for an isolated, nonproduction database and Fastify's
in-process HTTP injection path. It does not prove production route
registration, production deployment, network-facing HTTP operation,
clinical readiness, or mutation-freedom beyond the compared data and
sequence state. The protected historical cluster was not independently
reinspected after Decision D.

The isolated cluster remains running. Cleanup Decision E is not granted.
No production code changes are authorized by this milestone.

## Git preservation scope

Only this milestone, the isolated execution plan, the bounded authority
decision draft, and the GET-only harness are candidates for review.
Pre-existing unrelated dirty files remain excluded.

## Post-draft bounded authorization and proof reconciliation

The authority-decision document above was originally written as a draft,
before the owner granted separate, specific chat authorizations for Decisions
A, B, C, and D. Its NOT_GRANTED and NOT_ESTABLISHED declarations are
preserved as historical draft-state statements, not silently rewritten.

Subsequently, the owner explicitly authorized:
- Decision A: isolated GET-only test-harness implementation.
- Decision B: creation and startup of an independent PostgreSQL test cluster.
- Decision C: synthetic database schema and fixture preparation in that cluster.
- Decision D: bounded real-PostgreSQL GET runtime testing through Fastify
  injection, controller, service, and repository, including 200/404 and
  before/after patient-row and CPN-sequence comparison.

Termux outputs reported the bounded tests passed. The result establishes
proof for the tested nonproduction paths only. It does not grant production
GET registration, deployment, clinical authority, or cleanup authorization.

This milestone records observed execution evidence and the owner's later
bounded chat authorizations. It does not retroactively convert the original
draft into a blanket implementation or execution authority.
