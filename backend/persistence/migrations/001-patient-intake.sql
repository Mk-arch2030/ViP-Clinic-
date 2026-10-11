-- Reviewed source only. Never applied automatically by app startup.
-- Apply once, in an explicitly authorized database transaction.
BEGIN;
CREATE TABLE patient_intakes (
    patient_id UUID PRIMARY KEY REFERENCES patients(patient_id)
);
-- A marker with zero items means the form was saved with empty history fields.
-- No marker means history was not captured by this contract; never backfill it.
CREATE TABLE past_history_items (
    item_id UUID PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patient_intakes(patient_id),
    category TEXT NOT NULL CHECK (category IN
      ('chronicIllnesses', 'knownAllergies', 'surgicalHistory', 'familyHistory', 'lifestyleNotes')),
    position INTEGER NOT NULL CHECK (position >= 0 AND position < 32),
    content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 2000),
    UNIQUE (patient_id, category, position),
    CHECK (category <> 'lifestyleNotes' OR position = 0),
    CHECK (category = 'lifestyleNotes' OR char_length(content) <= 500)
);
COMMIT;
