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

CREATE TABLE clinic_days (
    clinic_day_id TEXT PRIMARY KEY,
    working_date DATE NOT NULL UNIQUE,
    status TEXT NOT NULL CHECK (status IN ('OPEN', 'CLOSED')),
    lifecycle TEXT NOT NULL CHECK (lifecycle IN ('WORKING', 'CONCLUDED')),
    counter INT NOT NULL DEFAULT 0,
    opened_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMPTZ,
    closed_by TEXT CHECK (closed_by IS NULL OR closed_by = 'Doctor')
);

