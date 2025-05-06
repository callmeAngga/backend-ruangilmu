--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

--
-- Name: update_updated_at_column_courses(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column_courses() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column_courses() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    course_id integer NOT NULL,
    course_name character varying(255) NOT NULL,
    course_description text NOT NULL,
    course_image_profile character varying(255) NOT NULL,
    course_image_cover character varying(255) NOT NULL,
    course_price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: courses_course_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_course_id_seq OWNER TO postgres;

--
-- Name: courses_course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_course_id_seq OWNED BY public.courses.course_id;


--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enrollments (
    enrolment_id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    progress integer DEFAULT 0,
    is_completed boolean DEFAULT false,
    enrolment_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT enrollments_progress_check CHECK (((progress >= 0) AND (progress <= 100)))
);


ALTER TABLE public.enrollments OWNER TO postgres;

--
-- Name: enrollments_enrolment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.enrollments_enrolment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enrollments_enrolment_id_seq OWNER TO postgres;

--
-- Name: enrollments_enrolment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.enrollments_enrolment_id_seq OWNED BY public.enrollments.enrolment_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    nama character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    tanggal_lahir date,
    kelas integer,
    isverified boolean DEFAULT false,
    role character varying(50) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    firebase_uid character varying(255),
    CONSTRAINT users_kelas_check CHECK ((kelas = ANY (ARRAY[4, 5, 6]))),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'user'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: courses course_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN course_id SET DEFAULT nextval('public.courses_course_id_seq'::regclass);


--
-- Name: enrollments enrolment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments ALTER COLUMN enrolment_id SET DEFAULT nextval('public.enrollments_enrolment_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (course_id, course_name, course_description, course_image_profile, course_image_cover, course_price, created_at, updated_at) FROM stdin;
1	Matematika Kelas 4 Semester 1	Belajar dasar-dasar matematika untuk siswa kelas 4 semester 1.	kelas4-sem1-profile.jpg	kelas4-sem1-cover.jpg	100.00	2025-04-08 09:05:38.01302	2025-04-08 09:05:38.01302
2	Matematika Kelas 4 Semester 2	Lanjutan materi matematika untuk kelas 4 semester 2.	kelas4-sem2-profile.jpg	kelas4-sem2-cover.jpg	100.00	2025-04-08 09:05:38.01302	2025-04-08 09:05:38.01302
3	Matematika Kelas 5 Semester 1	Pemahaman lebih dalam konsep matematika untuk kelas 5 semester 1.	kelas5-sem1-profile.jpg	kelas5-sem1-cover.jpg	100.00	2025-04-08 09:05:38.01302	2025-04-08 09:05:38.01302
4	Matematika Kelas 5 Semester 2	Materi lanjutan matematika kelas 5 semester 2.	kelas5-sem2-profile.jpg	kelas5-sem2-cover.jpg	100.00	2025-04-08 09:05:38.01302	2025-04-08 09:05:38.01302
5	Matematika Kelas 6 Semester 1	Persiapan menuju ujian akhir dengan materi kelas 6 semester 1.	kelas6-sem1-profile.jpg	kelas6-sem1-cover.jpg	100.00	2025-04-08 09:05:38.01302	2025-04-08 09:05:38.01302
6	Matematika Kelas 6 Semester 2	Materi penutup matematika SD di kelas 6 semester 2.	kelas6-sem2-profile.jpg	kelas6-sem2-cover.jpg	100.00	2025-04-08 09:05:38.01302	2025-04-08 09:05:38.01302
\.


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollments (enrolment_id, user_id, course_id, progress, is_completed, enrolment_date) FROM stdin;
1	24	1	0	f	2025-04-14 21:58:28.709537
2	24	4	0	f	2025-04-15 04:24:36.930283
3	24	5	0	f	2025-04-15 04:30:50.540676
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, nama, email, password, tanggal_lahir, kelas, isverified, role, created_at, updated_at, firebase_uid) FROM stdin;
24	Wong	wongfromindo@gmail.com	$2b$10$CgvQmF4FQPHUv17bwgxOxeHjQC00ZOjEi5xTarCh2ET2.qJoUCQ12	\N	\N	t	user	2025-04-08 11:23:28.540537	2025-04-08 11:24:35.495729	\N
22	Angga Prasetyo	prasetyoangga817@gmail.com	$2b$10$arawyPWkciiN5JSnA3lk8.ngoheAG0sC1QKZEQ6/jKG8R6mtPpr9i	\N	\N	t	user	2025-04-08 09:52:54.321248	2025-04-14 10:50:43.489367	QtcB1tJxqzVtLDJGHQi8dVMu2kH3
\.


--
-- Name: courses_course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_course_id_seq', 6, true);


--
-- Name: enrollments_enrolment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.enrollments_enrolment_id_seq', 3, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 24, true);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (course_id);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (enrolment_id);


--
-- Name: enrollments enrollments_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_firebase_uid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_firebase_uid_key UNIQUE (firebase_uid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: courses set_updated_at_courses; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_courses BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column_courses();


--
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(course_id) ON DELETE CASCADE;


--
-- Name: enrollments enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

