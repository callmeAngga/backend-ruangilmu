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
1	2	2	CERT-20250522-6BFNE5	99	2025-05-22 20:13:08.179745
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (course_id, course_name, course_description, course_image_profile, course_image_cover, course_price, created_at, updated_at, course_slug) FROM stdin;
1	Piktogram dan Diagram Batang	Piktogram dan diagram batang adalah cara mudah untuk menyajikan data menggunakan gambar dan batang agar lebih cepat dipahami.	piktogram-6-profile.png	piktogram-6-cover.png	0.00	2024-01-10 19:34:54.027113	2024-01-18 19:22:58.464865	piktogram-dan-diagram-batang
2	Bilangan Cacah sampai 10.000	Materi bilangan Cacah sampai 10.000 untuk siswa kelas 4 SD	bilangan-1-profile.png	bilangan-1-cover.png	0.00	2024-02-23 15:28:52.395399	2024-02-28 19:11:31.997413	bilangan-cacah-sampai-10000
3	Pecahan	Pelajari cara melakukan operasi mtk ke pecahan	pecahan-2-profile.png	pecahan-2-cover.png	0.00	2024-03-01 15:28:52.395399	2024-03-05 19:13:29.368348	pecahan
4	Pola Gambar & Pola Bilangan	kalian akan mempelajari cara mengenali, melanjutkan, dan membuat pola gambar serta pola bilangan berdasarkan aturan tertentu.	pola-3-profile.png	pola-3-cover.png	0.00	2024-04-03 15:28:52.395399	2024-04-08 19:17:28.498819	pola-gambar-pola-bilangan
5	Pengukuran luas dan volume	mengukur dan menghitung luas permukaan bidang datar serta volume bangun ruang sederhana dengan satuan yang sesuai.	pengukuran-4-profile.png	pengukuran-4-cover.png	0.00	2024-05-06 19:34:54.027113	2024-05-10 19:19:31.625382	pengukuran-luas-dan-volume
6	Bangun Datar	mempelajari berbagai jenis bangun datar, ciri-cirinya, serta cara mengidentifikasi dan menyusunnya menjadi bentuk baru.	bangun-5-profile.png	bangun-5-cover.png	0.00	2024-06-06 19:34:54.027113	2024-06-10 19:21:09.276729	bangun-datar
7	Penjumlahan dan Pengurangan Bilangan Bulat	Mempelajari dasar-dasar operasi penjumlahan dan pengurangan pada bilangan bulat positif dan negatif.	penjumlahan-7-profile.png	penjumlahan-7-cover.png	0.00	2024-07-01 10:00:00	2024-07-05 10:30:00	penjumlahan-dan-pengurangan-bilangan-bulat
8	Perkalian dan Pembagian Bilangan Bulat	Memahami konsep perkalian dan pembagian bilangan bulat, termasuk aturan tanda positif dan negatif.	perkalian-8-profile.png	perkalian-8-cover.png	0.00	2024-07-08 11:00:00	2024-07-12 11:30:00	perkalian-dan-pembagian-bilangan-bulat
9	Operasi Hitung Campuran	Mempelajari urutan operasi hitung campuran yang benar (kurung, kali/bagi, tambah/kurang) untuk menyelesaikan soal.	operasi-9-profile.png	operasi-9-cover.png	0.00	2024-07-15 12:00:00	2024-07-19 12:30:00	operasi-hitung-campuran
10	KPK dan FPB	Mengidentifikasi dan menghitung Kelipatan Persekutuan Terkecil (KPK) serta Faktor Persekutuan Terbesar (FPB) dari dua atau lebih bilangan.	kpk-10-profile.png	kpk-10-cover.png	0.00	2024-07-22 13:00:00	2024-07-26 13:30:00	kpk-dan-fpb
11	Bilangan Prima	Mengenali dan memahami karakteristik bilangan prima serta cara menentukan bilangan prima dalam suatu deret angka.	bilangan-11-profile.png	bilangan-11-cover.png	0.00	2024-07-29 14:00:00	2024-08-02 14:30:00	bilangan-prima
12	Satuan Panjang dan Berat	Mempelajari berbagai satuan panjang (km, m, cm) dan berat (kg, g, mg) serta cara mengkonversinya.	satuan-12-profile.png	satuan-12-cover.png	0.00	2024-08-05 15:00:00	2024-08-09 15:30:00	satuan-panjang-dan-berat
13	Satuan Waktu dan Volume	Memahami satuan waktu (jam, menit, detik) dan volume (liter, ml) serta cara mengkonversinya dalam berbagai konteks.	satuan-13-profile.png	satuan-13-cover.png	0.00	2024-08-12 16:00:00	2024-08-16 16:30:00	satuan-waktu-dan-volume
14	Debit	Mempelajari konsep debit sebagai perbandingan volume dan waktu, serta penerapannya dalam soal-soal praktis.	debit-14-profile.png	debit-14-cover.png	0.00	2024-08-19 17:00:00	2024-08-23 17:30:00	debit
15	Skala dan Perbandingan	Memahami konsep skala pada peta dan denah, serta perbandingan senilai dan berbalik nilai dalam kehidupan sehari-hari.	skala-15-profile.png	skala-15-cover.png	0.00	2024-08-26 09:00:00	2024-08-30 09:30:00	skala-dan-perbandingan
16	Geometri Ruang (Kubus, Balok, Tabung)	Mengenali berbagai bentuk bangun ruang seperti kubus, balok, dan tabung, serta ciri-ciri dan unsurnya.	geometri-16-profile.png	geometri-16-cover.png	0.00	2024-09-02 10:00:00	2024-09-06 10:30:00	geometri-ruang-kubus-balok-tabung
17	Luas Permukaan Bangun Ruang	Menghitung luas permukaan berbagai bangun ruang sederhana seperti kubus, balok, dan tabung.	luas-17-profile.png	luas-17-cover.png	0.00	2024-09-09 11:00:00	2024-09-13 11:30:00	luas-permukaan-bangun-ruang
18	Volume Bangun Ruang	Menghitung volume bangun ruang sederhana seperti kubus, balok, dan tabung dengan rumus yang tepat.	volume-18-profile.png	volume-18-cover.png	0.00	2024-09-16 12:00:00	2024-09-20 12:30:00	volume-bangun-ruang
19	Koordinat Kartesius	Mempelajari cara membaca dan menuliskan letak suatu titik pada bidang koordinat Kartesius.	koordinat-19-profile.png	koordinat-19-cover.png	0.00	2024-09-23 13:00:00	2024-09-27 13:30:00	koordinat-kartesius
20	Statistika Dasar (Mean, Median, Modus)	Mengenal konsep rata-rata (mean), nilai tengah (median), dan nilai yang paling sering muncul (modus) dari suatu data.	statistika-20-profile.png	statistika-20-cover.png	0.00	2024-09-30 14:00:00	2024-10-04 14:30:00	statistika-dasar-mean-median-modus
21	Pengolahan Data	Mempelajari cara mengumpulkan, menyajikan, dan menafsirkan data dalam bentuk tabel atau diagram.	pengolahan-21-profile.png	pengolahan-21-cover.png	0.00	2024-10-07 15:00:00	2024-10-11 15:30:00	pengolahan-data
22	Sudut dan Garis	Mengenali berbagai jenis sudut dan garis, serta hubungan antar sudut dan garis.	sudut-22-profile.png	sudut-22-cover.png	0.00	2024-10-14 16:00:00	2024-10-18 16:30:00	sudut-dan-garis
23	Simetri Lipat dan Simetri Putar	Mengidentifikasi bangun datar yang memiliki simetri lipat dan simetri putar, serta menentukan sumbu simetrinya.	simetri-23-profile.png	simetri-23-cover.png	0.00	2024-10-21 17:00:00	2024-10-25 17:30:00	simetri-lipat-dan-simetri-putar
24	Jaring-jaring Bangun Ruang	Memahami dan membuat jaring-jaring dari berbagai bangun ruang sederhana seperti kubus, balok, dan prisma.	jaring-24-profile.png	jaring-24-cover.png	0.00	2024-10-28 09:00:00	2024-11-01 09:30:00	jaring-jaring-bangun-ruang
25	Pengukuran Sudut	Mengukur besar sudut menggunakan busur derajat dan menyelesaikan soal-soal terkait pengukuran sudut.	pengukuran-25-profile.png	pengukuran-25-cover.png	0.00	2024-11-04 10:00:00	2024-11-08 10:30:00	pengukuran-sudut
26	Keliling dan Luas Lingkaran	Menghitung keliling dan luas lingkaran menggunakan rumus yang benar.	keliling-26-profile.png	keliling-26-cover.png	0.00	2024-11-11 11:00:00	2024-11-15 11:30:00	keliling-dan-luas-lingkaran
27	Bangun Ruang Sisi Lengkung	Mengenali dan memahami sifat-sifat bangun ruang sisi lengkung seperti tabung, kerucut, dan bola.	bangun-27-profile.png	bangun-27-cover.png	0.00	2024-11-18 12:00:00	2024-11-22 12:30:00	bangun-ruang-sisi-lengkung
28	Pengenalan Aljabar Sederhana	Mempelajari konsep variabel, konstanta, dan operasi dasar dalam bentuk aljabar sederhana.	pengenalan-28-profile.png	pengenalan-28-cover.png	0.00	2024-11-25 13:00:00	2024-11-29 13:30:00	pengenalan-aljabar-sederhana
29	Barisan dan Deret Bilangan	Mengenali pola pada barisan bilangan dan memahami konsep dasar deret aritmatika dan geometri.	barisan-29-profile.png	barisan-29-cover.png	0.00	2024-12-02 14:00:00	2024-12-06 14:30:00	barisan-dan-deret-bilangan
30	Pengenalan Himpunan	Mempelajari konsep dasar himpunan, anggota himpunan, dan operasi pada himpunan sederhana.	pengenalan-30-profile.png	pengenalan-30-cover.png	0.00	2024-12-09 15:00:00	2024-12-13 15:30:00	pengenalan-himpunan
\.


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollments (enrolment_id, user_id, course_id, progress, is_completed, enrolment_date) FROM stdin;
1	2	2	0	f	2024-01-05 10:00:00
2	34	4	0	f	2024-05-18 15:03:39.072067
3	36	3	0	f	2024-05-18 15:12:05.11123
4	33	1	0	f	2024-05-18 17:14:05.219533
5	33	2	0	f	2024-05-18 19:28:23.839538
6	34	5	0	f	2024-05-19 13:35:45.744922
7	34	1	0	f	2024-05-19 13:48:32.676184
8	37	1	0	f	2024-05-21 17:11:42.296438
9	2	3	0	f	2024-01-10 11:00:00
10	2	10	0	f	2024-01-15 12:00:00
11	3	1	0	f	2024-01-20 09:00:00
12	3	5	0	f	2024-01-25 10:00:00
13	3	12	0	f	2024-01-30 11:00:00
14	4	2	0	f	2024-02-01 13:00:00
15	4	6	0	f	2024-02-05 14:00:00
16	5	1	0	f	2024-02-10 10:00:00
17	5	7	0	f	2024-02-15 11:00:00
18	5	15	0	f	2024-02-20 12:00:00
19	6	2	0	f	2024-02-25 09:00:00
20	6	11	0	f	2024-03-01 10:00:00
21	7	3	0	f	2024-03-05 13:00:00
22	7	4	0	f	2024-03-10 14:00:00
23	7	18	0	f	2024-03-15 15:00:00
24	8	1	0	f	2024-03-20 10:00:00
25	8	9	0	f	2024-03-25 11:00:00
26	9	2	0	f	2024-04-01 12:00:00
27	9	13	0	f	2024-04-05 13:00:00
28	9	20	0	f	2024-04-10 14:00:00
29	10	3	0	f	2024-04-15 09:00:00
30	10	7	0	f	2024-04-20 10:00:00
31	11	4	0	f	2024-04-25 11:00:00
32	11	8	0	f	2024-04-30 12:00:00
33	11	25	0	f	2024-05-05 13:00:00
34	12	5	0	f	2024-05-10 14:00:00
35	12	10	0	f	2024-05-15 15:00:00
36	13	6	0	f	2024-05-20 09:00:00
37	13	11	0	f	2024-05-25 10:00:00
38	13	28	0	f	2024-05-30 11:00:00
39	14	1	0	f	2024-06-01 13:00:00
40	14	12	0	f	2024-06-05 14:00:00
41	15	2	0	f	2024-06-10 10:00:00
42	15	14	0	f	2024-06-15 11:00:00
43	15	22	0	f	2024-06-20 12:00:00
44	16	3	0	f	2024-06-25 09:00:00
45	16	16	0	f	2024-06-30 10:00:00
46	17	4	0	f	2024-07-01 11:00:00
47	17	17	0	f	2024-07-05 12:00:00
48	17	26	0	f	2024-07-10 13:00:00
49	18	5	0	f	2024-07-15 14:00:00
50	18	19	0	f	2024-07-20 15:00:00
51	19	6	0	f	2024-07-25 09:00:00
52	19	21	0	f	2024-07-30 10:00:00
53	19	29	0	f	2024-08-01 11:00:00
54	20	1	0	f	2024-08-05 12:00:00
55	20	23	0	f	2024-08-10 13:00:00
56	21	2	0	f	2024-08-15 14:00:00
57	21	24	0	f	2024-08-20 15:00:00
58	21	30	0	f	2024-08-25 16:00:00
59	22	3	0	f	2024-08-28 09:00:00
60	22	27	0	f	2024-09-01 10:00:00
61	23	4	0	f	2024-09-05 11:00:00
62	23	28	0	f	2024-09-10 12:00:00
63	23	1	0	f	2024-09-15 13:00:00
64	24	5	0	f	2024-09-20 14:00:00
65	24	29	0	f	2024-09-25 15:00:00
66	25	6	0	f	2024-09-30 10:00:00
67	25	30	0	f	2024-10-05 11:00:00
68	25	2	0	f	2024-10-10 12:00:00
69	26	7	0	f	2024-10-15 13:00:00
70	26	12	0	f	2024-10-20 14:00:00
71	27	8	0	f	2024-10-25 15:00:00
72	27	13	0	f	2024-10-30 16:00:00
73	27	3	0	f	2024-11-01 17:00:00
74	28	9	0	f	2024-11-05 09:00:00
75	28	14	0	f	2024-11-10 10:00:00
76	29	10	0	f	2024-11-15 11:00:00
77	29	15	0	f	2024-11-20 12:00:00
78	29	4	0	f	2024-11-25 13:00:00
79	30	11	0	f	2024-11-28 14:00:00
80	30	16	0	f	2024-12-01 15:00:00
81	31	1	0	f	2024-12-05 09:30:00
82	31	5	0	f	2024-12-08 10:30:00
83	32	2	0	f	2024-12-10 11:30:00
84	32	6	0	f	2024-12-13 12:30:00
85	32	18	0	f	2024-12-16 13:30:00
86	35	1	0	f	2024-06-01 08:00:00
87	35	2	0	f	2024-06-05 09:00:00
88	35	15	0	f	2024-06-10 10:00:00
89	38	7	0	f	2024-05-25 10:00:00
90	38	8	0	f	2024-05-28 11:00:00
91	39	9	0	f	2024-06-01 12:00:00
92	39	10	0	f	2024-06-04 13:00:00
93	39	21	0	f	2024-06-07 14:00:00
94	40	11	0	f	2024-06-10 15:00:00
95	40	12	0	f	2024-06-13 16:00:00
96	41	1	0	f	2024-06-15 08:00:00
97	41	2	0	f	2024-06-17 09:00:00
98	41	3	0	f	2024-06-19 10:00:00
99	42	4	0	f	2024-06-21 11:00:00
100	42	5	0	f	2024-06-23 12:00:00
101	42	6	0	f	2024-06-25 13:00:00
102	43	7	0	f	2024-06-27 14:00:00
103	43	8	0	f	2024-06-29 15:00:00
104	43	9	0	f	2024-07-01 16:00:00
105	44	10	0	f	2024-07-03 09:00:00
106	44	11	0	f	2024-07-05 10:00:00
107	44	12	0	f	2024-07-07 11:00:00
108	45	13	0	f	2024-07-09 12:00:00
109	45	14	0	f	2024-07-11 13:00:00
110	45	15	0	f	2024-07-13 14:00:00
111	46	16	0	f	2024-07-15 15:00:00
112	46	17	0	f	2024-07-17 16:00:00
113	46	18	0	f	2024-07-19 17:00:00
114	47	19	0	f	2024-07-21 08:00:00
115	47	20	0	f	2024-07-23 09:00:00
116	47	21	0	f	2024-07-25 10:00:00
117	48	22	0	f	2024-07-27 11:00:00
118	48	23	0	f	2024-07-29 12:00:00
119	48	24	0	f	2024-07-31 13:00:00
120	49	25	0	f	2024-08-02 14:00:00
121	49	26	0	f	2024-08-04 15:00:00
122	49	27	0	f	2024-08-06 16:00:00
123	50	28	0	f	2024-08-08 09:00:00
124	50	29	0	f	2024-08-10 10:00:00
125	50	30	0	f	2024-08-12 11:00:00
126	51	1	0	f	2024-08-14 12:00:00
127	51	3	0	f	2024-08-16 13:00:00
128	51	5	0	f	2024-08-18 14:00:00
129	52	7	0	f	2024-08-20 15:00:00
130	52	9	0	f	2024-08-22 16:00:00
131	52	11	0	f	2024-08-24 17:00:00
132	53	13	0	f	2024-08-26 08:00:00
133	53	15	0	f	2024-08-28 09:00:00
134	53	17	0	f	2024-08-30 10:00:00
135	54	19	0	f	2024-09-01 11:00:00
136	54	21	0	f	2024-09-03 12:00:00
137	54	23	0	f	2024-09-05 13:00:00
138	55	25	0	f	2024-09-07 14:00:00
139	55	27	0	f	2024-09-09 15:00:00
140	55	29	0	f	2024-09-11 16:00:00
141	56	2	0	f	2024-09-13 09:00:00
142	56	4	0	f	2024-09-15 10:00:00
143	56	6	0	f	2024-09-17 11:00:00
144	57	8	0	f	2024-09-19 12:00:00
145	57	10	0	f	2024-09-21 13:00:00
146	57	12	0	f	2024-09-23 14:00:00
147	58	14	0	f	2024-09-25 15:00:00
148	58	16	0	f	2024-09-27 16:00:00
149	58	18	0	f	2024-09-29 17:00:00
150	59	20	0	f	2024-10-01 08:00:00
151	59	22	0	f	2024-10-03 09:00:00
152	59	24	0	f	2024-10-05 10:00:00
153	60	26	0	f	2024-10-07 11:00:00
154	60	28	0	f	2024-10-09 12:00:00
155	60	30	0	f	2024-10-11 13:00:00
156	61	1	0	f	2024-10-13 14:00:00
157	61	2	0	f	2024-10-15 15:00:00
158	61	3	0	f	2024-10-17 16:00:00
159	62	4	0	f	2024-10-19 17:00:00
160	62	5	0	f	2024-10-21 08:00:00
161	62	6	0	f	2024-10-23 09:00:00
162	63	7	0	f	2024-10-25 10:00:00
163	63	8	0	f	2024-10-27 11:00:00
164	63	9	0	f	2024-10-29 12:00:00
165	64	10	0	f	2024-10-31 13:00:00
166	64	11	0	f	2024-11-02 14:00:00
167	64	12	0	f	2024-11-04 15:00:00
168	65	13	0	f	2024-11-06 16:00:00
169	65	14	0	f	2024-11-08 17:00:00
170	65	15	0	f	2024-11-10 08:00:00
171	66	16	0	f	2024-11-12 09:00:00
172	66	17	0	f	2024-11-14 10:00:00
173	66	18	0	f	2024-11-16 11:00:00
174	67	19	0	f	2024-11-18 12:00:00
175	67	20	0	f	2024-11-20 13:00:00
176	67	21	0	f	2024-11-22 14:00:00
177	68	22	0	f	2024-11-24 15:00:00
178	68	23	0	f	2024-11-26 16:00:00
179	68	24	0	f	2024-11-28 17:00:00
180	69	25	0	f	2024-11-30 08:00:00
181	69	26	0	f	2024-12-02 09:00:00
182	69	27	0	f	2024-12-04 10:00:00
183	70	28	0	f	2024-12-06 11:00:00
184	70	29	0	f	2024-12-08 12:00:00
185	70	30	0	f	2024-12-10 13:00:00
186	71	1	0	f	2024-12-12 14:00:00
187	71	2	0	f	2024-12-14 15:00:00
188	71	3	0	f	2024-12-16 16:00:00
189	2	1	0	f	2025-05-25 20:35:27.1836
\.


--
-- Data for Name: module_contents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.module_contents (content_id, module_id, content_type, content, content_order, created_at, updated_at) FROM stdin;
1	8	text	<h3 class="text-2xl font-semibold text-blue-600 mb-4">🔢 Contoh Latihan</h3>\\n\\n    <div class="mb-6">\\n      <p class="font-bold mb-2">Contoh 1:</p>\\n      <p class="mb-4">\\n        Tuliskan nilai tempat dari angka-angka dalam bilangan\\n        <span class="font-bold">3.254</span>\\n      </p>\\n\\n      <div class="overflow-x-auto">\\n        <table class="table-auto border border-gray-300 w-full text-left mb-6">\\n          <thead class="bg-gray-100">\\n            <tr>\\n              <th class="border px-4 py-2">Angka</th>\\n              <th class="border px-4 py-2">Tempat</th>\\n              <th class="border px-4 py-2">Nilai Angka</th>\\n            </tr>\\n          </thead>\\n          <tbody>\\n            <tr class="hover:bg-gray-50">\\n              <td class="border px-4 py-2">3</td>\\n              <td class="border px-4 py-2">Ribuan</td>\\n              <td class="border px-4 py-2">3.000</td>\\n            </tr>\\n            <tr class="hover:bg-gray-50">\\n              <td class="border px-4 py-2">2</td>\\n              <td class="border px-4 py-2">Ratusan</td>\\n              <td class="border px-4 py-2">200</td>\\n            </tr>\\n            <tr class="hover:bg-gray-50">\\n              <td class="border px-4 py-2">5</td>\\n              <td class="border px-4 py-2">Puluhan</td>\\n              <td class="border px-4 py-2">50</td>\\n            </tr>\\n            <tr class="hover:bg-gray-50">\\n              <td class="border px-4 py-2">4</td>\\n              <td class="border px-4 py-2">Satuan</td>\\n              <td class="border px-4 py-2">4</td>\\n            </tr>\\n          </tbody>\\n        </table>\\n      </div>\\n    </div>\\n    <br></br>\\n\\n    <div>\\n      <p class="font-bold mb-2">Contoh 2:</p>\\n      <p class="mb-2">Tentukan nilai tempat dari angka 6 pada bilangan:</p>\\n      <ul class="list-disc pl-6 space-y-1">\\n        <li>\\n          <span class="font-medium">6.789</span> → 6 =\\n          <span class="font-bold">6.000</span>\\n          <span class="text-gray-600">(ribuan)</span>\\n        </li>\\n        <li>\\n          <span class="font-medium">4.675</span> → 6 =\\n          <span class="font-bold">600</span>\\n          <span class="text-gray-600">(ratusan)</span>\\n        </li>\\n        <li>\\n          <span class="font-medium">1.236</span> → 6 =\\n          <span class="font-bold">6</span>\\n          <span class="text-gray-600">(satuan)</span>\\n        </li>\\n      </ul>\\n    </div>	2	2024-03-02 10:30:00	2024-03-02 10:35:00
2	7	text	<h3 class="text-2xl font-semibold text-blue-600 mb-2">\\n      ✍️ 3. Menulis Bilangan Cacah\\n    </h3>\\n    <p class="mb-4">\\n      Sebaliknya, untuk menulis bilangan cacah, kita menuliskannya dari\\n      kata-kata ke bentuk angka.\\n    </p>\\n    <div class="overflow-x-auto mb-6">\\n      <table class="table-auto border border-gray-300 w-full text-left">\\n        <thead class="bg-gray-100">\\n          <tr>\\n            <th class="border border-gray-300 px-4 py-2 font-semibold">\\n              Tulisan Angka\\n            </th>\\n            <th class="border border-gray-300 px-4 py-2 font-semibold">\\n              Bilangan\\n            </th>\\n          </tr>\\n        </thead>\\n        <tbody>\\n          <tr>\\n            <td class="border border-gray-300 px-4 py-2">\\n              Delapan ratus sembilan puluh lima\\n            </td>\\n            <td class="border border-gray-300 px-4 py-2">895</td>\\n          </tr>\\n          <tr>\\n            <td class="border border-gray-300 px-4 py-2">\\n              Seribu tiga puluh dua\\n            </td>\\n            <td class="border border-gray-300 px-4 py-2">1.032</td>\\n          </tr>\\n          <tr>\\n            <td class="border border-gray-300 px-4 py-2">\\n              Sembilan ribu sembilan ratus sembilan puluh sembilan\\n            </td>\\n            <td class="border border-gray-300 px-4 py-2">9.999</td>\\n          </tr>\\n        </tbody>\\n      </table>\\n    </div>\\n    <br></br>\\n\\n    <h3 class="text-2xl font-semibold text-blue-600 mb-2">\\n      🧠 4. Mengenal Nilai Tempat dan Nilai Angka\\n    </h3>\\n    <p class="mb-2">\\n      Nilai tempat adalah posisi angka dalam bilangan (satuan, puluhan, ratusan,\\n      ribuan).\\n    </p>\\n    <p class="mb-2">\\n      Nilai angka adalah besar angka tersebut sesuai tempatnya.\\n    </p>\\n    <p class="mb-4">Contoh: Bilangan <strong>4.728</strong> terdiri dari:</p>\\n    <ul class="list-disc list-inside space-y-1 mb-6">\\n      <li><strong>4</strong> pada ribuan → nilainya = 4.000</li>\\n      <li><strong>7</strong> pada ratusan → nilainya = 700</li>\\n      <li><strong>2</strong> pada puluhan → nilainya = 20</li>\\n      <li><strong>8</strong> pada satuan → nilainya = 8</li>\\n    </ul>	2	2024-03-01 10:00:00	2024-03-01 10:05:00
3	9	text	<h3 class="text-2xl font-semibold text-blue-600 mb-2">📈 Mengurutkan Bilangan</h3>\\n   <p class="mb-2">Mengurutkan bilangan artinya menyusun dari yang terkecil ke terbesar atau sebaliknya.</p>\\n\\n   <p class="font-semibold mb-1">Contoh:</p>\\n   <p class="mb-4">Urutkan: 2.460, 3.676, 3.726</p>\\n\\n   <img src="/images/course1/1-4.png" alt="gambar 4" class="w-full h-auto rounded mb-4" />\\n\\n   <p class="mb-6">\\n     <strong>Urutan dari terkecil ke terbesar:</strong><br>\\n     2.460 &lt; 3.676 &lt; 3.726\\n   </p>\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">🧠 Tips Mengingat</h3>\\n   <p class="mb-2">\\n     🔹 Coba bayangkan angka-angka sedang berdiri berbaris!<br />\\n     🔹 Siapa yang paling tinggi (ribuan besar), dia paling depan!<br />\\n     🔹 Kalau tingginya sama, lihat siapa yang paling gemuk (ratusan), dan seterusnya!\\n   </p>	2	2024-03-06 10:00:00	2024-03-06 10:05:00
4	8	text	<h2 class="text-2xl font-bold text-black-600 mb-4">\\n      🎯 Tujuan Pembelajaran\\n    </h2>\\n    <p class="mb-3">Setelah mempelajari materi ini, siswa dapat:</p>\\n    <ul class="list-disc list-inside mb-6 space-y-1">\\n      <li>\\n        🔹 Menyebutkan nilai tempat setiap angka dalam bilangan cacah sampai\\n        10.000.\\n      </li>\\n      <li>🔹 Menggunakan nilai tempat untuk memahami nilai angka.</li>\\n      <li>\\n        🔹 Menyusun dan membongkar (menganalisis) bilangan berdasarkan nilai\\n        tempatnya.\\n      </li>\\n    </ul>\\n    <br></br>\\n\\n    <h3 class="text-2xl font-semibold text-blue-600 mb-3">\\n      📌 Pengantar Materi\\n    </h3>\\n    <p class="mb-3">\\n      <img\\n        src="/images/course1/1-1.png"\\n        alt="gambar 1"\\n        class="w-auto h-auto rounded-md shadow-md"\\n      />\\n    </p>\\n\\n    <p class="mb-2">\\n      Bilangan terdiri dari angka-angka yang memiliki nilai tempat berbeda.\\n    </p>\\n    <p class="mb-2">Contohnya bilangan <strong>2.150</strong>:</p>\\n    <ul class="list-disc list-inside mb-6 space-y-1">\\n      <li>Angka 2 ada di tempat ribuan → 2.000</li>\\n      <li>Angka 1 di tempat ratusan → 100</li>\\n      <li>Angka 5 di tempat puluhan → 50</li>\\n      <li>Angka 0 di tempat satuan → 0</li>\\n    </ul>\\n\\n    <p class="mb-3">\\n      <img\\n        src="/images/course1/1-2.png"\\n        alt="gambar 2"\\n        class="w-full h-auto rounded-md shadow-md"\\n      />\\n    </p>\\n    <br></br>\\n\\n    <h3 class="text-2xl font-semibold text-blue-600 mb-3">\\n      🧠 Penjelasan Nilai Tempat\\n    </h3>\\n    <p class="mb-2">\\n      Setiap posisi angka dalam bilangan menunjukkan nilai tempat tertentu:\\n    </p>\\n\\n    <div class="overflow-x-auto mb-6">\\n      <table class="table-auto border border-gray-300 w-full text-left">\\n        <thead class="bg-gray-100">\\n          <tr>\\n            <th class="border border-gray-300 px-4 py-2 font-semibold">\\n              Tempat\\n            </th>\\n            <th class="border border-gray-300 px-4 py-2 font-semibold">\\n              Simbol Digit\\n            </th>\\n            <th class="border border-gray-300 px-4 py-2 font-semibold">\\n              Nilai Angka\\n            </th>\\n          </tr>\\n        </thead>\\n        <tbody>\\n          <tr>\\n            <td class="border border-gray-300 px-4 py-2">Satuan</td>\\n            <td class="border border-gray-300 px-4 py-2">4</td>\\n            <td class="border border-gray-300 px-4 py-2">4</td>\\n          </tr>\\n          <tr>\\n            <td class="border border-gray-300 px-4 py-2">Puluhan</td>\\n            <td class="border border-gray-300 px-4 py-2">6</td>\\n            <td class="border border-gray-300 px-4 py-2">60</td>\\n          </tr>\\n          <tr>\\n            <td class="border border-gray-300 px-4 py-2">Ratusan</td>\\n            <td class="border border-gray-300 px-4 py-2">7</td>\\n            <td class="border border-gray-300 px-4 py-2">700</td>\\n          </tr>\\n          <tr>\\n            <td class="border border-gray-300 px-4 py-2">Ribuan</td>\\n            <td class="border border-gray-300 px-4 py-2">2</td>\\n            <td class="border border-gray-300 px-4 py-2">2.000</td>\\n          </tr>\\n        </tbody>\\n      </table>\\n    </div>\\n\\n    <p class="mb-6">\\n      Contoh bilangan <strong>2.764</strong> → dibaca dua ribu tujuh ratus enam\\n      puluh empat\\n    </p>	1	2024-03-01 09:00:00	2024-03-01 09:05:00
5	11	text	<h3 class="text-2xl font-semibold text-blue-600 mb-2">🌟 Cara 1: Penjumlahan Susun Panjang</h3>\\n   <p class="mb-4">\\n     Cara ini cocok untuk kamu yang suka menguraikan angka menjadi bagian-bagian kecil.<br />\\n     <strong>Langkah-langkahnya:</strong>\\n     <ul class="list-disc pl-6 mt-2 mb-2">\\n       <li>🔹 Uraikan masing-masing bilangan sesuai nilai tempatnya.</li>\\n       <li>🔹 Jumlahkan ratusan dengan ratusan, puluhan dengan puluhan, satuan dengan satuan.</li>\\n       <li>🔹 Hitung hasilnya!</li>\\n     </ul>\\n     Contoh:<br />\\n     <img src="/images/course1/1-8.png" alt="gambar 8" class="w-64 h-auto rounded my-4" />\\n   </p>\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">🌟 Cara 2: Penjumlahan Susun Pendek</h3>\\n   <p class="mb-4">\\n     Kalau kamu suka cara yang cepat dan praktis, ini pilihan yang tepat!<br />\\n     <strong>Langkah-langkahnya:</strong>\\n     <ul class="list-disc pl-6 mt-2 mb-2">\\n       <li>🔹 Susun angka-angkanya bertumpuk (satuan sejajar dengan satuan, puluhan sejajar dengan puluhan, ratusan sejajar dengan ratusan).</li>\\n       <li>🔹 Jumlahkan dari kanan ke kiri (dari satuan → puluhan → ratusan).</li>\\n       <li>🔹 Kalau hasil penjumlahan lebih dari 9, simpan ke kolom di sebelah kiri.</li>\\n     </ul>\\n     Contoh:<br />\\n     <img src="/images/course1/1-9.png" alt="gambar 9" class="w-64 h-auto rounded my-4" />\\n     Jadi, seluruh pohon jeruk Pak Toni ada <strong>452 pohon</strong>.<br />\\n     Sama kan hasilnya?<br />\\n     Kamu bisa pilih cara mana yang kamu suka!\\n   </p>\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">🚨 Apa itu "Menyimpan"?</h3>\\n   <p class="mb-4">\\n     Terkadang jumlah satuan atau puluhan lebih dari 9.<br />\\n     Kalau itu terjadi, kita harus menyimpan 1 angka ke kolom berikutnya.<br />\\n     Contoh:<br />\\n     <img src="/images/course1/1-10.png" alt="gambar 10" class="w-64 h-auto rounded my-4" /><br />\\n     <strong>9 + 5 = 14</strong> → tulis 4 di satuan, simpan 1 ke puluhan<br />\\n     <strong>8 + 4 = 12</strong>, tambah 1 dari yang kita simpan tadi = <strong>13</strong> → tulis 3 di puluhan, simpan 1 ke ratusan<br />\\n     <strong>1 + 2 = 3</strong>, tambah 1 dari yang kita simpan tadi = <strong>4</strong> → tulis 4 di ratusan<br />\\n     Jadi hasilnya adalah <strong>434</strong>! 🌟\\n   </p>	2	2024-03-10 14:30:00	2024-03-10 14:35:00
6	12	text	<h3 class="text-2xl font-semibold text-blue-600 mb-3">📚 Cara Mengurangi Bilangan</h3>\\n   <p class="mb-4">Ada dua cara utama yang bisa kita gunakan.</p>\\n   <br></br>\\n\\n   <h4 class="text-2xl font-semibold text-blue-600 mb-2">🌟 Cara 1: Pengurangan Susun Panjang</h4>\\n   <p class="mb-2">\\n     Cara ini cocok buat kamu yang suka menguraikan angka dan melihat setiap langkahnya secara jelas.\\n   </p>\\n   <ul class="list-disc pl-6 mb-4">\\n     <li>🔹 Menguraikan masing-masing bilangan yang akan dikurangkan</li>\\n     <li>🔹 Kurangkan bilangan sesuai dengan nilai tempatnya</li>\\n     <li>🔹 Lakukan operasi pengurangan dari nilai tempat yang terkecil ke terbesar (kanan ke kiri)</li>\\n   </ul>\\n   <img src="/images/course1/1-11.png" alt="gambar 11" class="mb-6 max-w-auto h-auto rounded-md shadow" />\\n   <br></br>\\n\\n   <h4 class="text-2xl font-semibold text-blue-600 mb-2">🌟 Cara 2: Pengurangan Susun Pendek</h4>\\n   <p class="mb-2">\\n     Ini cara cepat, tinggal susun dari atas ke bawah seperti tangga.\\n   </p>\\n   <img src="/images/course1/1-12.png" alt="gambar 12" class="mb-6 max-w-auto h-auto rounded-md shadow" />\\n\\n   <p class="mb-4 text-yellow-700 font-semibold">🤔 Tapi... bagaimana kalau bilangan atasnya lebih kecil dari bilangan bawahnya?</p>\\n   <br></br>\\n\\n   <h4 class="text-2xl font-semibold text-blue-600 mb-2">🚨 Apa Itu “Meminjam”?</h4>\\n   <p class="mb-4">\\n     Kadang, kita tidak bisa langsung mengurangkan angka karena bilangan atasnya lebih kecil.\\n   </p>\\n   <img src="/images/course1/1-13.png" alt="gambar 13" class="mb-6 max-w-auto h-auto rounded-md shadow" />\\n\\n   <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-4 rounded">\\n     <p>1 – 5 ❌ (nggak bisa, harus pinjam 1 dari puluhan)</p>\\n     <p>Jadinya 11 – 5 = 6</p><br/>\\n     <p>Tapi karena kita pinjam 1 dari 4 puluhan, jadi tinggal 3</p>\\n     <p>3 – 7 ❌ (masih nggak bisa, pinjam lagi 1 dari ratusan!)</p>\\n     <p>13 – 7 = 6</p><br/>\\n     <p>Sekarang ratusannya tinggal 1 – 1 = 0</p><br/>\\n     <p class="font-bold text-green-700">✅ Hasilnya: 66</p>\\n   </div>	2	2024-03-12 15:30:00	2024-03-12 15:35:00
7	13	text	<h2 class="text-2xl font-bold text-black-600 mb-3">🎯 Tujuan Pembelajaran</h2>\\n   <p class="mb-4">\\n     Setelah belajar materi ini, kalian akan bisa:\\n     <ul class="list-disc pl-6 mt-2">\\n       <li>🔹 Mengerti apa itu perkalian bilangan cacah.</li>\\n       <li>🔹 Mengalikan bilangan sampai 100 dengan mudah.</li>\\n       <li>🔹 Menyelesaikan soal cerita perkalian.</li>\\n     </ul>\\n   </p>\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">🧠 Apa Itu Perkalian?</h3>\\n   <p class="mb-4">\\n     Perkalian adalah <span class="font-semibold text-green-700">penjumlahan berulang</span>. Misalnya:<br />\\n     <span class="font-bold">3 × 4</span> artinya 3 ditambah sebanyak 4 kali:<br />\\n     <span class="text-gray-700">3 + 3 + 3 + 3 = 12</span>\\n   </p>\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">🔢 Contoh Lainnya:</h3>\\n   <p class="mb-2">\\n     <span class="font-bold">4 × 8</span> = 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 = <span class="text-green-700 font-bold">48</span>\\n   </p>\\n   <img src="/images/course1/1-14.png" alt="Ilustrasi 4x8" class="mt-4 max-w-full h-auto rounded shadow" />	1	2024-03-14 16:30:00	2024-03-14 16:35:00
8	7	text	<h2 class="text-2xl font-bold text-black-600 mb-4">🎯 Tujuan Pembelajaran:</h2>\\n   <p class="mb-2">Setelah mengikuti materi ini, siswa diharapkan dapat:</p>\\n   <ul class="list-disc pl-6 mb-10 space-y-1">\\n     <li>🔹 Mengenal bilangan cacah sampai 10.000.</li>\\n     <li>🔹 Membaca dan menuliskan bilangan cacah tersebut dengan benar.</li>\\n     <li>🔹 Menyebutkan nilai tempat dan nilai angka dalam bilangan.</li>\\n   </ul>\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">📚 1. Apa itu Bilangan Cacah?</h3>\\n   <p class="mb-2">Bilangan cacah adalah bilangan yang dimulai dari 0, 1, 2, 3, dan seterusnya, tanpa bilangan negatif atau pecahan.</p>\\n   <p class="mb-2">Contoh bilangan cacah: 0, 1, 2, 3, 4, …, 9.999, 10.000</p>\\n   <p class="mb-10">Jadi, bilangan cacah sampai 10.000 adalah semua bilangan dari 0 sampai 10.000.</p>\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">🔢 2. Membaca Bilangan Cacah</h3>\\n   <p class="mb-4">Untuk membaca bilangan cacah, kita perlu memahami nilai tempat (satuan, puluhan, ratusan, ribuan).</p>\\n\\n   <table class="table-auto border border-gray-300 w-full text-left mb-6">\\n     <thead class="bg-gray-100">\\n       <tr>\\n         <th class="border border-gray-300 px-4 py-2">Bilangan</th>\\n         <th class="border border-gray-300 px-4 py-2">Cara Membaca</th>\\n       </tr>\\n     </thead>\\n     <tbody>\\n       <tr>\\n         <td class="border border-gray-300 px-4 py-2">5</td>\\n         <td class="border border-gray-300 px-4 py-2">Lima</td>\\n       </tr>\\n       <tr>\\n         <td class="border border-gray-300 px-4 py-2">42</td>\\n         <td class="border border-gray-300 px-4 py-2">Empat puluh dua</td>\\n       </tr>\\n       <tr>\\n         <td class="border border-gray-300 px-4 py-2">307</td>\\n         <td class="border border-gray-300 px-4 py-2">Tiga ratus tujuh</td>\\n       </tr>\\n       <tr>\\n         <td class="border border-gray-300 px-4 py-2">1.254</td>\\n         <td class="border border-gray-300 px-4 py-2">Seribu dua ratus lima puluh empat</td>\\n       </tr>\\n       <tr>\\n         <td class="border border-gray-300 px-4 py-2">10.000</td>\\n         <td class="border border-gray-300 px-4 py-2">Sepuluh ribu</td>\\n       </tr>\\n     </tbody>\\n   </table>	1	2024-03-01 09:00:00	2024-03-01 09:05:00
9	9	text	<h2 class="text-2xl font-bold text-black-600 mb-4">\\n      🎯 Tujuan Pembelajaran\\n    </h2>\\n    <p class="mb-2">Setelah mempelajari materi ini, siswa dapat:</p>\\n    <ul class="list-disc pl-6 mb-6">\\n      <li>🔹 Membandingkan dua atau lebih bilangan cacah sampai 10.000.</li>\\n      <li>\\n        🔹 Mengurutkan bilangan cacah dari yang terkecil ke terbesar atau\\n        sebaliknya.\\n      </li>\\n    </ul>\\n    <br></br>\\n\\n    <h3 class="text-2xl font-semibold text-blue-600 mb-2">\\n      📌 Apa itu Membandingkan Bilangan?\\n    </h3>\\n    <p class="mb-2">\\n      Membandingkan bilangan artinya kita mengetahui bilangan mana yang lebih\\n      besar, lebih kecil, atau sama.\\n    </p>\\n    <p class="mb-4">Kita bisa menggunakan tanda:</p>\\n\\n    <table class="table-auto border border-gray-300 w-full text-left mb-6">\\n      <thead class="bg-gray-100">\\n        <tr>\\n          <th class="border px-4 py-2">Tanda</th>\\n          <th class="border px-4 py-2">Arti</th>\\n        </tr>\\n      </thead>\\n      <tbody>\\n        <tr>\\n          <td class="border px-4 py-2">&gt;</td>\\n          <td class="border px-4 py-2">lebih dari</td>\\n        </tr>\\n        <tr>\\n          <td class="border px-4 py-2">&lt;</td>\\n          <td class="border px-4 py-2">kurang dari</td>\\n        </tr>\\n        <tr>\\n          <td class="border px-4 py-2">=</td>\\n          <td class="border px-4 py-2">sama dengan</td>\\n        </tr>\\n      </tbody>\\n    </table>\\n    <br></br>\\n\\n    <h3 class="text-2xl font-semibold text-blue-600 mb-2">\\n      🔢 Cara Membandingkan Bilangan\\n    </h3>\\n    <p class="font-semibold mb-2">Langkah-langkah:</p>\\n    <ol class="list-decimal pl-6 mb-6 space-y-1">\\n      <li>Lihat angka ribuan. Bandingkan dulu dari sini.</li>\\n      <li>Kalau ribuan sama, baru lihat ratusan.</li>\\n      <li>Kalau ratusan juga sama, lihat puluhan.</li>\\n      <li>Terakhir, bandingkan satuan.</li>\\n    </ol>\\n\\n    <img\\n      src="/images/course1/1-3.png"\\n      alt="gambar 3"\\n      class="w-full h-auto rounded mb-4"\\n    />\\n    <p class="mb-6">\\n      Karena 8 lebih dari 7, maka:<br />\\n      <strong>8.750 &gt; 7.500</strong>\\n    </p>\\n    <br></br>\\n\\n    <h3 class="text-2xl font-semibold text-blue-600 mb-2">✍️ Contoh Lain</h3>\\n\\n    <p class="font-bold mb-1">Contoh 1:</p>\\n    <p>Bandingkan 4.352 dan 4.365</p>\\n    <ul class="list-disc pl-6 mb-4">\\n      <li>→ Angka ribuan dan ratusan sama</li>\\n      <li>→ Lihat puluhan: 5 &lt; 6</li>\\n      <li>→ Jadi: 4.352 &lt; 4.365</li>\\n    </ul>\\n    <br></br>\\n\\n    <p class="font-bold mb-1">Contoh 2:</p>\\n    <p>Bandingkan 4.352 dan 4.352</p>\\n    <ul class="list-disc pl-6">\\n      <li>→ Semua angka sama</li>\\n      <li>→ Jadi: 4.352 = 4.352</li>\\n    </ul>	1	2024-03-05 09:00:00	2024-03-05 09:05:00
10	12	text	<h2 class="text-2xl font-bold text-black-600 mb-2">🎯 Tujuan Pembelajaran</h2>\\n   <p class="mb-4">\\n     Setelah mempelajari materi ini, kamu diharapkan:\\n     <ul class="list-disc pl-6 mt-2">\\n       <li>🔹 Mampu mengurangkan bilangan cacah sampai 1.000.</li>\\n       <li>🔹 Mampu menyelesaikan soal cerita yang melibatkan pengurangan bilangan cacah sampai 1.000.</li>\\n     </ul>\\n   </p>\\n   <br></br>\\n\\n   <p class="mb-4">\\n     Nah, kalau sebelumnya kita belajar tentang penjumlahan, sekarang saatnya kita belajar tentang <strong>pengurangan</strong>.<br />\\n     Kalau penjumlahan digunakan saat kita menambah sesuatu, maka pengurangan berguna saat kita mengurangi atau menghitung sisa dari sesuatu.<br />\\n     Misalnya, saat kita sudah membelanjakan sebagian uang jajan, atau saat teman kita meminjam pensil dari kotak alat tulis kita, dan kita ingin tahu berapa sisa pensilnya.<br />\\n     Semua anak pasti pernah mengalami hal seperti ini, kan?<br />\\n     Nah, sekarang kita akan belajar caranya menghitung pengurangan dengan mudah dan menyenangkan! 😊\\n   </p>\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">🌞 Cerita Awal</h3>\\n   <p class="mb-4">\\n     Pagi itu di perpustakaan sekolah, Riska melihat rak buku pelajaran.<br />\\n     Petugas perpustakaan bilang, ada <strong>265 buku pelajaran</strong> di rak.<br />\\n     Tapi, karena tahun ajaran baru dimulai, para siswa sudah meminjam <strong>132 buku</strong>.<br />\\n     Nah, pertanyaannya:<br />\\n     <strong>Berapa banyak buku yang masih ada di rak?</strong><br />\\n     Yuk kita belajar bagaimana cara menghitung pengurangan seperti itu!\\n   </p>\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">📚 Apa Itu Pengurangan?</h3>\\n   <p class="mb-2">\\n     Pengurangan adalah operasi matematika untuk mencari selisih antara dua bilangan.<br />\\n     Biasanya kita gunakan ketika ingin mengetahui:\\n   </p>\\n   <ul class="list-disc pl-6 mb-4">\\n     <li>Berapa sisa uang setelah belanja 💸</li>\\n     <li>Berapa banyak barang yang sudah digunakan 📦</li>\\n     <li>Berapa yang masih tersisa setelah dibagikan 🎁</li>\\n   </ul>	1	2024-03-12 15:00:00	2024-03-12 15:05:00
11	14	text	<h2 class="text-2xl font-bold text-black-600 mb-4">🎯 Tujuan Pembelajaran</h2>\\n   <ul class="list-disc pl-6 text-gray-800 mb-6 space-y-1">\\n     <li>🔹 Menjelaskan arti pembagian.</li>\\n     <li>🔹 Membagi bilangan cacah sampai 100.</li>\\n     <li>🔹 Menyelesaikan soal cerita pembagian.</li>\\n   </ul>\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">💡 Apa Itu Pembagian?</h3>\\n   <p class="mb-6 text-gray-700">\\n     Pembagian adalah <span class="font-semibold text-blue-400">pembagian secara merata</span> atau bisa disebut <span class="font-semibold text-green-700">kebalikan dari perkalian</span>.\\n   </p>\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">🧠 Contoh:</h3>\\n   <div class="bg-gray-50 border-l-4 border-blue-400 p-4 rounded mb-4">\\n     <p class="mb-2 text-gray-800">\\n       <span class="font-mono text-lg">12 : 3 = 4</span><br>\\n       Artinya: 12 dibagi ke 3 kelompok, <span class="font-semibold text-blue-700">setiap kelompok mendapat 4</span>.\\n     </p>\\n     <p class="text-gray-800">\\n       Atau kita bisa berpikir:<br>\\n       <span class="font-mono text-lg">3 × 4 = 12</span> → jadi <span class="font-mono text-lg">12 : 3 = 4</span>\\n     </p>\\n   </div>	1	2024-03-15 17:30:00	2024-03-15 17:35:00
12	14	text	<h3 class="text-2xl font-semibold text-blue-600 mb-4">🧮 Pembagian Tanpa Sisa dan Dengan Sisa</h3>\\n\\n   <div class="mb-4 text-gray-800">\\n     <p><strong>Tanpa sisa:</strong></p>\\n     <p>36 : 6 = 6</p>\\n     <p class="mb-2">(karena 6 × 6 = 36)</p>\\n\\n     <p><strong>Dengan sisa:</strong></p>\\n     <p>38 : 5 = 7 sisa 3</p>\\n     <p class="mb-2">(karena 7 × 5 = 35, lalu 38 – 35 = 3)</p>\\n\\n     <img src="/images/course1/1-20.png" alt="Pembagian dengan sisa" class="w-auto max-w-md mx-auto rounded shadow">\\n   </div>\\n   <br></br>\\n\\n   <div class="mt-6">\\n     <h4 class="text-2xl font-semibold text-blue-600 mb-2">🎉 Kesimpulan</h4>\\n     <ul class="list-disc list-inside text-gray-800 space-y-1">\\n       <li>🔹 Pembagian adalah kebalikan dari perkalian.</li>\\n       <li>🔹 Bisa dilakukan dengan cara bersusun atau dengan membayangkan kelompok.</li>\\n       <li>🔹 Pembagian bisa ada sisanya atau tidak.</li>\\n     </ul>\\n   </div>	3	2024-03-16 18:30:00	2024-03-16 18:35:00
13	15	text	<h3 class="text-2xl font-semibold text-blue-600 mb-2">💡 Apa itu Kelipatan?</h3>\\n   <p class="text-gray-800 mb-4">\\n     Kelipatan adalah hasil perkalian suatu bilangan dengan bilangan cacah.\\n   </p>\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">🔢 Contoh:</h3>\\n   <div class="text-gray-800 mb-4">\\n     <p>Kelipatan 4 adalah:</p>\\n     <ul class="list-none ml-4 mt-2 space-y-1">\\n       <li>🔹 4 × 1 = 4</li>\\n       <li>🔹 4 × 2 = 8</li>\\n       <li>🔹 4 × 3 = 12</li>\\n       <li>🔹 4 × 4 = 16</li>\\n       <li>🔹 4 × 5 = 20</li>\\n     </ul>\\n     <p class="mt-2">Jadi, kelipatan 4 adalah: <strong>4, 8, 12, 16, 20, …</strong></p>\\n   </div>	2	2024-03-18 18:30:00	2024-03-18 18:35:00
20	15	text	<h3 class="text-2xl font-bold text-black-600 mb-4">🎯 Tujuan Pembelajaran</h3>\\n   <ul class="list-disc list-inside text-gray-800 mb-6 space-y-1">\\n     <li>🔹 Menemukan faktor dari suatu bilangan.</li>\\n     <li>🔹 Menyebutkan kelipatan dari suatu bilangan.</li>\\n     <li>🔹 Menggunakan faktor dan kelipatan dalam kehidupan sehari-hari.</li>\\n   </ul>\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">🧠 Apa itu Faktor?</h3>\\n   <p class="text-gray-800 mb-4">\\n     Faktor dari suatu bilangan adalah bilangan yang bisa membagi habis bilangan tersebut (sisa bagi = 0).\\n   </p>\\n   <br></br>\\n\\n   <h4 class="text-2xl font-semibold text-blue-600 mb-2">🔢 Contoh:</h4>\\n   <div class="text-gray-800 mb-4">\\n     <p>Faktor dari 12 adalah:</p>\\n     <ul class="list-none ml-4 mt-2 space-y-1">\\n       <li>🔹 12 : 1 = 12 ✅</li>\\n       <li>🔹 12 : 2 = 6 ✅</li>\\n       <li>🔹 12 : 3 = 4 ✅</li>\\n       <li>🔹 12 : 4 = 3 ✅</li>\\n       <li>🔹 12 : 6 = 2 ✅</li>\\n       <li>🔹 12 : 12 = 1 ✅</li>\\n     </ul>\\n     <p class="mt-2">Jadi, faktor dari 12 adalah: <strong>1, 2, 3, 4, 6, dan 12</strong>.</p>\\n   </div>\\n\\n   <img src="/images/course1/1-21.png" alt="Faktor 12" class="w-full max-w-md mx-auto rounded shadow">	1	2024-03-18 18:00:00	2024-03-18 18:05:00
14	10	text	<h2 class="text-2xl font-bold text-black-600 mb-4">🎯 Tujuan Pembelajaran</h2>\\n   <p class="mb-2">Setelah mempelajari materi ini, kamu akan bisa:</p>\\n   <ul class="list-disc pl-6 mb-6">\\n     <li>🔹 Menyusun bilangan dari angka-angka satuan, puluhan, ratusan, dan ribuan.</li>\\n     <li>🔹 Menguraikan bilangan ke dalam nilai tempatnya.</li>\\n   </ul>\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">📌 Apa itu Komposisi dan Dekomposisi?</h3>\\n   <table class="table-auto border border-gray-300 w-full text-left mb-6">\\n     <thead class="bg-gray-100">\\n       <tr>\\n         <th class="border px-4 py-2">🧱 Komposisi</th>\\n         <th class="border px-4 py-2">🔧 Dekomposisi</th>\\n       </tr>\\n     </thead>\\n     <tbody>\\n       <tr>\\n         <td class="border px-4 py-2">\\n           Menyusun bilangan dari bagian-bagian<br>\\n           Contoh: 3 ribuan + 5 ratusan + 2 puluhan + 8 satuan = <strong>3.528</strong>\\n         </td>\\n         <td class="border px-4 py-2">\\n           Menguraikan bilangan ke dalam bagian-bagiannya<br>\\n           Contoh: 6.349 → <strong>6.000 + 300 + 40 + 9</strong>\\n         </td>\\n       </tr>\\n     </tbody>\\n   </table>\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">🧱 Komposisi Bilangan</h3>\\n   <p class="mb-4">Kita menyusun bilangan dengan menambahkan bagian-bagian dari nilai tempat.</p>\\n   <img src="/images/course1/1-5.png" alt="gambar 5" class="w-full h-auto rounded mb-4" />\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">✍️ Contoh Komposisi</h3>\\n   <p><strong>Contoh 3:</strong><br>6 ribuan + 0 ratusan + 3 puluhan + 9 satuan = <strong>6.039</strong></p>	1	2024-03-08 13:30:00	2024-03-08 13:35:00
15	10	text	<h3 class="text-2xl font-semibold text-blue-600 mb-2">\\n      🔧 Dekomposisi Bilangan\\n    </h3>\\n    <p class="mb-4">\\n      Kita menguraikan bilangan menjadi bagian-bagian berdasarkan nilai tempat.\\n    </p>\\n\\n    <p class="font-semibold mb-1">Contoh :</p>\\n    <p class="mb-4">Bilangan: <strong>6.789</strong></p>\\n\\n    <table class="table-auto border border-gray-300 w-full text-left mb-6">\\n      <thead class="bg-gray-100">\\n        <tr>\\n          <th class="border px-4 py-2">Nilai Tempat</th>\\n          <th class="border px-4 py-2">Angka</th>\\n          <th class="border px-4 py-2">Nilai Angka</th>\\n        </tr>\\n      </thead>\\n      <tbody>\\n        <tr>\\n          <td class="border px-4 py-2">Ribuan</td>\\n          <td class="border px-4 py-2">6</td>\\n          <td class="border px-4 py-2">6.000</td>\\n        </tr>\\n        <tr>\\n          <td class="border px-4 py-2">Ratusan</td>\\n          <td class="border px-4 py-2">7</td>\\n          <td class="border px-4 py-2">700</td>\\n        </tr>\\n        <tr>\\n          <td class="border px-4 py-2">Puluhan</td>\\n          <td class="border px-4 py-2">8</td>\\n          <td class="border px-4 py-2">80</td>\\n        </tr>\\n        <tr>\\n          <td class="border px-4 py-2">Satuan</td>\\n          <td class="border px-4 py-2">9</td>\\n          <td class="border px-4 py-2">9</td>\\n        </tr>\\n      </tbody>\\n    </table>\\n\\n    <p class="mb-4">\\n      <strong>🔽 Maka dekomposisinya:</strong><br />\\n      6.789 = 6.000 + 700 + 80 + 9\\n    </p>\\n\\n    <img\\n      src="/images/course1/1-6.png"\\n      alt="gambar 6"\\n      class="w-full h-auto rounded mb-6"\\n    />\\n    <br></br>\\n\\n    <h3 class="text-2xl font-semibold text-blue-600 mb-2">\\n      ✍️ Contoh Dekomposisi\\n    </h3>\\n    <p class="mb-6">\\n      <strong>Contoh 4:</strong><br />\\n      Bilangan: <strong>2.418</strong><br />\\n      → <strong>2.000 + 400 + 10 + 8</strong>\\n    </p>\\n    <br></br>\\n\\n    <h3 class="text-2xl font-semibold text-blue-600 mb-2">🧠 Tips Jitu!</h3>\\n    <p class="font-semibold mb-2">Ingat:</p>\\n    <ul class="list-disc pl-6 mb-4">\\n      <li>Komposisi = Menyusun</li>\\n      <li>Dekomposisi = Menguraikan</li>\\n    </ul>\\n\\n    <p>\\n      <strong>💡 Ibarat LEGO:</strong><br />\\n      Komposisi = menyusun LEGO jadi robot<br />\\n      Dekomposisi = membongkar robot jadi LEGO kecil\\n    </p>	2	2024-03-08 14:00:00	2024-03-08 14:05:00
16	11	text	<h2 class="text-2xl font-bold text-black-600 mb-4">🎯 Tujuan Pembelajaran</h2>\\n   <p class="mb-4">\\n     Setelah mempelajari materi ini, kamu diharapkan:\\n     <ul class="list-disc pl-6 mt-2 mb-4">\\n       <li>🔹 Mampu menjumlahkan bilangan cacah sampai 1.000.</li>\\n       <li>🔹 Mampu menyelesaikan soal cerita yang melibatkan penjumlahan bilangan cacah sampai 1.000.</li>\\n     </ul>\\n   </p>\\n   <br></br>\\n\\n   <p class="mb-4">\\n     Halo teman-teman hebat! 👋<br />\\n     Hari ini kita akan belajar tentang <strong>penjumlahan bilangan cacah sampai 1.000</strong>.<br />\\n     Kalian pasti sering bertemu penjumlahan di kehidupan sehari-hari, misalnya saat menghitung koin di celengan, jumlah buku di rak, atau jumlah teman yang hadir di kelas. Seru, kan?<br />\\n     Untuk itu, mari kita belajar bersama-sama, perlahan-lahan, supaya semua teman bisa memahami dengan baik.\\n   </p>\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">🔍 Mari kita amati !!</h3>\\n   <p class="mb-4">\\n     <img src="/images/course1/1-7.png" alt="gambar 7" class="w-auto h-auto rounded mb-4" />\\n     Bu Rini punya dua kebun jeruk.<br />\\n     Di kebun pertama, Bu Rini menanam <strong>131 pohon</strong>.<br />\\n     Di kebun kedua, ada <strong>321 pohon</strong>.<br />\\n     Nah, kira-kira berapa jumlah seluruh pohon jeruk Bu Rini?<br />\\n     Bagaimana ya caranya menghitungnya? 🤔\\n   </p>\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">📚 Belajar Cara Menjumlahkan</h3>\\n   <p class="mb-4">\\n     Ada dua cara mudah yang bisa kita pilih.\\n   </p>	1	2024-03-10 14:00:00	2024-03-10 14:05:00
17	13	text	<h3 class="text-2xl font-semibold text-blue-600 mb-3">📏 Tabel Perkalian 1–10</h3>\\n   <p class="mb-3">\\n     Belajar perkalian lebih mudah dengan tabel perkalian. Coba lihat dan hafalkan!\\n   </p>\\n   <img src="/images/course1/1-15.png" alt="Tabel Perkalian 1-10" class="max-w-full h-auto rounded shadow mb-6" />\\n   <br></br>\\n\\n   <h4 class="text-2xl font-semibold text-blue-600 mb-2">💡 Tips Mengalikan Bilangan Lebih Dari 10 Sampai 100</h4>\\n   <p class="mb-3">\\n     Misalnya kamu ingin menghitung:\\n   </p>\\n   <p class="mb-3 font-semibold text-gray-800">12 × 5 = ?</p>\\n   <p class="mb-3">\\n     Kita bisa menggunakan cara bersusun:\\n   </p>\\n   <img src="/images/course1/1-16.png" alt="Cara Bersusun 12x5" class="max-w-full h-auto rounded shadow mb-4" />\\n   <p class="mb-6 font-bold text-green-700">Jawabannya adalah 60.</p>\\n   <br></br>\\n\\n   <h4 class="text-2xl font-semibold text-blue-600 mb-2">🔢 Contoh lain:</h4>\\n   <ul class="list-disc pl-6 text-gray-800">\\n     <li>25 × 4 = <span class="font-bold text-green-700">100</span></li>\\n     <li>36 × 2 = <span class="font-bold text-green-700">72</span></li>\\n   </ul>	2	2024-03-14 17:00:00	2024-03-14 17:05:00
18	13	text	<h3 class="text-2xl font-semibold text-blue-600 mb-4">🧩 Soal Cerita Perkalian</h3>\\n\\n   <p class="mb-2">\\n     Ani membeli <span class="font-semibold text-blue-700">7 kotak pensil</span>. Setiap kotak berisi <span class="font-semibold text-blue-700">12 pensil</span>.<br>\\n     <strong>Berapa banyak pensil yang dimiliki Ani?</strong><br>\\n     ➤ <span class="font-bold text-green-700">12 × 7 = 84 pensil</span>\\n   </p>\\n   <br></br>\\n\\n   <p class="mb-4">\\n     Di kelas ada <span class="font-semibold text-blue-700">6 baris kursi</span>. Setiap baris ada <span class="font-semibold text-blue-700">9 kursi</span>.<br>\\n     <strong>Ada berapa kursi seluruhnya?</strong><br>\\n     ➤ <span class="font-bold text-green-700">6 × 9 = 54 kursi</span>\\n   </p>\\n\\n   <img src="/images/course1/1-17.png" alt="Ilustrasi 6x9 kursi" class="max-w-full h-auto rounded shadow mb-6" />\\n   <br></br>\\n\\n   <h3 class="text-2xl font-semibold text-blue-600 mb-2">🎉 Kesimpulan</h3>\\n   <ul class="list-disc pl-6 text-gray-800 space-y-1">\\n     <li>🔹 Perkalian adalah <span class="font-semibold text-blue-700">penjumlahan berulang</span>.</li>\\n     <li>🔹 Kita bisa mengalikan bilangan sampai 100 dengan <span class="font-semibold">cara bersusun</span> atau menggunakan <span class="font-semibold">tabel perkalian</span>.</li>\\n     <li>🔹 Perkalian sangat berguna untuk menyelesaikan <span class="font-semibold text-purple-700">soal cerita</span>.</li>\\n   </ul>	3	2024-03-14 17:30:00	2024-03-14 17:35:00
19	14	text	<h3 class="text-2xl font-semibold text-blue-600 mb-4">🍬 Contoh Sederhana</h3>\\n\\n   <div class="mb-4">\\n     <img src="/images/course1/1-18.png" alt="Ilustrasi pembagian" class="w-full max-w-md mx-auto rounded shadow">\\n   </div>\\n\\n   <p class="text-gray-800 mb-2">\\n     <strong>48 : 4 = ?</strong><br>\\n     Artinya: 48 dibagi ke dalam 4 bagian sama besar.\\n   </p>\\n\\n   <p class="text-gray-800 mb-4">\\n     Gunakan cara bersusun:\\n   </p>\\n\\n   <div class="mb-4">\\n     <img src="/images/course1/1-19.png" alt="Pembagian bersusun" class="w-auto max-w-md mx-auto rounded shadow">\\n   </div>\\n\\n   <p class="text-green-700 font-semibold text-lg">Jawaban = 12</p>	2	2024-03-15 18:00:00	2024-03-15 18:05:00
21	15	text	<h3 class="text-2xl font-semibold text-blue-600 mb-4">🧩 Perbedaan Faktor dan Kelipatan</h3>\\n   <div class="overflow-x-auto">\\n     <table class="table-auto w-full border border-gray-300 text-center text-sm text-gray-700">\\n       <thead class="bg-indigo-100">\\n         <tr>\\n           <th class="border border-gray-300 px-4 py-2 font-semibold">Bilangan</th>\\n           <th class="border border-gray-300 px-4 py-2 font-semibold">Faktor</th>\\n           <th class="border border-gray-300 px-4 py-2 font-semibold">Kelipatan</th>\\n         </tr>\\n       </thead>\\n       <tbody>\\n         <tr class="bg-white">\\n           <td class="border border-gray-300 px-4 py-2">6</td>\\n           <td class="border border-gray-300 px-4 py-2">1, 2, 3, 6</td>\\n           <td class="border border-gray-300 px-4 py-2">6, 12, 18, 24, 30, …</td>\\n         </tr>\\n         <tr class="bg-gray-50">\\n           <td class="border border-gray-300 px-4 py-2">10</td>\\n           <td class="border border-gray-300 px-4 py-2">1, 2, 5, 10</td>\\n           <td class="border border-gray-300 px-4 py-2">10, 20, 30, 40, 50, …</td>\\n         </tr>\\n       </tbody>\\n     </table>\\n   </div>\\n   <br></br>\\n\\n   <div class="mt-4 text-gray-800">\\n     <h3 class="text-2xl font-semibold text-blue-600 mb-4">🎉 Kesimpulan:</h3>\\n     <ul class="list-disc list-inside mt-2 space-y-1">\\n       <li>🔹 <strong>Faktor:</strong> Bilangan yang membagi habis suatu bilangan.</li>\\n       <li>🔹 <strong>Kelipatan:</strong> Hasil kali suatu bilangan dengan bilangan cacah.</li>\\n       <li>🔹 Gunakan gambar dan alat bantu untuk lebih memahami konsep ini.</li>\\n     </ul>\\n   </div>	3	2024-03-18 19:00:00	2024-03-18 19:05:00
\.


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modules (module_id, course_id, title, description, module_order, created_at, updated_at) FROM stdin;
1	1	Pengenalan Piktogram	Memahami apa itu piktogram dan kegunaannya dalam menyajikan data.	1	2024-01-15 09:00:00	2024-01-16 09:05:00
2	1	Membaca Informasi dari Piktogram	Belajar cara menafsirkan data yang disajikan dalam bentuk piktogram.	2	2024-01-17 10:00:00	2024-01-18 10:05:00
3	1	Membuat Piktogram Sederhana	Praktik membuat piktogram dari data yang diberikan menggunakan simbol yang tepat.	3	2024-01-19 11:00:00	2024-01-20 11:05:00
4	1	Pengenalan Diagram Batang	Memahami apa itu diagram batang dan komponen-komponennya.	4	2024-01-21 12:00:00	2024-01-22 12:05:00
5	1	Membaca Informasi dari Diagram Batang	Belajar cara menafsirkan data yang disajikan dalam bentuk diagram batang.	5	2024-01-23 13:00:00	2024-01-24 13:05:00
6	1	Membuat Diagram Batang Sederhana	Praktik membuat diagram batang dari data yang diberikan secara akurat.	6	2024-01-25 14:00:00	2024-01-26 14:05:00
7	2	Membaca dan Menulis Bilangan Cacah sampai 10.000	Mengenal cara membaca dan menuliskan bilangan cacah hingga sepuluh ribu.	1	2024-03-01 10:00:00	2024-03-02 10:05:00
8	2	Menentukan dan Menggunakan Nilai Tempat Bilangan Cacah sampai 10.000	Memahami nilai setiap angka berdasarkan posisinya dalam bilangan hingga 10.000.	2	2024-03-03 11:00:00	2024-03-04 11:05:00
9	2	Membandingkan dan Mengurutkan Bilangan Cacah sampai 10.000	Menentukan mana bilangan yang lebih besar atau kecil dan menyusunnya secara urut.	3	2024-03-05 12:00:00	2024-03-06 12:05:00
10	2	Komposisi dan Dekomposisi Bilangan Cacah sampai 10.000	Menyusun dan memecah bilangan cacah menjadi bagian-bagian angka yang lebih kecil.	4	2024-03-07 13:00:00	2024-03-08 13:05:00
11	2	Penjumlahan Bilangan Cacah sampai 1.000	Menjumlahkan dua atau lebih bilangan cacah hingga seribu.	5	2024-03-09 14:00:00	2024-03-10 14:05:00
12	2	Pengurangan Bilangan Cacah sampai 1.000	Menghitung selisih antara dua bilangan cacah hingga seribu.	6	2024-03-11 15:00:00	2024-03-12 15:05:00
13	2	Perkalian Bilangan Cacah Sampai 100	Mengalikan bilangan cacah dengan hasil maksimal seratus.	7	2024-03-13 16:00:00	2024-03-14 16:05:00
14	2	Pembagian Bilangan Cacah Sampai 100	Membagi bilangan cacah dengan hasil maksimal seratus.	8	2024-03-15 17:00:00	2024-03-16 17:05:00
15	2	Faktor dan Kelipatan	Menentukan bilangan yang dapat membagi habis atau menjadi hasil perkalian bilangan tertentu.	9	2024-03-17 18:00:00	2024-03-18 18:05:00
16	3	Pengenalan Konsep Pecahan	Memahami pecahan sebagai bagian dari keseluruhan dan cara menuliskannya.	1	2024-03-06 09:00:00	2024-03-07 09:05:00
17	3	Jenis-jenis Pecahan (Biasa, Campuran, Desimal)	Mengenal berbagai bentuk pecahan dan karakteristiknya.	2	2024-03-08 10:00:00	2024-03-09 10:05:00
18	3	Pecahan Senilai dan Menyederhanakan Pecahan	Mempelajari cara menemukan pecahan yang memiliki nilai sama dan menyederhanakannya.	3	2024-03-10 11:00:00	2024-03-11 11:05:00
19	3	Membandingkan dan Mengurutkan Pecahan	Menentukan pecahan mana yang lebih besar/kecil dan menyusunnya secara berurutan.	4	2024-03-12 12:00:00	2024-03-13 12:05:00
20	3	Penjumlahan Pecahan Berpenyebut Sama	Melakukan operasi penjumlahan pada pecahan dengan penyebut yang sama.	5	2024-03-14 13:00:00	2024-03-15 13:05:00
21	3	Pengurangan Pecahan Berpenyebut Sama	Melakukan operasi pengurangan pada pecahan dengan penyebut yang sama.	6	2024-03-16 14:00:00	2024-03-17 14:05:00
22	3	Penjumlahan Pecahan Berpenyebut Berbeda	Melakukan operasi penjumlahan pada pecahan dengan penyebut yang berbeda.	7	2024-03-18 15:00:00	2024-03-19 15:05:00
23	3	Pengurangan Pecahan Berpenyebut Berbeda	Melakukan operasi pengurangan pada pecahan dengan penyebut yang berbeda.	8	2024-03-20 16:00:00	2024-03-21 16:05:00
24	4	Mengenali Pola Gambar Sederhana	Mengidentifikasi urutan dan aturan dalam pola gambar yang berulang.	1	2024-04-09 09:00:00	2024-04-10 09:05:00
25	4	Melanjutkan Pola Gambar	Memprediksi dan menggambar elemen selanjutnya dalam suatu pola gambar.	2	2024-04-11 10:00:00	2024-04-12 10:05:00
26	4	Membuat Pola Gambar Sendiri	Mengembangkan kreativitas dengan menciptakan pola gambar berdasarkan aturan yang ditentukan.	3	2024-04-13 11:00:00	2024-04-14 11:05:00
27	4	Mengenali Pola Bilangan Sederhana	Mengidentifikasi urutan dan aturan dalam pola bilangan (penjumlahan, pengurangan, perkalian, pembagian).	4	2024-04-15 12:00:00	2024-04-16 12:05:00
28	4	Melanjutkan Pola Bilangan	Memprediksi dan menentukan angka selanjutnya dalam suatu pola bilangan.	5	2024-04-17 13:00:00	2024-04-18 13:05:00
29	4	Membuat Pola Bilangan Sendiri	Menciptakan pola bilangan berdasarkan aturan matematika yang logis.	6	2024-04-19 14:00:00	2024-04-20 14:05:00
30	5	Pengenalan Konsep Luas	Memahami apa itu luas dan bagaimana menghitungnya.	1	2024-05-11 09:00:00	2024-05-12 09:05:00
31	5	Menghitung Luas Persegi dan Persegi Panjang	Mempelajari rumus dan cara menghitung luas bangun datar persegi dan persegi panjang.	2	2024-05-13 10:00:00	2024-05-14 10:05:00
32	5	Menghitung Luas Segitiga	Mempelajari rumus dan cara menghitung luas bangun datar segitiga.	3	2024-05-15 11:00:00	2024-05-16 11:05:00
33	5	Pengenalan Konsep Volume	Memahami apa itu volume dan bagaimana menghitungnya.	4	2024-05-17 12:00:00	2024-05-18 12:05:00
34	5	Menghitung Volume Kubus	Mempelajari rumus dan cara menghitung volume bangun ruang kubus.	5	2024-05-19 13:00:00	2024-05-20 13:05:00
35	5	Menghitung Volume Balok	Mempelajari rumus dan cara menghitung volume bangun ruang balok.	6	2024-05-21 14:00:00	2024-05-22 14:05:00
36	6	Mengenal Berbagai Jenis Bangun Datar	Mengidentifikasi dan membedakan berbagai bentuk bangun datar seperti persegi, lingkaran, segitiga, dll.	1	2024-06-11 09:00:00	2024-06-12 09:05:00
37	6	Ciri-ciri dan Sifat Bangun Datar	Memahami karakteristik unik dari setiap bangun datar (jumlah sisi, sudut, dll.).	2	2024-06-13 10:00:00	2024-06-14 10:05:00
38	6	Menghitung Keliling Bangun Datar Sederhana	Mempelajari cara menghitung keliling bangun datar seperti persegi, persegi panjang, dan segitiga.	3	2024-06-15 11:00:00	2024-06-16 11:05:00
39	6	Menghitung Luas Bangun Datar Sederhana	Mempelajari cara menghitung luas bangun datar seperti persegi, persegi panjang, dan segitiga.	4	2024-06-17 12:00:00	2024-06-18 12:05:00
40	6	Menyusun Bangun Datar menjadi Bentuk Baru	Menggabungkan beberapa bangun datar untuk membentuk bangun baru yang lebih kompleks.	5	2024-06-19 13:00:00	2024-06-20 13:05:00
41	6	Memecah Bangun Datar Kompleks	Menganalisis dan memecah bangun datar kompleks menjadi bangun datar sederhana.	6	2024-06-21 14:00:00	2024-06-22 14:05:00
\.


--
-- Data for Name: quiz_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quiz_options (quiz_option_id, question_id, option_text, option_order, created_at, updated_at) FROM stdin;
1	1	Satuan	1	2024-05-19 18:58:45.450454	2024-05-19 18:58:45.450454
2	1	Ratusan	2	2024-05-19 18:58:45.450454	2024-05-19 18:58:45.450454
3	1	Ribuan	3	2024-05-19 18:58:45.450454	2024-05-19 18:58:45.450454
4	1	Puluhan	4	2024-05-19 18:58:45.450454	2024-05-19 18:58:45.450454
5	2	5	1	2024-05-19 18:59:43.645429	2024-05-19 18:59:43.645429
6	2	50	2	2024-05-19 18:59:43.645429	2024-05-19 18:59:43.645429
7	2	500	3	2024-05-19 18:59:43.645429	2024-05-19 18:59:43.645429
8	2	5000	4	2024-05-19 18:59:43.645429	2024-05-19 18:59:43.645429
9	3	1.493	1	2024-05-19 19:00:40.00074	2024-05-19 19:00:40.00074
10	3	9.031	2	2024-05-19 19:00:40.00074	2024-05-19 19:00:40.00074
11	3	3.519	3	2024-05-19 19:00:40.00074	2024-05-19 19:00:40.00074
12	3	7.963	4	2024-05-19 19:00:40.00074	2024-05-19 19:00:40.00074
13	4	6.042	1	2024-05-19 19:01:29.514745	2024-05-19 19:01:29.514745
14	4	6.420	2	2024-05-19 19:01:29.514745	2024-05-19 19:01:29.514745
15	4	6.402	3	2024-05-19 19:01:29.514745	2024-05-19 19:01:29.514745
16	4	6.240	4	2024-05-19 19:01:29.514745	2024-05-19 19:01:29.514745
17	5	Satuan	1	2024-05-19 19:02:47.185122	2024-05-19 19:02:47.185122
18	5	Ratusan	2	2024-05-19 19:02:47.185122	2024-05-19 19:02:47.185122
19	5	Ribuan	3	2024-05-19 19:02:47.185122	2024-05-19 19:02:47.185122
20	5	Puluhan	4	2024-05-19 19:02:47.185122	2024-05-19 19:02:47.185122
21	6	3.241	1	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
22	6	3.214	2	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
23	6	3.124	3	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
24	6	3.421	4	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
25	7	Enam ribu tujuh ratus delapan	1	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
26	7	Enam ribu delapan puluh tujuh	2	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
27	7	Enam ribu nol tujuh puluh delapan	3	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
28	7	Enam ribu tujuh puluh delapan	4	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
29	8	Satuan	1	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
30	8	Puluhan	2	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
31	8	Ratusan	3	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
32	8	Ribuan	4	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
33	9	3.506	1	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
34	9	3.650	2	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
35	9	3.056	3	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
36	9	3.065	4	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
37	10	4.923	1	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
38	10	5.023	2	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
39	10	5.203	3	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
40	10	5.321	4	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
41	11	2.305, 2.350, 2.503	1	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
42	11	2.503, 2.350, 2.305	2	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
43	11	2.305, 2.503, 2.350	3	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
44	11	2.350, 2.503, 2.305	4	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
45	12	7 ribuan + 40 ratusan + 8 satuan	1	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
46	12	7 ribuan + 4 ratusan + 8 satuan	2	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
47	12	7 ribuan + 0 ratusan + 4 puluhan + 8 satuan	3	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
48	12	70 ratusan + 4 puluhan + 8 satuan	4	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
49	13	6 + 2 + 4 + 1	1	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
50	13	6000 + 200 + 40 + 1	2	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
51	13	60 + 20 + 4 + 1	3	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
52	13	6 + 200 + 4 + 1	4	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
53	14	659	1	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
54	14	669	2	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
55	14	679	3	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
56	14	689	4	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
57	15	527	1	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
58	15	517	2	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
59	15	537	3	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
60	15	547	4	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
61	16	456	1	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
62	16	446	2	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
63	16	444	3	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
64	16	464	4	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
65	17	72	1	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
66	17	84	2	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
67	17	68	3	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
68	17	62	4	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
69	18	84 pensil	1	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
70	18	72 pensil	2	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
71	18	96 pensil	3	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
72	18	76 pensil	4	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
73	19	24	1	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
74	19	20	2	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
75	19	28	3	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
76	19	22	4	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
77	20	2, 3, 5	1	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
78	20	2, 4, 6	2	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
79	20	2, 5, 10	3	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
80	20	2, 6, 9	4	2024-05-22 19:00:40.991759	2024-05-22 19:00:40.991759
\.


--
-- Data for Name: quiz_questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quiz_questions (question_id, quiz_id, question_text, question_order, correct_option_id, created_at, updated_at) FROM stdin;
1	1	Angka 7 pada bilangan 7.483 menempati nilai tempat …	1	3	2024-05-19 18:57:16.355342	2024-05-19 19:06:51.403915
2	1	Nilai tempat dari angka 5 pada bilangan 3.582 adalah …	2	7	2024-05-19 18:57:16.355342	2024-05-19 19:06:51.403915
3	1	Bilangan yang memiliki angka 9 pada tempat ratusan adalah …	3	12	2024-05-19 18:57:16.355342	2024-05-19 19:06:51.403915
4	1	Bilangan yang terdiri dari 6 ribuan, 0 ratusan, 4 puluhan, dan 2 satuan adalah …	4	13	2024-05-19 18:57:16.355342	2024-05-19 19:06:51.403915
5	1	Nilai tempat dari angka 0 pada bilangan 2.150 adalah…	5	17	2024-05-19 18:57:16.355342	2024-05-19 19:06:51.403915
6	2	Bilangan “tiga ribu dua ratus empat belas” ditulis sebagai …	1	22	2024-05-22 18:40:34.811302	2024-05-22 19:08:54.001031
7	2	Cara membaca bilangan 6.078 adalah …	2	28	2024-05-22 18:40:34.811302	2024-05-22 19:08:54.001031
8	2	Nilai tempat angka 6 pada bilangan 6.382 adalah …	3	32	2024-05-22 18:40:34.811302	2024-05-22 19:08:54.001031
9	2	Bilangan yang terdiri atas 3 ribuan, 0 ratusan, 5 puluhan, dan 6 satuan adalah …	4	35	2024-05-22 18:40:34.811302	2024-05-22 19:08:54.001031
10	2	Bilangan manakah yang lebih besar dari 5.230?	5	40	2024-05-22 18:40:34.811302	2024-05-22 19:08:54.001031
11	2	Urutan bilangan dari yang terkecil: 2.350, 2.305, 2.503 adalah …	6	41	2024-05-22 18:40:34.811302	2024-05-22 19:08:54.001031
12	2	Bilangan 7.048 dapat diuraikan menjadi …	7	47	2024-05-22 18:40:34.811302	2024-05-22 19:08:54.001031
13	2	6.241 = … ribuan + … ratusan + … puluhan + … satuan	8	49	2024-05-22 18:40:34.811302	2024-05-22 19:08:54.001031
14	2	Hasil dari 453 + 216 adalah …	9	54	2024-05-22 18:40:34.811302	2024-05-22 19:08:54.001031
15	2	385 + 142 = …	10	57	2024-05-22 18:40:34.811302	2024-05-22 19:08:54.001031
16	2	735 – 289 = …	11	62	2024-05-22 18:40:34.811302	2024-05-22 19:08:54.001031
17	2	Hasil dari 24 × 3 adalah …	12	65	2024-05-22 18:40:34.811302	2024-05-22 19:08:54.001031
18	2	Jika satu pak berisi 12 pensil, maka 7 pak berisi …	13	69	2024-05-22 18:40:34.811302	2024-05-22 19:08:54.001031
19	2	96 dibagi 4 hasilnya adalah …	14	73	2024-05-22 18:40:34.811302	2024-05-22 19:08:54.001031
20	2	Berikut ini yang merupakan faktor dari 12 adalah …	15	78	2024-05-22 18:40:34.811302	2024-05-22 19:08:54.001031
\.


--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quizzes (quiz_id, module_id, course_id, title, description, time_limit, pass_score, is_final_exam, created_at, updated_at) FROM stdin;
1	8	2	Quiz Menentukan dan Menggunakan Nilai Tempat Bilangan Cacah sampai 10.000	Menguji pemahaman Menentukan dan Menggunakan Nilai Tempat Bilangan Cacah sampai 10.000.	5	60	f	2024-05-19 18:24:27.398241	2024-05-19 18:24:27.398241
2	\N	2	Test Akhir Bilangan Cacah sampai 10.000	Menguji pemahaman untuk materi Bilangan Cacah sampai 10.000	15	70	t	2024-05-22 18:22:36.58515	2024-05-22 18:22:36.58515
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (review_id, user_id, course_id, content, sentiment, created_at, updated_at) FROM stdin;
1	2	2	Materi Bilangan Cacah ini sangat mudah dipahami! Penjelasannya lugas dan contohnya jelas.	positif	2024-01-08 11:00:00	2024-01-08 11:10:00
2	2	3	Modul Pecahan ini membantu saya memahami konsep dasar dengan baik. Soal latihannya juga variatif.	positif	2024-01-12 12:00:00	2024-01-12 12:15:00
3	2	10	Kursus KPK dan FPB ini agak rumit di awal, tapi setelah dipelajari perlahan jadi lebih mengerti. Butuh fokus ekstra.	positif	2024-01-18 13:00:00	2024-01-18 13:20:00
4	3	1	Piktogram dan Diagram Batang ini materi yang menyenangkan! Gambarnya bikin semangat belajar.	positif	2024-01-22 10:00:00	2024-01-22 10:05:00
5	3	5	Bangun Datar dijelaskan dengan baik, tapi saya masih agak bingung di bagian jaring-jaringnya. Perlu latihan lebih.	positif	2024-01-28 11:00:00	2024-01-28 11:10:00
6	3	12	Satuan Panjang dan Berat ini materinya agak membosankan buat anak saya. Mungkin bisa lebih banyak video interaktif?	negatif	2024-02-02 12:00:00	2024-02-02 12:05:00
7	4	2	Sangat membantu untuk anak saya yang kesulitan dengan bilangan cacah. Terima kasih!	positif	2024-02-07 14:00:00	2024-02-07 14:05:00
8	4	6	Penjelasan Bangun Datar cukup jelas, tapi kadang gambarnya kurang besar di layar tablet.	positif	2024-02-12 15:00:00	2024-02-12 15:05:00
9	5	1	Materi Piktogram ini bagus, mudah dipahami. Anak saya suka!	positif	2024-02-17 10:00:00	2024-02-17 10:05:00
10	5	7	Perkalian dan Pembagian Bilangan Bulat sangat menantang tapi penjelasannya cukup membantu.	positif	2024-02-22 11:00:00	2024-02-22 11:10:00
11	5	15	Skala dan Perbandingan ini materinya agak banyak, tapi saya bisa mengikuti dengan baik.	positif	2024-02-27 12:00:00	2024-02-27 12:05:00
12	6	2	Kuisnya menantang! Bikin anak makin semangat belajar bilangan cacah.	positif	2024-03-03 10:00:00	2024-03-03 10:05:00
13	6	11	Pengolahan data ini bagus, tapi saya berharap ada lebih banyak contoh soal interaktif.	positif	2024-03-08 11:00:00	2024-03-08 11:10:00
14	7	3	Pecahan adalah materi yang sulit untuk saya, penjelasan di sini lumayan membantu. Terima kasih!	positif	2024-03-12 14:00:00	2024-03-12 14:05:00
15	7	4	Pola Bilangan ini seru banget! Anak saya jadi suka cari-cari pola di sekitar.	positif	2024-03-17 15:00:00	2024-03-17 15:10:00
16	7	18	Volume Bangun Ruang, materinya agak berat untuk kelas SD. Tapi penjelasannya detail.	positif	2024-03-22 16:00:00	2024-03-22 16:05:00
17	8	1	Piktogramnya oke, saya jadi lebih paham. 	positif	2024-03-27 10:00:00	2024-03-27 10:05:00
18	8	9	Modul Operasi Hitung Campuran terlalu cepat bagi anak saya. Perlu penjelasan yang lebih sederhana lagi.	negatif	2024-04-02 11:00:00	2024-04-02 11:10:00
19	9	2	Quiz Bilangan Cacahnya lumayan menantang.	positif	2024-04-07 13:00:00	2024-04-07 13:05:00
20	9	13	Satuan Waktu dan Volume cukup membingungkan. Contohnya kurang bervariasi.	negatif	2024-04-12 14:00:00	2024-04-12 14:10:00
21	9	20	Statistika Dasar ini menarik! Penjelasannya mudah dicerna.	positif	2024-04-17 15:00:00	2024-04-17 15:05:00
22	10	3	Pecahan. Ini materi paling bikin pusing. Tapi dengan kursus ini sedikit mendingan. 	positif	2024-04-22 10:00:00	2024-04-22 10:05:00
23	10	7	Perkalian ini sudah cukup baik, terima kasih!	positif	2024-04-27 11:00:00	2024-04-27 11:05:00
24	11	4	Pola bilangan bikin anak saya ketagihan. 👍	positif	2024-05-02 12:00:00	2024-05-02 12:05:00
25	11	8	Pembagian agak sulit, tapi contohnya lumayan membantu. Butuh pengulangan.	positif	2024-05-07 13:00:00	2024-05-07 13:10:00
26	11	25	Pengukuran Sudut ini perlu lebih banyak gambar ilustrasi agar mudah dibayangkan.	negatif	2024-05-12 14:00:00	2024-05-12 14:05:00
27	12	5	Penjelasan Bangun Datar yang cukup komprehensif. Anak saya senang!	positif	2024-05-17 15:00:00	2024-05-17 15:05:00
28	12	10	KPK dan FPB lumayan bikin pusing, tapi materi ini cukup jelas kok. Asal fokus!	positif	2024-05-22 16:00:00	2024-05-22 16:10:00
29	13	6	Modul Bangun Datar ini interaktif, anak saya suka. Bisa sambil menggambar.	positif	2024-05-27 10:00:00	2024-05-27 10:05:00
30	13	11	Pengolahan data terlalu banyak teks, anak saya cepat bosan. Perlu lebih banyak visualisasi.	negatif	2024-06-01 11:00:00	2024-06-01 11:10:00
31	13	28	Pengenalan Aljabar ini cukup menarik, meskipun masih sangat dasar.	positif	2024-06-06 12:00:00	2024-06-06 12:05:00
32	14	1	Sangat direkomendasikan untuk dasar piktogram. Oke!	positif	2024-06-10 14:00:00	2024-06-10 14:05:00
33	14	12	Satuan Panjang dan Berat, materinya agak kurang menarik. Anak saya cepat hilang fokus.	negatif	2024-06-15 15:00:00	2024-06-15 15:10:00
34	15	2	Kursus bilangan cacah ini standar, tidak terlalu istimewa tapi cukup membantu.	positif	2024-06-20 11:00:00	2024-06-20 11:05:00
35	15	14	Debit ini materinya bagus, contohnya relevan dengan kehidupan sehari-hari.	positif	2024-06-25 12:00:00	2024-06-25 12:10:00
36	15	22	Sudut dan Garis, lumayan membantu, tapi ada beberapa bagian yang agak sulit dicerna.	positif	2024-06-30 13:00:00	2024-06-30 13:05:00
37	16	3	Penjelasan pecahan ini butuh lebih banyak contoh soal yang bervariasi.	negatif	2024-07-03 10:00:00	2024-07-03 10:05:00
38	16	16	Geometri Ruang ini materi favorit anak saya. Penjelasannya bagus dan visualnya oke.	positif	2024-07-08 11:00:00	2024-07-08 11:10:00
39	17	4	Pola gambar dan bilangan ini seru, cocok untuk anak yang suka tantangan.	positif	2024-07-12 12:00:00	2024-07-12 12:05:00
40	17	17	Luas Permukaan Bangun Ruang, penjelasannya terlalu teoritis. Butuh lebih banyak praktik.	negatif	2024-07-17 13:00:00	2024-07-17 13:10:00
41	17	26	Keliling dan Luas Lingkaran, perlu lebih sederhana lagi penjelasannya.	negatif	2024-07-22 14:00:00	2024-07-22 14:05:00
42	18	5	Bangun Datar ini materinya mudah diikuti, anak saya paham!	positif	2024-07-27 15:00:00	2024-07-27 15:05:00
43	18	19	Koordinat Kartesius ini materinya baru dan menarik. Penjelasannya sangat jelas.	positif	2024-08-01 16:00:00	2024-08-01 16:10:00
44	19	6	Bangun Datar cukup menarik, tapi videonya kadang buffering.	positif	2024-08-05 10:00:00	2024-08-05 10:05:00
45	19	21	Pengolahan Data ini lumayan sulit, tapi soalnya menarik.	positif	2024-08-10 11:00:00	2024-08-10 11:10:00
46	19	29	Barisan dan Deret Bilangan, terlalu kompleks untuk anak saya.	negatif	2024-08-15 12:00:00	2024-08-15 12:05:00
47	20	1	Piktogramnya oke, saya jadi lebih paham. 	positif	2024-08-20 13:00:00	2024-08-20 13:05:00
48	20	23	Simetri Lipat dan Putar ini materinya menyenangkan, anak saya jadi suka menggambar.	positif	2024-08-25 14:00:00	2024-08-25 14:10:00
49	21	2	Materi Bilangan Cacah ini standar saja.	positif	2024-08-30 15:00:00	2024-08-30 15:05:00
50	21	24	Jaring-jaring Bangun Ruang lumayan menantang, tapi bisa dipahami.	positif	2024-09-04 16:00:00	2024-09-04 16:10:00
51	21	30	Pengenalan Himpunan ini materinya baru dan cukup menarik.	positif	2024-09-09 17:00:00	2024-09-09 17:05:00
52	22	3	Pecahan ini memang sulit, tapi penjelasan di sini cukup membantu.	positif	2024-09-12 10:00:00	2024-09-12 10:05:00
53	22	27	Bangun Ruang Sisi Lengkung, materinya perlu lebih banyak visualisasi 3D.	negatif	2024-09-17 11:00:00	2024-09-17 11:10:00
54	23	4	Pola bilangan ini sangat bagus untuk melatih logika anak.	positif	2024-09-20 12:00:00	2024-09-20 12:05:00
55	23	28	Aljabar sederhana ini pengantarnya bagus, mudah diikuti.	positif	2024-09-25 13:00:00	2024-09-25 13:10:00
56	23	1	Piktogram dan Diagram Batang ini terlalu dasar untuk anak saya. Tapi kualitasnya bagus.	positif	2024-09-30 14:00:00	2024-09-30 14:05:00
57	24	5	Bangun Datar, materinya komplit. Bagus!	positif	2024-10-05 15:00:00	2024-10-05 15:05:00
58	24	29	Barisan dan Deret ini penjelasannya kurang detail, perlu lebih banyak contoh.	negatif	2024-10-10 16:00:00	2024-10-10 16:10:00
59	25	6	Modul Bangun Datar ini cocok untuk pengulangan materi. 👍	positif	2024-10-15 11:00:00	2024-10-15 11:05:00
60	25	30	Pengenalan Himpunan ini agak membingungkan untuk anak saya.	negatif	2024-10-20 12:00:00	2024-10-20 12:05:00
61	25	2	Bilangan Cacah ini mudah dipahami anak saya.	positif	2024-10-25 13:00:00	2024-10-25 13:05:00
62	26	7	Perkalian dan Pembagian Bilangan Bulat ini sangat membantu anak saya yang kesulitan.	positif	2024-10-30 14:00:00	2024-10-30 14:05:00
63	26	12	Satuan Panjang dan Berat ini materinya kurang menarik, anak saya jadi malas belajar.	negatif	2024-11-04 15:00:00	2024-11-04 15:10:00
64	27	8	Pembagian agak sulit, tapi penjelasan di sini detail.	positif	2024-11-09 16:00:00	2024-11-09 16:05:00
65	27	13	Satuan Waktu dan Volume butuh lebih banyak latihan soal yang interaktif.	negatif	2024-11-14 17:00:00	2024-11-14 17:10:00
66	27	3	Materi Pecahan ini penjelasannya bagus, meskipun materinya memang sulit.	positif	2024-11-19 18:00:00	2024-11-19 18:05:00
67	28	9	Operasi Hitung Campuran ini penting, dan dijelaskan dengan baik.	positif	2024-11-24 09:00:00	2024-11-24 09:05:00
68	28	14	Debit ini materinya mudah dipahami, contohnya sangat membantu.	positif	2024-11-29 10:00:00	2024-11-29 10:10:00
69	29	10	KPK dan FPB ini materinya lumayan menantang, tapi penyampaiannya bagus.	positif	2024-12-04 11:00:00	2024-12-04 11:05:00
70	29	15	Skala dan Perbandingan ini cukup kompleks, tapi penjelasannya lumayan membantu.	positif	2024-12-09 12:00:00	2024-12-09 12:10:00
71	29	4	Pola Gambar & Pola Bilangan ini seru dan bikin anak saya ketagihan.	positif	2024-12-14 13:00:00	2024-12-14 13:05:00
72	30	11	Pengolahan data ini terlalu membosankan, perlu lebih banyak ilustrasi atau aktivitas.	negatif	2024-12-19 14:00:00	2024-12-19 14:05:00
73	30	16	Geometri Ruang ini sangat membantu anak saya dalam memahami bentuk-bentuk.	positif	2024-12-24 15:00:00	2024-12-24 15:10:00
74	31	1	Materi piktogram ini sangat bagus, saya jadi paham.	positif	2024-12-26 10:00:00	2024-12-26 10:05:00
75	31	5	Bangun datar ini penjelasannya kurang detail.	negatif	2024-12-28 11:00:00	2024-12-28 11:05:00
76	32	2	Bilangan cacah sangat mudah dipahami. Rekomen!	positif	2024-12-29 12:00:00	2024-12-29 12:05:00
77	32	6	Bangun datar ini terlalu banyak teori, kurang praktek.	negatif	2024-12-30 13:00:00	2024-12-30 13:05:00
78	32	18	Volume bangun ruang ini penjelasannya bagus sekali, contohnya sangat membantu.	positif	2024-12-31 14:00:00	2024-12-31 14:05:00
79	33	1	Oke banget, materi piktogramnya mantap!	positif	2025-01-01 09:00:00	2025-01-01 09:05:00
80	33	2	Bilangan cacah sangat relevan untuk anak saya.	positif	2025-01-02 10:00:00	2025-01-02 10:05:00
81	34	4	Pengukuran luas dan volume ini materinya lumayan. Tapi kadang loading gambarnya agak lama.	positif	2025-01-03 11:00:00	2025-01-03 11:10:00
82	34	5	Bangun datar itu seru! Anak saya suka!	positif	2025-01-04 12:00:00	2025-01-04 12:05:00
83	34	1	Piktogram dan diagram batang ini mudah diikuti, sangat cocok untuk pemula.	positif	2025-01-05 13:00:00	2025-01-05 13:05:00
84	35	1	Piktogramnya oke, saya jadi lebih paham. 	positif	2025-01-06 08:00:00	2025-01-06 08:05:00
85	35	2	Kursus bilangan cacah ini standar, tidak terlalu istimewa tapi cukup membantu.	positif	2025-01-07 09:00:00	2025-01-07 09:05:00
86	35	15	Skala dan Perbandingan ini materinya agak banyak, tapi saya bisa mengikuti dengan baik.	positif	2025-01-08 10:00:00	2025-01-08 10:05:00
87	36	3	Pecahan adalah materi yang sulit untuk saya, penjelasan di sini lumayan membantu. Terima kasih!	positif	2025-01-09 11:00:00	2025-01-09 11:05:00
88	37	1	Sangat direkomendasikan untuk dasar piktogram. Oke!	positif	2025-01-10 12:00:00	2025-01-10 12:05:00
89	38	7	Perkalian dan Pembagian sangat jelas, anak saya jadi tidak takut lagi!	positif	2025-01-11 09:00:00	2025-01-11 09:05:00
90	38	8	Pembagian ini perlu lebih banyak latihan interaktif.	negatif	2025-01-12 10:00:00	2025-01-12 10:05:00
91	39	9	Operasi hitung campuran ini dijelaskan dengan sangat baik.	positif	2025-01-13 11:00:00	2025-01-13 11:05:00
92	39	10	KPK dan FPB lumayan sulit, tapi penjelasan di sini membantu saya.	positif	2025-01-14 12:00:00	2025-01-14 12:05:00
93	39	21	Pengolahan Data materinya padat, tapi informatif.	positif	2025-01-15 13:00:00	2025-01-15 13:05:00
94	40	11	Statistika dasar ini sangat mudah dipahami. TOP!	positif	2025-01-16 14:00:00	2025-01-16 14:05:00
95	40	12	Satuan waktu dan volume kurang menarik bagi anak saya.	negatif	2025-01-17 15:00:00	2025-01-17 15:05:00
96	41	1	Piktogram dan diagram batang ini kursus yang bagus untuk SD.	positif	2025-01-18 09:00:00	2025-01-18 09:05:00
97	41	2	Materi bilangan cacah ini sangat fundamental dan mudah dipahami.	positif	2025-01-19 10:00:00	2025-01-19 10:05:00
98	41	3	Pecahan itu selalu bikin pusing, tapi di sini penjelasannya cukup baik.	positif	2025-01-20 11:00:00	2025-01-20 11:05:00
99	42	4	Pola gambar itu kreatif, anak saya senang mempelajarinya.	positif	2025-01-21 12:00:00	2025-01-21 12:05:00
100	42	5	Bangun datar ini terlalu banyak jenis, agak sulit membedakannya.	negatif	2025-01-22 13:00:00	2025-01-22 13:05:00
101	42	6	Pengukuran luas dan volume ini dijelaskan secara rinci, bagus.	positif	2025-01-23 14:00:00	2025-01-23 14:05:00
102	43	7	Perkalian dan pembagian ini sangat penting, penjelasannya cukup komprehensif.	positif	2025-01-24 15:00:00	2025-01-24 15:05:00
103	43	8	Pembagian itu sulit, saya butuh lebih banyak contoh video.	negatif	2025-01-25 16:00:00	2025-01-25 16:05:00
104	43	9	Operasi hitung campuran ini penting, tapi agak membingungkan pada beberapa soal.	positif	2025-01-26 17:00:00	2025-01-26 17:05:00
105	44	10	KPK dan FPB ini materinya lumayan, tidak terlalu sulit.	positif	2025-01-27 09:00:00	2025-01-27 09:05:00
106	44	11	Statistika dasar ini sangat cocok untuk pengenalan data.	positif	2025-01-28 10:00:00	2025-01-28 10:05:00
107	44	12	Satuan waktu dan volume kurang interaktif, bikin anak cepat bosan.	negatif	2025-01-29 11:00:00	2025-01-29 11:05:00
108	45	13	Debit itu lumayan menantang, tapi bisa dipahami.	positif	2025-01-30 12:00:00	2025-01-30 12:05:00
109	45	14	Skala dan Perbandingan ini penting, dan dijelaskan dengan baik.	positif	2025-01-31 13:00:00	2025-01-31 13:05:00
110	45	15	Geometri ruang itu menarik, anak saya suka visualisasinya.	positif	2025-02-01 14:00:00	2025-02-01 14:05:00
111	46	16	Luas permukaan bangun ruang ini butuh lebih banyak latihan.	negatif	2025-02-02 15:00:00	2025-02-02 15:05:00
112	46	17	Volume bangun ruang ini penjelasannya detail, bagus.	positif	2025-02-03 16:00:00	2025-02-03 16:05:00
113	46	18	Koordinat Kartesius ini materinya menarik dan baru bagi anak saya.	positif	2025-02-04 17:00:00	2025-02-04 17:05:00
114	47	19	Statistika dasar ini mudah dipahami anak saya, tapi kuisnya agak sulit.	positif	2025-02-05 09:00:00	2025-02-05 09:05:00
115	47	20	Pengolahan data ini terlalu banyak angka, kurang visual.	negatif	2025-02-06 10:00:00	2025-02-06 10:05:00
116	47	21	Sudut dan Garis ini lumayan membantu, tapi ada beberapa bagian yang kurang jelas.	positif	2025-02-07 11:00:00	2025-02-07 11:05:00
117	48	22	Simetri lipat dan putar ini seru, anak saya jadi suka eksperimen.	positif	2025-02-08 12:00:00	2025-02-08 12:05:00
118	48	23	Jaring-jaring bangun ruang ini butuh lebih banyak contoh benda nyata.	negatif	2025-02-09 13:00:00	2025-02-09 13:05:00
119	48	24	Pengukuran sudut ini penjelasannya detail.	positif	2025-02-10 14:00:00	2025-02-10 14:05:00
120	49	25	Keliling dan luas lingkaran itu sulit. Saya butuh guru les.	negatif	2025-02-11 15:00:00	2025-02-11 15:05:00
121	49	26	Bangun ruang sisi lengkung ini sangat bagus, visualnya membantu.	positif	2025-02-12 16:00:00	2025-02-12 16:05:00
122	49	27	Pengenalan aljabar sederhana ini pengantarnya lumayan.	positif	2025-02-13 17:00:00	2025-02-13 17:05:00
123	50	28	Barisan dan Deret Bilangan itu terlalu abstrak bagi anak saya.	negatif	2025-02-14 09:00:00	2025-02-14 09:05:00
124	50	29	Pengenalan Himpunan ini materinya baru dan cukup menarik.	positif	2025-02-15 10:00:00	2025-02-15 10:05:00
125	50	30	Piktogram dan diagram batang itu dasar, tapi bagus untuk review.	positif	2025-02-16 11:00:00	2025-02-16 11:05:00
126	51	1	Materi ini mudah dimengerti, cocok untuk pemula.	positif	2025-02-17 12:00:00	2025-02-17 12:05:00
127	51	3	Pecahan selalu bikin pusing, tapi penjelasannya lumayan.	positif	2025-02-18 13:00:00	2025-02-18 13:05:00
128	51	5	Bangun datar ini terlalu banyak rumus, anak saya cepat lupa.	negatif	2025-02-19 14:00:00	2025-02-19 14:05:00
129	52	7	Perkaliannya sudah mantap, tidak ada masalah.	positif	2025-02-20 15:00:00	2025-02-20 15:05:00
130	52	9	Operasi hitung campuran ini penting, tapi penjelasannya perlu lebih interaktif.	negatif	2025-02-21 16:00:00	2025-02-21 16:05:00
131	52	11	Statistika dasarnya bagus, mudah dipahami.	positif	2025-02-22 17:00:00	2025-02-22 17:05:00
132	53	13	Debit ini cukup menantang, tapi dengan latihan bisa kok.	positif	2025-02-23 09:00:00	2025-02-23 09:05:00
133	53	15	Skala dan perbandingan ini perlu lebih banyak contoh soal cerita.	negatif	2025-02-24 10:00:00	2025-02-24 10:05:00
134	53	17	Volume bangun ruang ini sangat jelas, anak saya suka.	positif	2025-02-25 11:00:00	2025-02-25 11:05:00
135	54	19	Koordinat kartesius ini menarik, tapi saya berharap ada lebih banyak game.	positif	2025-02-26 12:00:00	2025-02-26 12:05:00
136	54	21	Pengolahan data ini terlalu banyak angka dan grafik, anak saya kurang tertarik.	negatif	2025-02-27 13:00:00	2025-02-27 13:05:00
137	54	23	Simetri lipat dan putar itu seru banget, anak saya jadi suka seni.	positif	2025-02-28 14:00:00	2025-02-28 14:05:00
138	55	25	Pengukuran sudut itu sulit, saya tidak mengerti. 	negatif	2025-03-01 15:00:00	2025-03-01 15:05:00
139	55	27	Bangun ruang sisi lengkung ini penjelasannya lumayan.	positif	2025-03-02 16:00:00	2025-03-02 16:05:00
140	55	29	Barisan dan Deret ini butuh lebih banyak contoh kehidupan nyata.	negatif	2025-03-03 17:00:00	2025-03-03 17:05:00
141	56	2	Bilangan cacah ini dasar, tapi penjelasannya bagus untuk review.	positif	2025-03-04 09:00:00	2025-03-04 09:05:00
142	56	4	Pola bilangan ini sangat menarik dan mudah dipahami.	positif	2025-03-05 10:00:00	2025-03-05 10:05:00
143	56	6	Pengukuran luas dan volume ini penjelasannya detail sekali.	positif	2025-03-06 11:00:00	2025-03-06 11:05:00
144	57	8	Pembagian agak sulit, tapi video penjelasannya membantu.	positif	2025-03-07 12:00:00	2025-03-07 12:05:00
145	57	10	KPK dan FPB ini materinya rumit, tapi dengan latihan jadi bisa.	positif	2025-03-08 13:00:00	2025-03-08 13:05:00
146	57	12	Satuan waktu dan volume ini perlu lebih banyak contoh kasus.	negatif	2025-03-09 14:00:00	2025-03-09 14:05:00
147	58	14	Debit itu sangat jelas, saya suka.	positif	2025-03-10 15:00:00	2025-03-10 15:05:00
148	58	16	Geometri Ruang ini sangat membantu, anak saya jadi suka matematika.	positif	2025-03-11 16:00:00	2025-03-11 16:05:00
149	58	18	Koordinat Kartesius ini materinya bagus, cocok untuk SD.	positif	2025-03-12 17:00:00	2025-03-12 17:05:00
150	59	20	Pengolahan data ini terlalu banyak teks, anak saya cepat bosan.	negatif	2025-03-13 09:00:00	2025-03-13 09:05:00
151	59	22	Sudut dan Garis ini bagus, tapi perlu lebih banyak ilustrasi.	positif	2025-03-14 10:00:00	2025-03-14 10:05:00
152	59	24	Pengukuran sudut itu menantang, tapi penjelasannya bagus.	positif	2025-03-15 11:00:00	2025-03-15 11:05:00
153	60	26	Keliling dan Luas Lingkaran ini terlalu rumit, anak saya tidak paham.	negatif	2025-03-16 12:00:00	2025-03-16 12:05:00
154	60	28	Aljabar sederhana itu pengantarnya jelas, anak saya tertarik.	positif	2025-03-17 13:00:00	2025-03-17 13:05:00
155	60	30	Pengenalan Himpunan ini materinya baru dan cukup menarik.	positif	2025-03-18 14:00:00	2025-03-18 14:05:00
156	61	1	Piktogram dan diagram batang ini bagus untuk pengenalan awal.	positif	2025-03-19 15:00:00	2025-03-19 15:05:00
157	61	2	Materi bilangan cacah ini standar, tapi bagus untuk review.	positif	2025-03-20 16:00:00	2025-03-20 16:05:00
158	61	3	Pecahan ini memang sulit, tapi penjelasannya lumayan membantu.	positif	2025-03-21 17:00:00	2025-03-21 17:05:00
159	62	4	Pola gambar ini kreatif, anak saya suka.	positif	2025-03-22 09:00:00	2025-03-22 09:05:00
160	62	5	Bangun datar ini terlalu banyak definisi, anak saya bosan.	negatif	2025-03-23 10:00:00	2025-03-23 10:05:00
161	62	6	Pengukuran luas dan volume ini penjelasannya sangat jelas.	positif	2025-03-24 11:00:00	2025-03-24 11:05:00
162	63	7	Perkalian dan pembagian ini sangat membantu.	positif	2025-03-25 12:00:00	2025-03-25 12:05:00
163	63	8	Pembagian ini perlu lebih banyak contoh yang sederhana.	negatif	2025-03-26 13:00:00	2025-03-26 13:05:00
164	63	9	Operasi hitung campuran ini penting, penjelasannya bagus.	positif	2025-03-27 14:00:00	2025-03-27 14:05:00
165	64	10	KPK dan FPB ini materinya lumayan, tapi perlu lebih banyak soal.	positif	2025-03-28 15:00:00	2025-03-28 15:05:00
166	64	11	Statistika dasar ini sangat cocok untuk anak SD.	positif	2025-03-29 16:00:00	2025-03-29 16:05:00
167	64	12	Satuan waktu dan volume ini kurang menarik.	negatif	2025-03-30 17:00:00	2025-03-30 17:05:00
168	65	13	Debit itu menantang, tapi penjelasannya detail.	positif	2025-04-01 09:00:00	2025-04-01 09:05:00
169	65	14	Skala dan Perbandingan ini sangat penting, penjelasannya bagus.	positif	2025-04-02 10:00:00	2025-04-02 10:05:00
170	65	15	Geometri ruang itu menarik, anak saya jadi suka matematika.	positif	2025-04-03 11:00:00	2025-04-03 11:05:00
171	66	16	Luas permukaan bangun ruang ini butuh lebih banyak visual.	negatif	2025-04-04 12:00:00	2025-04-04 12:05:00
172	66	17	Volume bangun ruang ini sangat jelas dan mudah diikuti.	positif	2025-04-05 13:00:00	2025-04-05 13:05:00
173	66	18	Koordinat Kartesius ini materi baru yang menarik.	positif	2025-04-06 14:00:00	2025-04-06 14:05:00
174	67	19	Statistika dasar ini mudah dipahami, tapi kuisnya lumayan.	positif	2025-04-07 15:00:00	2025-04-07 15:05:00
175	67	20	Pengolahan data ini terlalu kering, kurang interaktif.	negatif	2025-04-08 16:00:00	2025-04-08 16:05:00
176	67	21	Sudut dan Garis ini bagus, tapi ada bagian yang kurang detail.	positif	2025-04-09 17:00:00	2025-04-09 17:05:00
177	68	22	Simetri lipat dan putar ini sangat menyenangkan.	positif	2025-04-10 09:00:00	2025-04-10 09:05:00
178	68	23	Jaring-jaring bangun ruang ini butuh lebih banyak ilustrasi 3D.	negatif	2025-04-11 10:00:00	2025-04-11 10:05:00
179	68	24	Pengukuran sudut ini penjelasannya bagus dan detail.	positif	2025-04-12 11:00:00	2025-04-12 11:05:00
180	69	25	Keliling dan luas lingkaran itu rumit, anak saya kesulitan.	negatif	2025-04-13 12:00:00	2025-04-13 12:05:00
181	69	26	Bangun ruang sisi lengkung ini penjelasannya bagus.	positif	2025-04-14 13:00:00	2025-04-14 13:05:00
182	69	27	Pengenalan aljabar sederhana ini pengantarnya jelas, anak saya tertarik.	positif	2025-04-15 14:00:00	2025-04-15 14:05:00
183	70	28	Barisan dan Deret Bilangan itu terlalu abstrak.	negatif	2025-04-16 15:00:00	2025-04-16 15:05:00
184	70	29	Pengenalan Himpunan ini menarik, tapi saya berharap ada lebih banyak contoh.	positif	2025-04-17 16:00:00	2025-04-17 16:05:00
185	70	30	Piktogram dan diagram batang ini bagus untuk review dasar.	positif	2025-04-18 17:00:00	2025-04-18 17:05:00
186	71	1	Piktogram dan diagram batang ini kursus yang bagus.	positif	2025-04-19 09:00:00	2025-04-19 09:05:00
187	71	2	Materi bilangan cacah ini sangat membantu anak saya.	positif	2025-04-20 10:00:00	2025-04-20 10:05:00
188	71	3	Pecahan itu selalu bikin pusing, tapi penjelasannya lumayan.	positif	2025-04-20 10:00:00	2025-04-20 10:05:00
189	2	1	Jelek	negatif	2025-05-25 21:01:57.925753	2025-05-25 21:01:57.925753
\.


--
-- Data for Name: user_module_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_module_progress (user_id, module_id, completed_at) FROM stdin;
2	7	2024-04-10 00:00:00
2	8	2024-04-10 00:00:00
2	9	2024-04-11 00:00:00
2	10	2024-04-11 00:00:00
2	11	2024-04-11 00:00:00
2	12	2024-04-12 00:00:00
2	13	2024-04-12 00:00:00
2	14	2024-04-12 00:00:00
2	15	2024-04-12 00:00:00
2	1	2025-05-25 21:02:23.292712
2	2	2025-05-25 21:02:24.203964
2	3	2025-05-25 21:02:25.025605
2	4	2025-05-25 21:02:25.932375
2	5	2025-05-25 21:02:27.456793
2	6	2025-05-25 21:02:29.268298
\.


--
-- Data for Name: user_quiz_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_quiz_results (user_id, quiz_id, score, passed, completed_at) FROM stdin;
2	1	99	t	2025-05-18 07:30:00
2	2	95	t	2025-05-18 08:00:00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, nama, email, password, tanggal_lahir, kelas, isverified, role, created_at, updated_at, firebase_uid, user_profile) FROM stdin;
3	Rizky Pratama	rizky.pratama@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2015-03-10	5	t	user	2025-01-01 08:00:00	2025-01-01 08:05:00	\N	rizky-pratama.png
4	Putri Lestari	putri.lestari@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2016-07-22	4	t	user	2025-01-02 09:15:00	2025-01-02 09:20:00	\N	putri-lestari.png
5	Bima Sakti	bima.sakti@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2014-11-05	6	t	user	2025-01-03 10:30:00	2025-01-03 10:35:00	\N	bima-sakti.png
6	Siti Aminah	siti.aminah@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2017-01-18	4	t	user	2025-01-04 11:45:00	2025-01-04 11:50:00	\N	siti-aminah.png
7	Arif Wijaya	arif.wijaya@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2015-09-01	5	t	user	2025-01-05 13:00:00	2025-01-05 13:05:00	\N	arif-wijaya.png
8	Dewi Anggraini	dewi.anggraini@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2016-04-25	4	t	user	2025-01-06 14:10:00	2025-01-06 14:15:00	\N	dewi-anggraini.png
9	Fajar Nugraha	fajar.nugraha@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2014-08-12	6	t	user	2025-01-07 15:20:00	2025-01-07 15:25:00	\N	fajar-nugraha.png
10	Intan Permata	intan.permata@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2017-02-28	4	t	user	2025-01-08 16:30:00	2025-01-08 16:35:00	\N	intan-permata.png
11	Kevin Sanjaya	kevin.sanjaya@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2015-06-15	5	t	user	2025-01-09 17:40:00	2025-01-09 17:45:00	\N	kevin-sanjaya.png
12	Lina Marlina	lina.marlina@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2016-10-03	4	t	user	2025-01-10 08:50:00	2025-01-10 08:55:00	\N	lina-marlina.png
13	Mirza Aditama	mirza.aditama@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2014-12-20	6	t	user	2025-01-11 09:00:00	2025-01-11 09:05:00	\N	mirza-aditama.png
14	Nadia Cahyani	nadia.cahyani@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2017-03-05	4	t	user	2025-01-12 10:10:00	2025-01-12 10:15:00	\N	nadia-cahyani.png
15	Oscar Wijaya	oscar.wijaya@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2015-01-20	5	t	user	2025-01-13 11:20:00	2025-01-13 11:25:00	\N	oscar-wijaya.png
16	Putra Dharma	putra.dharma@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2016-08-08	4	t	user	2025-01-14 12:30:00	2025-01-14 12:35:00	\N	putra-dharma.png
17	Qonita Zahra	qonita.zahra@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2014-05-19	6	t	user	2025-01-15 13:40:00	2025-01-15 13:45:00	\N	qonita-zahra.png
18	Rani Fitriani	rani.fitriani@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2017-04-14	4	t	user	2025-01-16 14:50:00	2025-01-16 14:55:00	\N	rani-fitriani.png
19	Satriyo Utomo	satriyo.utomo@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2015-02-07	5	t	user	2025-01-17 16:00:00	2025-01-17 16:05:00	\N	satriyo-utomo.png
20	Tania Putri	tania.putri@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2016-09-28	4	t	user	2025-01-18 17:10:00	2025-01-18 17:15:00	\N	tania-putri.png
21	Umar Bakri	umar.bakri@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2014-06-03	6	t	user	2025-01-19 08:20:00	2025-01-19 08:25:00	\N	umar-bakri.png
22	Vina Lestari	vina.lestari@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2017-05-09	4	t	user	2025-01-20 09:30:00	2025-01-20 09:35:00	\N	vina-lestari.png
23	Wahyu Pratama	wahyu.pratama@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2015-04-11	5	t	user	2025-01-21 10:40:00	2025-01-21 10:45:00	\N	wahyu-pratama.png
24	Xena Indah	xena.indah@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2016-11-20	4	t	user	2025-01-22 11:50:00	2025-01-22 11:55:00	\N	xena-indah.png
25	Yudha Firmansyah	yudha.firmansyah@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2014-07-07	6	t	user	2025-01-23 13:00:00	2025-01-23 13:05:00	\N	yudha-firmansyah.png
26	Zahra Putri	zahra.putri@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2017-06-01	4	t	user	2025-01-24 14:10:00	2025-01-24 14:15:00	\N	zahra-putri.png
27	Aldi Saputra	aldi.saputra@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2015-05-29	5	t	user	2025-01-25 15:20:00	2025-01-25 15:25:00	\N	aldi-saputra.png
28	Bella Amelia	bella.amelia@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2016-12-10	4	t	user	2025-01-26 16:30:00	2025-01-26 16:35:00	\N	bella-amelia.png
29	Candra Wijaya	candra.wijaya@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2014-09-17	6	t	user	2025-01-27 17:40:00	2025-01-27 17:45:00	\N	candra-wijaya.png
30	Dina Mariana	dina.mariana@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2017-07-03	4	t	user	2025-01-28 08:50:00	2025-01-28 08:55:00	\N	dina-mariana.png
31	Eko Prasetyo	eko.prasetyo@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2015-06-08	5	t	user	2025-01-29 10:00:00	2025-01-29 10:05:00	\N	eko-prasetyo.png
32	Fani Nuraini	fani.nuraini@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2016-01-01	4	t	user	2025-01-30 11:10:00	2025-01-30 11:15:00	\N	fani-nuraini.png
33	Guntur Putra	guntur.putra@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2014-10-26	6	t	user	2025-01-31 12:20:00	2025-01-31 12:25:00	\N	guntur-putra.png
34	Hana Wulandari	hana.wulandari@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2017-08-11	4	t	user	2025-02-01 13:30:00	2025-02-01 13:35:00	\N	hana-wulandari.png
35	Irfan Maulana	irfan.maulana@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2015-07-19	5	t	user	2025-02-02 14:40:00	2025-02-02 14:45:00	\N	irfan-maulana.png
36	Jihan Putri	jihan.putri@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2016-02-29	4	t	user	2025-02-03 15:50:00	2025-02-03 15:55:00	\N	jihan-putri.png
37	Kiki Amelia	kiki.amelia@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2014-11-15	6	t	user	2025-02-04 17:00:00	2025-02-04 17:05:00	\N	kiki-amelia.png
38	Lutfi Hidayat	lutfi.hidayat@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2017-09-02	4	t	user	2025-02-05 08:10:00	2025-02-05 08:15:00	\N	lutfi-hidayat.png
39	Maya Sari	maya.sari@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2015-08-05	5	t	user	2025-02-06 09:20:00	2025-02-06 09:25:00	\N	maya-sari.png
40	Naufal Ramadhan	naufal.ramadhan@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2016-03-18	4	t	user	2025-02-07 10:30:00	2025-02-07 10:35:00	\N	naufal-ramadhan.png
41	Olivia Wijaya	olivia.wijaya@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2014-12-01	6	t	user	2025-02-08 11:40:00	2025-02-08 11:45:00	\N	olivia-wijaya.png
42	Pandu Setiawan	pandu.setiawan@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2017-10-07	4	t	user	2025-02-09 12:50:00	2025-02-09 12:55:00	\N	pandu-setiawan.png
43	Rina Lestari	rina.lestari@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2015-09-13	5	t	user	2025-02-10 14:00:00	2025-02-10 14:05:00	\N	rina-lestari.png
44	Salsabila Azizah	salsabila.azizah@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2016-04-04	4	t	user	2025-02-11 15:10:00	2025-02-11 15:15:00	\N	salsabila-azizah.png
45	Taufik Hidayat	taufik.hidayat@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2014-01-23	6	t	user	2025-02-12 16:20:00	2025-02-12 16:25:00	\N	taufik-hidayat.png
46	Ulya Nuraini	ulya.nuraini@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2017-11-19	4	t	user	2025-02-13 17:30:00	2025-02-13 17:35:00	\N	ulya-nuraini.png
47	Vicky Putra	vicky.putra@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2015-10-08	5	t	user	2025-02-14 08:40:00	2025-02-14 08:45:00	\N	vicky-putra.png
48	Wulan Sari	wulan.sari@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2016-05-21	4	t	user	2025-02-15 09:50:00	2025-02-15 09:55:00	\N	wulan-sari.png
49	Yoga Pratama	yoga.pratama@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2014-02-14	6	t	user	2025-02-16 11:00:00	2025-02-16 11:05:00	\N	yoga-pratama.png
50	Zaskia Amelia	zaskia.amelia@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2017-12-25	4	t	user	2025-02-17 12:10:00	2025-02-17 12:15:00	\N	zaskia-amelia.png
51	Adam Wijaya	adam.wijaya@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2015-11-03	5	t	user	2025-02-18 13:20:00	2025-02-18 13:25:00	\N	adam-wijaya.png
52	Bunga Citra	bunga.citra@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2016-06-12	4	t	user	2025-02-19 14:30:00	2025-02-19 14:35:00	\N	bunga-citra.png
53	Cahyo Nugroho	cahyo.nugroho@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2014-03-09	6	t	user	2025-02-20 15:40:00	2025-02-20 15:45:00	\N	cahyo-nugroho.png
54	Dian Pertiwi	dian.pertiwi@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2017-01-01	4	t	user	2025-02-21 16:50:00	2025-02-21 16:55:00	\N	dian-pertiwi.png
55	Eka Putra	eka.putra@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2015-12-17	5	t	user	2025-02-22 18:00:00	2025-02-22 18:05:00	\N	eka-putra.png
56	Fatimah Zahra	fatimah.zahra@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2016-07-04	4	t	user	2025-02-23 09:10:00	2025-02-23 09:15:00	\N	fatimah-zahra.png
57	Gita Permata	gita.permata@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2014-04-28	6	t	user	2025-02-24 10:20:00	2025-02-24 10:25:00	\N	gita-permata.png
58	Hadi Santoso	hadi.santoso@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2017-02-09	4	t	user	2025-02-25 11:30:00	2025-02-25 11:35:00	\N	hadi-santoso.png
59	Indah Sari	indah.sari@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2015-01-05	5	t	user	2025-02-26 12:40:00	2025-02-26 12:45:00	\N	indah-sari.png
60	Joko Susilo	joko.susilo@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2016-08-15	4	t	user	2025-02-27 13:50:00	2025-02-27 13:55:00	\N	joko-susilo.png
61	Kartika Dewi	kartika.dewi@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2014-05-02	6	t	user	2025-02-28 15:00:00	2025-02-28 15:05:00	\N	kartika-dewi.png
62	Larasati Ayu	larasati.ayu@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2017-03-20	4	t	user	2025-03-01 16:10:00	2025-03-01 16:15:00	\N	larasati-ayu.png
63	Mochamad Rizal	mochamad.rizal@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2015-02-20	5	t	user	2025-03-02 17:20:00	2025-03-02 17:25:00	\N	mochamad-rizal.png
64	Nia Ramadhani	nia.ramadhani@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2016-09-01	4	t	user	2025-03-03 08:30:00	2025-03-03 08:35:00	\N	nia-ramadhani.png
65	Panji Gumilang	panji.gumilang@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2014-06-18	6	t	user	2025-03-04 09:40:00	2025-03-04 09:45:00	\N	panji-gumilang.png
66	Qoriatul Hasanah	qoriatul.hasanah@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2017-04-05	4	t	user	2025-03-05 10:50:00	2025-03-05 10:55:00	\N	qoriatul-hasanah.png
67	Rizka Amelia	rizka.amelia@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2015-03-25	5	t	user	2025-03-06 12:00:00	2025-03-06 12:05:00	\N	rizka-amelia.png
68	Sifa Nurjanah	sifa.nurjanah@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2016-10-14	4	t	user	2025-03-07 13:10:00	2025-03-07 13:15:00	\N	sifa-nurjanah.png
69	Tegar Satria	tegar.satria@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2014-07-29	6	t	user	2025-03-08 14:20:00	2025-03-08 14:25:00	\N	tegar-satria.png
70	Uswatun Hasanah	uswatun.hasanah@example.com	$2b$10$3FyS.G6ilUhGqrNFV94eTuMd/aaI2Q1rmxeqgYp1y0w7Xll1pkbcG	2017-05-10	4	t	user	2025-03-09 15:30:00	2025-03-09 15:35:00	\N	uswatun-hasanah.png
71	Wong From Indo	wongfromindo@gmail.com	$2b$10$E8yjWK.HDdrQkm8qB1rE8utlVeAb5XlmeSkNHvF1M3tx4jyL2K6Tq	\N	\N	f	user	2025-05-25 18:13:41.393139	2025-05-25 18:13:41.393139	\N	\N
1	Angga Prasetyo	prasetyoangga817@gmail.com	$2b$10$l8E9/zRek4NTcXerq5xm7u1jZjSmx6FFOx9eBN3PC2V//84AiOmvG	2002-12-27	\N	t	admin	2025-01-01 08:00:00	2025-01-01 08:05:00	\N	angga-prasetyo.png
2	Miharjo Arjadikrama	prasetyoangga2712@gmail.com	$2b$10$E8yjWK.HDdrQkm8qB1rE8utlVeAb5XlmeSkNHvF1M3tx4jyL2K6Tq	2014-08-14	6	t	user	2025-01-01 08:00:00	2025-01-01 08:05:00	\N	miharjo-arjadikrama.png
\.


--
-- Name: certificates_certificate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.certificates_certificate_id_seq', 1, false);


--
-- Name: courses_course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_course_id_seq', 30, true);


--
-- Name: enrollments_enrolment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.enrollments_enrolment_id_seq', 189, true);


--
-- Name: module_contents_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.module_contents_content_id_seq', 21, true);


--
-- Name: modules_module_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.modules_module_id_seq', 41, true);


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

SELECT pg_catalog.setval('public.quizzes_quiz_id_seq', 2, true);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 189, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 71, true);


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
    ADD CONSTRAINT quiz_options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.quiz_questions(question_id);


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

