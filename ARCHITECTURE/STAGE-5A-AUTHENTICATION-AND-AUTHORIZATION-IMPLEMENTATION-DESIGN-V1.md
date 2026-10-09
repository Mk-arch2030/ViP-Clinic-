# Stage 5-A — Authentication and Authorization Implementation Design V1

OWNER: MOHAMED.K_ROBY  
STATUS: DESIGN_PROPOSAL_READY_FOR_BOUNDED_OWNER_DECISIONS  
SOURCE_BASELINE: a6e76e93b8324ddf28beda4948a5b3cd1abd3ef7  
DESIGN_AUTHORIZATION: GRANTED_IN_CHAT  
IMPLEMENTATION_AUTHORIZATION: NOT_GRANTED  
RUNTIME_PROOF: NOT_EXECUTED  
DATABASE_OR_PRODUCTION_EXECUTION: NOT_GRANTED

## 1. Decision status

The owner authorized producing and preserving this design package. The choices
below are engineering proposals constrained by the existing contracts.
Publication is not implementation permission, production security certification,
or proof that any credential/session exists.

The design follows the [source reconciliation](./STAGE-5A-ACTOR-AND-AUTHENTICATION-SOURCE-RECONCILIATION-V1.md).
Existing contract definitions remain closed; implementation-specific choices
are being made explicit rather than reopening product scope.

## 2. Responsibility boundaries

| Component | Responsibility | Must not do |
| --- | --- | --- |
| Actor adapter | Resolve stable identity, stored role and current lifecycle | Infer role from username, Patient CPN or a client-supplied role |
| Credential verifier | Verify a password against protected, bounded verifier material | Create actors, grant permissions, issue clinical authority |
| Authentication service | Validate credentials and request a fresh server session | Treat a successful password as unrestricted permission |
| Session service/repository | Issue, validate, expire and revoke server state | Store a raw bearer identifier in browser localStorage or trust role snapshots indefinitely |
| Authorization policy | Decide a named operation from server-resolved identity and current delegation | Let Nurse self-expand or let unknown operations pass |
| Request boundary | Authenticate, check CSRF where relevant, authorize, then dispatch | Accept actorRole/actorId/permissions supplied by the frontend as authority |
| UI adapter | Display server identity and send permitted requests | Continue using local role selection as backend identity |

Normal sequence: request limits → parse transport → authenticate → resolve Actor/
lifecycle → authorize operation → controller/application service → persistence.
For cookie-authenticated mutations, CSRF/origin checks precede business dispatch.
Store outages and missing policy fail closed.

## 3. Actor representation and mapping

Proposed first code slice reconciles domain/actor.js to validate and represent
ACTIVE / DEACTIVATED for both approved roles, while preserving identity and
authorityContext separation. Keep the existing NURSE_LIFECYCLE export as a
compatibility alias if an Actor-wide constant is added. Do not remove an existing
export as an incidental cleanup.

When a Doctor lifecycle is explicitly supplied, validate and preserve it using
the same vocabulary as Nurse. Preserve legacy Doctor construction without a
lifecycle as an unspecified compatibility representation; do not turn omission
into ACTIVE or authenticated participation. Nurse's existing required lifecycle
validation remains unchanged. This compatibility state cannot pass the future
authenticated Actor adapter, which requires explicit persisted lifecycle.

Lifecycle must be explicitly supplied from trusted persisted/test data in the
new authenticated path. Do not silently default a missing persisted lifecycle
to ACTIVE. Audit existing constructor call sites before changing requirements;
any additional caller changes need inclusion in the reviewed write allowlist.

The persistence adapter maps DOCTOR/NURSE to Doctor/Nurse and lifecycle_state to
the Actor-wide vocabulary. A session refers to the stable actorIdentityReference
through the existing actor_id mapping, not a newly invented product identity.
Logical distinction does not require duplicating the same identity into a new
Actor table column.

Any unknown role, unknown lifecycle, missing Actor or DEACTIVATED Actor is denied
active authenticated participation. This design does not add Actor deletion,
Doctor deactivation, reactivation, Nurse creation or ownership transfer routes.

## 4. Credential design proposal

Select asynchronous Node runtime crypto.scrypt for the initial compatible
implementation, with a versioned verifier format. This is a deliberate
compatibility proposal, not a claim that Argon2id is inferior or unavailable.
Node v24 documentation includes native Argon2 from v24.7.0; no unverified API or
Node upgrade is assumed for the owner's runtime. Reconsidering the algorithm is
a separate design change, not a silent fallback.

Candidate profile:

| Setting | Proposed value |
| --- | --- |
| Algorithm/profile | scrypt / vip-scrypt-v1 |
| N, r, p | 131072, 8, 1 |
| Derived key | 32 bytes |
| Per-verifier salt | 16 random bytes |
| Node maxmem | 256 MiB explicit ceiling |
| Active derivations | 1 per process initially |
| Waiting derivations | At most 8, with 5-second queue wait bound |

The N/r/p profile is one OWASP-listed scrypt option. Node's maxmem must allow
the algorithm's memory requirement. These values are candidates for real-device
cost/availability tests, not measured Infinix performance. Do not silently reduce
cost to make a test pass. Persistent unacceptable cost blocks the next gate and
requires a reviewed alternative profile/algorithm decision.

Verifier fields: format version, approved profile identifier, salt and derived
key. Parse only bounded lengths and allowlisted profiles before allocating
memory or running crypto. Stored/requested arbitrary N/r/p/maxmem values must
not control resource allocation. Use strict encoding, fixed output length and
timingSafeEqual for valid equal-length derived buffers; surrounding control flow
still requires review against enumeration and timing leaks.

Proposed password policy for new synthetic/enrolled credentials: 15–128 Unicode
code points, bounded to 1024 UTF-8 input bytes, with NFC normalization consistently
at enrollment and verification. Do not trim, change case, silently truncate or
require arbitrary character-class rules. This is a project policy proposal.
A reviewed common/compromised-password blocklist policy and provisioning/recovery
flow must exist before real credential enrollment. No user's password, real
credential or verifier is requested, embedded, logged or committed here.

Login labels are credential lookup data, not Actor identity. Proposed label
format is 3–64 ASCII characters from letters/digits/slash/underscore/hyphen,
canonically uppercase with explicit validation; reject surrounding whitespace.
Uniqueness uses that canonical representation. Do not preseed the historical
Doctor's label or identity. Initial proofs use independent synthetic labels.

Unknown label, bad password and inactive Actor return the same external login
failure after bounded dummy-verifier work where appropriate. Malformed schema,
throttling and infrastructure-unavailable errors remain separate generic classes.
Passwords and verifier material must be redacted from logs and error objects.

## 5. Server-managed session proposal

Generate a fresh 32-byte random opaque identifier at successful login. Return
the raw identifier only through the session transport. Store a SHA256 digest
for lookup, plus actor reference, credential version, issue/last-seen times,
idle/absolute deadlines and revocation state. SHA256 here indexes a high-entropy
session identifier; it is not a password hashing choice.

Proposed project defaults: 15-minute idle limit and 8-hour absolute limit.
Both are server-enforced. Activity can update idle state but cannot extend the
absolute deadline; no background keepalive grants indefinite login.
Maximum active sessions per Actor is three. Any later fourth successful login
revokes the oldest active session atomically before the new one becomes usable.

Reauthenticate with a new identifier rather than adopt any client-chosen value.
Rotate on successful reauthentication, and revoke the presented prior session
atomically with issuance where applicable. Failed login must not invalidate an
unrelated valid session. Logout revokes the presented session and clears the
cookie with matching attributes.

Every authenticated request checks current Actor existence/lifecycle, credential
version, session deadlines/revocation and applicable delegation. Password
replacement increments credential version and revokes that Actor's sessions in
one controlled transaction. Actor lifecycle/role/delegation changes must take
effect without waiting for an old session to expire; no permission snapshot is
an enduring grant.

No automatic renewal API, remember-me option, JWT, bearer-in-URL transport or
browser-localStorage session storage is proposed. A future mobile transport
requires its own explicit review.

## 6. Browser transport and CSRF proposal

Proposed browser cookie:
__Host-vip_session; Secure; HttpOnly; SameSite=Strict; Path=/; no Domain.
Use explicit expiry compatible with the absolute deadline and clear with the
same name/path/security scope. Auth responses use Cache-Control: no-store.
No raw session identifier appears in response JSON, URLs, logs or browser state.

Browser deployment uses a same-origin Web/API boundary. Cross-origin development
integration needs an explicit allowlist/CORS/credential decision later; never
enable wildcard credential access. Secure cookies and TLS are not disabled
automatically because a request says it is localhost. Injection tests can supply
synthetic Cookie headers directly; this is not browser/TLS deployment proof.

Use a per-session random synchronizer CSRF token, stored as protected server
session material and returned in authenticated no-store JSON responses. The UI
keeps it in memory and sends X-CSRF-Token for state-changing authenticated
requests. Validate against the current session using bounded decoding/comparison.
SameSite is additional protection, not a substitute for the server check.

Login has no authenticated session yet: require JSON content type, an allowed
configured Origin, reject cross-site request metadata, and do not enable
cross-origin credentialed access. If Origin is missing, reject browser entry
rather than invent trust from a client-controlled Host header. A trusted-origin
configuration failure blocks entry. Authenticated logout also requires CSRF.
No mutable operation is exposed as GET.

A future native client with different transport must have a separately reviewed
entry/CSRF policy; do not weaken the browser policy to accommodate it implicitly.

## 7. Proposed persistence model — no SQL executed

Use dedicated application-managed authentication storage, conceptually separated
from public Actor/Patient/Clinic Day data. A later SQL design gate decides exact
types, constraints, migrations and schema permissions.

| Proposed responsibility | Required fields/constraints |
| --- | --- |
| Credentials | actor reference FK, unique canonical login label, versioned verifier, credential version, enabled flag, timestamps |
| Sessions | unique token digest, Actor FK, credential version, protected CSRF value, issued/last-seen/deadline timestamps, revoked timestamp/reason |
| Delegation | Nurse Actor reference, granting Doctor reference, FULL/LIMITED mode, explicit selected subset of four approved capabilities, version |
| Login throttling | Bounded per-login-label/per-source counters, expiry/cooldown and capacity; shared across processes before any multi-process deployment |

No ON DELETE CASCADE destroying Actor/history is implied; Actor deletion remains
prohibited. Auth records do not replace Actors or redefine Patient identity.
Unknown/corrupt states and unavailable stores deny access.

Session issue/rotation/session-cap enforcement, credential changes and delegation
updates require defined transaction/concurrency behavior before repository code.
Locking must serialize relevant Actor/credential/session decisions so concurrent
requests cannot exceed caps or preserve reset sessions incorrectly. Privileged
business mutations eventually require a transactional authorization/version
check close to their write; a middleware-only check is insufficient for strict
revocation behavior during races.

Do not alter backend/persistence/schema.sql under this package. Later test
persistence requires a separately approved synthetic database on a verified
isolated cluster, distinct from roby_retrieve_proof_c. No Stage 4 fixture changes,
historical cluster connections or production Actor/credential enrollment.

## 8. Endpoint and permission proposal — not route registration

Candidate routes for a later secured test composition:

| Route | Proposed behavior |
| --- | --- |
| POST /auth/login | Validated login label/password, bounded verification, fresh cookie/session; 200 on success |
| GET /auth/session | Resolve current server Actor and session, return safe display identity and CSRF value; 200 |
| POST /auth/logout | Authenticated CSRF-protected revocation and cookie clear; 204 |
| Existing POST /patients | Authentication plus approved registration capability/payload mapping before dispatch |
| Existing optional GET /patients/:patientId | Authentication plus explicitly mapped retrieval permission before dispatch |

Do not add these routes, change current registration behavior or turn on GET
through a global flag during initial unit slices. Prefer a separately composed
secured application with explicit dependencies; missing auth configuration must
not silently expose its routes without protection. The original Stage 4
composition remains a bounded nonproduction proof path, not a production
alternative around the secured boundary.

Unauthenticated/missing/invalid/expired/revoked/inactive cases: generic 401.
Authenticated but not permitted: generic 403.
Malformed payload/transport: bounded 400/415 as appropriate.
Throttled attempts: 429 with bounded Retry-After.
Store/crypto/configuration unavailable: generic 503, never successful fallback.
No failure returns credential material or sensitive internal diagnostics.

Proposed initial login limits: five failed attempts per canonical label per
15 minutes and twenty attempts per trusted source per 15 minutes, plus global
crypto queue bounds. Use bounded expiring keys; do not let attackers create an
unlimited counter map. Source identity comes from the actual peer or specifically
trusted proxy configuration, never an untrusted X-Forwarded-For value.
These are tunable project proposals, requiring abuse and device proof.

Permission policy remains deny-by-default. Doctor permissions are named approved
product operations, not arbitrary route access. Nurse FULL means only the four
contracted operational categories; LIMITED checks the selected subset.
Operational mode, current lifecycle and delegation are resolved on the server.

Nurse registration is a candidate Patient Data Recording mapping requiring
explicit approval and a basic-data-only payload boundary. Nurse GET retrieval
is denied pending deliberate mapping review. No clinical content/Past History
authority or future route permission is granted by these proposals.

## 9. Provisioning and recovery boundary

First proofs use synthetic Actor/credential records via an approved fixture path,
not automatic public signup or enrollment of the historical Main Admin.
No initial password is committed or displayed in a report.

Real provisioning, password change/recovery/reset and Nurse creation require
separate bounded workflows. Recovery must establish controlled authorized
context, preserve Actor identity and invalidate old sessions; knowing a login
label or owning a stale cookie is not recovery authorization. Reset endpoint/UI
and verification-channel choices are not implemented or silently invented here.
Real enrollment/deployment remains blocked until that recovery/provisioning
design is explicitly completed and approved.

This preserves the product's controlled recovery requirement while limiting the
first code slice to representations and synthetic tests.

## 10. Primary engineering references

Reviewed 2026-10-10; these inform engineering choices and do not authorize product work:

- [Node v24 crypto API](https://nodejs.org/docs/latest-v24.x/api/crypto.html): asynchronous scrypt, random bytes and comparison APIs; verify the exact Termux runtime during implementation proof.
- [OWASP password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html): Argon2id preference and scrypt alternative profiles; the compatibility choice above is our proposal.
- [OWASP session management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html): session transport/lifecycle principles.
- [OWASP CSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html): stateful token and origin defenses.

No certification or perfect-security claim is made. Proposed numeric policies
are project decisions, not asserted universal values from those references.
Acceptance/sequence is in the [bounded decision package](./STAGE-5A-BOUNDED-IMPLEMENTATION-DECISION-PACKAGE-V1.md).
