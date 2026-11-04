# CJ02 — Termux Read-only Founder Handoff V1

Owner: MOHAMED.K_ROBY
Status: PREPARED HANDOFF / NOT EXECUTED
Date: 2026-11-04

## Goal
After the documentation batch, Founder uses Infinix/Termux to verify local repository identity, branch, working-tree status and availability of documented architecture artifacts. This handoff does not authorize implementation or PostgreSQL startup.

## Safety
- Preserve Golden, original Git history, uncommitted changes and existing PostgreSQL original/preservation/recovery copies.
- No push, merge, checkout, reset, clean, pull, migration, server start, database writes or clinical release without separate explicit authorization.
- Never infer local checkout equals GitHub docs branch.
- Execute one read-only command, inspect output, then decide the next command.
- Do not paste credentials, tokens, patient identifiers or clinical content in chat.
- If working directory is uncertain, first inspect pwd; if repository identity differs, STOP and report.
- Any database proof must use a separately authorized positively identified disposable target; no DB execution in this handoff.

## Founder STEP T01 (one command only)
```sh
pwd
```
Send the exact output. Next read-only checks can include `git rev-parse --show-toplevel`, `git status --short --branch`, `git rev-parse HEAD`, and `git remote -v` (redact any credentials), each individually after inspection. Do not assume a particular local path or branch.

## GitHub documents to compare
- ARCHITECTURE/CJ02-G02-C-C3-C6-ACCESS-RECOVERY-AUTHORITY-AUDIT-DESIGN-V1.md
- ARCHITECTURE/CJ02-G02-C-FOUNDER-DECISION-BATCH-REGISTER-V1.md
- ARCHITECTURE/CJ02-G02-C-FOUNDER-DECISION-C1-A-V1.md
- ARCHITECTURE/CJ02-G02-C-FOUNDER-DECISION-C2-A-V1.md

## Later proof matrix (not run)
Doctor-only revoke; Nurse denied; active delegation; terminal-state replay; cross-patient privacy; concurrency revoke/consume; Day closure race; receipt recovery; no duplicate Case/Visit; legacy receipt compatibility; immutable audit. Source test selection, historical exclusions and database identity must be enumerated before execution.

GITHUB_DOCS = DESIGN_ONLY
TERMUX_HANDOFF = PREPARED_NOT_EXECUTED
DATABASE_MIGRATION = NOT_AUTHORIZED
CLINICAL_RELEASE = NOT_AUTHORIZED

MANUSCRIPT IS AUTHORITY. CONTRACTS AUTHORIZE. PROOF VALIDATES. GIT PRESERVES. MOHAMED.K_ROBY DECIDES.
