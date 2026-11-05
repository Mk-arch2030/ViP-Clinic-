# CJ02-G03-M4 — Founder-approved current product boundary

Date: 2026-11-05
Authority: MOHAMED.K_ROBY (Founder)
Status: APPROVED SCOPE BOUNDARY; M4 detailed authority contract still OPEN
Scope: Documentation only; no clinical implementation, migration, merge, deployment, or release.

## Founder decision — current ViP Clinic product scope
- ViP Clinic in its **current scope** is a **single clinic** system.
- There is **exactly one owning Doctor**, who is the clinic's sole **Main Admin & Owner** and sole leader of clinic-system administration.
- The Doctor can run the entire clinic workflow alone.
- Optional nurse/staff accounts operate only under bounded permissions granted by the owning Doctor and enforced by the system; they do not become another Main Admin.
- No co-owner Doctor, multi-Doctor administration, multi-clinic tenancy, inter-clinic sharing, or cross-Doctor collaboration is authorized in the current scope.
- Earlier M4 A/B question about authority between multiple Doctors/clinics was **withdrawn as out of scope** and is not a founder selection.

## Future expansion boundary
The founder intends to **consider expansion only after the current single-clinic product is completed and its behavior, safeguards, and evidence have been satisfactorily verified**. Expansion requires a separate explicit founder decision and a distinct design/authorization process. Passing tests alone does not authorize clinical release or expansion.

## M4 corrected discussion scope
M4 concerns enforcement of the sole Doctor-owner's authority and denial of unauthorized actors within **one clinic**, including relevant FirstRegistrationIntent governance. Specific authorization checks and staff permissions remain subject to subsequent M4/M5 decisions. Do not infer implementation from this decision.

## Non-claims
This document is an approved **scope boundary**, not approval of all M4 details, and not evidence of code or database implementation. No push/merge of clinical code, PostgreSQL startup/migration, or deployment is authorized.

MANUSCRIPT IS AUTHORITY. CONTRACTS AUTHORIZE. PROOF VALIDATES. GIT PRESERVES. MOHAMED.K_ROBY DECIDES.
