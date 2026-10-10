# Stage 6 — Owner-operated Infinix Browser Proof Checklist

STATUS: CHECKLIST_ONLY_NOT_EXECUTED  
SOURCE: Stage 6-A W01–W16 matrix; bounded device package  
AUTHORITY: Device build/prepare/start and browser mutations require their own decisions.

## Entry and evidence

- Record the exact full execution HEAD and reviewed source/build/database manifests.
- Record Android/Chrome version and device UTC time; the leaf must still be valid.
- Open only https://127.0.0.1:3443 after a separately authorized foreground start.
- Record Chrome's actual connection/security indication and available certificate
  details. Do not click through a certificate warning. Android root installation
  and Node's TLS tests do not substitute for this observation.
- Use only the private owner-chosen Stage 6 synthetic login/password inputs.
  Never send passwords, cookies, CSRF, verifier or private keys to chat/Git.
- Record each case independently as PASS_FOR_OBSERVED_ASSERTIONS, FAILED,
  NOT_EXECUTED or NOT_OBSERVABLE_WITH_CURRENT_DEVICE_TOOLS. Distinguish source,
  fake dependency, SQL, Node TLS and actual Chrome evidence.
- No test-admin HTTP endpoint, browser role source, mock fallback or schema reset.

## Initial permitted journey after execution authorization

1. Fresh entry: server session check; unauthenticated state, no Patient shown.
2. Wrong synthetic password and disabled synthetic Doctor: generic denial.
3. Active Nurse: server-resolved Nurse identity, current Patient operations denied.
4. Logout; active Doctor: server-resolved Doctor identity and permitted UUID lookup.
5. Find b6000000-0000-4600-8600-000000000001; then lookup the deliberately absent
   b6000000-0000-4600-8600-000000000002. Missing must clear the previous result.
6. Logout and reopen: no remembered browser identity can grant access.
7. One separately authorized positive synthetic registration only, after E0
   response contract checks pass. Capture returned UUID/CPN and retrieve that UUID.
   Never infer successful registration from a disabled button or a sent request.

These observations alone do not complete the matrix below.

| ID | Required case | Evidence and current gap |
| --- | --- | --- |
| W01 | Missing/invalid session | Valid-shaped request denied, no Patient disclosure/write; inspect target baseline separately |
| W02 | Forged stored/browser role or payload | Cannot establish server identity; requires separately reviewed request manipulation/tooling; no demo-store mutation |
| W03 | Wrong password, unknown label, disabled Actor | Generic denial; verify no usable session in target-only evidence |
| W04 | Expiry/revocation/credential replacement/deactivation | Actual next request denied; private target state controls not implemented in this package |
| W05 | Valid Nurse Patient actions | 403 for both GET and POST with valid request/CSRF, even FULL; disabled UI is not server proof |
| W06 | Missing/wrong CSRF or Origin/cross-site | Denial before business work; requires reviewed request tooling, compare target rows/sequence |
| W07 | HTTP/unexpected origin | Adapter refuses credentials before fetch; no cookie weakening or plaintext server; do not send test passwords over HTTP |
| W08 | Chrome TLS/login/session cookie | Browser accepts genuine TLS, session bootstrap uses safe server identity; cookie attributes/JS opacity need observable tooling, otherwise unproven |
| W09 | Doctor GET found/missing | 200/404 distinct, old result cleared, no demo fallback |
| W10 | Late GET and cross-tab revocation | Delayed-response control not implemented here; two-tab observation cannot substitute for all races |
| W11 | Reload/reopen/back after logout/expiry | Fresh bootstrap, protected content not restored as authority |
| W12 | Network/503/TLS/invalid JSON/lost POST response | Controlled fault injection not implemented; outcome unknown blocks further registration, no retry |
| W13 | Doctor POST then UUID GET | One expected new synthetic row, server UUID/CPN and one allocation; real SQL comparison required |
| W14 | Auth/business transaction failure | Private fault control not implemented; rows roll back, consumed nextval can remain as a gap |
| W15 | Demo and clinical contract preservation | No demo merge/reset, Past History loss, Visit overwrite, Case completion or day mutation |
| W16 | Assets/logging/lifecycle | No source/config/key exposure, allowlisted assets, loopback address and owned close; observed results required |

## Known outcome and lifecycle rules

Loss of a POST response, malformed success, timeout or uncertainty is an unknown
Patient outcome, not a rollback claim. Stop registration. Do not reload/relogin
or automatically resend to evade the UI block. Review target-only read evidence
before any further write authorization. Browser cancel does not undo a committed
INSERT. Do not reset sequences; record any fault-test allocation separately.

The start mode requires the fresh no-session baseline. A restart after login or
mutation deliberately blocks rather than reset it; diagnostics/restart policy
requires independent review. Android process termination is not graceful-close
evidence. Ctrl+C in the owning foreground Termux session closes only that Web
listener and its owned pool. Vite/PostgreSQL remain running and excluded.

After the test, use the agreed individual Uninstall action for the exact RobY
Stage6 CA entry, verify its disappearance, and preserve other entries. This is
Android trust restoration, not permission for database/cluster cleanup.

## Remaining tooling gate

This package prepares source/build/new-database/start modes. It deliberately does
not implement arbitrary SQL, reset/cleanup, credential/actor toggles, interception,
remote-debugging setup or browser-driving automation. Review exact controls and
their permissions before executing the outstanding failure/race cases.
Do not label Stage 6-F complete while required cases remain unobserved.
