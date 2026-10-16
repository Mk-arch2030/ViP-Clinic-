# Stage 6 registration uncertainty guard V1

STATUS = BOUNDED ENGINEERING CONTRACT / NOT A RUNTIME CLOSURE
AUTHORITY = MOHAMED.K_ROBY autonomous engineering directive, 2026-10-13
BASE = b72192aed65f810b794f6d69b8e49c18622a3945

The existing Stage 6A design §4 requires no automatic POST retry or false rollback. Stage 6E–F review §9 explicitly prohibits reload/relogin as an uncertainty bypass. The source coordinator currently preserves this block only in memory. The current directive authorizes repairing this development prerequisite without altering clinical lifecycle or historical artifacts.

Before dispatching registration, the protected browser stores a minimal origin-scoped unresolved marker (format version and random operation identity only). This is a denial guard, never identity, clinical storage, patient cache, session authority or a server idempotency receipt. A Web Locks exclusive lock serializes marker reservation/removal across same-origin cooperating tabs. The marker must be written and read back before POST. Missing locks or unavailable storage denies dispatch. On reload or a second cooperating client, a marker blocks registration and protected entry; server authentication is still independently required.

Remove the owned marker only after a fully parsed successful server acknowledgement, or a known contractual pre-effect rejection (400/401/403/404/413/415/429). Transport failure, 5xx, invalid response, disposal or lost acknowledgement keeps it. Failed marker removal leaves the UI blocked. Authentication refresh, login, logout and browser teardown do not clear uncertainty. No automatic retry or reset/unlock button is added. Separately reviewed server reconciliation is still required to resolve an unknown registration; this slice does not supply that workflow.

The guarantee is limited to cooperating clients sharing this origin's persistent storage and lock manager. Cleared site data, another profile/device, older application versions or direct API requests are not protected by a browser marker. No server exactly-once claim, receipt recovery or production guarantee follows. Markers contain no patient fields, credentials, session token, CSRF or Doctor identity. Browser storage cannot grant authority; tampering can remove the denial guard, which is why server receipts remain a prerequisite for complete recovery.

Required local tests: reserve-before-send, concurrent cooperating clients, reload after lost acknowledgement, session refresh/relogin does not unlock, successful response clears owned marker, definite denial permits corrected submit, storage/lock failures prevent POST, disposal retains marker, malformed marker fails closed, removal failure prevents success, authenticated HTTP injection of registration with lost reply and fresh-client denial. DOM tests are not real browser/PostgreSQL proof. Existing official historical exclusion remains disclosed; new untracked tests must be executed explicitly until Git preservation is separately authorized.

Rollback: revert only this uncommitted increment in a separately reviewed integration action; preserve unresolved markers until independently reconciled. Never delete a marker to make an unknown registration appear safe. No schema, route, credential, protected owner path, historical fixture or deployment changes are authorized by this document.
