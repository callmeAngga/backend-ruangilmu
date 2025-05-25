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
-- Name: certificates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificates (
    certificate_id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    certificate_number character varying(30) NOT NULL,
    final_score integer NOT NULL,
    issue_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.certificates OWNER TO postgres;

--
-- Name: certificates_certificate_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.certificates_certificate_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certificates_certificate_id_seq OWNER TO postgres;

--
-- Name: certificates_certificate_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.certificates_certificate_id_seq OWNED BY public.certificates.certificate_id;


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
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    course_slug character varying(255)
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
-- Name: module_contents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.module_contents (
    content_id integer NOT NULL,
    module_id integer NOT NULL,
    content_type character varying(20) NOT NULL,
    content text NOT NULL,
    content_order integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.module_contents OWNER TO postgres;

--
-- Name: module_contents_content_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.module_contents_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.module_contents_content_id_seq OWNER TO postgres;

--
-- Name: module_contents_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.module_contents_content_id_seq OWNED BY public.module_contents.content_id;


--
-- Name: modules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modules (
    module_id integer NOT NULL,
    course_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    module_order integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.modules OWNER TO postgres;

--
-- Name: modules_module_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.modules_module_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.modules_module_id_seq OWNER TO postgres;

--
-- Name: modules_module_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.modules_module_id_seq OWNED BY public.modules.module_id;


--
-- Name: quiz_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quiz_options (
    quiz_option_id integer NOT NULL,
    question_id integer NOT NULL,
    option_text text NOT NULL,
    option_order integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.quiz_options OWNER TO postgres;

--
-- Name: quiz_options_quiz_option_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quiz_options_quiz_option_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quiz_options_quiz_option_id_seq OWNER TO postgres;

--
-- Name: quiz_options_quiz_option_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quiz_options_quiz_option_id_seq OWNED BY public.quiz_options.quiz_option_id;


--
-- Name: quiz_questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quiz_questions (
    question_id integer NOT NULL,
    quiz_id integer NOT NULL,
    question_text text NOT NULL,
    question_order integer NOT NULL,
    correct_option_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.quiz_questions OWNER TO postgres;

--
-- Name: quiz_questions_question_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quiz_questions_question_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quiz_questions_question_id_seq OWNER TO postgres;

--
-- Name: quiz_questions_question_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quiz_questions_question_id_seq OWNED BY public.quiz_questions.question_id;


--
-- Name: quizzes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quizzes (
    quiz_id integer NOT NULL,
    module_id integer,
    course_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    time_limit integer,
    pass_score integer DEFAULT 70 NOT NULL,
    is_final_exam boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_quiz_type CHECK ((((module_id IS NOT NULL) AND (is_final_exam = false)) OR ((module_id IS NULL) AND (is_final_exam = true))))
);


ALTER TABLE public.quizzes OWNER TO postgres;

--
-- Name: quizzes_quiz_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quizzes_quiz_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quizzes_quiz_id_seq OWNER TO postgres;

--
-- Name: quizzes_quiz_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quizzes_quiz_id_seq OWNED BY public.quizzes.quiz_id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    content text NOT NULL,
    sentiment character varying(10),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_sentiment_check CHECK (((sentiment)::text = ANY ((ARRAY['positif'::character varying, 'netral'::character varying, 'negatif'::character varying])::text[])))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_review_id_seq OWNER TO postgres;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- Name: user_module_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_module_progress (
    user_id integer NOT NULL,
    module_id integer NOT NULL,
    completed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_module_progress OWNER TO postgres;

--
-- Name: user_quiz_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_quiz_results (
    user_id integer NOT NULL,
    quiz_id integer NOT NULL,
    score integer NOT NULL,
    passed boolean NOT NULL,
    completed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_quiz_results OWNER TO postgres;

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
    user_profile character varying(100),
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
-- Name: certificates certificate_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates ALTER COLUMN certificate_id SET DEFAULT nextval('public.certificates_certificate_id_seq'::regclass);


--
-- Name: courses course_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN course_id SET DEFAULT nextval('public.courses_course_id_seq'::regclass);


--
-- Name: enrollments enrolment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments ALTER COLUMN enrolment_id SET DEFAULT nextval('public.enrollments_enrolment_id_seq'::regclass);


--
-- Name: module_contents content_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_contents ALTER COLUMN content_id SET DEFAULT nextval('public.module_contents_content_id_seq'::regclass);


--
-- Name: modules module_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules ALTER COLUMN module_id SET DEFAULT nextval('public.modules_module_id_seq'::regclass);


--
-- Name: quiz_options quiz_option_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_options ALTER COLUMN quiz_option_id SET DEFAULT nextval('public.quiz_options_quiz_option_id_seq'::regclass);


--
-- Name: quiz_questions question_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_questions ALTER COLUMN question_id SET DEFAULT nextval('public.quiz_questions_question_id_seq'::regclass);


--
-- Name: quizzes quiz_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes ALTER COLUMN quiz_id SET DEFAULT nextval('public.quizzes_quiz_id_seq'::regclass);


--
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certificates (certificate_id, user_id, course_id, certificate_number, final_score, issue_date) FROM stdin;
1	24	1	CERT-2025-0001	85	2025-05-06 11:40:00
2	40	1	CERT-20250518-L1GJXG	100	2025-05-18 23:50:03.076496
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (course_id, course_name, course_description, course_image_profile, course_image_cover, course_price, created_at, updated_at, course_slug) FROM stdin;
1	Matematika Kelas 4 Semester 1	Belajar dasar-dasar matematika untuk siswa kelas 4 semester 1.	kelas4-sem1-profile.jpg	kelas4-sem1-cover.jpg	100.00	2025-04-08 09:05:38.01302	2025-05-17 16:40:54.363869	matematika-kelas-4-semester-1
2	Matematika Kelas 4 Semester 2	Lanjutan materi matematika untuk kelas 4 semester 2.	kelas4-sem2-profile.jpg	kelas4-sem2-cover.jpg	100.00	2025-04-08 09:05:38.01302	2025-05-17 16:40:54.363869	matematika-kelas-4-semester-2
3	Matematika Kelas 5 Semester 1	Pemahaman lebih dalam konsep matematika untuk kelas 5 semester 1.	kelas5-sem1-profile.jpg	kelas5-sem1-cover.jpg	100.00	2025-04-08 09:05:38.01302	2025-05-17 16:40:54.363869	matematika-kelas-5-semester-1
4	Matematika Kelas 5 Semester 2	Materi lanjutan matematika kelas 5 semester 2.	kelas5-sem2-profile.jpg	kelas5-sem2-cover.jpg	100.00	2025-04-08 09:05:38.01302	2025-05-17 16:40:54.363869	matematika-kelas-5-semester-2
5	Matematika Kelas 6 Semester 1	Persiapan menuju ujian akhir dengan materi kelas 6 semester 1.	kelas6-sem1-profile.jpg	kelas6-sem1-cover.jpg	100.00	2025-04-08 09:05:38.01302	2025-05-17 16:40:54.363869	matematika-kelas-6-semester-1
6	Matematika Kelas 6 Semester 2	Materi penutup matematika SD di kelas 6 semester 2.	kelas6-sem2-profile.jpg	kelas6-sem2-cover.jpg	100.00	2025-04-08 09:05:38.01302	2025-05-17 16:40:54.363869	matematika-kelas-6-semester-2
\.


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollments (enrolment_id, user_id, course_id, progress, is_completed, enrolment_date) FROM stdin;
1	24	1	0	f	2025-04-14 21:58:28.709537
2	24	4	0	f	2025-04-15 04:24:36.930283
3	24	5	0	f	2025-04-15 04:30:50.540676
4	24	6	0	f	2025-04-21 19:59:48.045737
5	24	3	0	f	2025-04-21 20:41:12.381515
10	35	1	0	f	2025-04-23 16:13:41.194209
11	40	1	0	f	2025-05-18 12:42:13.220005
12	40	5	0	f	2025-05-18 12:43:54.872341
\.


--
-- Data for Name: module_contents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.module_contents (content_id, module_id, content_type, content, content_order, created_at, updated_at) FROM stdin;
1	1	text	Penjelasan tentang bilangan bulat.	1	2025-05-06 10:55:00	2025-05-06 10:55:00
2	1	video	https://youtube.com/watch?v=bilanganbulat	2	2025-05-06 10:55:00	2025-05-06 10:55:00
3	2	text	Penjelasan tentang pecahan.	1	2025-05-06 10:55:00	2025-05-06 10:55:00
4	2	video	https://youtube.com/watch?v=pecahan	2	2025-05-06 10:55:00	2025-05-06 10:55:00
5	3	text	Materi perkalian dan pembagian.	1	2025-05-06 10:55:00	2025-05-06 10:55:00
6	3	video	https://youtube.com/watch?v=perkalianpembagian	2	2025-05-06 10:55:00	2025-05-06 10:55:00
\.


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modules (module_id, course_id, title, description, module_order, created_at, updated_at) FROM stdin;
1	1	Bilangan Bulat	Materi bilangan bulat untuk kelas 4 semester 1	1	2025-05-06 10:50:00	2025-05-06 10:50:00
2	1	Pecahan	Materi pecahan dasar untuk kelas 4 semester 1	2	2025-05-06 10:50:00	2025-05-06 10:50:00
3	2	Perkalian dan Pembagian	Materi lanjutan perkalian dan pembagian	1	2025-05-06 10:50:00	2025-05-06 10:50:00
4	2	Pengukuran	Belajar pengukuran panjang dan berat	2	2025-05-06 10:50:00	2025-05-06 10:50:00
5	3	FPB dan KPK	Materi mencari FPB dan KPK	1	2025-05-06 10:50:00	2025-05-06 10:50:00
6	3	Operasi Pecahan	Operasi hitung pecahan campuran	2	2025-05-06 10:50:00	2025-05-06 10:50:00
\.


--
-- Data for Name: quiz_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quiz_options (quiz_option_id, question_id, option_text, option_order, created_at, updated_at) FROM stdin;
1	1	2	1	2025-05-06 11:25:00	2025-05-06 11:25:00
2	1	8	2	2025-05-06 11:25:00	2025-05-06 11:25:00
3	1	1	3	2025-05-06 11:25:00	2025-05-06 11:25:00
4	1	0	4	2025-05-06 11:25:00	2025-05-06 11:25:00
5	2	12	1	2025-05-06 11:25:00	2025-05-06 11:25:00
6	2	20	2	2025-05-06 11:25:00	2025-05-06 11:25:00
7	2	15	3	2025-05-06 11:25:00	2025-05-06 11:25:00
8	2	30	4	2025-05-06 11:25:00	2025-05-06 11:25:00
\.


--
-- Data for Name: quiz_questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quiz_questions (question_id, quiz_id, question_text, question_order, correct_option_id, created_at, updated_at) FROM stdin;
1	1	Apa hasil dari 5 + (-3)?	1	1	2025-05-06 11:20:00	2025-05-06 11:20:00
2	2	Apa hasil dari 10 x 2?	1	6	2025-05-06 11:20:00	2025-05-06 11:20:00
\.


--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quizzes (quiz_id, module_id, course_id, title, description, time_limit, pass_score, is_final_exam, created_at, updated_at) FROM stdin;
1	1	1	Kuis Bilangan Bulat	Tes pemahaman bilangan bulat.	30	70	f	2025-05-06 11:15:00	2025-05-06 11:15:00
2	\N	1	Ujian Akhir Kelas 4 Semester 1	Ujian final semester.	60	70	t	2025-05-06 11:15:00	2025-05-06 11:15:00
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (review_id, user_id, course_id, content, sentiment, created_at, updated_at) FROM stdin;
1	24	1	asli boy, kursus ini sangat bagus sekali	positif	2025-05-06 10:27:36.508452	2025-05-06 10:36:02.483815
3	24	3	Kursus ini sangat bagus	positif	2025-05-06 12:37:38.145221	2025-05-06 12:37:38.145221
33	40	1	Menurut saya jelek	negatif	2025-05-20 12:12:50.98251	2025-05-20 12:12:50.98251
18	40	5	Kursus ini bagus, saya akan merekomendasikannya ke teman saya	positif	2025-05-19 17:35:27.338113	2025-05-19 17:35:27.338113
\.


--
-- Data for Name: user_module_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_module_progress (user_id, module_id, completed_at) FROM stdin;
24	1	2025-05-06 11:00:00
24	2	2025-05-06 11:10:00
40	1	2025-05-18 23:26:33.471867
40	2	2025-05-19 13:39:17.966707
\.


--
-- Data for Name: user_quiz_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_quiz_results (user_id, quiz_id, score, passed, completed_at) FROM stdin;
24	1	80	t	2025-05-06 11:30:00
24	2	90	t	2025-05-06 11:35:00
40	2	100	t	2025-05-18 23:50:03.071994
40	1	100	t	2025-05-19 13:27:41.317787
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, nama, email, password, tanggal_lahir, kelas, isverified, role, created_at, updated_at, firebase_uid, user_profile) FROM stdin;
24	Wong	wongfromindo@gmail.com	$2b$10$CgvQmF4FQPHUv17bwgxOxeHjQC00ZOjEi5xTarCh2ET2.qJoUCQ12	\N	\N	t	user	2025-04-08 11:23:28.540537	2025-04-21 20:40:58.408983	FA1kLYJZ6WPa6veluy6uh9MxE3x1	\N
34	ANGGA PRASETYO	angga22004@mail.unpad.ac.id	$2b$10$jrY5mJd5U1BAvQ1UVZAj..4EiOtb7Dko0TaGXRfzqhN0tj2dGE6CW	\N	\N	t	user	2025-04-23 15:38:47.866487	2025-04-23 15:38:47.88209	H7hxk3oP4qXa7fD8HpTjkus98nE3	\N
40	Miharjo Arjadikrama	prasetyoangga2712@gmail.com	$2b$10$4gk69LuEGjyuwSig9vGfLeoqUkFJrNICFaXtqThk0X7GBxZwuyHsi	1212-12-12	6	t	user	2025-05-18 11:05:30.651743	2025-05-20 12:15:26.672022	\N	prasetyoangga2712-40.jpg
35	Angga Prasetyo	prasetyoangga817@gmail.com	$2b$10$/yBpELc/kH1LETKVFgbdLeOYrQYJ/hN74prpIywcnRVy8kmAVCeyK	\N	\N	t	user	2025-04-23 16:12:36.217049	2025-04-23 16:13:21.559661	QtcB1tJxqzVtLDJGHQi8dVMu2kH3	\N
\.


--
-- Name: certificates_certificate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.certificates_certificate_id_seq', 2, true);


--
-- Name: courses_course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_course_id_seq', 6, true);


--
-- Name: enrollments_enrolment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.enrollments_enrolment_id_seq', 12, true);


--
-- Name: module_contents_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.module_contents_content_id_seq', 1, false);


--
-- Name: modules_module_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.modules_module_id_seq', 1, false);


--
-- Name: quiz_options_quiz_option_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quiz_options_quiz_option_id_seq', 1, false);


--
-- Name: quiz_questions_question_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quiz_questions_question_id_seq', 1, false);


--
-- Name: quizzes_quiz_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quizzes_quiz_id_seq', 1, false);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 33, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 40, true);


--
-- Name: certificates certificates_certificate_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_certificate_number_key UNIQUE (certificate_number);


--
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (certificate_id);


--
-- Name: certificates certificates_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_user_id_course_id_key UNIQUE (user_id, course_id);


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
-- Name: module_contents module_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_contents
    ADD CONSTRAINT module_contents_pkey PRIMARY KEY (content_id);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (module_id);


--
-- Name: quiz_options quiz_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_options
    ADD CONSTRAINT quiz_options_pkey PRIMARY KEY (quiz_option_id);


--
-- Name: quiz_questions quiz_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT quiz_questions_pkey PRIMARY KEY (question_id);


--
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (quiz_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: reviews reviews_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: courses unique_slug; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT unique_slug UNIQUE (course_slug);


--
-- Name: user_module_progress user_module_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_module_progress
    ADD CONSTRAINT user_module_progress_pkey PRIMARY KEY (user_id, module_id);


--
-- Name: user_quiz_results user_quiz_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_quiz_results
    ADD CONSTRAINT user_quiz_results_pkey PRIMARY KEY (user_id, quiz_id);


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
-- Name: idx_certificates_certificate_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_certificates_certificate_number ON public.certificates USING btree (certificate_number);


--
-- Name: idx_certificates_course_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_certificates_course_id ON public.certificates USING btree (course_id);


--
-- Name: idx_certificates_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_certificates_user_id ON public.certificates USING btree (user_id);


--
-- Name: idx_module_contents_module_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_module_contents_module_id ON public.module_contents USING btree (module_id);


--
-- Name: idx_modules_course_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_modules_course_id ON public.modules USING btree (course_id);


--
-- Name: idx_quiz_options_question_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quiz_options_question_id ON public.quiz_options USING btree (question_id);


--
-- Name: idx_quiz_questions_quiz_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quiz_questions_quiz_id ON public.quiz_questions USING btree (quiz_id);


--
-- Name: idx_quizzes_course_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quizzes_course_id ON public.quizzes USING btree (course_id);


--
-- Name: idx_quizzes_module_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quizzes_module_id ON public.quizzes USING btree (module_id);


--
-- Name: idx_user_module_progress_module_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_module_progress_module_id ON public.user_module_progress USING btree (module_id);


--
-- Name: idx_user_module_progress_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_module_progress_user_id ON public.user_module_progress USING btree (user_id);


--
-- Name: idx_user_quiz_results_quiz_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_quiz_results_quiz_id ON public.user_quiz_results USING btree (quiz_id);


--
-- Name: idx_user_quiz_results_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_quiz_results_user_id ON public.user_quiz_results USING btree (user_id);


--
-- Name: users set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: courses set_updated_at_courses; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_courses BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column_courses();


--
-- Name: certificates certificates_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(course_id) ON DELETE CASCADE;


--
-- Name: certificates certificates_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


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
-- Name: quiz_questions fk_correct_option; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT fk_correct_option FOREIGN KEY (correct_option_id) REFERENCES public.quiz_options(quiz_option_id);


--
-- Name: module_contents module_contents_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_contents
    ADD CONSTRAINT module_contents_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(module_id) ON DELETE CASCADE;


--
-- Name: modules modules_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(course_id) ON DELETE CASCADE;


--
-- Name: quiz_options quiz_options_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_options
    ADD CONSTRAINT quiz_options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.quiz_questions(question_id) ON DELETE CASCADE;


--
-- Name: quiz_questions quiz_questions_quiz_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT quiz_questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(quiz_id) ON DELETE CASCADE;


--
-- Name: quizzes quizzes_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(course_id) ON DELETE CASCADE;


--
-- Name: quizzes quizzes_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(module_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(course_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_module_progress user_module_progress_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_module_progress
    ADD CONSTRAINT user_module_progress_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(module_id) ON DELETE CASCADE;


--
-- Name: user_module_progress user_module_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_module_progress
    ADD CONSTRAINT user_module_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_quiz_results user_quiz_results_quiz_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_quiz_results
    ADD CONSTRAINT user_quiz_results_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(quiz_id) ON DELETE CASCADE;


--
-- Name: user_quiz_results user_quiz_results_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_quiz_results
    ADD CONSTRAINT user_quiz_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

