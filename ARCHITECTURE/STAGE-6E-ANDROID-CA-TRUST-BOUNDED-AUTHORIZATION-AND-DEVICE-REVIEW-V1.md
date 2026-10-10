# Stage 6-E — Android CA Trust Bounded Authorization and Device Review V1

OWNER: MOHAMED.K_ROBY
DECISION_DATE: 2026-10-10 (Africa/Cairo)
REVIEWED_SOURCE_HEAD: 9a6905494054be36bd4c7620c87d6124c2368f18
STATUS: OWNER_AUTHORIZED_DEVICE_INSTALL_AND_VERIFICATION_NOT_YET_EXECUTED
GIT_SCOPE: THIS_NEW_DOCUMENT_ONLY
ANDROID_BROWSER_TLS_PROOF: NOT_EXECUTED
LISTENER_AND_DATABASE_EXECUTION: NOT_GRANTED_BY_THIS_DECISION
PRODUCTION_DEPLOYMENT_AND_CLINICAL_USE: NOT_GRANTED
DECISION_E_CLUSTER_CLEANUP: NOT_AUTHORIZED

## Authority and temporal reconciliation

Read with the [Stage 6-A decision package](./STAGE-6A-BOUNDED-WEB-INTEGRATION-DECISION-PACKAGE-V1.md),
[design](./STAGE-6A-WEB-AUTHENTICATION-AND-PATIENT-ADAPTER-DESIGN-V1.md)
and [6-B–D source record](./STAGE-6B-D-WEB-INTEGRATION-IMPLEMENTATION-AND-WORK-VALIDATION-V1.md).
Their earlier ungranted device-trust statements retain their historical meaning.

The owner first authorized only public CA export, fingerprint/validity verification
and read-only isolation review, excluding installation and Android trust changes.
After those observations and a concrete current-profile trust proposal, the owner
explicitly approved independent installation/verification authority and requested
GitHub preservation followed by protected Termux synchronization (17:39 Africa/Cairo).
This grants only the exact public CA installation in the current Android user,
inspection of its resulting trust entry, and later removal of that exact entry.
It does not authorize other trust anchors, device administration/profile creation,
TLS bypass, network listeners, database preparation/connections, or clinical use.

GitHub publication preserves instructions and the grant. It cannot install an
Android certificate. Device execution remains owner-operated and evidence-gated.

## Owner-reported device evidence

Device: INFINIX SMART 10 / Infinix X6725; Android 15 / API 35.
Public certificate preparation was reported completed on Termux:
offline chain, IP SAN, key-match and validity checks passed; RSA key size 3072.
No certificate/private key is committed or transported through GitHub.

The public-only export reported:
- UTC device time: 2026-10-10T14:15:38.708774+00:00.
- Subject: CN=RobY Stage6 Device Test CA 9a690549.
- SHA-256: 7EC5EC247C13012F208D693AD869928B121D6916C9455567C3924659B660A0CC.
- Validity: 2026-10-10 06:47:02 UTC through 2026-10-13 06:47:02 UTC.
- Downloads: /storage/emulated/0/Download/RobY-Stage6-CA-9a690549-7ec5ec24.cer.
- Exported bytes and fingerprint matched; validity verified at that device time.
- No Android trust change, profile creation, listener or database connection.
- Private keys, protected files, Git and prior clusters were not accessed by export.

The server leaf was separately reported to cover IP 127.0.0.1 and to expire
2026-10-12 06:47:03 UTC (09:47:03 Africa/Cairo). CA expiry is 13 October
09:47:02 Africa/Cairo. Recheck current validity before installation/testing.
An expired certificate blocks proof; do not silently regenerate or bypass TLS.

Device source tests were reported 25/25 and active regression 52/52, zero failures.
These are source/test results, not Android certificate trust or browser proof.

## Isolation review and explicit limitation

Read-only device properties advertised managed_users; low_ram was true.
Multiple-user properties were unset/unavailable, not a conclusive support test.
Settings searches did not expose Multiple users, Guest or Private space.
The visible Work profile screen required an IT administrator code and management
tool download. No provisioning, installation or administration was performed.
Users & Accounts showed application accounts, not a demonstrated separate user.

No usable isolated trust profile has been established by this review.
This is not a claim that every device isolation mechanism is unsupported.

The owner accepts the proposed current-user installation for this bounded test.
A user CA is not limited to ViP Clinic, 127.0.0.1, or TCP port 3443:
its trust scope depends on consuming applications and the Android user/profile.
The leaf IP SAN does not restrict CA signing authority. Another port, Incognito
or an app clone is not accepted as evidence of certificate-trust isolation.
Short certificate validity does not automatically remove an installed trust entry.

## Device installation and verification procedure

1. Immediately before installation, verify the existing public Downloads file
   still has the exact SHA-256 above and the public CA remains currently valid.
   Read only public certificate material; no private-key inspection or export.
2. In Settings search for "Encryption & credentials", "Install a certificate",
   "CA certificate" or "Trusted credentials". Exact XOS navigation is not yet
   observed; use device screenshots to resolve menu differences.
3. Inspect the existing User trust list first. If a matching CA already exists,
   verify it instead of creating a duplicate. Other entries are outside scope.
4. Select the CA certificate installation option, not Wi-Fi or VPN/app client
   certificate installation. Select only the reviewed Downloads .cer file.
   Read the system trust warning and authenticate using the existing device lock;
   do not transmit PIN/password to chat. If a new lock or management setup is
   required, stop for review rather than changing unrelated device configuration.
5. In Trusted credentials -> User (or the observed equivalent), open the installed
   entry and verify subject, SHA-256 fingerprint and validity against this record.
   If Android does not display a required field, mark it unobserved, not PASS.
6. Report observed installation result, exact menu path and public certificate
   details. No browser connection is performed under this decision.

Stop for wrong/expired fingerprint, unexpected installer category, nonmatching
subject, ambiguous duplicate entry, additional permissions/profile administration,
or inability to inspect the resulting entry. Do not press through browser warnings,
disable TLS validation, clear all credentials or alter system trust entries.

## Removal and acceptance

After the separately authorized test, remove only this exact user CA using its
individual entry, identified by subject and fingerprint. Verify that this entry
is absent and unrelated entries remain present. Never use Clear credentials,
delete private material or remove all trust entries as a shortcut.
Certificate removal is trust restoration for this bounded test, not Decision E
cluster cleanup. Removal also needs observed device evidence.

Acceptance labels remain independent:
PUBLIC_CA_EXPORT = OWNER_REPORTED_PASS
ISOLATED_TRUST_PROFILE = NOT_ESTABLISHED
ANDROID_CA_INSTALL_AND_ENTRY_VERIFICATION = AUTHORIZED_NOT_EXECUTED
ANDROID_BROWSER_TRUSTED_TLS = NOT_EXECUTED
STAGE6_BROWSER_AND_POSTGRESQL_MATRIX = NOT_EXECUTED
CA_REMOVAL_AND_RESTORATION = NOT_EXECUTED

Installation/entry verification alone cannot prove browser TLS, cookie behavior,
CSRF, server authorization or the full Stage 6-F matrix.

## Preservation and next gate

Add only this document. Preserve all existing source, README, contracts, package
locks and the four protected local dirty files. Never commit keys, certificates,
device trust-store exports, credentials or browser Patient data.
Safe Termux sync must review one added path, exact downloaded bytes, expected
remote HEAD, collisions and preserved worktree/index/protected state.

A documentation commit changes repository HEAD, not the recorded source-test
HEAD. Existing certificate labels remain source provenance. A future build/start
package must reconcile its exact execution HEAD, unchanged tested source bytes
and independently prepared Stage 6 manifest; do not reuse a stale HEAD blindly.

Next: owner-operated installation and entry verification only. The subsequent
browser/listener/new-database gate requires a separate concrete decision.
Current Vite, historical PostgreSQL cluster, prior proof databases and existing
isolated cluster remain excluded. No stop/restart/reset/drop/cleanup authority.

## Primary reference boundaries

- [Android KeyChain](https://developer.android.com/reference/android/security/KeyChain):
  Android 11+ CA installation uses Settings; application credential installation
  is distinct from a user CA.
- [AOSP multi-user](https://source.android.com/docs/devices/admin/multi-user):
  user/profile availability and restrictions depend on product configuration.
- [Android certificate help](https://support.google.com/pixelphone/answer/2844832?hl=en):
  individual credential removal guidance; Pixel navigation and Wi-Fi installation
  instructions are not assumed to be the Infinix CA installer path.
- [Chromium trust FAQ](https://chromium.googlesource.com/chromium/src/+/main/net/data/ssl/chrome_root_store/faq.md):
  browser trust handling is distinct from merely generating certificate material.

These references inform review; actual XOS menus and browser behavior require
observed device evidence.

**Manuscript is authority. Contracts authorize. Proof validates. Git preserves. MOHAMED.K_ROBY decides.**
