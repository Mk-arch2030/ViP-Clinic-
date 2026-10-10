# Stage 6-A — Web Authentication and Patient Adapter Design V1

OWNER: MOHAMED.K_ROBY  
SOURCE_BASELINE: adc46f5502d46699748fc3cc81c2e4afda3d57e3  
STATUS: PROPOSAL_FOR_BOUNDED_IMPLEMENTATION_AND_EXECUTION_DECISIONS  
CURRENT_CHANGE: DOCUMENTATION_ONLY  
BROWSER_OR_TLS_PROOF: NOT_EXECUTED  
PRODUCTION_DEPLOYMENT_AND_CLINICAL_USE: NOT_GRANTED

## 1. Target and source reconciliation

Follow the [source review](./STAGE-6A-WEB-INTEGRATION-SOURCE-RECONCILIATION-V1.md).
Prove actual browser → HTTPS → existing secured Fastify composition →
auth service/repository → independent synthetic PostgreSQL data.
The initial screen supports login/session/logout, basic Doctor registration and
technical UUID retrieval. It displays Nurse identity but patient operations stay
denied. No role-selection input or stored demo role becomes server authority.

The existing Vite clinic demo remains separate. Do not replace its registration
or dossier with the smaller backend DTO, drop Past History, copy seeded CPNs,
allocate CPN in the browser or create local Case/Visit/day records from API success.

## 2. Proposed transport

Select a same-origin loopback HTTPS test runtime serving an independently built
React integration entry and the existing /auth/* and /patients routes. Candidate
origin is https://127.0.0.1:3443; bind only 127.0.0.1. The port is a proposal:
verify it is unused before a separately authorized start; never stop its owner
or silently choose another origin. Do not change the running port-3000 Vite.

The test runtime owns the HTTPS listener and bounded pool; importing/building
modules does not connect or listen. Explicit start validates source HEAD,
database/cluster identity, build bytes, matching certificate/key and fixed
origin. Failure closes only resources it created, not Vite or PostgreSQL.
Expose no alternative unsecured patient composition. No trustProxy or forwarded
identity/role trust is added. API errors remain JSON; static SPA fallback never
swallows API 401/403/404. Serve only the approved build asset allowlist, with
path traversal/symlink/source/config/key exposure rejected.

Preserve __Host-vip_session; Secure; HttpOnly; SameSite=Strict; Path=/; no Domain.
Do not switch cookie names/attributes for HTTP. Stage 5 already requires an
HTTPS trustedOrigin. Existing http://localhost:3000 remains the demo boundary.
Plain HTTP is a negative transport test: the integration client refuses credential
submission before fetch, and the authenticated test server has no plaintext
entry. A localhost cookie exception is not a production TLS proof.

A local certificate must contain the chosen IP SAN and become trusted through a
reviewed device-specific procedure. Its key/CA material remains outside Git and
the frontend build. No ignoreHTTPSErrors, NODE_TLS_REJECT_UNAUTHORIZED=0, browser
security bypass, certificate-warning click-through or public tunnel is accepted
as proof. Certificate generation and Android trust installation are separate
execution decisions after their exact method/scope is known. If genuine trust
cannot be established on the device, block that proof gate and review alternatives.

Cookies are host-scoped, not port-scoped. A different port alone is not a cookie
security boundary; select/review the host and other services on it deliberately.
Same-origin controls do not claim XSS resistance. Private response bodies are
no-store, no service-worker/offline cache is introduced, and rendered Patient
strings use React text escaping.

## 3. Browser adapter and session state

Use fixed relative route paths with credentials: same-origin, cache: no-store
and redirect: error. Require HTTPS and the expected origin before credential
entry. Never accept arbitrary API base URLs from a query string or localStorage,
never set Cookie/Origin headers in browser code, and never inspect Set-Cookie.

Session UI states: checking, unauthenticated, authenticated, unavailable.
On every fresh page/reopen, start checking and call GET /auth/session before
enabling patient actions. A remembered role/Patient or localStorage entry cannot
skip bootstrap. Store only validated display identity/current CSRF in memory;
no password, raw session token, CSRF or backend Patient data in localStorage,
sessionStorage, URL, analytics or logs. The browser owns the HttpOnly cookie.

Login submits only loginLabel/password. On success fetch /auth/session;
authenticated UI requires that validated result, not merely authenticated:true.
Clear password fields after completion. Unknown/bad/disabled logins share a
generic message; never expose credentials or internal diagnostics.

Authenticated POST sends the current in-memory X-CSRF-Token, JSON and browser
Origin. SameSite is additional protection, not a substitute for server checks.
Current role/lifecycle/credential/delegation and session deadlines remain server
checks on every operation. Bootstrap only resolves display state, not lasting
permission. Hidden/disabled UI controls are not authorization.

Use a session-generation counter and per-request cancellation. Logout/relogin,
identity change or 401 invalidates earlier results and sensitive views. A late
GET must not repopulate a cleared view or reinstall old identity/CSRF. Reconcile
on focus/visibility after absence without a periodic keepalive; test cross-tab
revocation on the next authorized request. Abort does not prove a server write
was rolled back.

Logout is CSRF-protected. During it suppress operations and clear sensitive
views; claim server logout only after 204 or confirmed invalid session. Network
failure means revocation unconfirmed; remain blocked and offer explicit session
reconciliation. Do not report successful revocation from local state alone.

## 4. Basic Patient mapping and failures

POST /patients accepts exactly name, dateOfBirth, profession, phone, gender.
No role, actor identity, authority, CPN, submitted age, Past History or clinical
content is sent. GET /patients/:patientId accepts technical UUID only.
Create a typed BasicPatient from the existing snake_case response, validating
required fields, nullable DOB and server-derived age where returned.
No invented registeredAt, empty Past History, Case count or Visit count.
Render this limited view as basic Patient information, not a full dossier.

The adapter inspects HTTP status/content type before JSON and supports 204.
401: clear identity/CSRF/patient views and require server session resolution.
403: display denied operation without changing role or assuming logout; a possible
CSRF failure blocks mutations until explicit session reconciliation.
404: clear the previous lookup result, show Patient not found; never fall back
to a mock match or create a Patient automatically.
400/413/415: bounded input/request error; retain only safe unsaved form fields.
429: show throttling with bounded Retry-After, no automatic login loop.
503/network/TLS/invalid-response: show unavailable and block uncertain work.

A registration timeout may follow a committed INSERT. No automatic retry or
claimed rollback/idempotency: display outcome unknown, avoid duplicate submit,
and reconcile deliberately. A GET retry is deliberate and does not retry POST.
Success uses the server UUID/CPN; double-click suppression is usability, not a
server exactly-once guarantee.

## 5. Independent database and evidence

Propose a new roby_web_proof_stage6 database within the existing isolated PG18
Unix-only cluster, with independently prepared Actors/credentials/Patient fixture.
Creation requires a separate execution decision, exact source HEAD and system
identity. Use the existing base/auth schema sources with correct public DDL
placement; do not restore/clone/query historical, Stage 4 or Stage 5 data.
Reject existing target databases rather than overwrite/reset them.

Use only synthetic credentials and a synthetic Patient baseline. Fixture expiry,
deactivation and other negative setup use a private owner-executed proof harness,
not browser administrative/product routes. No test-control HTTP endpoint.
Snapshots compare protected files/status/index/HEAD, source/build bytes, target
identity, Patient rows and CPN sequence. Positive POST is an explicit expected
mutation, not whole-run preservation. Retain results/database for review.

Work may prepare and test source/HTTP injection with doubles. Termux must prove
real PostgreSQL, listener and actual Infinix browser TLS/cookie behavior.
Node/curl cookie headers and injection are not browser evidence. Automation may
supplement proof on a supported environment; no Android Playwright/driver access
is assumed. A manual device checklist needs recorded observable outcomes; if a
required attribute cannot be inspected, leave it unproven rather than infer PASS.
Build/type-check failures are recorded and resolved in scope or block the gate.

## 6. Failure-first acceptance matrix

| ID | Test | Required result |
| --- | --- | --- |
| W01 | Missing/invalid session with a valid request | 401; no Patient disclosure or write |
| W02 | localStorage Doctor role/permissions, injected role/identity payload | Cannot establish identity or expand permission; demo bytes unchanged |
| W03 | Wrong password, unknown label, disabled Actor | Generic denial; no new usable session |
| W04 | Expired/revoked/replaced-credential session; Doctor/Nurse deactivation | Next request denied; new login denied when disabled; stale view cleared |
| W05 | Valid Nurse session and valid patient request | 403 for both current Patient operations, including FULL mode |
| W06 | Missing/wrong CSRF, wrong/missing Origin, cross-site request | Rejected before business mutation; compared data/sequence unchanged |
| W07 | Browser sends credentials toward HTTP or an unexpected origin | Client blocks before fetch; no unsecured server entry or weakened cookie |
| W08 | Trusted-origin HTTPS browser login and session bootstrap | Browser stores/sends protected cookie; safe server identity and memory CSRF; JS cannot read bearer token |
| W09 | Allowed GET found/missing; prior result then missing | 200/404 handled distinctly; stale result cleared; no mock fallback |
| W10 | GET delayed across logout/relogin; two tabs | Old response cannot restore state; revoked session cannot later dispatch |
| W11 | Browser reload/reopen/back navigation after logout/expiry | Fresh session check; protected view remains blocked until resolved |
| W12 | Network/503/TLS/invalid JSON and POST response loss | Unavailable or outcome unknown; no false success, auto retry or demo fallback |
| W13 | Allowed basic Doctor POST, then UUID retrieval | Exactly the observed permitted mutation and server identity/CPN; no clinical record fabricated |
| W14 | POST failure inside auth/business transaction | SQL rollback proven; no partial Patient/CPN result claimed |
| W15 | Existing demo store and clinical contracts | No mock merge/reset, Past History loss, Visit overwrite, Case completion or Clinic Day mutation |
| W16 | Logging/build/asset boundary and listener lifecycle | No secrets/config/source exposure; explicit loopback HTTPS; owned resources close correctly |

Schema/payload validation can reject 400/415 before authentication in existing
composition; W01/W05 use valid shapes/UUID/Origin to isolate auth outcomes.
The UI does not reinterpret every 403 as a role failure or every 404 as logout.

## 7. Sources and remaining gates

Primary references reviewed 2026-10-10:
- [MDN Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie): Secure/HttpOnly/host prefixes and localhost caveat.
- [MDN Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch): credentials, asynchronous status/error handling.
- [Fastify Server](https://fastify.dev/docs/latest/Reference/Server/): explicit HTTPS server configuration.

These references inform design, not authorization or proof. Production TLS/proxy,
deployment/secrets/backup/recovery, real-user enrollment and clinical pilot stay
later gates. CPN/history/clinical UI migration needs its own contract coverage.
See the [decision package](./STAGE-6A-BOUNDED-WEB-INTEGRATION-DECISION-PACKAGE-V1.md).
