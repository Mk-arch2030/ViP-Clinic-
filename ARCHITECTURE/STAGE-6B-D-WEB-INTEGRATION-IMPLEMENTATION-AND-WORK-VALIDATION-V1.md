# Stage 6-B–D — Web Integration Implementation and Work Validation V1

OWNER: MOHAMED.K_ROBY  
SOURCE_BASELINE: 8f01ae8cb0e238d71b54887785ae7c8e972268c2  
OWNER_AUTHORIZATION: EXPLICIT_CHAT_ADOPTION_OF_6B_THROUGH_6D_AND_START_IMPLEMENTATION  
STATUS: IMPLEMENTED_AND_WORK_TESTED_FOR_RECORDED_PATHS  
ACTUAL_INFINIX_BROWSER_AND_STAGE6_POSTGRESQL_PROOF: NOT_EXECUTED  
DEVICE_CERTIFICATE_TRUST_AND_DATABASE_PREPARATION: NOT_EXECUTED  
PRODUCTION_DEPLOYMENT_AND_CLINICAL_USE: NOT_GRANTED  
DECISION_E_CLEANUP: NOT_AUTHORIZED

## Authority and scope

The owner adopted the [Stage 6-A decision package](./STAGE-6A-BOUNDED-WEB-INTEGRATION-DECISION-PACKAGE-V1.md)
and explicitly authorized implementing 6-B–D. This later grant covers the source
increment and its tests; earlier proposal-state wording remains historical.
It does not authorize Android certificate trust changes, Stage 6 database
preparation, its real PostgreSQL/browser listener execution, production or
clinical use. Those follow 6-E/F's concrete bounded device execution decisions.

The code follows the [design](./STAGE-6A-WEB-AUTHENTICATION-AND-PATIENT-ADAPTER-DESIGN-V1.md)
and [source reconciliation](./STAGE-6A-WEB-INTEGRATION-SOURCE-RECONCILIATION-V1.md).
The delivered entry is a basic synthetic integration screen, not a replacement
for the full clinic demo or longitudinal dossier.

## Delivered behavior

6-B supplies strict basic Patient/registration mapping, a fixed-origin relative
Fetch adapter and a memory-only session coordinator. HTTPS expected origin,
safe response schemas and status/content type are checked; raw cookie/Set-Cookie,
localStorage role, arbitrary API URLs and extra clinical/authority payloads are
not used. Network/HTTP failures have bounded messages without response diagnostics.

Fresh entry/reopen/focus resolves server session before protected actions.
Login requires session bootstrap after success. 401 clears identity/CSRF/Patient;
403 retains identity but blocks mutations pending explicit reconciliation;
404 clears a prior lookup without logout or mock fallback.
Generation checks and cancellation discard delayed GET results after logout or
relogin. A pending mutation cannot be canceled via logout/recheck to imply rollback.

POST response loss produces outcome-unknown, never automatic retry. During the
current page lifetime even a successful session recheck does not unblock another
registration after that uncertainty. This is not server idempotency or a durable
cross-reload duplicate-prevention guarantee. Determining an uncertain insert
remains a deliberate evidence review; no reset/force-retry control is exposed.

Logout hides protected data immediately but only claims revocation after 204 or
confirmed invalid session. Failed logout stays unconfirmed, blocks login and
requires explicit server reconciliation. No periodic session keepalive is added.

6-C provides a separate React entry and independent stylesheet. It displays
server identity, login/logout, basic five-field Doctor registration, technical
UUID retrieval and a limited basic Patient result. Nurse Patient actions are
disabled for usability; the server still independently authorizes requests.
No clinicStore, seed data, local CPN allocation, Past History stripping, Case/
Visit counts or fabricated registration metadata enters this path.

6-D provides a separate import-safe HTTPS runtime builder/start API and build
configuration. Import creates no listener/pool. Build verifies explicit
certificate/key/current validity/IP SAN and bounded hash-approved regular build
assets; it does not connect/listen. Owned resources close on build failure or
normal shutdown, caller-owned pools remain caller-owned.
The runtime serves only approved assets and the existing secured composition.
Wrong Host, traversal/source/config/key paths and API-as-SPA fallback reject.
Responses are no-store with nosniff and a same-origin CSP; no unsecured composition
is installed, forwarded role/identity is not trusted and logger is disabled.

The explicit future start API requires a token, full source/build HEAD, committed
critical source bytes, existing isolated PG18 Unix-only cluster identity, a new
roby_web_proof_stage6 database and a matching proof manifest. It never creates,
resets or drops that database and binds only 127.0.0.1:3443.
No automatic CLI startup or default route enablement is introduced.

## Integration-specific expiry recovery

Existing Stage 5 login validates a presented prior cookie before rotating it.
A cookie may outlive server idle expiry and cannot be cleared by JavaScript
because it is HttpOnly. Without a server clear, bootstrap 401 followed by login
would keep presenting invalid prior material.

The separate Stage 6 runtime therefore clears the same protected cookie on 401
from /auth/session or /auth/logout. A failed password login does not clear a valid
cookie, and 503 does not claim revocation. This is transport recovery in the new
runtime; existing Stage 5 shared source is unchanged. Tests verify both sides.

## Work execution evidence

Validation used Node v24.19.0 and the repository-locked versions in a temporary
dependency directory outside repository source:
React/React DOM 19.3.0, Vite 8.3.2, TypeScript 7.0.2, Fastify 5.12.5,
pg 8.23.1, tsx 4.23.15; @types/react/react-dom 19.3.0 and @types/node 22.20.5.

- Combined new integration/runtime and existing Actor/auth selection: 90/90
  tests passed, 0 failures (25 new tests plus 65 prior tests).
- Existing npm run test:active: 52/52 passed, 0 failures.
- Strict targeted TypeScript noEmit check for new TS/TSX, tests and build config:
  passed. This is not a claimed fresh whole-repository type-check.
- Separate Vite production build: passed, 19 modules transformed; output stayed
  in ../vip-stage6-build, not ordinary dist; no source maps.
- New CJS runtime syntax check passed.
- Source review found no clinicStore/storage/unsafe HTML or TLS-disable path in
  the new integration/runtime implementation.

The runtime tests generate temporary synthetic certificate/key material and use
real short-lived loopback HTTPS listeners on ephemeral ports with fake auth.
Node clients explicitly trust the test certificate and still validate its IP;
no TLS validation bypass is used. These owned test listeners and temporary
test files are closed/removed by the tests. They are not an Android trust-store
change, production listener or PostgreSQL proof.

Actual Infinix browser cookie acceptance/HttpOnly/reopen/cross-tab behavior,
device certificate trust and the Stage 6 database integration remain unexecuted.
UI is built/type-checked; no claim of an executed real-browser component journey
is made. Unit/Node TLS evidence does not complete 6-F's W01–W16 matrix.

## Exact Git preservation scope

Twelve new authorized source/test/build files:
- src/integration/basic-patient.ts
- src/integration/web-api-client.ts
- src/integration/web-api-client.test.ts
- src/integration/session-coordinator.ts
- src/integration/session-coordinator.test.ts
- src/integration/Stage6IntegrationApp.tsx
- src/integration/main.tsx
- src/integration/integration.css
- stage6-integration.html
- vite.stage6.config.ts
- backend/api/stage6-web-test-runtime.cjs
- backend/api/stage6-web-test-runtime.test.cjs

The thirteenth new file is this implementation/validation record.
No existing source, stylesheet, package/lockfile, base/auth SQL, runtime,
controller, clinicStore, protected path, README or historical contract is changed.
Build outputs, keys, certificates, temporary dependencies and synthetic secrets
are not committed.

Work reads committed source; protected Android bytes/status remain device-owned
evidence, not independently inspected here. Safe download must snapshot protected
paths, all existing worktree diff/status and untracked bytes, stage nothing,
review exact additions/collisions and verify fetched HEAD/content.

## Next bounded gate

Prepare 6-E's exact source/build manifest, existing-device preflight, unused
loopback port check, trusted certificate procedure and independent fresh
synthetic database decision. Do not run startStage6WebTestRuntime against the
Stage 5 database or reinterpret its manifest after this source commit.
Do not stop/restart Vite or PostgreSQL, reset prior proof databases, trust a
certificate without its reviewed scope or rerun the one-shot Stage 5 proof.

Useful source-validation commands after guarded sync and an explicit test scope:

~~~bash
node --import tsx --test src/integration/web-api-client.test.ts src/integration/session-coordinator.test.ts backend/api/stage6-web-test-runtime.test.cjs
npm run test:active
npx --no-install vite build --config vite.stage6.config.ts
~~~

Runtime tests require openssl and start only their own ephemeral fake-auth TLS
listeners. Building writes only the separate output directory and preserves old
contents; an execution package must bind the chosen fresh outputs/hashes to the
tested source HEAD before serving them. The Vite manifest is not itself the
SHA256-approved asset map accepted by the runtime.

**ROBY FACTORY — source implemented, proof scoped, device gate explicit.**
