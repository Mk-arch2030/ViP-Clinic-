# DEPLOYMENT TECHNICAL CONTRACT V1

STATUS = CONTROLLED DEFINITION
GAP = G05 — DEPLOYMENT
IMPLEMENTATION_AUTHORIZED = NO

PURPOSE:
Define the technical deployment boundary for the sellable Clinic Web App
without selecting a production vendor or authorizing deployment.

DEPLOYMENT MODEL:
- Single internet-hosted web application.
- Doctor and Nurse access the same application.
- Client devices require no mandatory application installation.
- Production deployment consists of application runtime plus persistent
  data storage and their required configuration boundary.

RUNTIME BOUNDARY:
- Application runtime is separated from persistent data storage.
- Production configuration is environment-specific.
- Secrets and credentials are configuration concerns and MUST NOT be
  embedded in source-controlled application artifacts.

ENVIRONMENT BOUNDARY:
- Development/test environment is distinct from production.
- Test/dummy data MUST NOT be treated as production data.
- Production credentials MUST NOT be introduced during definition work.

PERSISTENCE:
- Production application connects only to its designated production
  persistence boundary.
- Persistence remains governed by the established Persistence contracts.

OPERATIONAL PROOF:
Deployment is not considered established until:
- application startup is proven;
- persistence connectivity is proven;
- required configuration is proven;
- application accessibility is proven;
- production deployment state is reproducible from defined artifacts.

MUST NOT ASSUME:
- specific cloud provider;
- specific hosting vendor;
- specific operating system;
- specific database hosting vendor;
- production credentials;
- production data;
- automatic scaling;
- implementation authorization.

INVARIANTS:
AUTHORITY_TRANSFER = NO
NEW_ACTOR = NO
NEW_PRODUCT_CAPABILITY = NO
PRODUCTION_DATA = NO
PRODUCTION_CREDENTIALS = NO
IMPLEMENTATION_AUTHORIZED = NO

NEXT_GATE = G05 CONTRACT RECONCILIATION AND PROOF
