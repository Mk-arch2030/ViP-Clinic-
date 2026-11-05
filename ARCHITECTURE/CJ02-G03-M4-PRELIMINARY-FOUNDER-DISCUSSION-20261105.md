# CJ02-G03-M4 — Founder Discussion Checkpoint
Date: 2026-11-05
Owner: MOHAMED.K_ROBY
Status: PRELIMINARY DISCUSSION CHECKPOINT — NOT FINAL M4 CONTRACT
Scope: DOCUMENTATION ONLY. No implementation, database changes, merge, deployment, or release.

## Approved current-product boundary (separate prior founder decision)
- One clinic per current ViP Clinic installation; one owning Doctor as sole Main Admin & Owner.
- Optional nursing accounts with limited delegated permissions; Doctor can operate alone.
- Desktop PC or laptop with compatible browser and security capabilities is required for operational use. Mobile clinic management is outside current scope. Termux/Infinix remain valid development tools, not evidence of supported clinical runtime.
- No multi-clinic or co-Doctor operation in current scope. Expansion is deferred until the existing product is completed, validated, and separately authorized.
- The original cross-Doctor M4 scenario was withdrawn as out of scope.

## M4 founder preliminary selections (not implementation proof)
1. Owner-only protected actions must be denied by the backend for unauthorized nursing accounts, including direct API calls; hiding UI controls alone is insufficient.
2. On every protected operation, the backend must validate authenticated session, Doctor-owner identity, and **current** authority; login-time checks alone are insufficient.
3. Disabling a nurse account must deny new protected operations even when an old session has not expired. Define concurrent-operation boundaries later.
4. Only the Doctor-owner may reactivate a nurse account. Old sessions remain invalid and the nurse must authenticate anew.
5. Ordinary staff-account management must not disable or alter the sole Doctor Main Admin. Exceptional ownership recovery or suspension requires a separate secure contract.
6. Founder identifies factory leadership as **God Admin**: exceptional authority outside daily clinic accounts, not another clinic Doctor. No implicit unrestricted clinical-record access.
7. God Admin factory assistance is restricted to independently verified administrative ownership recovery, without reading or changing patient records.
8. Three failed **recovery challenge** attempts suspend that challenge and open a help path; this must NOT automatically disable the Doctor account. Failed attempts do not prove the actor is an intruder, and seeing help does not prove Doctor identity. Rate-limit abuse without letting an attacker trivially lock out the legitimate owner.
9. Self-service recovery should primarily use previously registered strong Passkeys and one-use backup recovery codes; factory help is last resort. Do not rely on traditional security questions as primary proof.
10. If the Doctor loses the phone/Passkey but has a valid backup code, permit secure self-service recovery with appropriate additional safeguards, invalidating old sessions and re-enrolling strong credentials.
11. On successful backup-code recovery, invalidate **all** prior backup codes and issue a replacement set securely; ensure consistent recovery completion and prevent code reuse.
12. Notify a previously verified contact method after successful recovery, without sending secrets or patient data. Record audit evidence; notification-delivery failure alone should not undo an otherwise verified recovery.
13. Changing Passkeys or recovery methods requires fresh strong authentication even during an active session; audit and notify. Deny on failed verification.
14. Do not allow deletion of the last strong primary sign-in method until a replacement is registered and verified; backup codes are emergency recovery, not the ordinary primary sign-in method.
15. Before the Doctor account is considered ready, require valid backup recovery codes with secure offline retention; encourage an additional Passkey when feasible.
16. Desktop/laptop compatibility checks must validate required capabilities and security features, not rely solely on spoofable browser device labels. Exact runtime support enforcement and test matrix remain open.
17. Email verification codes are supplemental verification/contact confirmation, not standalone proof of Doctor ownership or sole means of Main Admin recovery. Codes must be short-lived, single-use, rate-limited, and not logged in plaintext.
18. Changing the Doctor's registered email requires fresh strong identity proof, verification of the new address, audit, and notice to the old address where possible. Do not authorize based solely on a code to the new address.
19. If the old email is inaccessible, permit the change after independent strong Doctor identity verification plus new-email confirmation. Old-email access is not mandatory; attempt a security notice.
20. After a verified email change, allow ordinary notifications and non-sensitive email verification immediately, but introduce a temporary protection period before relying on the new address in sensitive recovery procedures. Preserve independent Passkey/backup-code recovery during this period. **Exact protection duration and rules are UNDECIDED.**

## Recovery safety invariants under discussion
- Three failed challenges suspend the specific challenge, **not** the Doctor account. Device/IP identification alone is insufficient for identity assurance or abuse resistance.
- Successful recovery invalidates prior sessions and codes, and establishes new credentials through a safe, consistent flow. Exact atomicity, sequencing, exception handling, rate limits, proof methods, notification delivery, and device compatibility are open for detailed contract and tests.
- God Admin may not silently impersonate the Doctor, bypass consent or verification, or read clinical records by virtue of its title.
- Main Admin operational authority does not remove patients' legal privacy rights.

## Checkpoint status
The founder requested stopping M4 discussion after selection #20. This checkpoint records the selections but **does not finalize or authorize implementation of the M4 contract**. M5 and M6 remain OPEN. No clinical release is authorized.

MANUSCRIPT IS AUTHORITY. CONTRACTS AUTHORIZE. PROOF VALIDATES. GIT PRESERVES. MOHAMED.K_ROBY DECIDES.
