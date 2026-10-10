# Owner decision: minimum six characters in the current nonproduction implementation

On 2026-10-10 the owner explicitly requested a minimum of six characters or digits,
without requiring complex character composition. The current password verifier
therefore accepts 6–128 NFC-normalized code points. Five characters are rejected;
six letters, six digits and mixed characters are accepted. Maximum byte bounds,
Unicode checks, whitespace semantics, scrypt cost, salts, verifier format and
existing login attempt/session/authorization controls remain unchanged.

This changes the shared verifier used by preparation and login, not only the
synthetic prompt. Existing longer credentials continue to verify. The earlier
Stage 5 proof package records its historical 15–128 policy; that evidence is not
rewritten or represented as proving the revised policy.

Six-character passwords have less resistance to guessing. Hashing and online
attempt limits do not restore the entropy of a longer password or prevent offline
guessing if a verifier is obtained. Accepting six characters in this nonproduction
implementation is not a claim of clinical readiness or production approval.
The owner's preference for simple future login is recorded; production identity
assurance and any additional authentication factors remain an independent gate.

Boundary and real scrypt tests cover rejection at five characters, acceptance at
six, correct/wrong six-digit verification, and unchanged longer-password behavior.
No database/listener/device operation is performed by this source change.

Stage 6 manifests bind their exact source HEAD. After sync, retain the earlier
build as historical evidence and create a fresh separate build for the new HEAD;
do not overwrite/reset its files or reuse its manifest with changed source.
