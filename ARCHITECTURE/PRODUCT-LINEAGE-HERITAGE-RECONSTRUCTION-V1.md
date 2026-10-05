DR_ROBY PRODUCT LINEAGE — HERITAGE & RECONSTRUCTION V1

1. PURPOSE

This document records the verified product lineage and reconstruction path from the original Dr_Roby heritage through the copied ViP product, its Local Storage runtime, cross-device portability validation, ARM compatibility adaptation, Standalone repository preservation, and the subsequent PostgreSQL reconstruction in ViP.

This document exists to preserve product history, technical heritage, runtime evidence, portability evidence, architectural continuity, and the genetic relationship between the historical runtime and the current factory reconstruction.

This is a lineage and evidence record.

It does not itself authorize authentication, authorization, API expansion, UI implementation, deployment, real clinical use, pilot use, or production use.

---

2. PRODUCT LINEAGE

Dr_Roby original heritage
          ↓
ViP copied product
          ↓
Local Storage functional runtime
          ↓
Infinix validation
          ↓
ZIP portability boundary
          ↓
Redmi 9A / ARM validation
          ↓
ARM compatibility adaptation
          ↓
DNA / fingerprints preserved
          ↓
Standalone Git repository
          ↓
PostgreSQL reconstruction in ViP
          ↓
REAL public.actors
          ↓
FIRST REAL MAIN ADMIN
          ↓
Dr_Roby / DOCTOR / ACTIVE
          ↓
01a10d74-d2cd-7354-a5ec-228ba8988efb

---

3. HERITAGE — Dr_Roby

The original Dr_Roby product is the architectural and product heritage from which the subsequent copied product lineage derives.

The heritage establishes the product identity, domain concepts, workflow boundaries, Actor model, Doctor/Nurse authority model, and the factory's historical implementation foundation.

The historical heritage remains valid evidence.

It is not erased merely because later persistence technology changed.

---

4. COPIED PRODUCT — ViP

ViP is the copied product derived from the Dr_Roby heritage.

The copy is part of the same product lineage and therefore preserves the relevant product concepts, domain boundaries, behavioral expectations, and historical implementation knowledge.

The ViP product subsequently became the active factory reconstruction environment.

Dr_Roby
   ↓
ViP

This relationship is part of the product's recorded lineage.

---

5. HISTORICAL RUNTIME — LOCAL STORAGE

The copied product was first exercised as a functional runtime using Local Storage persistence.

The historical runtime established real behavioral evidence before the later PostgreSQL reconstruction.

Historical Local Storage behavior included persistent patient data and product runtime behavior.

The existence of the later PostgreSQL implementation does not invalidate this historical runtime.

It is preserved as product heritage and behavioral evidence.

Historical persistence:
Local Storage

Current reconstructed persistence:
PostgreSQL

The persistence technology changed.

The product lineage did not.

---

6. INFINIX VALIDATION

The Local Storage runtime was extracted and executed on the Infinix development environment.

The product was exercised as a real runtime in the Termux environment and validated before the portability experiment.

This established the first practical runtime boundary for the copied product.

ViP copied product
        ↓
Local Storage runtime
        ↓
Infinix validation

---

7. ZIP PORTABILITY BOUNDARY

The product runtime was packaged into a ZIP artifact.

The ZIP became a concrete portability boundary between the validated Infinix runtime and the subsequent independent device validation.

The purpose was not merely backup.

The artifact was used to determine whether the product runtime could be reconstructed outside the original development environment.

---

8. REDMI 9A / ARM VALIDATION

The same product lineage was extracted and reconstructed on a Redmi 9A using Termux.

The Redmi environment introduced a materially different ARM runtime environment and exposed compatibility limitations that were not merely theoretical.

The product was successfully brought to runtime operation on the Redmi environment.

This established real cross-device portability evidence.

Infinix
   ↓
ZIP artifact
   ↓
Redmi 9A
   ↓
ARM runtime

---

9. ARM COMPATIBILITY ADAPTATION

The Redmi runtime exposed compatibility problems involving the existing Tailwind/lightningcss toolchain and ARM-specific native module availability.

The adaptation was performed without discarding the product's functional visual behavior.

The resulting compatibility path preserved the required UI behavior while recording the original configuration and adaptation history.

Recorded adaptation evidence includes:

vite.config.ts.tailwind-plugin-failure-proof
vite.config.ts.before-arm32-test
package.json.portability-baseline
src/index.css.pre-redmi-compat
scripts/generate-redmi-css.mjs

The generated compatibility CSS was independently validated.

Recorded evidence included:

FILES = 14
CANDIDATES = 432
CSS_BYTES = 53912

BG_BLUE = PASS
ROUNDED = PASS
GRID = PASS

The resulting Redmi runtime was visually validated as functional.

---

10. DNA / FINGERPRINT PRESERVATION

The Standalone runtime was preserved as a fingerprinted product artifact.

The purpose of preservation was to retain the exact historical runtime lineage, including the compatibility adaptations required for the Redmi ARM environment.

The preserved artifact therefore represents more than a backup.

It is a reproducible historical runtime reference.

The release archive was fingerprinted with:

SHA256
f2dd878679c1d18003e5822bbcae59c0a5ff37d5a8de607659c7d67e9487b762

The corresponding Standalone repository established a permanent Git history for this runtime lineage.

---

11. STANDALONE GIT REPOSITORY

The Redmi-validated runtime was preserved as:

Dr_Roby_Clinic_Standalone

Repository:

Mk-arch2030/Dr_Roby_Clinic_Standalone

Initial standalone release milestone:

85c75dd
release: establish first standalone product runtime

This repository preserves the product's historical runtime and portability lineage independently from the current PostgreSQL reconstruction.

Therefore:

Dr_Roby_Clinic_Standalone
=
Product Heritage
+
Runtime Reference
+
Portability Evidence
+
Architectural Memory

It is not treated as an obsolete discarded implementation.

---

12. POSTGRESQL RECONSTRUCTION IN ViP

Following the historical runtime and portability validation, the ViP product entered a controlled persistence reconstruction.

The historical Local Storage implementation remained preserved as lineage evidence while PostgreSQL became the current reconstructed persistence foundation.

The reconstruction established:

PostgreSQL 18.2
        ↓
vip_clinic
        ↓
public.actors
        ↓
UUIDv7 actor persistence

The Actor persistence foundation was separately authorized, implemented, behaviorally tested, and proven with rollback safety.

---

13. FIRST REAL "public.actors" WRITE

The first real Actor was subsequently written into the live PostgreSQL database.

This was not a test row.

It was the first real persisted Actor of the reconstructed ViP runtime.

Recorded live values:

ACTOR_ROLE = DOCTOR
LIFECYCLE_STATE = ACTIVE

ACTOR_ID =
01a10d74-d2cd-7354-a5ec-228ba8988efb

The live runtime identity was:

POSTGRES_RUNTIME_ROLE = u0_a282
DATABASE = vip_clinic
PHYSICAL_OBJECT = public.actors

Patient data was preserved during the write.

The live proof established:

FIRST_REAL_MAIN_ADMIN_ACTOR_WRITE = PASS
DATA_PRESERVATION = PASS
FAIL = 0

---

14. FIRST REAL MAIN ADMIN

The first real Actor represents the initial Main Admin of the reconstructed product.

MAIN_ADMIN = Dr_Roby
USERNAME = DR/MK_ROBY
ROLE = DOCTOR
LIFECYCLE = ACTIVE

The distinctions are intentional:

Dr_Roby
=
Main Admin
+
Doctor
+
Clinical Authority
+
System Owner

DR/MK_ROBY
=
Authentication Login Identifier

actor_id
=
Actor Persistence Key

u0_a282
=
PostgreSQL Runtime Role

These identities are not interchangeable.

The username is not the Actor persistence key.

The username is not the authority itself.

The PostgreSQL runtime role is not the product Actor.

---

15. FINAL LINEAGE STATE

The complete verified lineage is:

Dr_Roby original heritage
          ↓
ViP copied product
          ↓
Local Storage functional runtime
          ↓
Infinix validation
          ↓
ZIP portability boundary
          ↓
Redmi 9A / ARM validation
          ↓
ARM compatibility adaptation
          ↓
DNA / fingerprints preserved
          ↓
Standalone Git repository
          ↓
PostgreSQL reconstruction in ViP
          ↓
REAL public.actors
          ↓
FIRST REAL MAIN ADMIN
          ↓
Dr_Roby / DOCTOR / ACTIVE
          ↓
01a10d74-d2cd-7354-a5ec-228ba8988efb

---

16. FACTORY INTERPRETATION

The historical and current implementations are both part of the product lineage.

Dr_Roby_Clinic_Standalone
=
Historical Product Heritage
+
Runtime Reference
+
Portability Proof
+
ARM Compatibility Evidence
+
DNA Preservation

ViP-Clinic-
=
Current Factory Reconstruction
+
PostgreSQL Persistence
+
Controlled Actor Implementation
+
Live Database Evidence

The transition from Local Storage to PostgreSQL is therefore recorded as a reconstruction and technological evolution, not as deletion of product history.

The factory preserves both the old and the new.

OLD = VALID HERITAGE
NEW = CURRENT RECONSTRUCTION
LINEAGE = PRESERVED
DATA = PRESERVED
IDENTITY = PRESERVED
ARCHITECTURAL CONTINUITY = PRESERVED

---

17. AUTHORITY BOUNDARY

This document records lineage and evidence only.

It does not authorize:

AUTHENTICATION IMPLEMENTATION
AUTHORIZATION IMPLEMENTATION
NEW API OPERATIONS
NURSE CREATION
PATIENT DATA MODIFICATION
CASE IMPLEMENTATION
VISIT IMPLEMENTATION
UI IMPLEMENTATION
DEPLOYMENT
REAL CLINICAL USE
REAL PILOT
PRODUCTION USE

Those actions remain subject to their own explicit authority artifacts.

---

18. FINAL STATUS

PRODUCT_LINEAGE = CLOSED + PROVEN
HERITAGE_CONTINUITY = PROVEN
LOCAL_STORAGE_RUNTIME_HISTORY = PRESERVED
INFINIX_VALIDATION = PRESERVED
ZIP_PORTABILITY_BOUNDARY = PRESERVED
REDMI_9A_ARM_VALIDATION = PROVEN
ARM_COMPATIBILITY_ADAPTATION = PRESERVED
DNA_FINGERPRINT = PRESERVED
STANDALONE_REPOSITORY = PRESERVED
POSTGRESQL_RECONSTRUCTION = PROVEN
REAL_PUBLIC_ACTORS = PROVEN
FIRST_REAL_MAIN_ADMIN = PROVEN

MAIN_ADMIN = Dr_Roby
USERNAME = DR/MK_ROBY
ROLE = DOCTOR
LIFECYCLE = ACTIVE

ACTOR_ID =
01a10d74-d2cd-7354-a5ec-228ba8988efb

DATA_PRESERVATION = PROVEN
AUTHORITY_TRANSFER = NO
UNAUTHORIZED_EXPANSION = NO

FAIL = 0

0 FAIL ™ 🧬✅
