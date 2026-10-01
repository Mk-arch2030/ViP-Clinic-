CREATE SEQUENCE clinic_patient_number_seq
    START WITH 1
    INCREMENT BY 1;

CREATE TABLE patients (
    patient_id UUID PRIMARY KEY DEFAULT uuidv7(),
    clinic_patient_number TEXT NOT NULL UNIQUE
        DEFAULT 'CPN-' || nextval('clinic_patient_number_seq')::text,
    name TEXT NOT NULL,
    date_of_birth DATE,
    profession TEXT NOT NULL,
    phone TEXT NOT NULL,
    gender TEXT NOT NULL
        CHECK (gender IN ('Male', 'Female'))
);
