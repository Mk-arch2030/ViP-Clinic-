# CPN GENERATION — TECHNICAL DEFINITION V1

STATUS = DEFINITION DRAFT

CAPABILITY = GENERATE CLINIC PATIENT NUMBER

PRODUCT REQUIREMENTS
- CPN is established at first Patient registration.
- CPN is stable for the Patient.
- CPN is a clinic identity reference.
- CPN is not a Visit identifier.
- CPN is not a Case identifier.
- CPN is not a Clinic Day identifier.

BOUNDARY
- This definition specifies only the technical generation responsibility.
- No API is defined.
- No UI is defined.
- No database schema is defined.
- No persistence mechanism is defined.
- No authentication or authorization mechanism is defined.
- No new product capability is introduced.
- No actor or authority is changed.

IMPLEMENTATION PRINCIPLE
- The CPN generator must produce a new clinic reference for first registration.
- The generator must not derive the CPN from Visit, Case, or Clinic Day identity.
- The generator must not silently redefine the Patient domain identity.
- The generated CPN must remain stable once established.
- The exact format and generation algorithm are intentionally NOT SELECTED in this draft.

STATUS
TECHNICAL GENERATION MECHANISM = DEFERRED
IMPLEMENTATION_AUTHORIZED = NO
FAIL = 0
