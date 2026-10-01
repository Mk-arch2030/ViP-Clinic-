--
-- PostgreSQL database dump
--

\restrict Pw9HhbeZVgTwOcGV7FQP39TlG6AtioaxvfY4U3Sq4NPNdJKMApfggkNThJa0iHG

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.patients (patient_id, clinic_patient_number, name, age, profession, phone, gender) FROM stdin;
2e1e59bb-5ddd-41d9-849d-2dc9e563b440	CPN-2	P1 Real Registration	40	Engineer	01000000002	Male
29ee29e6-6215-4c68-bff9-fe90ee6f19f7	CPN-14	P2 Runtime Patient	41	Engineer	01000000001	Male
5fab4801-a8f8-401c-b828-2165dfb68f00	CPN-15	P2 Runtime Patient 2	42	Engineer	01000000002	Male
2c700c20-aec2-4fbd-86b2-7a2b733d8cfa	CPN-16	REAL SQL Proof Patient	36	Proof Engineer	01000000016	Male
\.


--
-- Name: clinic_patient_number_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.clinic_patient_number_seq', 16, true);


--
-- PostgreSQL database dump complete
--

\unrestrict Pw9HhbeZVgTwOcGV7FQP39TlG6AtioaxvfY4U3Sq4NPNdJKMApfggkNThJa0iHG
