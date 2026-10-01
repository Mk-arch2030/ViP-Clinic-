# DR_ROBY_CLINIC — ROADMAP RECONCILIATION SPECIFICATION V1

> STATUS = DRAFT FOR STRUCTURAL REVIEW
> PURPOSE = Establish the controlled transition from the proven Web Delivery
>           to a One-Nucleus / Dual-Shell Delivery Model.
> AUTHORITY = Existing closed contracts, authorization decisions, proof artifacts,
>             canonical Git history, and Round-4 Mobile Architecture Discovery.
> IMPLEMENTATION AUTHORIZATION = NONE
> CODE CHANGE AUTHORIZATION = NONE
> FAIL = 0

---

## 1. PURPOSE

This specification reconciles the existing Dr_Roby_Clinic implementation
roadmap with the newly established One-Nucleus / Dual-Shell delivery model.

It does not replace, reopen, reinterpret, or weaken any existing contract.

It defines the controlled roadmap boundary required before a future Mobile
Shell may be implemented.

The governing principle is:

ONE NUCLEUS — MULTIPLE DELIVERY SHELLS — ONE AUTHORITY MODEL.

---

## 2. CANONICAL BASELINE

The current canonical repository state is:

REPOSITORY = Mk-arch2030/Dr_Roby_Clinic
BRANCH = main
CANONICAL HEAD = 48dbad9
LOCAL HEAD = 48dbad9
REMOTE HEAD = 48dbad9
WORKTREE = CLEAN
REGRESSION BASELINE = 22 PASS / 0 FAIL
CONTRACT-09 = CLOSED + PROVEN
ROUND-4 MOBILE DISCOVERY = EVIDENCE COMPLETE

No source implementation change is authorized by this document.

---

## 3. EXISTING PROVEN DELIVERY FOUNDATION

The following are treated as existing/proven architectural foundation:

1. DOMAIN NUCLEUS
   domain/ is the semantic business-model authority.

2. APPLICATION CAPABILITIES
   application/ contains bounded application services and capabilities.

3. POSTGRESQL AUTHORITY
   PostgreSQL remains the persistence authority.

4. FASTIFY API
   Existing authorized API surface remains the server boundary.

5. WEB SHELL
   Existing Vite + React browser delivery remains a peer delivery shell.

6. CONTRACT SYSTEM
   Existing architecture and contract documents remain authoritative.

7. PROOF SYSTEM
   Regression tests and closure proofs remain mandatory evidence.

8. GIT / CANONICAL HISTORY
   GitHub main remains the canonical remote history.

---

## 4. ONE-NUCLEUS MODEL

The future delivery model is:

                         ONE SEMANTIC NUCLEUS
              domain/ + application/ + contracts
                              |
                              v
                       FASTIFY API
                              |
                              v
                    POSTGRESQL AUTHORITY
                         /          \
                        /            \
                       v              v
                  WEB SHELL      MOBILE SHELL
                  React/Vite     React Native/Expo
                       |              |
                       v              v
                 API ADAPTERS   MOBILE API ADAPTER
                       \              /
                        \            /
                         SERVER-DERIVED
                         AUTHORITATIVE DATA

The Mobile Shell is not a second product authority.

The Mobile Shell is not a replacement for the Web Shell.

The Mobile Shell is not a second implementation of the business model.

The Mobile Shell is a new delivery surface consuming the existing authority
through an authorized API boundary.

---

## 5. AUTHORITY PRESERVATION

The following authority invariants remain unchanged:

NO_NEW_ACTOR = YES
NO_NEW_AUTHORITY = YES
NO_AUTHORITY_TRANSFER = YES
NO_NEW_PRODUCT_CAPABILITY = YES
PATIENT_IDENTITY = UNCHANGED
CPN_AUTHORITY = POSTGRESQL
DOB_AUTHORITY = EXISTING PATIENT DOMAIN
AGE_AUTHORITY = DERIVED
AGE_PERSISTENCE_AUTHORITY = NONE
API_AUTHORITY = EXISTING AUTHORIZED SURFACE

The Mobile Shell shall not:

- allocate authoritative CPN values;
- persist authoritative Age;
- replace PostgreSQL;
- bypass authorized application services;
- access PostgreSQL directly;
- create an independent patient identity authority;
- create a second business-rule Nucleus;
- silently redefine existing contracts.

---

## 6. CURRENT WEB DELIVERY

The Web Shell remains unchanged by this specification.

Its current architecture is:

Browser
  ->
Vite + React
  ->
patientApiService.js
  ->
Fastify API
  ->
Application Service
  ->
Repository
  ->
PostgreSQL

The Web Shell is therefore preserved as the first proven delivery shell.

No web rewrite is authorized by this roadmap reconciliation.

---

## 7. FUTURE MOBILE DELIVERY

The future Mobile Shell shall be treated as a peer delivery shell.

Target architecture:

Mobile UI
  ->
Mobile Application Adapter
  ->
Existing Fastify API
  ->
Existing Application Boundary
  ->
Existing PostgreSQL Authority

The Mobile Adapter shall be transport-focused.

It shall not become a new location for:

- age calculation authority;
- CPN allocation;
- persistence authority;
- clinical business rules;
- transaction authority;
- patient identity authority.

---

## 8. NUCLEUS REUSE DECISION

The canonical semantic source remains:

domain/
application/
ARCHITECTURE/

The mobile roadmap must preserve the principle:

ONE NUCLEUS, NOT ONE COPY PER SHELL.

The preferred initial execution model is server-side domain execution through
the existing Node/Fastify API.

Bundling domain logic into the mobile application is not authorized by this
document.

If on-device domain execution is later considered, it requires an explicit
contract and reconciliation decision before implementation.

---

## 9. MOBILE RUNTIME DIRECTION

Round-4 discovery established four candidate runtime families:

1. React Native
2. Expo / EAS
3. Capacitor
4. Kotlin / Jetpack Compose

The roadmap target is a real installable Android application.

PWA-only delivery is therefore outside the target.

Responsive Web relabeling is outside the target.

Kotlin implementation would require a second business-rule implementation and
therefore conflicts with the current One-Nucleus constraint unless a future
explicit architectural decision changes that constraint.

React Native / Expo remain the candidate direction for the next controlled
architecture gate.

Final runtime selection is NOT AUTHORIZED by this document.

---

## 10. REQUIRED MOBILE CONTRACTS

Before mobile implementation, the following contracts must be created,
reviewed, reconciled, and explicitly authorized:

1. MOBILE CLIENT AUTHORITY BOUNDARY

2. MOBILE API CONSUMPTION CONTRACT

3. MOBILE TRANSPORT & ENDPOINT RESOLUTION CONTRACT

4. MOBILE AUTHENTICATION & SESSION CONTRACT

5. SHARED NUCLEUS REUSE DECISION

6. ANDROID BUILD & SIGNING CONTRACT

7. MOBILE DEVICE TEST STRATEGY

8. OFFLINE DRAFT & SYNC CONTRACT
   DEFERRED unless offline behavior is explicitly authorized.

These are identified requirements only.

This document does NOT create implementation authorization for them.

---

## 11. MOBILE BUILD ENVIRONMENT GATE

A real Android build environment is a separate future gate.

Required evidence includes:

- JDK;
- Android SDK;
- SDK platform/build tools;
- Gradle-compatible build path;
- APK/AAB generation;
- signing configuration;
- reproducible build process;
- device or emulator verification;
- secure keystore handling.

The current Freebuff environment is not treated as the Android build authority.

No manual toolchain installation is authorized as part of this roadmap
specification.

---

## 12. MOBILE PROOF GATE

Mobile implementation is not considered proven merely because source code
compiles.

Future proof must cover, as applicable:

- API connectivity;
- patient registration;
- patient retrieval;
- DOB authority;
- derived Age presentation;
- submitted Age rejection as authority;
- no Age persistence;
- CPN server authority;
- transaction integrity;
- regression preservation;
- Android runtime behavior;
- device-level behavior.

The existing Node regression remains the baseline.

TARGET:

EXISTING REGRESSION + AUTHORIZED MOBILE PROOF
= FAIL 0

---

## 13. DUAL-SHELL RECONCILIATION

After mobile proof, a dedicated reconciliation gate shall establish:

WEB SHELL
and
MOBILE SHELL

consume the same semantic authority.

The reconciliation must verify:

- same patient identity semantics;
- same CPN authority;
- same DOB authority;
- same derived Age semantics;
- same API boundary;
- same persistence authority;
- no duplicate business-rule authority;
- no unauthorized capability expansion.

The two shells may differ in presentation and interaction.

They may not silently diverge in domain meaning.

---

## 14. ROADMAP PHASES

The reconciled delivery roadmap is:

PHASE 0  — MANUSCRIPT / AUTHORITY
PHASE 1  — DOMAIN NUCLEUS
PHASE 2  — APPLICATION CAPABILITIES
PHASE 3  — API + POSTGRESQL AUTHORITY
PHASE 4  — WEB SHELL
PHASE 5  — PROOF / REGRESSION
PHASE 6  — MOBILE ARCHITECTURE DISCOVERY
PHASE 7  — MOBILE CONTRACTS
PHASE 8  — MOBILE RUNTIME SHELL
PHASE 9  — MOBILE API ADAPTER
PHASE 10 — ANDROID BUILD ENVIRONMENT
PHASE 11 — DEVICE / APK / AAB PROOF
PHASE 12 — DUAL-SHELL RECONCILIATION
PHASE 13 — FINAL DELIVERY

Phases 0–6 represent the established historical/proven path and discovery
evidence.

Phases 7–13 represent future controlled delivery gates.

No future phase is automatically authorized by listing it here.

---

## 15. GATE DISCIPLINE

Every future phase shall follow:

UNDERSTAND
  ->
DESIGN
  ->
DEFINE
  ->
CONTRACT
  ->
BUILD
  ->
PROVE
  ->
EXTEND

No implementation shall begin solely because a roadmap phase exists.

A phase becomes actionable only after its applicable contract and authorization
gate are CLOSED + PROVEN.

No closed contract may be reopened without new evidence.

---

## 16. EXPLICITLY OUT OF SCOPE

This roadmap reconciliation does not authorize:

- PostgreSQL redesign;
- new patient tables;
- Age persistence;
- CPN redesign;
- new API capabilities;
- direct mobile database access;
- authentication implementation;
- authorization redesign;
- clinical workflow redesign;
- Case redesign;
- Encounter redesign;
- Clinical History redesign;
- Past History redesign;
- PWA conversion;
- deployment implementation;
- random refactoring;
- framework installation;
- Android build setup;
- mobile code implementation.

---

## 17. SAFETY INVARIANTS

The following remain mandatory:

AUTHORITY_TRANSFER = NO
NEW_ACTOR = NO
NEW_AUTHORITY = NO
NEW_PRODUCT_CAPABILITY = NO
CONTRACT_MUTATION = NO
RANDOM_REFACTORING = NO
UNAUTHORIZED_EXPANSION = NO
DIRECT_DB_ACCESS_FROM_SHELL = NO
AUTHORITATIVE_AGE_FROM_CLIENT = NO
AGE_PERSISTENCE_AUTHORITY = NO
CPN_CLIENT_AUTHORITY = NO

---

## 18. CURRENT IMPLEMENTATION STATE

ROADMAP_RECONCILIATION_SPECIFICATION = CREATED
STRUCTURAL_REVIEW = PENDING
ROADMAP_AMENDMENT = NOT CREATED
MOBILE_CONTRACTS = NOT CREATED
MOBILE_IMPLEMENTATION = NOT STARTED
ANDROID_BUILD_ENVIRONMENT = NOT PROVISIONED
DEVICE_PROOF = NOT STARTED

SOURCE_CODE_MODIFIED = NO
PACKAGES_INSTALLED = NO
COMMIT_CREATED = NO
PUSH_CREATED = NO

---

## 19. CLOSURE CONDITION

This specification may be considered structurally closed only when:

- canonical baseline is verified;
- existing authority boundaries are preserved;
- One-Nucleus model is explicit;
- Web Shell preservation is explicit;
- Mobile Shell boundary is explicit;
- future mobile contracts are identified;
- implementation is not accidentally authorized;
- forbidden scope is explicit;
- FAIL = 0.

This document itself does not grant implementation authorization.

---

## 20. FINAL RECONCILIATION STATEMENT

The future Mobile Shell is an extension of delivery, not an extension of
semantic authority.

The existing Dr_Roby_Clinic Nucleus remains the single source of business
meaning.

The existing Web Shell remains valid.

The future Mobile Shell shall consume the same authority through the existing
API boundary.

The roadmap therefore evolves from:

SINGLE WEB DELIVERY

to:

ONE NUCLEUS / DUAL-SHELL DELIVERY

without transferring authority, duplicating the Nucleus, or reopening
proven contracts.

---

FAIL = 0
