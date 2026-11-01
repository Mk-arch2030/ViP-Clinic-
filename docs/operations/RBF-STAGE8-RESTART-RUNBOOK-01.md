# RBF-STAGE8-RESTART-RUNBOOK-01

Status: DRAFT — Synthetic Acceptance Environment
Owner: MOHAMED.K_ROBY
Environment: Infinix / Termux / ViP-Clinic-Stage8

## 1. Scope

This runbook documents controlled restart and readiness checks for
the Stage 8 synthetic acceptance environment.

It does not authorize clinical deployment, database migrations,
seeding, resets, Git commits, pushes, or merges.

## 2. Verified Environment Identity

Repository: ~/ViP-Clinic-Stage8
PostgreSQL data: ~/roby-stage8-pg/data
PostgreSQL socket: ~/roby-stage8-pg/socket
PostgreSQL port: 55445
Database: roby_stage8_acceptance
Database system identifier: 7698378941885896125
TLS directory: ~/roby-stage8-pg/tls-acceptance-v1
Frontend assets: ~/ViP-Clinic-Stage8/dist-stage8-acceptance
HTTPS endpoint: https://127.0.0.1:3443

Identity and readiness were observed on 2026-11-01.
These observations must not be treated as permanent runtime state.

## 3. PostgreSQL Readiness

Run:

    pg_isready -h "$HOME/roby-stage8-pg/socket" -p 55445 -d roby_stage8_acceptance

If accepting connections, do not start another server.

Verify database identity:

    psql -h "$HOME/roby-stage8-pg/socket" -p 55445 -d roby_stage8_acceptance -X -A -t -c "SELECT current_database(), current_setting('port'), current_setting('unix_socket_directories'), (pg_control_system()).system_identifier::text, pg_postmaster_start_time();"

Expected database, port, socket and system identifier must match
Section 2 before continuing.

If the server is unavailable, determine whether it stopped cleanly.
Do not delete postmaster.pid, modify WAL, or automatically start
a cluster with unresolved process/control-file state.

After a confirmed safe stop, the historically successful command is:

    pg_ctl -D "$HOME/roby-stage8-pg/data" -l "$HOME/roby-stage8-pg/stage8-postgres-restart.log" -w -t 30 start

This command is conditional, not an automatic recovery procedure.

## 4. HTTPS Backend Readiness

Run:

    curl -ksS -o /dev/null -w 'BACKEND_HTTP_STATUS=%{http_code}\n' --max-time 10 https://127.0.0.1:3443/auth/session

HTTP 401 without authentication is an acceptable indication that
the HTTPS authentication endpoint responds.

HTTP 401 is not proof of successful login or full application health.

Do not start a second backend if the current instance is responding.

## 5. Backend Start — Only When Stopped

Prerequisites:
- PostgreSQL ready and database identity verified.
- HTTPS backend confirmed stopped.
- TLS and frontend assets present.
- Dedicated Termux session available.

Run:

    cd "$HOME/ViP-Clinic-Stage8" && node -e 'const {startDevice,TOKEN}=require("./backend/api/stage8-device-adapter.cjs");startDevice({token:TOKEN,listen:true}).then(r=>{console.log("BACKEND_STATUS="+r.status);console.log("BACKEND_ADDRESS="+r.address);}).catch(e=>{console.error("BACKEND_START_FAILED="+e.message);process.exitCode=1;});'

Expected startup status:

    STAGE8_HTTPS_STARTED_NOT_E2E_PROOF

Keep the backend Termux session running.

The adapter validates TLS, assets and database identity before
starting the HTTPS listener. Importing the adapter alone does not
start the server or execute migrations.

## 6. Synthetic Doctor Login

Open:

    https://127.0.0.1:3443

Authenticate using the authorized synthetic Doctor test account.

Do not store passwords, cookies, tokens or session secrets in this
runbook.

Successful Doctor login was observed previously in the browser.
A fresh login must be checked after each restart.

## 7. Stop and Escalation Conditions

Stop and investigate if:
- Database identity differs from the expected identifier.
- PostgreSQL process state conflicts with control-file state.
- Backend endpoint fails or returns unexpected errors.
- TLS or frontend assets fail verification.
- Authentication fails unexpectedly.

Do not:
- Remove PostgreSQL PID or WAL files as a shortcut.
- Run Migration 003 automatically.
- Modify preservation or recovery copies.
- Interpret synthetic login as clinical production authorization.
- Commit, push, merge or deploy without separate approval.

## 8. Evidence Boundaries

2026-11-01:
- PostgreSQL identity verified.
- PostgreSQL pg_isready: accepting connections.
- HTTPS /auth/session without cookie: HTTP 401.
- Backend startup implementation inspected.
- Synthetic Doctor login previously observed.

These observations establish limited operational evidence only.
They do not establish complete end-to-end clinical readiness.

## 9. Document Governance

This document is a draft operational runbook.
Its creation does not modify the Golden baseline or authorize release.

MANUSCRIPT IS AUTHORITY.
CONTRACTS AUTHORIZE.
PROOF VALIDATES.
GIT PRESERVES.
MOHAMED.K_ROBY DECIDES.

SYNTHETIC DATA IS NOT CLINICAL DATA.
SYNTHETIC PROOF IS NOT PRODUCTION AUTHORIZATION.
