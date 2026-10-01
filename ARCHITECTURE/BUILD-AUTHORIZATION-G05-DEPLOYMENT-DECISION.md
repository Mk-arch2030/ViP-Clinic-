# BUILD AUTHORIZATION — G05 DEPLOYMENT DECISION

STATUS = TECHNICAL DEFINITION DECISION
GAP = G05 — DEPLOYMENT

ESTABLISHED PRODUCT DIRECTION:
- Sellable Clinic Web App.
- Single internet-hosted web application.
- Doctor and Nurse access the same application.
- Target devices include PC, laptop, tablet, and mobile.
- No mandatory client-side installation prerequisite.

TECHNICAL DEFINITION REQUIRED:
- deployment topology;
- production runtime boundary;
- application hosting boundary;
- persistence hosting boundary;
- environment separation;
- configuration and secret boundary;
- production startup/runtime behavior;
- database connectivity boundary;
- deployment verification and operational proof;
- rollback/recovery expectations where required.

MUST NOT ASSUME:
- specific cloud provider;
- specific hosting vendor;
- specific deployment platform;
- production credentials;
- production data;
- implementation authorization.

INVARIANTS:
AUTHORITY_TRANSFER = NO
NEW_ACTOR = NO
NEW_PRODUCT_CAPABILITY = NO
IMPLEMENTATION_AUTHORIZED = NO

DECISION:
G05 REQUIRES A DEDICATED DEPLOYMENT TECHNICAL CONTRACT BEFORE
DEPLOYMENT IMPLEMENTATION OR PRODUCTION RUNTIME WORK.

NEXT_GATE = G05 DEPLOYMENT TECHNICAL CONTRACT
