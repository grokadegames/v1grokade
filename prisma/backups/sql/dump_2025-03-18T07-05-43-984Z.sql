--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Debian 16.8-1.pgdg120+1)
-- Dumped by pg_dump version 16.8 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'REGULAR',
    'BASIC',
    'AUTHOR',
    'SPONSOR',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: game_favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_favorites (
    "userId" text NOT NULL,
    "gameId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.game_favorites OWNER TO postgres;

--
-- Name: game_metrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_metrics (
    id text NOT NULL,
    "gameId" text NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    plays integer DEFAULT 0 NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    dislikes integer DEFAULT 0 NOT NULL,
    "lastUpdated" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.game_metrics OWNER TO postgres;

--
-- Name: games; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.games (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "imageUrl" text,
    "playUrl" text NOT NULL,
    "authorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    tagcategory text,
    xaccount text,
    "galleryImage1" text,
    "galleryImage2" text,
    "galleryImage3" text,
    "galleryImage4" text,
    featured boolean DEFAULT false NOT NULL
);


ALTER TABLE public.games OWNER TO postgres;

--
-- Name: page_views; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.page_views (
    id text NOT NULL,
    path text NOT NULL,
    "userId" text,
    "userAgent" text,
    referer text,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.page_views OWNER TO postgres;

--
-- Name: ranking_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ranking_history (
    id text NOT NULL,
    "entityId" text NOT NULL,
    "entityType" text NOT NULL,
    "rankingType" text NOT NULL,
    "position" integer NOT NULL,
    score double precision,
    views integer,
    plays integer,
    "recordedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.ranking_history OWNER TO postgres;

--
-- Name: sponsors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sponsors (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    "logoUrl" text NOT NULL,
    website text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sponsors OWNER TO postgres;

--
-- Name: subscribers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscribers (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    status text DEFAULT 'active'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.subscribers OWNER TO postgres;

--
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_achievements (
    id text NOT NULL,
    "userId" text NOT NULL,
    "achievementId" text NOT NULL,
    "unlockedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_achievements OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    "displayName" text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    role public."UserRole" DEFAULT 'REGULAR'::public."UserRole" NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: game_favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game_favorites ("userId", "gameId", "createdAt") FROM stdin;
\.


--
-- Data for Name: game_metrics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game_metrics (id, "gameId", views, plays, likes, dislikes, "lastUpdated") FROM stdin;
568835bc-9c7f-458a-bb04-09c0f574627e	bb935fc4-4063-4709-874a-20e8dd1ba36f	0	0	0	0	2025-03-17 01:36:00.237
4fe1743e-275e-4df3-ad55-492d64ea9809	2964c8d9-953c-41a9-aa4f-653d261d14e6	0	0	0	0	2025-03-17 01:36:00.868
ed11a272-d59c-43ab-b66d-e5e0df044135	3ebb0eb7-753f-4778-8b67-7fd98a94b49c	0	0	0	0	2025-03-17 01:36:01.338
b61eeeb3-22b8-4bb7-8285-d92f41875805	d5fba96c-069e-4242-9206-3d145ccf899a	0	0	0	0	2025-03-17 01:36:01.797
ce2c4863-1e3e-476d-9ac8-0386d1661168	f8279a3a-cbc2-446e-a640-080b05366998	0	0	0	0	2025-03-17 01:36:02.303
025b815e-4d37-42b3-bd08-03ac36493cc1	34734b25-58ec-46ab-ac41-1bceccdab4fa	0	0	0	0	2025-03-17 01:36:03.261
28d759bf-249c-427a-bd27-2a531b994a25	63ecb365-86eb-4c0e-9100-b697c7df6a90	0	0	0	0	2025-03-17 01:36:03.752
f9b26403-c9e4-4f1f-93ef-5710cada4371	8c2d3fdb-bfa7-4838-9e7e-fbe9ca69c12b	0	0	0	0	2025-03-17 01:36:04.249
c00e9d91-cd41-49d4-b1fb-fb0992ba3a69	054009be-8fa3-4bdb-a853-57f5c355583f	0	0	0	0	2025-03-17 19:32:30.487
efc83cb3-bcbc-4246-a944-b677c6f934c7	f68e6594-fe6b-4779-8483-99c510580c6b	2	4	0	0	2025-03-17 19:32:30.487
f516d5fa-e47e-4c57-8a3b-ca6427ec3a24	75d16c0b-6af6-482b-8333-44247339f9e8	0	3	8	2	2025-03-17 19:32:30.487
ff491c9b-6285-4717-b23d-30c9f308ee40	cc4c1e10-ce79-4157-9138-7f59e14ef6fc	5	2	3	1	2025-03-17 19:32:30.487
d569fb08-ee4c-421c-9bdf-0f9ad6031e58	cab0a67a-4967-4c77-901d-12970681ec85	2	1	0	0	2025-03-17 19:33:07.389
a80f7cfd-7c70-4f20-b3b9-a19d0a8cd449	b492c7d1-f9c5-4b3b-a49b-eae4fe82bc83	0	0	0	0	2025-03-17 19:33:07.389
3e789087-c1ad-4e97-8c91-c945e206fa7c	d675ee59-bc51-4acb-a74a-2a51dca64cbe	0	0	9	2	2025-03-17 19:33:24.581
ac610044-309a-45c9-a345-72b4be8d12b0	bbdb0453-4d4d-45ed-ba49-e132cae453f1	0	0	0	0	2025-03-17 01:36:05.626
95748756-d27e-4939-a83f-1982c3621da7	e035a8c3-809b-4989-aa39-d5dae607c309	0	0	0	0	2025-03-17 01:36:15.288
3d2b1f29-5a58-44e2-b9c6-038481e2e793	844c3033-7af0-46bc-965f-d7d6c8696660	0	0	0	0	2025-03-17 01:36:17.374
faf61c7c-a30a-46f0-8ad9-1dc04d999998	f7a0e68c-d889-4436-be6a-9f592244ecf0	0	0	0	0	2025-03-17 01:36:17.825
a45e9631-172a-4fdf-b592-e9cca4bd52e3	00bae889-15b5-402f-976e-60f288c8c882	0	0	0	0	2025-03-17 01:36:19.336
2d06ccca-7633-4b9c-9971-4a301f28d12d	b7c322be-7029-435d-baf3-631200ce6ddb	0	0	0	0	2025-03-17 01:36:19.798
497acd1a-8cf3-4964-9dd8-9d647608c479	90dd0c2f-f8cf-47ff-81a5-9613739b59b3	0	0	0	0	2025-03-17 01:36:20.288
634b011a-fb05-4b5d-87ea-5251a857f615	5ab0ce77-3c98-4659-a98f-357d042047d9	0	0	0	0	2025-03-17 01:36:20.748
e233e921-feca-4ab5-8d86-2129fcf3d037	04699df4-76cd-4f84-900a-dd65d5ae7052	0	0	0	0	2025-03-17 01:36:21.266
71ceb01e-3889-4221-9094-b3919c66acd6	7fa78729-6336-441f-8ed6-9c827de2bfe3	0	0	0	0	2025-03-17 01:36:21.786
562dc412-7601-4533-ad7f-27f74a422a28	b98ca5e9-7424-4208-8f0a-dbac8c6ca808	0	0	0	0	2025-03-17 01:36:22.237
e093dd2c-11f6-452c-ba90-c88d1679cf95	219f782b-fed3-4c58-84ec-25f59e930d34	0	0	0	0	2025-03-17 01:36:22.689
ae2f635f-1f7c-4626-816d-ca2d91624382	23f70fdf-049c-4b86-b946-d66ef18d38b4	0	0	0	0	2025-03-17 01:36:23.152
b4f11ab2-926b-4c49-96da-f1704ae57e55	db27129f-f6b4-409d-8d3a-20a590c816f3	0	0	0	0	2025-03-17 01:36:23.63
a8464403-0c2d-46b7-a566-ae7b87348667	b25564d4-e26d-4933-baa4-60d04b385a6a	0	0	0	0	2025-03-17 01:36:24.609
3f899cd8-4dfb-42cb-9546-586e80eec9e4	55887d6d-ef93-44fc-9e0a-afb5cbd83df0	0	0	0	0	2025-03-17 01:36:25.066
2e44786c-3545-4181-b1b2-8cadb4e6aeeb	73875939-a972-4927-b0c6-ae68249bfdb9	0	0	0	0	2025-03-17 01:36:25.54
d4bc6288-cbee-4369-984e-275716f44c09	0af2b647-0e29-4f99-b32f-96501608bf3c	0	0	0	0	2025-03-17 01:36:25.993
f9f59924-ad51-48e1-90fc-b7913c84c695	4aaa007f-ff17-452a-8917-4dd47a8102b4	0	0	0	0	2025-03-17 01:36:26.499
0c31ad29-62d2-4791-a314-5184476caa23	31c831b2-5562-4968-ba09-1a5459bb1b92	0	0	0	0	2025-03-17 01:36:26.96
d60492af-7600-4628-9aa0-9414aa84134e	e5e98736-5eed-4bf3-82d5-fbc29eaaf4b2	0	0	0	0	2025-03-17 01:36:27.433
2e1a2f20-571c-4c70-88f3-46e565f7c686	35096d12-6a4a-4e7a-aed9-19b5db5db10c	0	0	0	0	2025-03-17 01:36:27.885
6d9f25a3-e0a4-463e-a733-999281cbcb3b	eccd75c9-812b-4464-b542-8dc1c4fa94f9	0	0	0	0	2025-03-17 01:36:28.386
d406c5e7-ae7d-42c4-ad98-bd6eb7253a6c	d5114658-91f6-4b1f-834d-be49235e419c	0	0	0	0	2025-03-17 01:36:28.841
7ac9de6c-c8ee-454e-a3d7-f19eb2f4daeb	7854fc02-d82c-4044-a52b-dd01380bfd7d	0	0	0	0	2025-03-17 01:36:29.333
7789a660-8aeb-41a5-88a9-c10fabfdb255	533711da-7205-4171-b1b3-76f725ce4da2	0	0	0	0	2025-03-17 01:36:29.796
fd529450-b068-4738-926c-725edae77de4	2c91becf-3c2b-4692-a762-66caeec53d1e	0	0	0	0	2025-03-17 01:36:30.441
d1dcf6d3-6ee6-4136-9f34-f504966db49f	d41e8753-0ada-4b33-bed9-a688ffa34d9e	0	0	0	0	2025-03-17 01:36:30.913
d07e52f3-08c0-4411-bd38-84fbc3b4fefc	341b131e-4d79-4f7b-82da-bf8174bcceaf	0	0	0	0	2025-03-17 01:36:31.476
d6b16d78-978f-4058-8859-98b1305cb221	4a8a627b-d49e-478c-9a93-d08d4100837a	0	0	0	0	2025-03-17 01:36:31.93
63456f07-9dce-48b3-abf2-b5b4fdb1789a	77261e65-6403-44cf-9f3f-2cc9f3d95f13	0	0	0	0	2025-03-17 01:36:33.425
b01f3212-5d2b-4421-8372-47b9784d2c77	07b92061-6f7f-4355-8be5-7e215deba937	0	0	0	0	2025-03-17 01:36:33.896
ab84769f-4687-46e8-a668-238c68b4bcdf	8b7021c3-73e4-46d9-b84f-b6291be61d3a	0	0	0	0	2025-03-17 01:36:34.379
f0b24095-fe26-4018-ba39-b9e4d169fae3	084cfb0c-2623-48cf-b8d6-2d6d6c0baec1	0	0	0	0	2025-03-17 01:36:34.829
2177231d-eb1f-482a-9d79-cdb4824b9a11	95b4658f-3578-4409-be47-6ec79ff6204f	0	0	0	0	2025-03-17 01:36:35.298
d3efc8d4-393b-4109-a894-6887d54febc2	d801607f-418e-4330-8f75-d947467ce3aa	0	0	0	0	2025-03-17 01:36:35.768
2e566c8a-071b-4865-a78c-0fbce8d52a9f	ba0fa9e9-9eba-403c-be52-2a136ecf3b7a	0	0	0	0	2025-03-17 01:36:36.24
89541790-f081-4551-a1ef-113162d39909	2272eed7-d25d-496f-aece-6aa7cbaac8bd	4	9	21	3	2025-03-17 22:53:14.009
5b4cc16d-a781-4da9-aab4-994a88642798	30cdfe59-56b7-4ea4-8f20-c975698e4541	4	1	3	2	2025-03-18 05:32:20.84
25d71336-ec82-492f-91e3-2db1a79e6bb4	2bc0e5cc-9d7e-438c-b1b3-c963b3c84aec	1	0	0	0	2025-03-18 04:01:26.492
95c682d7-cce0-4eb6-baaa-0683960ffff0	bf456723-0c50-448d-9732-623f581da6a0	11	0	3	2	2025-03-18 05:32:55.259
06b5e981-05b2-48db-85d3-ef948a0af728	193935c5-ac96-4664-bcc0-9869b84e1548	2	0	0	0	2025-03-18 00:57:19.289
7d8e9ee9-7fed-4ea5-9ccb-730b4b5a3a41	162a11b3-6138-4540-86ae-f50619bac7f4	2	0	9	6	2025-03-18 05:33:32.918
b9ffc64a-6851-4b86-bd73-b634849a8079	59aee7d1-1d45-4386-a3e4-c164cc4de46d	2	1	16	2	2025-03-18 05:36:25.015
9fb1e2be-11a6-4c6e-ba53-41e25bcee833	22845991-0fb6-4bdf-9725-0525b565699c	0	0	0	0	2025-03-17 01:36:36.725
0036efd7-b62b-4312-82d5-ca91e29eb7ab	dfba9261-3270-4ba2-9110-5103eb8c03c9	0	0	0	0	2025-03-17 01:36:37.211
35a40c22-fe74-4079-b2a6-8c4a1378f31e	bcbbaf7b-bd8e-413d-b42b-e483d4dec771	0	0	0	0	2025-03-17 01:36:37.689
2f2a2acb-9c26-4eaa-ada5-eb2f0b0ac9b5	ed450b52-5caa-492f-8790-d3c6b4f77fff	0	0	0	0	2025-03-17 01:36:38.196
a8710d88-3ce4-48b2-ae0f-71f78f5f65d4	f0e24ffc-e714-4da0-8510-35cfbb521ffb	0	0	0	0	2025-03-17 01:36:38.683
6c707f6d-a44f-4e8a-a90a-43ac36133564	8ad6e622-f36f-42e3-aac7-92aa7d3a8288	0	0	0	0	2025-03-17 01:36:39.659
f39c4746-f6c3-4aa2-8819-637d896ee6d4	788597c7-0923-4688-a425-6e694b0007d2	0	0	0	0	2025-03-17 01:36:40.187
7e019a74-3880-4bbc-9cd7-87a2a8080e7f	8759da60-d5ce-42b4-b0aa-fafdbd345aa2	0	0	0	0	2025-03-17 01:36:40.683
fd664fdd-33f7-463f-bcd3-6f55f0ac316c	25754fe0-22d6-4e01-b552-add4be72ae48	0	0	0	0	2025-03-17 01:36:41.197
af8acac7-23a9-4cab-9c18-7341d98eb53e	af707792-b791-4803-9d5d-dd83bf7fcc87	0	0	0	0	2025-03-17 01:36:41.689
4214efa5-ca26-49c0-ad81-9d4712ff3cb5	0b859c68-a877-40a3-9f8e-ca0bc40317b5	0	0	0	0	2025-03-17 01:36:42.174
2584270f-ca09-4772-83d4-9fa7e4690809	f67f4c00-47fa-4ee3-a7bd-8a1bacd6f95e	0	0	0	0	2025-03-17 01:36:42.676
ea3c6dd3-da14-481e-a2ae-a7884d937c5a	9359a360-70c0-43ad-bceb-9912f7d134da	0	0	0	0	2025-03-17 01:36:43.154
3b363df3-a3cf-4807-8129-8a397be8b020	8cfc30a0-f692-4e4e-bdca-ad4c2c372cd1	0	0	0	0	2025-03-17 01:36:43.649
2778d65c-0e38-4339-8001-88f3d9f2467b	c10111fb-d178-4643-b837-7ef19bef8f41	0	0	0	0	2025-03-17 01:36:44.687
1f305a70-6825-47b6-9acd-c5d1147f39f6	59b2393e-ebab-4d7e-b9c3-b2aaa0bd8513	0	0	0	0	2025-03-17 01:36:45.167
c89e3026-dd1e-4efe-8d84-2b6019adc7fe	dca78d28-45b4-44ea-9bc7-80baf7008641	0	0	0	0	2025-03-17 01:36:45.8
90b4082a-d615-4b9f-a376-a18a7c3ecdbb	07d6775c-e242-4597-a44e-e22437a49459	0	0	0	0	2025-03-17 01:36:46.304
0b34822f-24bf-4b17-b15d-b9fbb3511e90	16d4082f-5b2f-4528-bc21-c105e46abbdf	0	0	0	0	2025-03-17 01:36:46.791
9a09bc08-4bd9-4b98-b877-3eb81fa5f17e	9748c31e-640b-4263-b719-da3a8f08736e	0	0	0	0	2025-03-17 01:36:47.283
00f2b6f0-5d25-44fb-8efd-f22b197e0616	b4d24777-f913-46b7-983d-88490a68e2c0	0	0	0	0	2025-03-17 01:36:47.74
b867effd-2904-4f6c-8403-533dd9732502	4626e481-051b-4832-ba44-be606da797c6	0	0	0	0	2025-03-17 01:36:48.221
9f31e780-7645-4c61-b52a-aaf08c08f8eb	8f9010c4-d77b-4887-9cc3-0c9b7010c569	0	0	0	0	2025-03-17 01:36:48.753
925b2cbd-4990-4350-9989-13d95e7ad627	6cb521f3-5336-4f75-8bbb-9b67d8b7ba3f	0	0	0	0	2025-03-17 01:36:49.713
bb913823-0dab-4835-bfcb-b8d2e5b9ed4c	83afb8c5-9e23-4fa8-9168-83decbd7978d	0	0	0	0	2025-03-17 01:36:50.219
0121c97c-866c-4d87-b2ae-582da6795d5d	d2bc2c08-c7b5-47b7-b45b-fa3b5b2e8f36	0	0	0	0	2025-03-17 01:36:50.747
b0664f2d-8f50-4904-bcba-42b18a0588c8	4b3fa1ed-a7fa-4185-9f03-519c76913aca	0	0	0	0	2025-03-17 01:36:52.295
ab4f275b-2a41-48eb-80bb-84da78d4073b	46250f21-9a73-4146-88f4-513a1c5f99d9	0	0	0	0	2025-03-17 01:36:53.774
2647bf0b-b02e-4c4b-98ac-4b8807fc73ab	18b64c24-3028-4d04-98e5-c4382f0c8cd0	0	0	0	0	2025-03-17 01:36:55.732
739795ca-90e3-4e5e-a673-db374e4ddc37	4bebe6a9-db56-453e-a85d-0400cb5a08f5	0	0	0	0	2025-03-17 01:36:56.232
aa508cd1-580e-450c-aacd-203ffcd32da6	61f434ad-2388-45de-b373-b561be63590b	0	0	0	0	2025-03-17 01:36:57.188
ef81b2f7-bc0f-4aae-9ca9-7bbd73210ca2	3e78f568-8737-4c77-a46b-e326470acb70	0	0	0	0	2025-03-17 01:36:57.659
f6b63018-6341-4179-9074-a5c725d5fc36	24d8d342-b1d7-40ee-8ad4-6c5636c04661	0	0	0	0	2025-03-17 01:36:58.122
6092020e-4877-46c0-8838-dbf51cbc74d8	2bfa4820-05e8-429d-91db-fd43914f98f9	1	0	0	0	2025-03-17 04:44:50.099
11fb5f42-4d54-461b-b314-4a22c046ec8c	86c45ba5-ab0f-452b-b1e8-877a898bec14	2	0	0	0	2025-03-17 04:04:21.739
cb25e905-caf4-4024-a5bd-2b498ae2e6bf	a3235777-29c9-418d-8b3d-bec551b9e174	1	0	0	0	2025-03-17 04:50:40.723
eecc0ef9-029d-4ad3-a229-f79281d7f882	408320e2-1adb-470a-b015-6e39bf8a5990	6	6	4	1	2025-03-17 19:31:27.425
3009cc21-95b1-414b-8069-bb06c3862535	91698f39-9bc5-464f-8aaf-e73a8a0f3cea	3	3	0	0	2025-03-17 19:28:35.295
88bc106c-7c94-4c5b-a9af-aedbfb4f8f21	8d3ebac9-6a26-4269-96c4-d6da0514d5b1	4	1	0	0	2025-03-17 23:19:35.717
0b7dbbb7-1bb3-4c8a-b3a2-f4c5c81d43ff	20f4e68a-8d53-454a-a405-d40fa30e4674	7	0	5	5	2025-03-18 05:34:40.596
12588c63-94df-453b-9b86-ba7073edad93	7f37cb28-0731-4c2a-b1b9-16cd56a57367	1	0	0	0	2025-03-18 01:02:16.105
fd2567bf-53ad-40d1-bf27-5752a8765812	e0173448-5bdb-410d-a47b-0174bf726c8b	2	0	0	0	2025-03-18 01:21:06.643
a3b5bf27-3d3d-4eb8-813e-476c615cfc13	1c44b058-5546-4826-ae5b-262763ad2a31	6	20	9	3	2025-03-18 06:54:15.233
db50a8ac-a94b-47b0-9a10-a7c3bbee20bc	bbbf2d80-4dba-4faf-a777-09cb88159bc1	7	4	70	13	2025-03-18 05:34:08.829
54b6f21a-074c-4cb1-af9c-b53191106a01	9b149ef6-7d84-4edc-8283-8b5522ce3518	1	0	0	0	2025-03-18 05:13:37.004
3d097a0a-9052-4e42-941f-f5b91a9070ed	c60de4b9-bb22-4b66-ba31-8a6754f8a876	3	1	0	0	2025-03-18 06:55:19.228
9f538791-117f-4fcc-b7ef-7028e4d7e3c6	bfbf5cd7-c44b-4054-a1a8-71455c04f29d	4	0	2	2	2025-03-18 05:32:35.534
5a78b654-3526-4284-b474-492250442258	8074fbb7-fe43-4c9b-aa2b-839438670652	6	6	0	0	2025-03-18 04:00:10.548
8f526b13-d5f4-4c27-8eb4-13950d02b664	d5663aac-ae60-473b-b36d-d00b4504dcc2	15	2	7	4	2025-03-18 06:16:46.707
143b3c84-1748-4b7a-947a-cb5147e8f3fb	708299c8-25f6-45c6-ad30-3dc8592775d4	17	7	9	2	2025-03-18 06:58:54.161
c37a5659-ca8d-4149-8beb-96799c6013d9	13a9b6f6-0b5b-416b-ab9e-3e143dd6bfce	9	1	11	2	2025-03-18 06:39:04.474
\.


--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.games (id, title, description, "imageUrl", "playUrl", "authorId", "createdAt", "updatedAt", tagcategory, xaccount, "galleryImage1", "galleryImage2", "galleryImage3", "galleryImage4", featured) FROM stdin;
cc4c1e10-ce79-4157-9138-7f59e14ef6fc	Dogfight Arena	Pilot WW2 planes in the most exciting and realistic dogfights!	https://res.cloudinary.com/dxow1rafl/image/upload/v1741710493/grokade-screenshots/game_4_1741710492449_Dogfight_Arena_20250310_095322.png.png	https://fly.zullo.fun/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 02:13:30.327	2025-03-16 02:13:30.327	\N	\N	\N	\N	\N	\N	f
cab0a67a-4967-4c77-901d-12970681ec85	Flight Simulator	Flight simulator with great visuals	https://res.cloudinary.com/dxow1rafl/image/upload/v1741710580/grokade-screenshots/game_90_1741710579391_Flight_Simulator_20250310_095558.png.png	https://flyhi.netlify.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 02:13:31.786	2025-03-16 02:13:31.786	\N	\N	\N	\N	\N	\N	f
d675ee59-bc51-4acb-a74a-2a51dca64cbe	Santa's Letter Quest	A fun browser game where Santa throws snowballs at ghosts to collect letters and win.	https://res.cloudinary.com/dxow1rafl/image/upload/v1741710568/grokade-screenshots/game_80_1741710567833_Santa_s_Letter_Quest_20250310_095539.png.png	https://www.santasletterquest.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 02:13:34.607	2025-03-17 19:43:39.741	Strategy,Puzzle	\N	\N	\N	\N	\N	f
75d16c0b-6af6-482b-8333-44247339f9e8	Moonlanders	Fly anywhere in the world from your Browser, sim test built with AI assistance	\N	https://m.moonlanders.net/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 02:13:33.45	2025-03-16 02:13:33.45	\N	\N	\N	\N	\N	\N	f
f68e6594-fe6b-4779-8483-99c510580c6b	Space Combat	Fight In Space	https://res.cloudinary.com/dxow1rafl/image/upload/v1741710577/grokade-screenshots/game_91_1741710577243_Space_Combat_20250310_095600.png.png	https://spacefightergame.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 02:13:35.081	2025-03-16 02:13:35.081	\N	\N	\N	\N	\N	\N	f
d5fba96c-069e-4242-9206-3d145ccf899a	Hot Air Balloon	A visually stunning, multiplayer hot air balloon game set over the Alps.	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171211/grokade-screenshots/Hot_Air_Balloon_Adventure_20250316_155638.png	https://www.hotairvibe.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-17 19:45:02.707	Sports,Adventure	https://x.com/SieversJosua	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171211/grokade-screenshots/Hot_Air_Balloon_Adventure_20250316_155638.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171531/grokade-screenshots/Hot_Air_Balloon_Adventure_20250310_203245.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171532/grokade-screenshots/Hot_Air_Balloon_Adventure_20250310_202401.png	\N	f
b492c7d1-f9c5-4b3b-a49b-eae4fe82bc83	Vibe Karting	Karting racing game	https://res.cloudinary.com/dxow1rafl/image/upload/v1741710476/grokade-screenshots/game_3_1741710475505_Vibe_Karting_20250310_095320.png.png	https://vibekarting.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 02:13:36.504	2025-03-16 02:13:36.504	\N	\N	\N	\N	\N	\N	f
bb935fc4-4063-4709-874a-20e8dd1ba36f	Antsantsants	You are an ant. You can dig.	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171206/grokade-screenshots/Antsantsants_20250310_203309.png	https://antsantsants.xyz	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Arcade,Shooter,Sports	https://x.com/ranking091	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171206/grokade-screenshots/Antsantsants_20250310_203309.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171513/grokade-screenshots/Antsantsants_20250316_155749.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171514/grokade-screenshots/Antsantsants_20250310_202445.png	\N	f
2964c8d9-953c-41a9-aa4f-653d261d14e6	Car vs Monsters	Drive through the city while avoiding or confronting monsters. Collect power-ups to survive longer and defeat enemies!	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171208/grokade-screenshots/Car_vs_Monsters_20250310_203205.png	https://3d-racer.netlify.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Racing,Shooter,Simulation	https://x.com/markszymik	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171208/grokade-screenshots/Car_vs_Monsters_20250310_203205.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171517/grokade-screenshots/Car_vs_Monsters_20250316_155805.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171518/grokade-screenshots/Car_vs_Monsters_20250310_202335.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171520/grokade-screenshots/Car_vs_Monsters_20250316_155546.png	f
3ebb0eb7-753f-4778-8b67-7fd98a94b49c	ShooterWorldAI	Multiplayer FPS Game	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171209/grokade-screenshots/ShooterWorldAI_20250316_155913.png	https://shooterworldai.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Shooter,Action	https://x.com/FeineCapital	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171209/grokade-screenshots/ShooterWorldAI_20250316_155913.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171525/grokade-screenshots/ShooterWorldAI_20250316_155508.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171527/grokade-screenshots/ShooterWorldAI_20250310_203233.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171528/grokade-screenshots/ShooterWorldAI_20250310_202438.png	f
f8279a3a-cbc2-446e-a640-080b05366998	Word Smash	Fun Typing Challenge Game	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171213/grokade-screenshots/Word_Smash_20250316_155852.png	https://wordsmash.apsquared.co	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Arcade,Puzzle,Sports	https://x.com/apsquareddev	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171213/grokade-screenshots/Word_Smash_20250316_155852.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171535/grokade-screenshots/Word_Smash_20250316_155937.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171536/grokade-screenshots/Word_Smash_20250310_203347.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171538/grokade-screenshots/Word_Smash_20250310_202326.png	f
34734b25-58ec-46ab-ac41-1bceccdab4fa	Grid Golf		https://res.cloudinary.com/dxow1rafl/image/upload/v1742171215/grokade-screenshots/Grid_Golf_20250316_160020.png	https://gridgolf.netlify.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Sports,Arcade,Platform	https://x.com/byteonwire	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171215/grokade-screenshots/Grid_Golf_20250316_160020.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171547/grokade-screenshots/Grid_Golf_20250310_203339.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171548/grokade-screenshots/Grid_Golf_20250310_202444.png	\N	f
63ecb365-86eb-4c0e-9100-b697c7df6a90	Pirate and fishing game	Basically you go around and fish and there are monsters that attack you	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171217/grokade-screenshots/Pirate_and_fishing_game_20250310_203158.png	https://boats.dyoburon.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Racing	https://x.com/dyoburon	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171217/grokade-screenshots/Pirate_and_fishing_game_20250310_203158.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171552/grokade-screenshots/Pirate_and_fishing_game_20250310_202333.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171553/grokade-screenshots/Pirate_and_fishing_game_20250316_155725.png	\N	f
8c2d3fdb-bfa7-4838-9e7e-fbe9ca69c12b	Boat Race 3D	You drive a boat around Santorini topography, shoot at other boats and listen to cool music	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171219/grokade-screenshots/Boat_Race_3D_20250316_155745.png	https://boatrace3d.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Racing,Action,Shooter	https://x.com/codefun_xyz	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171219/grokade-screenshots/Boat_Race_3D_20250316_155745.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171556/grokade-screenshots/Boat_Race_3D_20250316_155934.png	\N	\N	f
30cdfe59-56b7-4ea4-8f20-c975698e4541	Freight Frenzy	Trucking themed endless runner	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171221/grokade-screenshots/Freight_Frenzy_20250310_202526.png	https://freightgames.github.io/Freight-Frenzy/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Arcade,Platform,Racing	https://x.com/StephenRuhe	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171221/grokade-screenshots/Freight_Frenzy_20250310_202526.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171559/grokade-screenshots/Freight_Frenzy_20250316_160025.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171560/grokade-screenshots/Freight_Frenzy_20250316_155943.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171561/grokade-screenshots/Freight_Frenzy_20250310_203154.png	f
bbdb0453-4d4d-45ed-ba49-e132cae453f1	Duke Nukem 3D 2025	It's time to kick ass and chew bubble gum.	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171222/grokade-screenshots/Duke_Nukem_3D_2025_20250310_202519.png	https://duke.jobboardsearch.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-17 19:43:13.146	Adventure	\N	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171222/grokade-screenshots/Duke_Nukem_3D_2025_20250310_202519.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171564/grokade-screenshots/Duke_Nukem_3D_2025_20250316_155622.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171565/grokade-screenshots/Duke_Nukem_3D_2025_20250316_155839.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171566/grokade-screenshots/Duke_Nukem_3D_2025_20250316_155557.png	f
e035a8c3-809b-4989-aa39-d5dae607c309	8 pool	AI pool game	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171237/grokade-screenshots/8_pool_20250316_155748.png	https://mrdeex.github.io/8pool/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Sports,Arcade	https://x.com/MrDee	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171237/grokade-screenshots/8_pool_20250316_155748.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171662/grokade-screenshots/8_pool_20250310_202506.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171663/grokade-screenshots/8_pool_20250316_155724.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171665/grokade-screenshots/8_pool_20250310_203211.png	f
844c3033-7af0-46bc-965f-d7d6c8696660	PokeBattle Arena	PokeBattle Arena is a lightweight, turn-based battler where you pick a Pokémon from a random lineup and square off against a surprise opponent. Built using Rep...	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171240/grokade-screenshots/PokeBattle_Arena_20250316_155611.png	https://poke-battle-arena.replit.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Fighting,Action	https://x.com/rajkstats	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171240/grokade-screenshots/PokeBattle_Arena_20250316_155611.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171695/grokade-screenshots/PokeBattle_Arena_20250310_203221.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171696/grokade-screenshots/PokeBattle_Arena_20250310_202421.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171698/grokade-screenshots/PokeBattle_Arena_20250316_155519.png	f
0b859c68-a877-40a3-9f8e-ca0bc40317b5	Cybertrucksim	A driving game where you and your buddies can cruise in a Cybertruck!	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171304/grokade-screenshots/Cybertrucksim_20250310_202404.png	https://cybertrucksim.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Racing,Simulation	https://x.com/Hi_Bennie	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171304/grokade-screenshots/Cybertrucksim_20250310_202404.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171984/grokade-screenshots/Cybertrucksim_20250310_203337.png	\N	\N	f
bf456723-0c50-448d-9732-623f581da6a0	Dome Farm	Chill farming game on Mars. Build your own farm and grow your zen.	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Dome_Farm_20250316_154637.png	https://dome.jelmerdeboer.nl/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-17 22:06:50.952	Strategy	https://x.com/jelmerdeboer	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171686/grokade-screenshots/Dome_Farm_20250310_202303.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171688/grokade-screenshots/Dome_Farm_20250316_154637.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171690/grokade-screenshots/Dome_Farm_20250316_160221.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171691/grokade-screenshots/Dome_Farm_20250310_202608.png	t
f7a0e68c-d889-4436-be6a-9f592244ecf0	Builder	Calm, Minecraft like builder game	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171242/grokade-screenshots/Builder_20250316_155701.png	https://www.regame.io	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Strategy,Survival	https://x.com/sarperdag	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171242/grokade-screenshots/Builder_20250316_155701.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171702/grokade-screenshots/Builder_20250310_203325.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171703/grokade-screenshots/Builder_20250316_155613.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171705/grokade-screenshots/Builder_20250310_202423.png	f
162a11b3-6138-4540-86ae-f50619bac7f4	cowboy shooter	A free-to-play 3D runner shooting game, 100% AI-generated, from game assets to code vibe coded by @pseudokid, Cursor AI, Anthropic's Claude 3.7 Sonnet 3D assets...	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/cowboy_shooter_20250316_154541.webp	https://cowboy.raymelon.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Action,Shooter,Platform	https://x.com/pseudokid	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171713/grokade-screenshots/Cowboy_Shooter_20250316_155637.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171715/grokade-screenshots/Cowboy_Shooter_20250316_160104.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171716/grokade-screenshots/cowboy_shooter_20250310_200904.jpg	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171717/grokade-screenshots/cowboy_shooter_20250316_154541.jpg	f
00bae889-15b5-402f-976e-60f288c8c882	Classic Pong Game	A classic pong game vibe coding built.	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171243/grokade-screenshots/Classic_Pong_Game_20250310_203327.png	https://maekitgames.com/pong	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Arcade,Sports	https://x.com/vibecoding_	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171243/grokade-screenshots/Classic_Pong_Game_20250310_203327.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171723/grokade-screenshots/Classic_Pong_Game_20250316_155857.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171724/grokade-screenshots/Classic_Pong_Game_20250310_202507.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171726/grokade-screenshots/Classic_Pong_Game_20250316_155910.png	f
b7c322be-7029-435d-baf3-631200ce6ddb	Word God	From Void to Universe. Eginning with primordial concepts, evolve a unique glorious universe through your ability to combine words. Watch your creation grow and ...	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171245/grokade-screenshots/Word_God_20250310_202427.png	https://www.experimentswithai.com/word-god-mindfulness-game.html	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Puzzle,Adventure	https://x.com/edwinhayward	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171245/grokade-screenshots/Word_God_20250310_202427.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171730/grokade-screenshots/Word_God_20250310_203223.png	\N	\N	f
90dd0c2f-f8cf-47ff-81a5-9613739b59b3	Astro Breaker	High-energy First Person Shooter that blends explosive arcade action with precision physics-based gameplay.	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171246/grokade-screenshots/Astro_Breaker_20250310_203302.png	https://hytopia.com/games/astro-breaker/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Action,Shooter,Arcade	https://x.com/NeuralPixelAI	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171246/grokade-screenshots/Astro_Breaker_20250310_203302.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171734/grokade-screenshots/Astro_Breaker_20250310_202347.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171737/grokade-screenshots/Astro_Breaker_20250316_155836.png	\N	f
5ab0ce77-3c98-4659-a98f-357d042047d9	Star Wing	Star Wing is a 3D spaceship shooter built with Three.js for web browsers. The player controls a lone starfighter pilot in a game that blends classic arcade shoo...	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171248/grokade-screenshots/Star_Wing_20250316_155832.png	https://star-wing-drosshole.vercel.app	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Action,Arcade,Fighting	https://x.com/drosshole	\N	\N	\N	\N	f
04699df4-76cd-4f84-900a-dd65d5ae7052	Pork Droid	Retro like asteroids game with a modern twist	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171250/grokade-screenshots/Pork_Droid_20250310_202451.png	https://PorkDroid.com	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Arcade,Action,Shooter	https://x.com/reignboat	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171250/grokade-screenshots/Pork_Droid_20250310_202451.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171740/grokade-screenshots/Pork_Droid_20250316_155808.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171741/grokade-screenshots/Pork_Droid_20250310_203218.png	\N	f
7fa78729-6336-441f-8ed6-9c827de2bfe3	Asteroid Assault	Asteroid shooter arcade game	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171251/grokade-screenshots/Asteroid_Assault_20250310_202503.png	https://asteroid-ep9.pages.dev/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Arcade,Shooter,Action	https://x.com/NoFlinch	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171251/grokade-screenshots/Asteroid_Assault_20250310_202503.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171743/grokade-screenshots/Asteroid_Assault_20250310_203359.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171745/grokade-screenshots/Asteroid_Assault_20250316_155553.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171746/grokade-screenshots/Asteroid_Assault_20250316_155633.png	f
13a9b6f6-0b5b-416b-ab9e-3e143dd6bfce	Land the Booster V3	Land the booster on mars - powerful rocket, fire thrusters, and nail the perfect landing. Can you master the challenge?	https://res.cloudinary.com/dxow1rafl/image/upload/v1742251043/f_tvuqZy_nmrqdn.jpg	https://land-the-booster.s13k.dev/mars/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-17 22:40:01.706	Exploration,Puzzle,Shooter	https://x.com/s13k_	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171706/grokade-screenshots/Land_the_Booster_V2_20250316_155915.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171708/grokade-screenshots/Land_the_Booster_V2_20250310_203307.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171710/grokade-screenshots/Land_the_Booster_V2_20250310_202435.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171712/grokade-screenshots/Land_the_Booster_V2_20250316_155859.png	t
b98ca5e9-7424-4208-8f0a-dbac8c6ca808	ClaudeSpace	Survive the cosmos in ClaudeSpace: dodge asteroids, blast enemies, and master your ship's weapons in this high-speed space shooter.	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171253/grokade-screenshots/ClaudeSpace_20250316_155834.png	https://ladegeraet.github.io/claudespace/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Shooter,Action,Racing	https://x.com/Oho_name	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171253/grokade-screenshots/ClaudeSpace_20250316_155834.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171751/grokade-screenshots/ClaudeSpace_20250310_202539.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171752/grokade-screenshots/ClaudeSpace_20250316_155529.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171754/grokade-screenshots/ClaudeSpace_20250316_155850.png	f
219f782b-fed3-4c58-84ec-25f59e930d34	Gladiator Arena	three.js gladiator arena with your own gladiator and several weapons to choose from. Will receive regular updates so check out often to see what's new.	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171255/grokade-screenshots/Gladiator_Arena_20250310_203321.png	https://3js-arena-v5-long-fog-3116.fly.dev/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Fighting,Shooter	https://x.com/rfitzpatrick_io	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171255/grokade-screenshots/Gladiator_Arena_20250310_203321.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171762/grokade-screenshots/Gladiator_Arena_20250310_202425.png	\N	\N	f
23f70fdf-049c-4b86-b946-d66ef18d38b4	Super Jumper	Jump , Take Boost, Play and get to Finish Line	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171257/grokade-screenshots/Super_Jumper_20250316_155835.png	https://super-jumper-game.web.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Platform	https://x.com/nishant_ty	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171257/grokade-screenshots/Super_Jumper_20250316_155835.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171764/grokade-screenshots/Super_Jumper_20250310_202403.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171765/grokade-screenshots/Super_Jumper_20250316_155506.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171766/grokade-screenshots/Super_Jumper_20250310_203206.png	f
db27129f-f6b4-409d-8d3a-20a590c816f3	Formula Simulator Racing	Experience the thrill of high-speed racing in this immersive 3D Formula racing simulator! Race through a dynamic open world filled with challenging obstacles, c...	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171258/grokade-screenshots/Formula_Simulator_Racing_20250316_160004.png	https://racing-car-game.onrender.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Simulation,Sports,Arcade	https://x.com/emreozdiyar	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171258/grokade-screenshots/Formula_Simulator_Racing_20250316_160004.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171770/grokade-screenshots/Formula_Simulator_Racing_20250310_202524.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171771/grokade-screenshots/Formula_Simulator_Racing_20250316_155658.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171773/grokade-screenshots/Formula_Simulator_Racing_20250310_203255.png	f
b25564d4-e26d-4933-baa4-60d04b385a6a	Pong Arcade	Challenge the AI or play against a friend in this modern recreation of Pong.	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171259/grokade-screenshots/Pong_Arcade_20250316_155549.png	https://www.pongarcade.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Arcade,Puzzle,Racing	https://x.com/mischeiwiller	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171259/grokade-screenshots/Pong_Arcade_20250316_155549.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171788/grokade-screenshots/Pong_Arcade_20250310_203346.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171789/grokade-screenshots/Pong_Arcade_20250316_155644.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171791/grokade-screenshots/Pong_Arcade_20250316_160000.png	f
55887d6d-ef93-44fc-9e0a-afb5cbd83df0	Dyson Defender	Defend the Dyson sphere from waves of alien invaders!	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171261/grokade-screenshots/Dyson_Defender_20250310_203358.png	https://dyson-defender.vercel.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Arcade	https://x.com/hankofalltrades	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171261/grokade-screenshots/Dyson_Defender_20250310_203358.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171795/grokade-screenshots/Dyson_Defender_20250316_160112.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171797/grokade-screenshots/Dyson_Defender_20250310_202411.png	\N	f
73875939-a972-4927-b0c6-ae68249bfdb9	AI Bomber Game	Inspired by bomberman, with 3D touches and twists	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171263/grokade-screenshots/AI_Bomber_Game_20250310_203216.png	https://bomberman-bice.vercel.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Racing	https://x.com/tuantruong	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171263/grokade-screenshots/AI_Bomber_Game_20250310_203216.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171801/grokade-screenshots/AI_Bomber_Game_20250316_155554.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171803/grokade-screenshots/AI_Bomber_Game_20250310_202536.png	\N	f
0af2b647-0e29-4f99-b32f-96501608bf3c	Cops and Robbers	Either be Robber who has to steal money or play as a cop who catches robbers. More like GTA and NFS.	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171265/grokade-screenshots/Cops_and_Robbers_20250310_202501.png	https://cnr.khatarnakishan.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Racing,Arcade,Shooter	https://x.com/Khatarnak_Ishan	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171265/grokade-screenshots/Cops_and_Robbers_20250310_202501.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171805/grokade-screenshots/Cops_and_Robbers_20250316_155607.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171807/grokade-screenshots/Cops_and_Robbers_20250316_155606.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171808/grokade-screenshots/Cops_and_Robbers_20250310_203342.png	f
4aaa007f-ff17-452a-8917-4dd47a8102b4	Wing Man	Fly a hang-glider	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171266/grokade-screenshots/Wing_Man_20250316_155617.png	https://hugohamelcom.github.io/wing-man-game/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Adventure,Racing,Shooter	https://x.com/hugohamelcom	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171266/grokade-screenshots/Wing_Man_20250316_155617.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171814/grokade-screenshots/Wing_Man_20250310_202418.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171815/grokade-screenshots/Wing_Man_20250310_203200.png	\N	f
31c831b2-5562-4968-ba09-1a5459bb1b92	Bubble Basher	Fast paced, pick up and play, multiplayer bubble bashing	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171268/grokade-screenshots/Bubble_Basher_20250316_155942.png	https://bubblebasher.com	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Racing	https://x.com/JonathanACaruso	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171268/grokade-screenshots/Bubble_Basher_20250316_155942.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171818/grokade-screenshots/Bubble_Basher_20250316_155851.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171819/grokade-screenshots/Bubble_Basher_20250316_155914.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171821/grokade-screenshots/Bubble_Basher_20250316_155657.png	f
e5e98736-5eed-4bf3-82d5-fbc29eaaf4b2	VybeRace	VybeRace is a fun, simple racing game with textured roads and scenic trees. Drift off-road to leave tire marks and feel the realistic slowdown—aim to be the f...	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/VybeRace_20250316_154645.png	https://vibegames.cc/browse/vyberace	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Racing,Simulation,Arcade	https://x.com/AlbertSimonDev	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171826/grokade-screenshots/VybeRace_20250316_160228.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171828/grokade-screenshots/VybeRace_20250316_155641.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171830/grokade-screenshots/VybeRace_20250316_155939.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171832/grokade-screenshots/VybeRace_20250316_155812.png	f
35096d12-6a4a-4e7a-aed9-19b5db5db10c	Planetary	Explore space, get into dogfights, do spaceflight time trials	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171269/grokade-screenshots/Planetary_20250316_155706.png	https://magnificent-zabaione-675839.netlify.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Strategy,Adventure,Exploration	https://x.com/jbelevate	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171269/grokade-screenshots/Planetary_20250316_155706.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171842/grokade-screenshots/Planetary_20250310_202459.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171844/grokade-screenshots/Planetary_20250310_203152.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171846/grokade-screenshots/Planetary_20250316_155722.png	f
d5114658-91f6-4b1f-834d-be49235e419c	Space Force: Drain The Swamp	Take to the stars as Donald Trump or Elon Musk in Space Force: Drain The Swamp, a thrilling Galaxian-inspired space shooter where patriotism meets intergalactic...	\N	https://hcbgreatwall.itch.io/space-force-drain-the-swamp	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Action,Shooter,Arcade	https://x.com/HCBGreatWall	\N	\N	\N	\N	f
533711da-7205-4171-b1b3-76f725ce4da2	Rock Water Skipping	A fun free-to-play Rock skipping primitive arcade game with real physics 100% made with AI, without any loading screen or game updates, "Just works".	\N	https://rock-water-skipping.vercel.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Arcade,Simulation	https://x.com/Stianwalgermo	\N	\N	\N	\N	f
2c91becf-3c2b-4692-a762-66caeec53d1e	Dune Wanderer	Wander the dessert in search of wells	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171272/grokade-screenshots/Dune_Wanderer_20250310_203252.png	https://dunewanderer.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Platform	https://x.com/balt1794	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171272/grokade-screenshots/Dune_Wanderer_20250310_203252.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171861/grokade-screenshots/Dune_Wanderer_20250310_202351.png	\N	\N	f
d41e8753-0ada-4b33-bed9-a688ffa34d9e	Emoji Sim	A village of emojis at your command. Create your own villages and even build out your game rules. Learn from others and lead your villagers	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171273/grokade-screenshots/Emoji_Sim_20250316_155811.png	https://emojisim.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Simulation,Strategy,Exploration	https://x.com/benwmaddox	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171273/grokade-screenshots/Emoji_Sim_20250316_155811.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171863/grokade-screenshots/Emoji_Sim_20250310_203241.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171864/grokade-screenshots/Emoji_Sim_20250310_202328.png	\N	f
341b131e-4d79-4f7b-82da-bf8174bcceaf	Artillery Defense	Defend your base by shooting down enemy paratroopers	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171275/grokade-screenshots/Artillery_Defense_20250316_155849.png	https://www.craygen.com/artillery/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Action,Shooter	https://x.com/craygen9	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171275/grokade-screenshots/Artillery_Defense_20250316_155849.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171867/grokade-screenshots/Artillery_Defense_20250316_155848.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171868/grokade-screenshots/Artillery_Defense_20250310_203253.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171870/grokade-screenshots/Artillery_Defense_20250310_202449.png	f
7854fc02-d82c-4044-a52b-dd01380bfd7d	Rocklight	Rogue-like shooter	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171271/grokade-screenshots/Rocklight_20250316_155838.png	https://zumashtm.manus.space/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-17 19:43:00.267	Platform,Shooter,Action	https://x.com/skifull579	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171271/grokade-screenshots/Rocklight_20250316_155838.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171859/grokade-screenshots/Rocklight_20250316_155912.png	\N	\N	f
4a8a627b-d49e-478c-9a93-d08d4100837a	TideFall	Build alliances, claim vast lands, and hunt for loot in dangerous realms.	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171276/grokade-screenshots/TideFall_20250310_202414.png	https://tidefall.io	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Exploration,Shooter,Strategy	https://x.com/dyoburon	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171276/grokade-screenshots/TideFall_20250310_202414.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171873/grokade-screenshots/TideFall_20250310_203243.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171874/grokade-screenshots/TideFall_20250316_160109.png	\N	f
2bc0e5cc-9d7e-438c-b1b3-c963b3c84aec	Space Cruise	3D Space Travel Web Game	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171279/grokade-screenshots/Space_Cruise_20250316_155616.png	https://space-cruise.tech	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Action	https://x.com/Aditya_T007	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171279/grokade-screenshots/Space_Cruise_20250316_155616.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171877/grokade-screenshots/Space_Cruise_20250310_203319.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171878/grokade-screenshots/Space_Cruise_20250316_155703.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171879/grokade-screenshots/Space_Cruise_20250316_155936.png	f
59aee7d1-1d45-4386-a3e4-c164cc4de46d	Drone Simulator	Fly different environments with a drone, explore and complete missions	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171280/grokade-screenshots/Drone_Simulator_20250316_155729.png	https://www.iamvg.space/drone-simulator/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Simulation,Exploration,Racing	https://x.com/ged_ven	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171280/grokade-screenshots/Drone_Simulator_20250316_155729.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171885/grokade-screenshots/Drone_Simulator_20250316_160022.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171887/grokade-screenshots/Drone_Simulator_20250316_155631.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171888/grokade-screenshots/Drone_Simulator_20250316_155630.png	f
77261e65-6403-44cf-9f3f-2cc9f3d95f13	3D Tetris	A 3D version of the classic Tetris game where you clear entire platforms	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171281/grokade-screenshots/3D_Tetris_20250316_155802.png	https://3d-tetris-platforms.lovable.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Platform,Arcade	https://x.com/RealFredericVC	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171281/grokade-screenshots/3D_Tetris_20250316_155802.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171892/grokade-screenshots/3D_Tetris_20250316_155803.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171893/grokade-screenshots/3D_Tetris_20250316_160106.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171895/grokade-screenshots/3D_Tetris_20250310_203202.png	f
07b92061-6f7f-4355-8be5-7e215deba937	Elemental Combatant	Elemental CombaTanks is a battlefield brawler where you command a tank powered by the elements—fire, water, earth, and air. And more Mode are added.	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171283/grokade-screenshots/Elemental_Combatant_20250316_155933.png	https://asalt.vercel.app	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Action,Fighting,Shooter	https://x.com/IsaacXVoxel	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171283/grokade-screenshots/Elemental_Combatant_20250316_155933.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171902/grokade-screenshots/Elemental_Combatant_20250310_203235.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171905/grokade-screenshots/Elemental_Combatant_20250310_202452.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171907/grokade-screenshots/Elemental_Combatant_20250316_155635.png	f
8b7021c3-73e4-46d9-b84f-b6291be61d3a	Society Fail	Can you survive the apocalypse? Society Fail is a post-apocalyptic incremental game where you must scavenge for resources, fight off mutants, and navigate a wor...	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171286/grokade-screenshots/Society_Fail_20250310_202541.png	https://society.fail/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Survival,Exploration,Strategy	https://x.com/Shpigford	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171286/grokade-screenshots/Society_Fail_20250310_202541.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171911/grokade-screenshots/Society_Fail_20250310_203214.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171912/grokade-screenshots/Society_Fail_20250316_160020.png	\N	f
084cfb0c-2623-48cf-b8d6-2d6d6c0baec1	Flappi Bird	A ThreeJS based Flappi Bird game built completely using Grok3, Claude 3.5, and Cursor.  Along with other AI tools for models, music, graphics, etc	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171287/grokade-screenshots/Flappi_Bird_20250310_203328.png	https://flappi-bird.vercel.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Arcade,Sports	https://x.com/joshuajohnsonAI	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171287/grokade-screenshots/Flappi_Bird_20250310_203328.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171916/grokade-screenshots/Flappi_Bird_20250310_202534.png	\N	\N	f
95b4658f-3578-4409-be47-6ec79ff6204f	Fruit of the Boom	Collect as many fruit as you can.	\N	https://isaacdozier.github.io/fruit-of-the-boom/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Arcade,Sports	https://x.com/isaactdozier	\N	\N	\N	\N	f
d801607f-418e-4330-8f75-d947467ce3aa	Island Adventure	Search for treasures and craft items on a island in singleplayer mode	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Island_20250316_154543.webp	https://ja.sperdeboer.nl/island/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Exploration,Adventure,Survival	https://x.com/jasperdeboer	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171223/grokade-screenshots/Island_Adventure_20250310_202510.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171607/grokade-screenshots/Island_Adventure_20250310_203353.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171608/grokade-screenshots/Island_Adventure_20250316_155750.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171613/grokade-screenshots/Island_Adventure_20250316_155456.png	f
ba0fa9e9-9eba-403c-be52-2a136ecf3b7a	Suika Game	Fuit-merging game akin to tetris or puyo-puyo. built with cursor/claude	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171289/grokade-screenshots/Suika_Game_20250316_155639.png	https://suika.live/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Puzzle	https://x.com/andrwhcom	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171289/grokade-screenshots/Suika_Game_20250316_155639.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171926/grokade-screenshots/Suika_Game_20250310_203227.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171928/grokade-screenshots/Suika_Game_20250310_202408.png	\N	f
22845991-0fb6-4bdf-9725-0525b565699c	Snake Trae	Play classic snake	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171290/grokade-screenshots/Snake_Trae_20250316_160017.png	https://trae.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Arcade	https://x.com/traemikal	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171290/grokade-screenshots/Snake_Trae_20250316_160017.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171931/grokade-screenshots/Snake_Trae_20250316_160016.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171932/grokade-screenshots/Snake_Trae_20250310_203401.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171933/grokade-screenshots/Snake_Trae_20250310_202321.png	f
dfba9261-3270-4ba2-9110-5103eb8c03c9	Breaking Balls	Break balls and feel calm	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171291/grokade-screenshots/Breaking_Balls_20250310_202532.png	https://makereal.tldraw.link/-wMNzXuU7igniDJ6oyhKW	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Sports	https://x.com/adityakabra	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171291/grokade-screenshots/Breaking_Balls_20250310_202532.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171936/grokade-screenshots/Breaking_Balls_20250316_155829.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171937/grokade-screenshots/Breaking_Balls_20250310_203409.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171938/grokade-screenshots/Breaking_Balls_20250316_155704.png	f
bcbbaf7b-bd8e-413d-b42b-e483d4dec771	Escape	A text-based escape room game	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171293/grokade-screenshots/Escape_Prison_Cell_20250310_202308.png	https://escape.puzzlesunlocked.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Puzzle	https://x.com/jamesckemp	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171293/grokade-screenshots/Escape_Prison_Cell_20250310_202308.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171940/grokade-screenshots/Escape_20250316_155856.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171942/grokade-screenshots/Escape_Prison_Cell_20250316_154642.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171944/grokade-screenshots/Escape_Prison_Cell_20250316_160225.png	f
ed450b52-5caa-492f-8790-d3c6b4f77fff	Ophidian	A short game that is basically Snake.	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171295/grokade-screenshots/Ophidian_20250310_202429.png	https://ophidian-offekt.vercel.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Strategy	https://x.com/drewvergara	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171295/grokade-screenshots/Ophidian_20250310_202429.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171953/grokade-screenshots/Ophidian_20250310_203259.png	\N	\N	f
f0e24ffc-e714-4da0-8510-35cfbb521ffb	Type Battles	Sharpen your typing skills, build up combos for a higher score, earn trophies and conquer all 10 levels to face the final boss...	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171297/grokade-screenshots/Type_Battles_20250310_202355.png	https://www.typebattles.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Platform,Action,Arcade	https://x.com/edwinhayward	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171297/grokade-screenshots/Type_Battles_20250310_202355.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171955/grokade-screenshots/Type_Battles_20250310_203330.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171956/grokade-screenshots/Type_Battles_20250316_155826.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171958/grokade-screenshots/Type_Battles_20250316_155827.png	f
e0173448-5bdb-410d-a47b-0174bf726c8b	Vibe Tanks	TRON style tank game. Play with your friends or against them in this fast paced game.	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Vibe_Tanks_20250316_154634.png	https://vibes.darefail.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Racing,Shooter	https://x.com/darefailed	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171959/grokade-screenshots/Vibe_Tanks_20250316_160217.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171960/grokade-screenshots/Vibe_Tanks_20250316_155530.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171962/grokade-screenshots/Vibe_Tanks_20250316_154634.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171963/grokade-screenshots/Vibe_Tanks_20250310_202605.png	f
8ad6e622-f36f-42e3-aac7-92aa7d3a8288	Tanks AI	Experience the thrill of tank battles in this exciting game!	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171298/grokade-screenshots/Tanks_AI_20250316_155956.png	https://tanksai.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Action,Fighting	https://x.com/d4m1n	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171298/grokade-screenshots/Tanks_AI_20250316_155956.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171968/grokade-screenshots/Tanks_AI_20250310_203344.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171970/grokade-screenshots/Tanks_AI_20250310_202322.png	\N	f
788597c7-0923-4688-a425-6e694b0007d2	Mars Landing Simulator	Prepare for the ultimate Mars landing experience!	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171300/grokade-screenshots/Mars_Landing_Simulator_20250310_202521.png	https://marslanding.vercel.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Exploration,Simulation,Racing	https://x.com/hi_itsbey	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171300/grokade-screenshots/Mars_Landing_Simulator_20250310_202521.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171973/grokade-screenshots/Mars_Landing_Simulator_20250316_155831.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171974/grokade-screenshots/Mars_Landing_Simulator_20250316_155941.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171975/grokade-screenshots/Mars_Landing_Simulator_20250310_203240.png	f
8759da60-d5ce-42b4-b0aa-fafdbd345aa2	Macro Data Refinement	A web application that simulates the macro data refinement work from the TV show Severance	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171301/grokade-screenshots/Macro_Data_Refinement_20250310_203315.png	https://macro-data-refinement-five.vercel.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Simulation	https://x.com/mitchposts	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171301/grokade-screenshots/Macro_Data_Refinement_20250310_203315.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171978/grokade-screenshots/Macro_Data_Refinement_20250316_155858.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171979/grokade-screenshots/Macro_Data_Refinement_20250310_202508.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171980/grokade-screenshots/Macro_Data_Refinement_20250316_155830.png	f
25754fe0-22d6-4e01-b552-add4be72ae48	Tic-Tac Cricket	Unique and fun online game that combines Tic-Tac-Toe with the excitement of cricket!	\N	https://tictaccricket.netlify.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Sports,Arcade,Fighting	https://x.com/byteonwire	\N	\N	\N	\N	f
af707792-b791-4803-9d5d-dd83bf7fcc87	Archer wars	1 vs 1 archer war	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171302/grokade-screenshots/Archer_wars_20250316_155720.png	https://www.archerwars.xyz/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Shooter,Platform,Action	https://x.com/finvisual	\N	\N	\N	\N	f
f67f4c00-47fa-4ee3-a7bd-8a1bacd6f95e	Push the Box	In this reimagined Sokoban game, you embark on a journey of logic and space. As you gently guide the character to push the boxes towards their destinations, you...	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171305/grokade-screenshots/Push_the_Box_20250310_203156.png	https://boxgame2000.netlify.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Platform,Adventure,Puzzle	https://x.com/xiaochi2	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171305/grokade-screenshots/Push_the_Box_20250310_203156.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171986/grokade-screenshots/Push_the_Box_20250316_155959.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171988/grokade-screenshots/Push_the_Box_20250310_202331.png	\N	f
8cfc30a0-f692-4e4e-bdca-ad4c2c372cd1	Necropolis: Rise of the Undead	High paced and exciting vibe coded zombie first person shooter game	\N	https://shanelarson.com/games/necropolis	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Shooter,Action,Arcade	https://x.com/PeakGrizzly	\N	\N	\N	\N	f
d5663aac-ae60-473b-b36d-d00b4504dcc2	Jet Ski Simulation	Bring in the holiday vibes with this game. Play with your friends or against them in this fast paced game.	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171308/grokade-screenshots/Jet_Ski_Simulation_20250310_203311.png	https://jetski.cemilsevim.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Simulation,Racing,Platform	https://x.com/cemilsvm	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171308/grokade-screenshots/Jet_Ski_Simulation_20250310_203311.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171652/grokade-screenshots/Jet_Ski_Simulation_20250310_202357.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171655/grokade-screenshots/Jet_Ski_Simulation_20250316_155916.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171659/grokade-screenshots/Jet_Ski_Simulation_20250316_155957.png	f
c10111fb-d178-4643-b837-7ef19bef8f41	Forest Escape	Escape from spirits in a haunted forest before they catch you!	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171309/grokade-screenshots/Forest_Escape_20250310_203148.png	https://www.escape.alexandre-grisey.fr/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Action	https://x.com/nomalex_	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171309/grokade-screenshots/Forest_Escape_20250310_203148.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172004/grokade-screenshots/Forest_Escape_20250310_202359.png	\N	\N	f
59b2393e-ebab-4d7e-b9c3-b2aaa0bd8513	Matrix Cube	Matrix Cube Memory is a challenging 3D memory game inspired by the digital world of The Matrix. Test your memory skills by remembering and repeating increasingl...	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171310/grokade-screenshots/Matrix_Cube_20250316_160114.png	https://matrixcube.netlify.app	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Educational	https://x.com/Akkorothone	\N	\N	\N	\N	f
dca78d28-45b4-44ea-9bc7-80baf7008641	Space Defenders	One shot a Space Invaders game like built with Sonnet 3.7	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171312/grokade-screenshots/Space_Defenders_20250316_155911.png	https://jasonleow.com/space-defenders/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Arcade,Sports,Action	https://x.com/jasonleowsg	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171312/grokade-screenshots/Space_Defenders_20250316_155911.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172007/grokade-screenshots/Space_Defenders_20250310_202420.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172009/grokade-screenshots/Space_Defenders_20250310_203352.png	\N	f
07d6775c-e242-4597-a44e-e22437a49459	Flappy Bird 3D	Flappy Bird reimagined as a 3D third person game	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171313/grokade-screenshots/Flappy_Bird_3D_20250316_155954.png	https://flappybird.purav.co	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Platform	https://x.com/notpurav	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171313/grokade-screenshots/Flappy_Bird_3D_20250316_155954.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172011/grokade-screenshots/Flappy_Bird_3D_20250316_155955.png	\N	\N	f
16d4082f-5b2f-4528-bc21-c105e46abbdf	Ad simulator	Capture the flag on a world full of ads	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171314/grokade-screenshots/Ad_simulator_20250310_203402.png	https://ad-simulator.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Simulation,Sports,Action	https://x.com/iagolast	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171314/grokade-screenshots/Ad_simulator_20250310_203402.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172014/grokade-screenshots/Ad_simulator_20250310_202432.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172016/grokade-screenshots/Ad_simulator_20250316_155719.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172017/grokade-screenshots/Ad_simulator_20250316_155500.png	f
9748c31e-640b-4263-b719-da3a8f08736e	Be a fish	Be a fish, eat other fish, become a bigger fish. Dive in and dominate the ocean!	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171316/grokade-screenshots/Be_a_fish_20250310_203323.png	https://www.be-a-fish.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Other	https://x.com/athcanft	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171316/grokade-screenshots/Be_a_fish_20250310_203323.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172023/grokade-screenshots/Be_a_fish_20250310_202455.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172026/grokade-screenshots/Be_a_fish_20250316_155618.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172029/grokade-screenshots/Be_a_fish_20250316_155527.png	f
b4d24777-f913-46b7-983d-88490a68e2c0	Aetherialdream	A beautiful and intuitive dream journal that helps you record, explore, and understand your dreams.	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171318/grokade-screenshots/Aetherialdream_20250310_202442.png	https://www.aetherialdream.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Adventure,Platform,Exploration	https://x.com/Kaberikram	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171318/grokade-screenshots/Aetherialdream_20250310_202442.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172033/grokade-screenshots/Aetherialdream_20250310_203225.png	\N	\N	f
4626e481-051b-4832-ba44-be606da797c6	Earth Simulation	Full earth simulation with climate, tectonic activity, evolution and civilization to factions, then burn it down with disaster scenarios. also includes earth te...	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171235/grokade-screenshots/Earth_Simulation_20250316_155504.png	https://o3-experiments-nextjs.fly.dev/earth	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Simulation,Action	https://x.com/rfitzpatrick_io	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171235/grokade-screenshots/Earth_Simulation_20250316_155504.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171650/grokade-screenshots/Earth_Simulation_20250310_202512.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171654/grokade-screenshots/Earth_Simulation_20250310_203237.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171658/grokade-screenshots/Earth_Simulation_20250316_155809.png	f
8f9010c4-d77b-4887-9cc3-0c9b7010c569	Falling Bubbles	Pop falling bubbles in a vibrant, fast-paced test of reflexes!	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171322/grokade-screenshots/Falling_Bubbles_20250310_203356.png	https://falling-bubbles.vercel.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-16 22:22:34.786	Shooter,Arcade,Sports	https://x.com/sagarsaija	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171322/grokade-screenshots/Falling_Bubbles_20250310_203356.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172047/grokade-screenshots/Falling_Bubbles_20250310_202329.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172048/grokade-screenshots/Falling_Bubbles_20250316_155507.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172050/grokade-screenshots/Falling_Bubbles_20250316_160024.png	f
6cb521f3-5336-4f75-8bbb-9b67d8b7ba3f	Tank	Tank is a multiplayer tank game. Play with your friends or against them in this fast paced game.	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Tank_20250316_154542.webp	https://tank.cemilsevim.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Action,Fighting,Shooter	https://x.com/cemilsvm	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171298/grokade-screenshots/Tanks_AI_20250316_155956.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172061/grokade-screenshots/Tank_20250316_154633.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171539/grokade-screenshots/TankNarok_20250316_154646.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172064/grokade-screenshots/Tank_20250310_200527.jpg	f
83afb8c5-9e23-4fa8-9168-83decbd7978d	Fly Hi	Realistic flight simulator with a focus on realism and physics. Fly Hi is a game that allows you to experience the thrill of flying in a realistic way.	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Fly_Hi_20250316_154625.png	https://flyhi.netlify.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Simulation	https://x.com/donvito	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172087/grokade-screenshots/Fly_Hi_20250310_202253.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172097/grokade-screenshots/Fly_Hi_20250316_160210.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172106/grokade-screenshots/Fly_Hi_20250316_154625.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172110/grokade-screenshots/Fly_Hi_20250310_202559.png	f
d2bc2c08-c7b5-47b7-b45b-fa3b5b2e8f36	GTAi	A GTA-inspired game. Drive/walk around and explore the city in singleplayer mode	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/GTAi_20250316_154544.webp	https://gtai.wherenomadsgo.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Racing,Shooter,Action	https://x.com/fabianbuilds	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172112/grokade-screenshots/GTAi_20250310_202551.jpg	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172113/grokade-screenshots/GTAi_20250316_154544.jpg	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172114/grokade-screenshots/GTAi_20250316_160129.jpg	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172115/grokade-screenshots/GTAi_20250310_201622.jpg	f
9b149ef6-7d84-4edc-8283-8b5522ce3518	V1be city	Shoot enemies in a city in singleplayer mode	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/V1be_city_20250316_154545.webp	https://vibescity.manta.so/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Action,Shooter	https://x.com/gabriel__xyz	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172118/grokade-screenshots/V1be_city_20250316_154545.jpg	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172119/grokade-screenshots/V1be_city_20250310_200530.jpg	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172120/grokade-screenshots/V1be_city_20250310_200907.jpg	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172122/grokade-screenshots/V1be_city_20250310_201623.jpg	f
4b3fa1ed-a7fa-4185-9f03-519c76913aca	FlyVibe	Flappy Bird like game but with paper plane and different modes	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/FlyVibe_20250316_154548.webp	https://farez.github.io/flyvibe/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Strategy	https://x.com/farez	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172147/grokade-screenshots/FlyVibe_20250316_160132.jpg	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172147/grokade-screenshots/FlyVibe_20250316_154548.jpg	\N	\N	f
46250f21-9a73-4146-88f4-513a1c5f99d9	Tank Battle	Tank Battle	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171323/grokade-screenshots/Enhanced_Tank_Battle_Game_20250316_155746.png	https://vibegames.cc/browse/tank-battle	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Action,Fighting,Simulation	\N	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171323/grokade-screenshots/Enhanced_Tank_Battle_Game_20250316_155746.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172150/grokade-screenshots/Enhanced_Tank_Battle_Game_20250310_203406.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172152/grokade-screenshots/Enhanced_Tank_Battle_Game_20250310_202342.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172153/grokade-screenshots/Enhanced_Tank_Battle_Game_20250316_155920.png	f
18b64c24-3028-4d04-98e5-c4382f0c8cd0	Summer Afternoon	Beautiful chill exploration game with Ghibli nostalgia. Procedurally generated environment with chill music. Human made.	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Summer_Afternoon_20250316_154624.png	https://vlucendo.com/play/summer-afternoon	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Exploration	https://x.com/vlucendo	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172155/grokade-screenshots/Summer_Afternoon_20250310_202557.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172157/grokade-screenshots/Summer_Afternoon_20250310_202251.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172159/grokade-screenshots/Summer_Afternoon_20250316_154624.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172161/grokade-screenshots/Summer_Afternoon_20250316_160208.png	f
4bebe6a9-db56-453e-a85d-0400cb5a08f5	Slow Roads	Drive around the Scottish countryside in this beautifully made game. Human Made.	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Slow_Roads_20250316_154624.png	https://slowroads.io/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Racing	https://x.com/anslogen	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172163/grokade-screenshots/Slow_Roads_20250310_202558.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172165/grokade-screenshots/Slow_Roads_20250316_154624.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172167/grokade-screenshots/Slow_Roads_20250316_160209.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172170/grokade-screenshots/Slow_Roads_20250310_202252.png	f
61f434ad-2388-45de-b373-b561be63590b	Robotic Surge Shooter	Arcade style space shooter with a focus on fast-paced gameplay and smooth controls.	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Robotic_Surge_Shooter_20250316_154627.png	https://roboticsurge.itch.io/shooter	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Action,Shooter,Arcade	https://x.com/jagger_sa	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172188/grokade-screenshots/Robotic_Surge_Shooter_20250316_160211.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172189/grokade-screenshots/Robotic_Surge_Shooter_20250310_202254.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172190/grokade-screenshots/Robotic_Surge_Shooter_20250316_154627.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172192/grokade-screenshots/Robotic_Surge_Shooter_20250310_202600.png	f
3e78f568-8737-4c77-a46b-e326470acb70	XForce	Space shooter with a fast paced gameplay and a focus on skill and precision.	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/XForce_20250316_154629.png	https://xforcegame.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Action,Educational,Racing	https://x.com/Daniel_Farinax	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172194/grokade-screenshots/XForce_20250316_160212.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172197/grokade-screenshots/XForce_20250316_154629.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172200/grokade-screenshots/XForce_20250310_202255.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172202/grokade-screenshots/XForce_20250310_202601.png	f
24d8d342-b1d7-40ee-8ad4-6c5636c04661	Stick Cricket	Hardest game of cricket you'll ever play.	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Stick_Cricket_20250316_154630.png	https://stick-cricket.vercel.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Fighting	https://x.com/saikatkrdey	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172204/grokade-screenshots/Stick_Cricket_20250310_202256.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172207/grokade-screenshots/Stick_Cricket_20250316_160213.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172209/grokade-screenshots/Stick_Cricket_20250316_154630.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172211/grokade-screenshots/Stick_Cricket_20250310_202602.png	f
a3235777-29c9-418d-8b3d-bec551b9e174	Open Road	Drive or Fly around the world in this open world game. Choose your own mode of travel.	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Open_Road_20250316_154631.png	https://openroad-game.vercel.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Exploration,Racing	https://x.com/aaronbesson	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172213/grokade-screenshots/Open_Road_20250316_154631.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172214/grokade-screenshots/Open_Road_20250310_202603.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172216/grokade-screenshots/Open_Road_20250310_202257.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172217/grokade-screenshots/Open_Road_20250316_160214.png	f
2bfa4820-05e8-429d-91db-fd43914f98f9	Swim Around	Swim around the world in this open underwater world game	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Swim_Around_20250316_154631.png	https://swimaround.io/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Action	https://x.com/RyanEndacott	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172219/grokade-screenshots/Swim_Around_20250310_202258.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172221/grokade-screenshots/Swim_Around_20250316_154631.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172222/grokade-screenshots/Swim_Around_20250310_202603.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172224/grokade-screenshots/Swim_Around_20250316_160215.png	f
c60de4b9-bb22-4b66-ba31-8a6754f8a876	Space Balls	Fast paced game of command and destruction. Command an army of units and destroy smaller units to grow your army.	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Space_Balls_20250316_154632.png	https://spaceballs.io/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Strategy,Racing,Sports	https://x.com/IndieJayCodes	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172225/grokade-screenshots/Space_Balls_20250316_160216.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172226/grokade-screenshots/Space_Balls_20250316_154632.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172228/grokade-screenshots/Space_Balls_20250310_202604.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172229/grokade-screenshots/Space_Balls_20250310_202258.png	f
86c45ba5-ab0f-452b-b1e8-877a898bec14	Pixel2DFight	Fast paced arcade shooter. Shoot the squares and grow your score.	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Pixel2DFight_20250316_154638.png	https://pixel2dfight.vercel.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-16 22:46:57.149	Action,Arcade,Shooter	https://x.com/bladeemaxxi	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172231/grokade-screenshots/Pixel2DFight_20250316_154638.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172232/grokade-screenshots/Pixel2DFight_20250310_202609.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172234/grokade-screenshots/Pixel2DFight_20250310_202304.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172236/grokade-screenshots/Pixel2DFight_20250316_160221.png	f
408320e2-1adb-470a-b015-6e39bf8a5990	Racing Cart	Race around the track, but be sure not to hit the kerb!	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Racing_Cart_20250316_154644.png	https://racingcart.vercel.app	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-17 19:29:16.528	Racing	https://x.com/pat_codes	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171229/grokade-screenshots/Racing_Cart_20250316_160228.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171637/grokade-screenshots/Racing_Cart_20250316_154644.png	\N	\N	f
eccd75c9-812b-4464-b542-8dc1c4fa94f9	WW2 Dogfight Arena	Most beautiful multiplayer dogfight game. Play with your friends or against them in this fast paced game.	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/WW2_Dogfight_Arena_20250316_154634.png	https://fly.zullo.fun/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-17 19:41:34.534	Fighting,Action,Racing	https://x.com/NicolasZu	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171849/grokade-screenshots/WW2_Dogfight_Arena_20250310_202301.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171851/grokade-screenshots/WW2_Dogfight_Arena_20250316_160218.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171853/grokade-screenshots/WW2_Dogfight_Arena_20250310_202606.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171856/grokade-screenshots/WW2_Dogfight_Arena_20250316_154634.png	f
7f37cb28-0731-4c2a-b1b9-16cd56a57367	Hot Air Balloon	Take a chill ride on a hotair baloon amoung the snowy mountains	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Hot_Air_Balloon_20250316_154547.webp	https://www.hotairvibe.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-17 19:41:34.534	Sports	https://x.com/SieversJosua	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172126/grokade-screenshots/Hot_Air_Balloon_20250316_154547.jpg	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172127/grokade-screenshots/Hot_Air_Balloon_20250310_200532.jpg	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172128/grokade-screenshots/Hot_Air_Balloon_20250310_202554.jpg	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172129/grokade-screenshots/Hot_Air_Balloon_20250316_160223.png	f
9359a360-70c0-43ad-bceb-9912f7d134da	Flee Battle	Flee the battle!	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171306/grokade-screenshots/Flee_Battle_20250310_203340.png	https://languagedungeon.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:22:34.786	2025-03-17 19:42:50.818	Action,Fighting	https://x.com/maxhertan	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171306/grokade-screenshots/Flee_Battle_20250310_203340.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171990/grokade-screenshots/Flee_Battle_20250316_155716.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171991/grokade-screenshots/Flee_Battle_20250310_202412.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171993/grokade-screenshots/Flee_Battle_20250316_155718.png	f
193935c5-ac96-4664-bcc0-9869b84e1548	Wildy Royale	Join a team or play alone and defend against waves of zombies in this first-person battle royale game.	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Wildy_Royale_20250316_154636.png	https://www.wildyroyale.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-17 22:19:40.469	Action,Fighting,Sports	https://x.com/nathansrobinson	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171775/grokade-screenshots/Wildy_Royale_20250310_202608.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171778/grokade-screenshots/Wildy_Royale_20250310_202302.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171781/grokade-screenshots/Wildy_Royale_20250316_154636.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171783/grokade-screenshots/Wildy_Royale_20250316_155702.png	t
20f4e68a-8d53-454a-a405-d40fa30e4674	Race Viberz	Race around the track with your mates!	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Race_Viberz_20250316_154641.png	https://raceviberz.vercel.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-17 22:20:08.614	Racing	https://x.com/LoukilAymen	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172264/grokade-screenshots/Race_Viberz_20250316_154641.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172266/grokade-screenshots/Race_Viberz_20250310_202307.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172268/grokade-screenshots/Race_Viberz_20250316_160225.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172270/grokade-screenshots/Race_Viberz_20250310_202612.png	t
91698f39-9bc5-464f-8aaf-e73a8a0f3cea	Arcade City	This is a game within a game. You could just fly around the neon city and then do some speed racing on a 3d track!	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Arcade_City_20250316_154644.png	https://arcade.0xrome.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-17 23:30:44.919	Racing,Arcade	https://x.com/0xRome	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171227/grokade-screenshots/Arcade_City_20250316_160227.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171626/grokade-screenshots/Arcade_City_20250310_202615.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171631/grokade-screenshots/Arcade_City_20250316_154644.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171634/grokade-screenshots/Arcade_City_20250310_202310.png	t
1c44b058-5546-4826-ae5b-262763ad2a31	Escape Prison Cell	Well designed and executed escape room. It's harder than you think	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Escape_Prison_Cell_20250316_154642.png	https://escape.puzzlesunlocked.com	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-18 06:53:57.996	Puzzle	https://x.com/jamesckemp	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171293/grokade-screenshots/Escape_Prison_Cell_20250310_202308.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171942/grokade-screenshots/Escape_Prison_Cell_20250316_154642.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171944/grokade-screenshots/Escape_Prison_Cell_20250316_160225.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171947/grokade-screenshots/Escape_Prison_Cell_20250310_202613.png	f
8074fbb7-fe43-4c9b-aa2b-839438670652	Cowboy	Gallop through a wild west street and shoot at things!	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Cowboy_20250316_154626.png	https://pseudokid.itch.io/cowboys	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-17 22:06:50.32	Action,Shooter	https://x.com/pseudokid	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171713/grokade-screenshots/Cowboy_Shooter_20250316_155637.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171715/grokade-screenshots/Cowboy_Shooter_20250316_160104.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171716/grokade-screenshots/cowboy_shooter_20250310_200904.jpg	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171717/grokade-screenshots/cowboy_shooter_20250316_154541.jpg	t
2272eed7-d25d-496f-aece-6aa7cbaac8bd	Vibe Sail	Chill out and sail the waves in this relaxing game. Vibe Sail is a simple, calming game that allows you to relax and enjoy the beautiful scenery.	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171239/grokade-screenshots/Vibe_Sail_20250316_160207.png	https://vibesail.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-17 22:06:50.648	Arcade,Simulation	https://x.com/NicolaManzini	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171239/grokade-screenshots/Vibe_Sail_20250316_160207.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171670/grokade-screenshots/Vibe_Sail_20250316_155531.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171672/grokade-screenshots/Vibe_Sail_20250310_202556.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171674/grokade-screenshots/Vibe_Sail_20250310_203404.png	t
708299c8-25f6-45c6-ad30-3dc8592775d4	TankNarok	Multiplayer tank battle game where you compete against other players in real-time combat. Maneuver your tank, avoid enemy fire, and destroy your opponents!	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/TankNarok_20250316_154646.png	https://tanks.rpaby.pw/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-17 22:06:50.801	Fighting,Action,Shooter	https://x.com/paulwes_pw	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171539/grokade-screenshots/TankNarok_20250316_154646.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171541/grokade-screenshots/Tanknarok_20250316_155457.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171542/grokade-screenshots/TankNarok_20250316_160229.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742171544/grokade-screenshots/Tanknarok_20250316_155815.png	t
054009be-8fa3-4bdb-a853-57f5c355583f	PingPongAI	Ping Pong game	https://res.cloudinary.com/dxow1rafl/image/upload/v1741710569/grokade-screenshots/game_66_1741710568864_PingPongAI_20250310_095514.png.png	https://pingpongai.vercel.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 02:13:33.759	2025-03-17 22:19:40.469	Arcade	\N	\N	\N	\N	\N	f
bfbf5cd7-c44b-4054-a1a8-71455c04f29d	Surviber FPS	Endless Horde Survival Shooter. It's more difficult than it looks	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Surviber_FPS_20250316_154640.png	https://surviber-fps.vercel.app/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-17 22:20:08.614	Shooter,Action,Survival	https://x.com/0xyardev	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172258/grokade-screenshots/Surviber_FPS_20250310_202307.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172259/grokade-screenshots/Surviber_FPS_20250316_154640.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172261/grokade-screenshots/Surviber_FPS_20250310_202612.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172262/grokade-screenshots/Surviber_FPS_20250316_160224.png	t
8d3ebac9-6a26-4269-96c4-d6da0514d5b1	ShellShock Showdown	Tank shooter FPS, driver around and unleash mayhem!	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/ShellShock_Showdown_20250316_154639.png	https://shellshockshowdown.itch.io/game	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-17 23:30:22.459	Shooter,Action,Racing	https://x.com/what_the_func	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172242/grokade-screenshots/ShellShock_Showdown_20250310_202610.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172250/grokade-screenshots/ShellShock_Showdown_20250316_160222.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172253/grokade-screenshots/ShellShock_Showdown_20250310_202305.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172256/grokade-screenshots/ShellShock_Showdown_20250316_154639.png	f
bbbf2d80-4dba-4faf-a777-09cb88159bc1	Fly Pieter	A fun free-to-play MMO flight sim, 100% made with Al, without loading screens and GBs of updates every time you wanna play. OG	https://res.cloudinary.com/dxow1rafl/image/upload/v120250316/grokade-screenshots/Fly_Pieter_20250316_154622.png	https://fly.pieter.com/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	2025-03-16 22:46:57.149	2025-03-17 22:25:41.098	Simulation	https://x.com/levelsio	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172053/grokade-screenshots/Fly_Pieter_20250310_202250.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172054/grokade-screenshots/Fly_Pieter_20250316_160206.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172056/grokade-screenshots/Fly_Pieter_20250310_202556.png	https://res.cloudinary.com/dxow1rafl/image/upload/v1742172058/grokade-screenshots/Fly_Pieter_20250316_154622.png	t
\.


--
-- Data for Name: page_views; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.page_views (id, path, "userId", "userAgent", referer, "timestamp") FROM stdin;
e36cd4fa-cb02-4d53-ac82-b2b92a5afbe7	/	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0.6778.0 Safari/537.36		2025-03-18 04:20:26.81
f43c83ce-7b45-4a44-a151-ffb473131c00	/	\N	Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Mobile Safari/537.36 Chrome-Lighthouse		2025-03-18 04:20:29.913
464d1c10-0895-49d7-bb1c-204e07ffbb87	/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:25:07.84
64b89a8a-0181-40a4-bdfa-8eefa50fb2e2	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:25:08.223
82d21835-8144-4fb1-b3f2-389efa4eb56e	/admin/analytics/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:29:00.949
b5d13347-895b-4ce9-9699-a6a814807e9f	/admin/analytics/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:29:02.379
20bef97e-6943-4a03-a138-921da87ee927	/dashboard/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:29:13.175
c81a8088-84d6-43a7-a725-0269e31bbc0e	/admin/analytics/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:29:21.667
05bd374f-fb5b-43ab-bd5f-4cf760c1229d	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:29:58.996
47eeef54-3a85-4d5c-a593-aced252e34b6	/	\N	Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Mobile Safari/537.36 Chrome-Lighthouse		2025-03-18 04:30:00.119
2491c59f-6d84-4cd8-833a-f2e7fa752c77	/game/bf456723-0c50-448d-9732-623f581da6a0/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/	2025-03-18 04:30:05.781
2ca29689-236e-4f92-9f43-1665625950b2	/game/bf456723-0c50-448d-9732-623f581da6a0/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/	2025-03-18 04:30:06.737
64474016-ff9d-4023-aeff-51538d4eb348	/coming-soon/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/	2025-03-18 04:30:14.083
8601882e-7a9c-4f4b-9908-1048f3df23d1	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/	2025-03-18 04:30:15.625
a1ebaa7a-f46c-4ac8-8aad-bed2b7741078	/coming-soon/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/	2025-03-18 04:30:16.311
35b2d4ab-740b-487f-aa3d-15f76d1d27ed	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/	2025-03-18 04:30:18.73
072b6073-de30-438a-9a77-c5af462f2bbf	/admin/analytics/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:32:33.473
90baab7e-4896-4e59-be48-f19c37da397d	/admin/analytics/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:32:33.71
d4fe98fd-d8b4-4e9d-98ae-4c8b8d18452b	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:35:05.201
9aa108ac-f625-4880-9679-863d85f8281e	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:35:20.348
9a5a2c65-5cc5-4d39-8520-bd9120905428	/	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0.6778.0 Safari/537.36		2025-03-18 04:35:35.829
f80611cb-a54a-47a0-ba8c-9b3033f1ced1	/	\N	Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Mobile Safari/537.36 Chrome-Lighthouse		2025-03-18 04:35:37.797
cdd70e11-39ec-48ef-a719-ebf3e5830561	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:35:49.433
13943f97-c8fe-47ba-ae5e-d8880918d028	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:35:50.505
fcc62dfa-4678-4884-9e65-1bc3a41c0084	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:35:51.445
8f984ee6-75ef-44ce-b574-f64f485abb09	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:35:52.019
4743bb5d-89fc-46b5-ac38-eaf33dd7e6be	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:35:52.683
04168ac4-2745-4373-9121-3ec042843e4b	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:35:53.107
17965c79-2a3f-42ec-b3b5-0f57a4726ec9	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:35:53.53
00e0c637-838e-4d1b-afda-0bb9c942516f	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:35:53.938
31e2a786-7f72-46f7-8a2a-fb8d77f4bb96	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:35:54.253
928c0c24-c382-49d2-a243-6964dd834de0	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:35:54.674
9fb0e461-a817-4939-a8f6-9a5e6b514c58	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:35:55.208
d68ad6e2-eb92-4e58-966f-a91259a64cc1	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:35:55.703
6c86d43a-1872-46fb-8db7-3037c8f3bcde	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:01.491
601c7bdf-e9ed-485c-b16c-ca6e2340c320	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:01.854
7c7e9cf4-b46a-44a1-ac15-8047adb9f316	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:03.592
c945dda7-4c5a-43d0-b67f-f16fe3bfadfe	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:06.792
da276a10-d13e-491a-8914-4bd3e778f374	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:16.547
aca007f9-1d66-4fb8-a31c-f14b99b7588d	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:18.233
9e5abfe2-0a7b-42a0-a915-7576759b5c83	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:21.907
0f83be65-3a05-420a-a89f-b208ffbf5d5d	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:03.986
d00d7c5a-a5a8-40f1-b96a-aecb5d7745fe	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:12.466
3928ac4d-b041-4580-b253-d842ec5e9e53	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:20.131
338b36f0-6e6e-4a30-a2f7-dd8a70a4c9d6	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:07.25
9a7bf2a9-1497-4899-8e1d-7e7a6f18af01	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:09.385
870d29e6-3fe8-485a-a9e7-f39860ad53d9	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:09.731
73a2084d-d82b-4b8f-b5ad-68906432af69	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:16.164
8500f1b0-79b6-4881-9d51-72483df093bb	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:17.854
cdbf1aec-c575-445f-bf6f-680f6dcd8f84	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:22.303
2b985a29-a2b2-47e5-898c-340567879295	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:12.839
e7fadc27-daf1-4252-a0a3-23f0e5f29821	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:14.354
cb3c54a9-a508-414e-a439-decc5598eeb7	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:14.667
074db805-7daf-4178-ad06-fbe8aea7dad4	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:36:20.61
34772a3a-23e0-4aa4-96d1-036a0c89da47	/admin/analytics/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:39:01.122
5eb907b5-2d65-49ba-9fbd-0c43dae2e773	/admin/analytics/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:39:01.715
0b0efcbe-80a7-4704-92cd-ba1b40544645	/admin/analytics/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:39:04.863
82ff2566-1ca8-4967-857d-237e694e05b5	/admin/analytics/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 04:39:05.271
7581ae5d-e2af-4342-afc5-f52f10e14308	/	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.6943.141 Mobile Safari/537.36		2025-03-18 04:55:52.748
2693098e-5046-4bb3-93df-2280461cb0cf	/	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.6943.141 Mobile Safari/537.36		2025-03-18 04:55:56.251
9cec64f0-0438-43d4-8141-f8aef6be2264	/	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0.6778.0 Safari/537.36		2025-03-18 05:02:20.454
e7a7aa6f-584e-4eb1-b35f-53e061b38bcc	/	\N	Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Mobile Safari/537.36 Chrome-Lighthouse		2025-03-18 05:02:23.522
9cd9f666-8de5-494a-a45f-ab2f7b517d17	/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:03:12.767
98087a11-d21d-43bb-8861-aae90ac34890	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:03:13.407
5c9c51ba-5fa2-46c7-b71d-6403d492ba34	/	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.6943.141 Mobile Safari/537.36		2025-03-18 05:06:44.583
b25a64be-c4d7-4182-8070-cbb2c279b629	/	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.6943.141 Mobile Safari/537.36		2025-03-18 05:08:19.04
05afb2f9-4c77-4292-bb6a-0a852b29816b	/	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0.6778.0 Safari/537.36		2025-03-18 05:11:06.178
a6d90e6b-8d2c-4271-a401-a838a63202d4	/	\N	Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Mobile Safari/537.36 Chrome-Lighthouse		2025-03-18 05:11:06.867
079563c5-00d0-4328-9dd7-173e81a14fac	/	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.6943.141 Mobile Safari/537.36		2025-03-18 05:11:07.774
e396e27c-05fa-42b0-b772-eacb7e7415c0	/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:11:14.299
5ac64d70-2d89-4713-8a2a-8e336c7e5bbe	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:11:14.593
8215896f-61e0-42f6-9976-794b9061f9f7	/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15	https://grokade.com/game/13a9b6f6-0b5b-416b-ab9e-3e143dd6bfce/	2025-03-18 05:13:15.896
2b4571b3-1b29-4889-b360-41ee2cf117da	/game/9b149ef6-7d84-4edc-8283-8b5522ce3518/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15	https://grokade.com/game/13a9b6f6-0b5b-416b-ab9e-3e143dd6bfce/	2025-03-18 05:13:35.747
4e2e391c-a1b0-4b84-bf63-ea48080c6b43	/	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0.6778.0 Safari/537.36		2025-03-18 05:14:35.867
ffd38dd9-c531-4c1d-88a4-dc181852be0b	/	\N	Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Mobile Safari/537.36 Chrome-Lighthouse		2025-03-18 05:14:38.465
eca4be1f-7491-48c2-ba4c-adf4f5c651bb	/	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.6943.141 Mobile Safari/537.36		2025-03-18 05:14:38.989
48451b61-e823-4fbf-9954-655364ca15d6	/	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.6943.141 Mobile Safari/537.36		2025-03-18 05:14:55.924
68c4fe62-c0d1-4363-af30-9179e0c6969e	/	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.6943.141 Mobile Safari/537.36		2025-03-18 05:16:46.146
61efd12d-e8fa-4547-8f9b-b80c0452470d	/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:19:44.66
462fb10d-6ecd-4a05-a895-27916b98dac3	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:19:45.642
d8fc86db-cefc-4406-97b2-062f631133a8	/	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.6943.141 Mobile Safari/537.36		2025-03-18 05:20:10.937
9a90b7d3-698e-4718-b6f5-71e16704036e	/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:20:32.245
cf9f706a-a27d-46ea-8820-89866b4220c8	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:20:32.763
d14f07d3-aed7-402b-ada5-4b10f64bc440	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:22:21.288
fde6d7d0-6697-43f0-aac1-88934df842a6	/	\N	Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Mobile Safari/537.36 Chrome-Lighthouse		2025-03-18 05:22:23.284
23e9bc24-797d-4814-8f27-113a70104f27	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:24:01.877
1e43b5b2-3196-4501-83b8-ff4091990cdb	/rankings/	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/134.0.0.0 Safari/537.36 Prerender (+https://github.com/prerender/prerender)		2025-03-18 05:27:15.053
6d023459-da70-4ea6-8da8-57683e213016	/rankings/	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/134.0.0.0 Safari/537.36 Prerender (+https://github.com/prerender/prerender)		2025-03-18 05:27:17.081
5aa870ca-b67b-4bd7-b849-55592f5e2470	/	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.6943.141 Mobile Safari/537.36		2025-03-18 05:30:38.765
adc59e2f-80cb-4e8c-bb53-3312dfd6d514	/game/bfbf5cd7-c44b-4054-a1a8-71455c04f29d/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:32:02.251
be5f6b64-86b8-4f6e-8368-2403819d8279	/game/bfbf5cd7-c44b-4054-a1a8-71455c04f29d/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:32:02.597
bc5ddf38-88b7-446c-a66e-818398c9c21d	/rankings/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:32:07.944
4e305cc5-001f-4fdf-9842-ed7b6e85ac90	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:32:09.292
24044082-8cef-40f9-b004-c9105ef38eef	/game/30cdfe59-56b7-4ea4-8f20-c975698e4541/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:32:15.227
386eb063-7728-489c-9373-7fcba7d3d228	/game/30cdfe59-56b7-4ea4-8f20-c975698e4541/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:32:15.707
db376ac7-c965-4740-9076-93ac30e16730	/rankings/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:32:22.045
8baae262-7971-48b3-bd0f-14713329ce4b	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:32:22.5
21786611-69f1-4bfd-9bfc-75b2fd748a9e	/game/bfbf5cd7-c44b-4054-a1a8-71455c04f29d/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:32:34.036
4d9d94a8-b54f-4dfc-bebf-6fc53bd4442d	/game/bfbf5cd7-c44b-4054-a1a8-71455c04f29d/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:32:34.544
f454a0cd-8c60-4e64-b320-aa7eaa1ed1c3	/rankings/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:32:41.674
ac45a86c-244f-42b6-8c09-49b1c4056d17	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:32:42.029
f04cffa7-0418-48ea-b596-959b1f4c4565	/game/bf456723-0c50-448d-9732-623f581da6a0/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:32:47.929
7c1833bd-158d-4524-a89f-b7cf4c5b88f4	/game/bf456723-0c50-448d-9732-623f581da6a0/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:32:48.79
acd4c603-a26a-4fc6-953b-a965327e09a3	/rankings/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:32:56.777
4a64945e-d53a-44d2-a8a7-00d2adb648e7	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:32:57.222
057e88a4-9a33-4dcf-8bd7-e3150c0ae2ec	/game/13a9b6f6-0b5b-416b-ab9e-3e143dd6bfce/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:33:04.998
71f9d53e-fe51-4dea-a6c2-c0845648816b	/game/13a9b6f6-0b5b-416b-ab9e-3e143dd6bfce/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:33:05.494
b2720f2d-454d-4d03-8b8d-d1d60ecd4fa6	/rankings/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:33:15.623
f096a171-e97a-4b28-83f8-89daab80a5d6	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:33:16.004
6dcb1d1d-f144-4879-940b-44a633661e43	/game/162a11b3-6138-4540-86ae-f50619bac7f4/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:33:24.555
5d74a94c-c7e5-45b1-a117-63fc5d6bde4d	/game/162a11b3-6138-4540-86ae-f50619bac7f4/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:33:25.042
8098cbd6-ec58-40a0-9a25-60f847f25873	/rankings/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:33:34.82
732e1684-52d3-4330-b4bf-8a29b996b471	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:33:35.186
9644356c-f1fb-4617-84ee-dda0c696e1a0	/game/bbbf2d80-4dba-4faf-a777-09cb88159bc1/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:33:39.016
9f720edd-4cb7-44e3-8c04-feb2ca77324a	/game/bbbf2d80-4dba-4faf-a777-09cb88159bc1/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:33:39.437
0defb6f1-7088-4d84-a7ae-a8cbe1c4f318	/rankings/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:34:09.907
b4b55335-df1d-47b2-afaa-a736040c2529	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:34:10.32
b032936b-45ee-46ef-92e0-72047ba95761	/rankings/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:34:24.094
200dc449-d406-45ff-b495-a408edf717e1	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:34:24.597
d0416b52-8962-4425-8850-71a07868cc27	/game/20f4e68a-8d53-454a-a405-d40fa30e4674/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:34:35.477
0ad15e63-5bae-497f-94f2-ac166d44a055	/game/20f4e68a-8d53-454a-a405-d40fa30e4674/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:34:35.969
b3c0adbe-e6e7-40a1-950f-414f3f81ccab	/game/708299c8-25f6-45c6-ad30-3dc8592775d4/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:36:45.953
855f386c-6695-482d-b3ae-269523757c66	/rankings/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:37:03.193
defbbc6e-a9ee-4dfb-8f2c-3e985545437b	/rankings/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:34:43.285
de58a7ba-ffdc-4eae-9b54-5eac1d41bfb2	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:34:43.644
aaa1e926-3754-4df1-b7d5-bbce6321cfa7	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:34:56.827
cda28cf0-8d66-4aef-b751-ae35e9585e27	/game/1c44b058-5546-4826-ae5b-262763ad2a31/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:34:49.65
cd39a040-d55d-4645-b235-89ddd79c87b2	/game/1c44b058-5546-4826-ae5b-262763ad2a31/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:34:50.076
1651a1b9-cea0-4b09-896d-1791244bba76	/rankings/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:34:56.408
b982421b-12e8-4428-9204-29db92d02368	/game/59aee7d1-1d45-4386-a3e4-c164cc4de46d/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:35:06.592
5b76ac10-8fd8-4cca-a476-79516c185f66	/rankings/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:36:26.129
039ecc3c-bd18-49a6-b2aa-228d751dda83	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:36:26.516
7ff684bf-6c4f-4794-a830-42dcdd0f0f77	/rankings/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:36:36.628
fa0d7266-f5e0-4e38-84c7-7ce4a372df56	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:36:37.069
72bcff7c-c907-4666-a9b6-473ec1e08d89	/game/708299c8-25f6-45c6-ad30-3dc8592775d4/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 05:36:45.553
f18c4ffa-15ae-4d4d-9f62-9c928f6e2fd0	/rankings/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:36:55.878
db1f4797-d27b-4503-a620-ed6df96b0bec	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:36:56.224
ce39c1fd-9557-4912-9498-f7a11a479de3	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:37:03.712
cf4f7c73-8447-482b-ae2c-05283f39ece7	/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://t.co/QhPNhmOEOr	2025-03-18 05:47:24.413
2e00a379-14e2-469f-9a49-f69d3b7b1201	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://t.co/QhPNhmOEOr	2025-03-18 05:47:24.661
53534ca5-bdd7-4f48-9ecd-bb0f67f83166	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://t.co/QhPNhmOEOr	2025-03-18 05:47:29.922
054f1dea-1d42-4fd6-82f7-19ab7d37f6fb	/	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.6943.141 Mobile Safari/537.36		2025-03-18 05:48:37.874
6d472a2d-7648-41d7-9206-d6e7731c1015	/	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0.6778.0 Safari/537.36		2025-03-18 05:51:46.667
94e772cb-2a7d-41c3-8948-684b9a58d3b8	/	\N	Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Mobile Safari/537.36 Chrome-Lighthouse		2025-03-18 05:51:47.154
fc77b0bf-a811-4f57-a555-3193b70e6654	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 05:55:37.469
a8128b28-78a2-4ca1-aa12-3419ae3aba82	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:00:32.152
f0f8ae42-9501-4f80-9ef0-92728bdf8a97	/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 06:02:35.676
702933a2-8b47-4440-b50e-57dbcd81c86a	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 06:02:35.977
2d4034e7-0e8d-45ff-9497-8a79ecf5c1c4	/	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1		2025-03-18 06:04:43.269
6ee1c81f-56d7-4721-88e8-a85f9368dd3b	/rankings/	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1		2025-03-18 06:05:04.702
5108f359-0cc3-4d58-9fbf-72e652dfd2e1	/rankings/	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	https://t.co/	2025-03-18 06:05:19.463
734b6648-f313-4697-a645-5ca297d114a3	/game/1c44b058-5546-4826-ae5b-262763ad2a31/	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	https://grokade.com/rankings/	2025-03-18 06:05:29.259
1945e6b2-e9c2-4c2d-8d38-3eadf240bd03	/game/13a9b6f6-0b5b-416b-ab9e-3e143dd6bfce/	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	https://grokade.com/rankings/	2025-03-18 06:05:47.501
cc71deba-4835-4d1a-855e-b41a66077828	/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:07:30.882
ef9a8f42-c69d-4b9f-b1cc-6175b4fe836b	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:07:31.387
08ddb298-1969-4492-b2be-491a52241d31	/about/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://t.co/QhPNhmOEOr	2025-03-18 06:09:04.123
63650785-277d-4753-9aa9-d23532047ee6	/	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0.6778.0 Safari/537.36		2025-03-18 06:10:26.391
b6008343-21f5-4d49-a01c-78eaca6c6737	/	\N	Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Mobile Safari/537.36 Chrome-Lighthouse		2025-03-18 06:10:30.1
857877e6-b5a9-4441-b5f5-59880ed7e4da	/	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0.6778.0 Safari/537.36		2025-03-18 06:12:41.819
12c5b034-1c30-4a5b-9bc0-e9ae7bae483a	/	\N	Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Mobile Safari/537.36 Chrome-Lighthouse		2025-03-18 06:12:41.995
a6f4acd7-ccf6-4bfc-8f11-7d18d3bbd54d	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/	2025-03-18 06:16:28.894
af40d9e0-5657-4a37-84b4-f92cccf64216	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/	2025-03-18 06:16:29.269
530a1fc5-4fa6-4445-b2b5-a3abdb8213c2	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:16:41.849
1695911e-0768-4dd9-9323-864e9933ab9e	/game/d5663aac-ae60-473b-b36d-d00b4504dcc2/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:16:42.999
5cb1b51e-188c-4049-a9b6-3fbedda57d0e	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:21:13.13
0a2dbdde-a7e0-4ba2-b5de-2262a14a1be8	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:21:14.03
18483af3-4149-4fe5-ba1c-f1efae9e22cc	/rankings/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:21:19.182
44691ac0-7b60-4bda-ae5c-aa3815104ad0	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:21:19.538
8e3d3174-0633-4164-9e3e-4c044d71cbdf	/rankings/	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	https://t.co/	2025-03-18 06:26:11.04
56a37e17-b6d0-481d-973b-a60602ea1ed8	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 06:27:22.434
f68bb3b9-aabe-40e6-bedb-588dbc8613fd	/game/1c44b058-5546-4826-ae5b-262763ad2a31/	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	https://grokade.com/rankings/	2025-03-18 06:27:42.423
b7f86ff8-30d5-40c0-a8c5-781417c30642	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://t.co/QhPNhmOEOr	2025-03-18 06:30:14.911
8b15a576-1ac3-4570-96e2-3f55e0b2b25c	/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 06:38:28.789
add242cc-69fa-456a-8e03-146a32b52f97	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 06:38:30.241
8d544b88-aee2-4174-9f37-f2f1173b38f4	/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:38:38.786
7b86afc6-3dd4-4bc6-9d94-e69d00f9bfc2	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:38:39.381
f2f07ebf-f11e-4f05-b41f-994bbe292d41	/game/13a9b6f6-0b5b-416b-ab9e-3e143dd6bfce/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:39:03.513
673176ad-7885-4206-8e8f-b7c1320626bb	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:39:09.684
547afc8f-9de7-4db6-9a3e-c8342c479481	/	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0.6778.0 Safari/537.36		2025-03-18 06:42:04.593
44ed6885-fe82-4a42-9db4-4d6d929bedd7	/	\N	Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Mobile Safari/537.36 Chrome-Lighthouse		2025-03-18 06:42:07.778
0aa200b3-814e-4bf2-80fb-532007fa111c	/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:42:31.408
b8f09f0c-fbe3-4a93-b0c1-059e0e34523a	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:42:31.983
868c1c35-203d-456f-b5b5-18d013a1db67	/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:44:34.344
338ca6cb-f705-4e99-b67f-3373ed89f063	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:44:34.766
e1e6c862-e7ea-4c5e-a222-b15be98b5dba	/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://www.linkedin.com/	2025-03-18 06:44:55.019
d1c82ce9-0e79-47e9-8e43-318e424fa8ea	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://www.linkedin.com/	2025-03-18 06:44:55.639
3c7b0551-127d-4ae1-9c6c-2453d0345fd0	/coming-soon/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 06:45:45.11
80611d3e-adf9-4a27-aa9a-464b5be248de	/coming-soon/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 06:45:45.605
4765a453-ebf4-4a84-90bc-986e09b5710b	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 06:45:46.365
7b493a24-b014-4c4b-877b-e02344f77a08	/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:48:28.412
31b05746-e252-4dae-b9f5-62bbeb88da57	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:48:29.568
14b0d3de-0e0f-4825-85d5-71f8564a815c	/game/d5114658-91f6-4b1f-834d-be49235e419c/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:49:00.342
c98cecc8-cc5b-4795-9fd4-24b8a93be83b	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:49:02.977
2ffa5d50-7808-4414-8788-04377a0175ee	/game/d5114658-91f6-4b1f-834d-be49235e419c/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:49:12.804
4096e6d7-25aa-416b-88c5-4b93347891cf	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:49:14.887
fca43e72-f101-4ac3-a713-10a7da967082	/game/d5114658-91f6-4b1f-834d-be49235e419c/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:49:19.959
50538246-3f4e-428b-a598-dd348fd8495d	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:49:22.696
0a1b47fb-4ae9-4ca4-a5f4-92194aa3503d	/rankings/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:52:15.9
981b0812-d3f9-42ee-9780-316b05ea7da9	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:52:16.461
cfd753c8-f8ca-4817-9e34-51a0901d5f35	/rankings/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:52:29.308
ca269932-2e34-4e02-a864-3ea74a2bb282	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:52:29.732
9af47a9c-e344-44dd-8a78-baba5ab9e70f	/game/1c44b058-5546-4826-ae5b-262763ad2a31/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 06:52:57.776
4b3af8c4-ae1a-4a83-874a-9e33edd4c5b0	/game/1c44b058-5546-4826-ae5b-262763ad2a31/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 06:52:58.022
77fed6b6-7111-44a6-b888-5ab5e622d703	/game/1c44b058-5546-4826-ae5b-262763ad2a31/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:54:12.525
221648a9-5a70-4144-97dd-5502bb1542df	/game/1c44b058-5546-4826-ae5b-262763ad2a31/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:54:13.556
fecf6fae-b0bd-4ef9-9cd8-b7cdb57fb734	/game/c60de4b9-bb22-4b66-ba31-8a6754f8a876/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://www.linkedin.com/	2025-03-18 06:55:18.666
f3eaa42a-75a6-460e-bd16-fda125765a89	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://www.linkedin.com/	2025-03-18 06:55:22.731
3c110b4f-2245-4eb5-ab20-bf6cb383ca69	/game/0dd8000b-48c2-4f63-addc-f4e908dd939e/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://www.linkedin.com/	2025-03-18 06:55:37.023
40d15225-758f-41a9-b94e-a11290532050	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36		2025-03-18 06:56:05.903
1bee2acb-c62f-4a10-9169-587000d910e9	/	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0	https://t.co/QhPNhmOEOr	2025-03-18 06:56:31.167
715d244e-b303-4c19-8d14-bcc3809b3ba3	/rankings/	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0	https://t.co/QhPNhmOEOr	2025-03-18 06:56:50.382
5e3795bf-7ff6-4143-b17b-bf4adae2a14b	/game/708299c8-25f6-45c6-ad30-3dc8592775d4/	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0	https://grokade.com/rankings/	2025-03-18 06:57:02.582
0edce932-16c4-40f4-a486-39da391ef982	/	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 06:58:15.245
8ef94f96-ad63-4983-ab23-00eb010d4635	/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 06:58:15.757
a25e5f01-2a0d-403c-afce-f01c8ada8173	/rankings/	a6c246ae-f84b-4c43-87b4-05db6b55afc3	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	https://grokade.com/rankings/	2025-03-18 06:59:24.908
c4e7f19c-50f3-47ed-b58f-4eeb3f706824	/login/	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0	https://grokade.com/rankings/	2025-03-18 07:02:52.463
c299b1c4-9b8e-4867-9b22-351259fe2d38	/register/	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0	https://grokade.com/rankings/	2025-03-18 07:02:54.487
3af4c46b-ef59-4087-a66d-9290f3110bc1	/	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0	https://grokade.com/rankings/	2025-03-18 07:04:45.731
7873c4fd-7063-4903-9a6f-9ded3e8fb1e2	/login/	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0	https://grokade.com/rankings/	2025-03-18 07:05:25.509
052132c2-5d66-4006-a70d-0390385a922c	/login/	bc7ef627-d00d-40f9-a2e0-6271df18d692	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0	https://grokade.com/rankings/	2025-03-18 07:05:31.321
67df74a2-beaa-4798-abc1-e35abf9efb62	/	bc7ef627-d00d-40f9-a2e0-6271df18d692	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0	https://grokade.com/rankings/	2025-03-18 07:05:31.712
2a105f5f-42de-4150-97fe-e07e8e37bf47	/competitions/	bc7ef627-d00d-40f9-a2e0-6271df18d692	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0	https://grokade.com/rankings/	2025-03-18 07:05:39.141
\.


--
-- Data for Name: ranking_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ranking_history (id, "entityId", "entityType", "rankingType", "position", score, views, plays, "recordedAt") FROM stdin;
2ce95f13-37d0-43bb-b1c3-80b539c0b329	1c44b058-5546-4826-ae5b-262763ad2a31	game	popularity	1	38	4	17	2025-03-18 06:39:35.622
1c13eff3-7d00-4419-962d-108f5ce7f1ff	708299c8-25f6-45c6-ad30-3dc8592775d4	game	popularity	2	28	16	6	2025-03-18 06:39:35.622
03b174aa-b72b-4e30-9328-ada46447970e	2272eed7-d25d-496f-aece-6aa7cbaac8bd	game	popularity	3	22	4	9	2025-03-18 06:39:35.622
4b3658a1-0d53-4cf4-814e-d674f786ea07	d5663aac-ae60-473b-b36d-d00b4504dcc2	game	popularity	4	19	15	2	2025-03-18 06:39:35.622
371cd90c-d489-43d9-9fec-f9aa6cfa71d8	408320e2-1adb-470a-b015-6e39bf8a5990	game	popularity	5	18	6	6	2025-03-18 06:39:35.622
d2aee084-5ac9-431d-84f4-65273d4be8c7	8074fbb7-fe43-4c9b-aa2b-839438670652	game	popularity	6	18	6	6	2025-03-18 06:39:35.622
a26254fe-0678-4564-9d0a-5fcbdf1b8219	bbbf2d80-4dba-4faf-a777-09cb88159bc1	game	popularity	7	15	7	4	2025-03-18 06:39:35.622
a11e1fae-e7be-47c0-8aba-5e559df67d49	bf456723-0c50-448d-9732-623f581da6a0	game	popularity	8	11	11	0	2025-03-18 06:39:35.622
0d7c3c7d-627a-411b-a1c9-3246021d15b1	13a9b6f6-0b5b-416b-ab9e-3e143dd6bfce	game	popularity	9	11	9	1	2025-03-18 06:39:35.622
c1079433-31dd-4559-acae-d1bc17dc75f5	f68e6594-fe6b-4779-8483-99c510580c6b	game	popularity	10	10	2	4	2025-03-18 06:39:35.622
7071215a-07a3-475b-9e98-b6c239e0f8b5	cc4c1e10-ce79-4157-9138-7f59e14ef6fc	game	popularity	11	9	5	2	2025-03-18 06:39:35.622
282b3ba3-c070-4b5c-9061-6854f2459fee	91698f39-9bc5-464f-8aaf-e73a8a0f3cea	game	popularity	12	9	3	3	2025-03-18 06:39:35.622
249d47bc-184b-4114-8725-eb6d8eeec145	20f4e68a-8d53-454a-a405-d40fa30e4674	game	popularity	13	7	7	0	2025-03-18 06:39:35.622
2b161136-8e12-4cea-85e0-b59f762254b1	75d16c0b-6af6-482b-8333-44247339f9e8	game	popularity	14	6	0	3	2025-03-18 06:39:35.622
51ef4b94-2583-4f65-874b-49cfc10d3198	30cdfe59-56b7-4ea4-8f20-c975698e4541	game	popularity	15	6	4	1	2025-03-18 06:39:35.622
da8cf61c-0cc9-4b50-83b5-7201c26ee673	8d3ebac9-6a26-4269-96c4-d6da0514d5b1	game	popularity	16	6	4	1	2025-03-18 06:39:35.622
5b8b8409-a8e3-4b5a-89d5-322bab23bfbd	cab0a67a-4967-4c77-901d-12970681ec85	game	popularity	17	4	2	1	2025-03-18 06:39:35.622
93fb809a-a422-4238-94ab-9876fad3a1e0	59aee7d1-1d45-4386-a3e4-c164cc4de46d	game	popularity	18	4	2	1	2025-03-18 06:39:35.622
33c9c133-ceed-4395-8131-0cd8debf71d5	c60de4b9-bb22-4b66-ba31-8a6754f8a876	game	popularity	19	4	2	1	2025-03-18 06:39:35.622
47f60e79-0078-4703-b28c-7fed8ce916aa	bfbf5cd7-c44b-4054-a1a8-71455c04f29d	game	popularity	20	4	4	0	2025-03-18 06:39:35.622
f1e6cfe3-2af6-4a76-9fd8-c2ab8b916ef5	162a11b3-6138-4540-86ae-f50619bac7f4	game	popularity	21	2	2	0	2025-03-18 06:39:35.622
24749844-f7fa-4e55-b98d-0c0964e8160d	e0173448-5bdb-410d-a47b-0174bf726c8b	game	popularity	22	2	2	0	2025-03-18 06:39:35.622
8e19ff70-6fc8-4c62-b855-dee31698f41e	86c45ba5-ab0f-452b-b1e8-877a898bec14	game	popularity	23	2	2	0	2025-03-18 06:39:35.622
764264e6-3dac-4dc1-8272-d26a3c879ed8	193935c5-ac96-4664-bcc0-9869b84e1548	game	popularity	24	2	2	0	2025-03-18 06:39:35.622
e125b18c-6810-4b7c-a8b1-1ccfe2b7a413	2bc0e5cc-9d7e-438c-b1b3-c963b3c84aec	game	popularity	25	1	1	0	2025-03-18 06:39:35.622
d7e61ea5-574f-4930-a8e7-baeaeef7ac7a	9b149ef6-7d84-4edc-8283-8b5522ce3518	game	popularity	26	1	1	0	2025-03-18 06:39:35.622
3db56c3e-5bac-4c6a-bd7c-c88c9baa9cb8	a3235777-29c9-418d-8b3d-bec551b9e174	game	popularity	27	1	1	0	2025-03-18 06:39:35.622
bf831076-3422-4ef4-ad81-ef367b0a9a63	2bfa4820-05e8-429d-91db-fd43914f98f9	game	popularity	28	1	1	0	2025-03-18 06:39:35.622
f46b2291-bbb4-4c0b-9677-f89ed2ab4a57	7f37cb28-0731-4c2a-b1b9-16cd56a57367	game	popularity	29	1	1	0	2025-03-18 06:39:35.622
3e0a21c3-59be-4cc9-9f42-8c065b9cb660	d675ee59-bc51-4acb-a74a-2a51dca64cbe	game	popularity	30	0	0	0	2025-03-18 06:39:35.622
45697373-a7d7-4a56-a2a5-28622b2b9178	d5fba96c-069e-4242-9206-3d145ccf899a	game	popularity	31	0	0	0	2025-03-18 06:39:35.622
4630b14c-8f89-4b33-9a80-0e9f96c4cafd	b492c7d1-f9c5-4b3b-a49b-eae4fe82bc83	game	popularity	32	0	0	0	2025-03-18 06:39:35.622
b2e26527-c951-493b-8037-bc744eb21b70	bb935fc4-4063-4709-874a-20e8dd1ba36f	game	popularity	33	0	0	0	2025-03-18 06:39:35.622
fb6ebce8-ef82-4d56-869a-cbf2ae75a688	2964c8d9-953c-41a9-aa4f-653d261d14e6	game	popularity	34	0	0	0	2025-03-18 06:39:35.622
4edd4045-ea64-4fdf-94ac-1cce97d25741	3ebb0eb7-753f-4778-8b67-7fd98a94b49c	game	popularity	35	0	0	0	2025-03-18 06:39:35.622
b87e0db1-9a35-4eb2-983e-62bd3eb251cf	f8279a3a-cbc2-446e-a640-080b05366998	game	popularity	36	0	0	0	2025-03-18 06:39:35.622
737ee5c7-eb61-4097-a78c-111fbf98999b	34734b25-58ec-46ab-ac41-1bceccdab4fa	game	popularity	37	0	0	0	2025-03-18 06:39:35.622
ae504bd6-d703-46a9-92d2-4842c0b50594	63ecb365-86eb-4c0e-9100-b697c7df6a90	game	popularity	38	0	0	0	2025-03-18 06:39:35.622
22da1879-b0e4-40ad-b63b-e7221e6f1f0b	8c2d3fdb-bfa7-4838-9e7e-fbe9ca69c12b	game	popularity	39	0	0	0	2025-03-18 06:39:35.622
f46c321a-09f3-48d8-b644-f5013ba99e72	bbdb0453-4d4d-45ed-ba49-e132cae453f1	game	popularity	40	0	0	0	2025-03-18 06:39:35.622
3596c264-0faa-4218-9d61-d90524c24be8	e035a8c3-809b-4989-aa39-d5dae607c309	game	popularity	41	0	0	0	2025-03-18 06:39:35.622
a7e751e6-b9be-400b-81c3-f51e5c7d0ec2	844c3033-7af0-46bc-965f-d7d6c8696660	game	popularity	42	0	0	0	2025-03-18 06:39:35.622
e63d8d43-e798-40e1-a4fb-35de5a6c5ea8	0b859c68-a877-40a3-9f8e-ca0bc40317b5	game	popularity	43	0	0	0	2025-03-18 06:39:35.622
db17ff33-2b9f-41f5-98d8-ee5d8ad4a400	f7a0e68c-d889-4436-be6a-9f592244ecf0	game	popularity	44	0	0	0	2025-03-18 06:39:35.622
483456b1-584c-4566-80d6-ce00fe7f535c	00bae889-15b5-402f-976e-60f288c8c882	game	popularity	45	0	0	0	2025-03-18 06:39:35.622
d292eddf-1c30-43fc-bb18-7c80fe8a742d	b7c322be-7029-435d-baf3-631200ce6ddb	game	popularity	46	0	0	0	2025-03-18 06:39:35.622
4fb5d820-c648-4232-b786-cefc5df4ec0d	90dd0c2f-f8cf-47ff-81a5-9613739b59b3	game	popularity	47	0	0	0	2025-03-18 06:39:35.622
ad8c755a-d8cb-49e7-bcd0-20f8c028a54e	5ab0ce77-3c98-4659-a98f-357d042047d9	game	popularity	48	0	0	0	2025-03-18 06:39:35.622
686953dc-4e0c-4b2f-adca-ef4a7dbc6390	04699df4-76cd-4f84-900a-dd65d5ae7052	game	popularity	49	0	0	0	2025-03-18 06:39:35.622
ec051aae-296d-41ff-9d81-442dad5af77b	7fa78729-6336-441f-8ed6-9c827de2bfe3	game	popularity	50	0	0	0	2025-03-18 06:39:35.622
21641765-cae3-4a8c-88ae-ddcc1bb1e8db	b98ca5e9-7424-4208-8f0a-dbac8c6ca808	game	popularity	51	0	0	0	2025-03-18 06:39:35.622
7a004435-4095-45bb-88df-0588f5805afe	219f782b-fed3-4c58-84ec-25f59e930d34	game	popularity	52	0	0	0	2025-03-18 06:39:35.622
be5e2440-8649-415d-86a4-9f9546cd7d7e	23f70fdf-049c-4b86-b946-d66ef18d38b4	game	popularity	53	0	0	0	2025-03-18 06:39:35.622
bac2f3f1-6524-4046-9e2d-ed8f256bdf1b	db27129f-f6b4-409d-8d3a-20a590c816f3	game	popularity	54	0	0	0	2025-03-18 06:39:35.622
3400a735-94e9-42ef-b779-700263eec8df	b25564d4-e26d-4933-baa4-60d04b385a6a	game	popularity	55	0	0	0	2025-03-18 06:39:35.622
7a5e9baf-43fc-4ece-9385-1996f775f9e7	55887d6d-ef93-44fc-9e0a-afb5cbd83df0	game	popularity	56	0	0	0	2025-03-18 06:39:35.622
fe9dab28-853e-400a-b3f9-8679538fc942	73875939-a972-4927-b0c6-ae68249bfdb9	game	popularity	57	0	0	0	2025-03-18 06:39:35.622
c105bf8c-5a96-4ec2-850e-b15baea9a035	0af2b647-0e29-4f99-b32f-96501608bf3c	game	popularity	58	0	0	0	2025-03-18 06:39:35.622
76fd45cb-2515-47c0-9a6b-4cda1be28319	4aaa007f-ff17-452a-8917-4dd47a8102b4	game	popularity	59	0	0	0	2025-03-18 06:39:35.622
2fda41cc-d59b-4763-b206-d345f31cc180	31c831b2-5562-4968-ba09-1a5459bb1b92	game	popularity	60	0	0	0	2025-03-18 06:39:35.622
f6091e9a-4eae-492c-bf0d-81fa0e531ecb	e5e98736-5eed-4bf3-82d5-fbc29eaaf4b2	game	popularity	61	0	0	0	2025-03-18 06:39:35.622
dc5e00a6-7676-4574-a22c-8c086975a939	35096d12-6a4a-4e7a-aed9-19b5db5db10c	game	popularity	62	0	0	0	2025-03-18 06:39:35.622
70ff975d-82f9-4287-9751-eeff78accf74	d5114658-91f6-4b1f-834d-be49235e419c	game	popularity	63	0	0	0	2025-03-18 06:39:35.622
769f41b2-2540-486c-befc-b26789efc608	533711da-7205-4171-b1b3-76f725ce4da2	game	popularity	64	0	0	0	2025-03-18 06:39:35.622
8273bc34-7f5f-4b0f-b5e3-9ceb5c15546e	2c91becf-3c2b-4692-a762-66caeec53d1e	game	popularity	65	0	0	0	2025-03-18 06:39:35.622
3d581fc4-a833-40f3-94da-281541da94bf	d41e8753-0ada-4b33-bed9-a688ffa34d9e	game	popularity	66	0	0	0	2025-03-18 06:39:35.622
85179d93-2f61-4f02-8377-73cdcf464ff1	341b131e-4d79-4f7b-82da-bf8174bcceaf	game	popularity	67	0	0	0	2025-03-18 06:39:35.622
f0efcbe7-1cb4-4ddc-b9d8-c8a10474c52a	7854fc02-d82c-4044-a52b-dd01380bfd7d	game	popularity	68	0	0	0	2025-03-18 06:39:35.622
f3959265-083d-4165-b027-c58cba3961d8	4a8a627b-d49e-478c-9a93-d08d4100837a	game	popularity	69	0	0	0	2025-03-18 06:39:35.622
6b4530ef-0f3d-4283-b08c-d41e49c65b8e	77261e65-6403-44cf-9f3f-2cc9f3d95f13	game	popularity	70	0	0	0	2025-03-18 06:39:35.622
8da63542-dc94-4784-a7c9-e1a471c8d759	07b92061-6f7f-4355-8be5-7e215deba937	game	popularity	71	0	0	0	2025-03-18 06:39:35.622
f7c436a5-c2d0-4554-a181-cab7b0bf0b92	8b7021c3-73e4-46d9-b84f-b6291be61d3a	game	popularity	72	0	0	0	2025-03-18 06:39:35.622
b37474b1-59d0-48fe-b962-6d9d4cf79d52	084cfb0c-2623-48cf-b8d6-2d6d6c0baec1	game	popularity	73	0	0	0	2025-03-18 06:39:35.622
19279d33-9ce3-4ac2-b879-a02c8391d950	95b4658f-3578-4409-be47-6ec79ff6204f	game	popularity	74	0	0	0	2025-03-18 06:39:35.622
24143718-9237-41a1-8ce1-d3d25eee5619	d801607f-418e-4330-8f75-d947467ce3aa	game	popularity	75	0	0	0	2025-03-18 06:39:35.622
12f02dd9-0170-49d6-a2c8-33decd7661f1	ba0fa9e9-9eba-403c-be52-2a136ecf3b7a	game	popularity	76	0	0	0	2025-03-18 06:39:35.622
2d850735-ab0e-46a5-ba0f-b7e293194fdc	22845991-0fb6-4bdf-9725-0525b565699c	game	popularity	77	0	0	0	2025-03-18 06:39:35.622
16d249a8-272d-4ae6-98cf-de44f8f3f67f	dfba9261-3270-4ba2-9110-5103eb8c03c9	game	popularity	78	0	0	0	2025-03-18 06:39:35.622
5a0b1d2f-6149-44e9-98b6-d05c26e0970f	bcbbaf7b-bd8e-413d-b42b-e483d4dec771	game	popularity	79	0	0	0	2025-03-18 06:39:35.622
eed06b79-88ca-46c6-a8e8-89475eb41a76	ed450b52-5caa-492f-8790-d3c6b4f77fff	game	popularity	80	0	0	0	2025-03-18 06:39:35.622
da425446-a916-4930-b2f3-cc2867dea45f	f0e24ffc-e714-4da0-8510-35cfbb521ffb	game	popularity	81	0	0	0	2025-03-18 06:39:35.622
9c56e45f-03c9-41a1-832c-06427140845e	8ad6e622-f36f-42e3-aac7-92aa7d3a8288	game	popularity	82	0	0	0	2025-03-18 06:39:35.622
b9c1d8e3-c322-4959-af57-294806e5bc61	788597c7-0923-4688-a425-6e694b0007d2	game	popularity	83	0	0	0	2025-03-18 06:39:35.622
47bbbc4e-ae9e-4998-b64a-58f87a411c20	8759da60-d5ce-42b4-b0aa-fafdbd345aa2	game	popularity	84	0	0	0	2025-03-18 06:39:35.622
3e2027dd-86a1-43c3-8a36-cc4e3679e1bc	25754fe0-22d6-4e01-b552-add4be72ae48	game	popularity	85	0	0	0	2025-03-18 06:39:35.622
bcb13ffa-23fb-43c8-815f-557b9323a138	af707792-b791-4803-9d5d-dd83bf7fcc87	game	popularity	86	0	0	0	2025-03-18 06:39:35.622
86a3377c-5db0-4e7d-9fb5-a1deb73f146e	f67f4c00-47fa-4ee3-a7bd-8a1bacd6f95e	game	popularity	87	0	0	0	2025-03-18 06:39:35.622
b7695a93-e70e-4811-92f3-d63d55d7f057	8cfc30a0-f692-4e4e-bdca-ad4c2c372cd1	game	popularity	88	0	0	0	2025-03-18 06:39:35.622
4d0cc63b-0830-48da-a65d-82c01b870da7	c10111fb-d178-4643-b837-7ef19bef8f41	game	popularity	89	0	0	0	2025-03-18 06:39:35.622
ff2a0473-a738-423d-af3e-5fc18011d58c	59b2393e-ebab-4d7e-b9c3-b2aaa0bd8513	game	popularity	90	0	0	0	2025-03-18 06:39:35.622
052f8675-9d03-47fb-b98c-604444c1fffe	dca78d28-45b4-44ea-9bc7-80baf7008641	game	popularity	91	0	0	0	2025-03-18 06:39:35.622
a4b5fdca-a395-45c5-8c2b-9fb4e44e1969	07d6775c-e242-4597-a44e-e22437a49459	game	popularity	92	0	0	0	2025-03-18 06:39:35.622
67c24aed-5084-46eb-a1ce-a9f11e3f11a3	16d4082f-5b2f-4528-bc21-c105e46abbdf	game	popularity	93	0	0	0	2025-03-18 06:39:35.622
6637c290-a9a8-4780-bd01-3e638265e40a	9748c31e-640b-4263-b719-da3a8f08736e	game	popularity	94	0	0	0	2025-03-18 06:39:35.622
47d6b0ba-5678-4ffa-9150-651d2bbbf61a	b4d24777-f913-46b7-983d-88490a68e2c0	game	popularity	95	0	0	0	2025-03-18 06:39:35.622
c224ffdf-6203-48da-ba8a-103da6505579	4626e481-051b-4832-ba44-be606da797c6	game	popularity	96	0	0	0	2025-03-18 06:39:35.622
9dc5400e-7d6a-4c43-b9c7-b750bbb8c2e1	8f9010c4-d77b-4887-9cc3-0c9b7010c569	game	popularity	97	0	0	0	2025-03-18 06:39:35.622
a14021df-9816-4842-92ce-6de35e5199d9	6cb521f3-5336-4f75-8bbb-9b67d8b7ba3f	game	popularity	98	0	0	0	2025-03-18 06:39:35.622
d673ed66-aea3-45b3-964d-2d0404b99a87	83afb8c5-9e23-4fa8-9168-83decbd7978d	game	popularity	99	0	0	0	2025-03-18 06:39:35.622
5b1f80f9-44d8-4d15-8bc8-ad74f1dc6740	d2bc2c08-c7b5-47b7-b45b-fa3b5b2e8f36	game	popularity	100	0	0	0	2025-03-18 06:39:35.622
9fc2b4e5-5171-4c99-91fc-b3c969c6b1dc	4b3fa1ed-a7fa-4185-9f03-519c76913aca	game	popularity	101	0	0	0	2025-03-18 06:39:35.622
b828a783-ccb0-46dc-82cf-c0bd9b8124fe	0dd8000b-48c2-4f63-addc-f4e908dd939e	game	popularity	102	0	0	0	2025-03-18 06:39:35.622
c60439d2-5adf-440d-83b6-a4421b305477	46250f21-9a73-4146-88f4-513a1c5f99d9	game	popularity	103	0	0	0	2025-03-18 06:39:35.622
a0470584-faa5-48a4-9414-35a2cabbd7c6	18b64c24-3028-4d04-98e5-c4382f0c8cd0	game	popularity	104	0	0	0	2025-03-18 06:39:35.622
eeb3096a-33db-436a-a94c-9c708e0f3c8a	4bebe6a9-db56-453e-a85d-0400cb5a08f5	game	popularity	105	0	0	0	2025-03-18 06:39:35.622
f50d03ec-3afa-4bd6-8d19-b1c295c2dbb2	61f434ad-2388-45de-b373-b561be63590b	game	popularity	106	0	0	0	2025-03-18 06:39:35.622
09687b50-5522-4051-8bcc-2e494f96fd83	3e78f568-8737-4c77-a46b-e326470acb70	game	popularity	107	0	0	0	2025-03-18 06:39:35.622
a8ec78bc-cded-42f9-98fa-ab0a1a686768	24d8d342-b1d7-40ee-8ad4-6c5636c04661	game	popularity	108	0	0	0	2025-03-18 06:39:35.622
f24b9d1a-40d5-42ca-90b2-f45e63c320be	eccd75c9-812b-4464-b542-8dc1c4fa94f9	game	popularity	109	0	0	0	2025-03-18 06:39:35.622
536469bb-2e72-4e7e-96da-a78b7722a8a8	9359a360-70c0-43ad-bceb-9912f7d134da	game	popularity	110	0	0	0	2025-03-18 06:39:35.622
ef0f729a-7f95-413c-b1ea-dc4c896449e0	054009be-8fa3-4bdb-a853-57f5c355583f	game	popularity	111	0	0	0	2025-03-18 06:39:35.622
7c19c750-417e-4a3a-8f64-ad7d3105095c	59aee7d1-1d45-4386-a3e4-c164cc4de46d	game	quality	1	0.8888888888888888	2	1	2025-03-18 06:39:35.622
b8412a57-1dcd-486e-b911-bcc3af471a88	2272eed7-d25d-496f-aece-6aa7cbaac8bd	game	quality	2	0.875	4	9	2025-03-18 06:39:35.622
1119e76d-2313-4af7-b2b8-b4e4084bac2d	13a9b6f6-0b5b-416b-ab9e-3e143dd6bfce	game	quality	3	0.8461538461538461	9	1	2025-03-18 06:39:35.622
79096ba6-8882-4bae-918c-d7e119145678	bbbf2d80-4dba-4faf-a777-09cb88159bc1	game	quality	4	0.8433734939759037	7	4	2025-03-18 06:39:35.622
803cb921-a1b5-4e7a-a3e1-c90d50f4c2db	d675ee59-bc51-4acb-a74a-2a51dca64cbe	game	quality	5	0.8181818181818182	0	0	2025-03-18 06:39:35.622
dd4b8624-960f-4fc2-9661-602fe7e2f570	75d16c0b-6af6-482b-8333-44247339f9e8	game	quality	6	0.8	0	3	2025-03-18 06:39:35.622
48065e9f-a1f2-4c23-8dad-5e0acb08d8a2	408320e2-1adb-470a-b015-6e39bf8a5990	game	quality	7	0.8	6	6	2025-03-18 06:39:35.622
cb34d699-b66a-48f9-9c31-e2878779d5f6	708299c8-25f6-45c6-ad30-3dc8592775d4	game	quality	8	0.8	16	6	2025-03-18 06:39:35.622
dca59f1f-1381-46bd-ac19-f487c33136ff	cc4c1e10-ce79-4157-9138-7f59e14ef6fc	game	quality	9	0.75	5	2	2025-03-18 06:39:35.622
5644f367-0714-454f-a53e-660feef28657	d5663aac-ae60-473b-b36d-d00b4504dcc2	game	quality	10	0.6363636363636364	15	2	2025-03-18 06:39:35.622
ffdd8784-cae1-4872-ab9e-c22e309fabb7	1c44b058-5546-4826-ae5b-262763ad2a31	game	quality	11	0.625	4	17	2025-03-18 06:39:35.622
7337c48a-3288-4b44-8c3b-ec05477c3a34	30cdfe59-56b7-4ea4-8f20-c975698e4541	game	quality	12	0.6	4	1	2025-03-18 06:39:35.622
2e34c213-c32b-4ad5-8a23-d8719054ae30	bf456723-0c50-448d-9732-623f581da6a0	game	quality	13	0.6	11	0	2025-03-18 06:39:35.622
e66c7066-ce0a-4d0c-9f6c-355c9b04576e	162a11b3-6138-4540-86ae-f50619bac7f4	game	quality	14	0.6	2	0	2025-03-18 06:39:35.622
48a8f24a-7311-4dd9-b5b1-f22f279ea396	20f4e68a-8d53-454a-a405-d40fa30e4674	game	quality	15	0.5	7	0	2025-03-18 06:39:35.622
3a478cb1-165e-4119-a1d2-c4b6e6301f72	bfbf5cd7-c44b-4054-a1a8-71455c04f29d	game	quality	16	0.5	4	0	2025-03-18 06:39:35.622
cbccd304-4a66-4a18-807f-5bc957d58d44	cab0a67a-4967-4c77-901d-12970681ec85	game	quality	17	0.5	2	1	2025-03-18 06:39:35.622
1e9b05e3-88fb-4d44-a7e2-ec9369e393d0	f68e6594-fe6b-4779-8483-99c510580c6b	game	quality	18	0.5	2	4	2025-03-18 06:39:35.622
f0f971b3-3c27-48e3-9777-e2b92f63aeaa	d5fba96c-069e-4242-9206-3d145ccf899a	game	quality	19	0.5	0	0	2025-03-18 06:39:35.622
4045fe6a-c039-4eda-ade5-ed0567a12a57	b492c7d1-f9c5-4b3b-a49b-eae4fe82bc83	game	quality	20	0.5	0	0	2025-03-18 06:39:35.622
30dfe0d2-b845-4ec8-b271-dbe9b38dec91	bb935fc4-4063-4709-874a-20e8dd1ba36f	game	quality	21	0.5	0	0	2025-03-18 06:39:35.622
982b7afa-1d79-4f40-84b5-4e3507a7e4a5	2964c8d9-953c-41a9-aa4f-653d261d14e6	game	quality	22	0.5	0	0	2025-03-18 06:39:35.622
1f80e586-d559-4e39-919b-5edf3bb1a710	3ebb0eb7-753f-4778-8b67-7fd98a94b49c	game	quality	23	0.5	0	0	2025-03-18 06:39:35.622
03dd3b7f-44d3-4cad-abaa-d490c0817717	f8279a3a-cbc2-446e-a640-080b05366998	game	quality	24	0.5	0	0	2025-03-18 06:39:35.622
4040d763-f4d4-4c9e-8ad1-996a51e29e7e	34734b25-58ec-46ab-ac41-1bceccdab4fa	game	quality	25	0.5	0	0	2025-03-18 06:39:35.622
e3921bfd-f487-4dec-8e6c-cfa3f879c4d1	63ecb365-86eb-4c0e-9100-b697c7df6a90	game	quality	26	0.5	0	0	2025-03-18 06:39:35.622
0513eb9e-f195-4574-9e61-75ffb5ed4565	8c2d3fdb-bfa7-4838-9e7e-fbe9ca69c12b	game	quality	27	0.5	0	0	2025-03-18 06:39:35.622
beedd268-957b-42b0-b73e-67c0781513e7	bbdb0453-4d4d-45ed-ba49-e132cae453f1	game	quality	28	0.5	0	0	2025-03-18 06:39:35.622
8730292e-60c0-4151-90fc-8de700b4b208	e035a8c3-809b-4989-aa39-d5dae607c309	game	quality	29	0.5	0	0	2025-03-18 06:39:35.622
c21374f1-5649-4a67-a633-03fffb6d383c	844c3033-7af0-46bc-965f-d7d6c8696660	game	quality	30	0.5	0	0	2025-03-18 06:39:35.622
b5868af7-9872-4955-8c69-cfafb431b969	0b859c68-a877-40a3-9f8e-ca0bc40317b5	game	quality	31	0.5	0	0	2025-03-18 06:39:35.622
fd439979-fcc2-492d-94f6-c5bf0eb29987	f7a0e68c-d889-4436-be6a-9f592244ecf0	game	quality	32	0.5	0	0	2025-03-18 06:39:35.622
665ab7e7-2e87-4b5e-993e-cef00b352bde	00bae889-15b5-402f-976e-60f288c8c882	game	quality	33	0.5	0	0	2025-03-18 06:39:35.622
088207ee-34a4-4c3a-9abc-fb929e3ad055	b7c322be-7029-435d-baf3-631200ce6ddb	game	quality	34	0.5	0	0	2025-03-18 06:39:35.622
e6ffe374-0562-46ed-a3ef-34e2b562a8a9	90dd0c2f-f8cf-47ff-81a5-9613739b59b3	game	quality	35	0.5	0	0	2025-03-18 06:39:35.622
0ae7f839-6ca8-4051-a8e5-2c2ea86c39b0	5ab0ce77-3c98-4659-a98f-357d042047d9	game	quality	36	0.5	0	0	2025-03-18 06:39:35.622
aa780030-2deb-45ce-8a84-cec83774be7b	04699df4-76cd-4f84-900a-dd65d5ae7052	game	quality	37	0.5	0	0	2025-03-18 06:39:35.622
9a2abe5d-ac31-4bff-a909-865d2a264156	7fa78729-6336-441f-8ed6-9c827de2bfe3	game	quality	38	0.5	0	0	2025-03-18 06:39:35.622
d2eae789-28ab-4eb5-b289-e83f5688cd73	b98ca5e9-7424-4208-8f0a-dbac8c6ca808	game	quality	39	0.5	0	0	2025-03-18 06:39:35.622
7a376254-a09c-46aa-9880-96d025ffdd27	219f782b-fed3-4c58-84ec-25f59e930d34	game	quality	40	0.5	0	0	2025-03-18 06:39:35.622
e755fb24-372c-4e49-ae42-3b3005cc4974	23f70fdf-049c-4b86-b946-d66ef18d38b4	game	quality	41	0.5	0	0	2025-03-18 06:39:35.622
acf02a0d-efee-45d8-8436-61ce158b1e6c	db27129f-f6b4-409d-8d3a-20a590c816f3	game	quality	42	0.5	0	0	2025-03-18 06:39:35.622
4c61015a-d379-491f-8bcd-5b98b9cc25dc	b25564d4-e26d-4933-baa4-60d04b385a6a	game	quality	43	0.5	0	0	2025-03-18 06:39:35.622
10e4206d-3d89-4543-ac4c-3aabc154fea9	55887d6d-ef93-44fc-9e0a-afb5cbd83df0	game	quality	44	0.5	0	0	2025-03-18 06:39:35.622
1cbaad1b-7cc9-4c63-8fc5-55ef6fff1dca	73875939-a972-4927-b0c6-ae68249bfdb9	game	quality	45	0.5	0	0	2025-03-18 06:39:35.622
41212fca-c96f-4dbb-97b8-56f1aaae49dc	0af2b647-0e29-4f99-b32f-96501608bf3c	game	quality	46	0.5	0	0	2025-03-18 06:39:35.622
bf96f7ea-ff97-4426-85d0-630b949f163a	4aaa007f-ff17-452a-8917-4dd47a8102b4	game	quality	47	0.5	0	0	2025-03-18 06:39:35.622
f0d79580-5818-4429-88dd-96967efd79c3	31c831b2-5562-4968-ba09-1a5459bb1b92	game	quality	48	0.5	0	0	2025-03-18 06:39:35.622
3e2cb6aa-9c72-41bd-b677-6527d6ac04aa	e5e98736-5eed-4bf3-82d5-fbc29eaaf4b2	game	quality	49	0.5	0	0	2025-03-18 06:39:35.622
09d20d44-6dd5-4b16-9ee1-ee442d971bd2	35096d12-6a4a-4e7a-aed9-19b5db5db10c	game	quality	50	0.5	0	0	2025-03-18 06:39:35.622
894896ac-03bc-45f2-aaaf-bdda80baf963	d5114658-91f6-4b1f-834d-be49235e419c	game	quality	51	0.5	0	0	2025-03-18 06:39:35.622
bea82f7f-e994-4ded-bcbc-b25e9b328e10	533711da-7205-4171-b1b3-76f725ce4da2	game	quality	52	0.5	0	0	2025-03-18 06:39:35.622
1612de4f-a67c-455d-b07c-6c2950a3844a	2c91becf-3c2b-4692-a762-66caeec53d1e	game	quality	53	0.5	0	0	2025-03-18 06:39:35.622
409778b6-1f0e-4fb0-88af-01caee5288b7	d41e8753-0ada-4b33-bed9-a688ffa34d9e	game	quality	54	0.5	0	0	2025-03-18 06:39:35.622
be148c65-4c3d-4527-9a3f-844fbd0a4422	341b131e-4d79-4f7b-82da-bf8174bcceaf	game	quality	55	0.5	0	0	2025-03-18 06:39:35.622
3fdc1a21-856c-4311-b08f-f1e2fc26825f	7854fc02-d82c-4044-a52b-dd01380bfd7d	game	quality	56	0.5	0	0	2025-03-18 06:39:35.622
3e3baecb-76ca-4d35-a1b0-8f78178141aa	4a8a627b-d49e-478c-9a93-d08d4100837a	game	quality	57	0.5	0	0	2025-03-18 06:39:35.622
ce7817de-bd54-483e-98f9-609ed154c8f7	2bc0e5cc-9d7e-438c-b1b3-c963b3c84aec	game	quality	58	0.5	1	0	2025-03-18 06:39:35.622
ea8c942d-a5dc-4736-893d-27f955383b5a	77261e65-6403-44cf-9f3f-2cc9f3d95f13	game	quality	59	0.5	0	0	2025-03-18 06:39:35.622
5a6ff629-8ca4-402b-ab35-c86cfca5d51e	07b92061-6f7f-4355-8be5-7e215deba937	game	quality	60	0.5	0	0	2025-03-18 06:39:35.622
04ee1d96-d729-410a-8a22-f0f9519ad442	8b7021c3-73e4-46d9-b84f-b6291be61d3a	game	quality	61	0.5	0	0	2025-03-18 06:39:35.622
b6a40aed-3199-4813-ae6c-b28113bd54e5	084cfb0c-2623-48cf-b8d6-2d6d6c0baec1	game	quality	62	0.5	0	0	2025-03-18 06:39:35.622
c96d0826-d812-4e79-a4a6-94fc367840bb	95b4658f-3578-4409-be47-6ec79ff6204f	game	quality	63	0.5	0	0	2025-03-18 06:39:35.622
a925a1ad-91b0-4f14-9b9c-e327b7dd1c9d	d801607f-418e-4330-8f75-d947467ce3aa	game	quality	64	0.5	0	0	2025-03-18 06:39:35.622
2d98dc60-e923-40db-a72a-7a40ce143096	ba0fa9e9-9eba-403c-be52-2a136ecf3b7a	game	quality	65	0.5	0	0	2025-03-18 06:39:35.622
9ccbdb11-a3ff-44a6-b056-d4512566b52f	22845991-0fb6-4bdf-9725-0525b565699c	game	quality	66	0.5	0	0	2025-03-18 06:39:35.622
6a0e08dd-f852-4cff-b6b7-6e681a388514	dfba9261-3270-4ba2-9110-5103eb8c03c9	game	quality	67	0.5	0	0	2025-03-18 06:39:35.622
fe543c9f-dd75-45ee-af2a-7ae5633ea10e	bcbbaf7b-bd8e-413d-b42b-e483d4dec771	game	quality	68	0.5	0	0	2025-03-18 06:39:35.622
2378b9b9-2323-4d10-92e2-9e49e1cb4bc4	ed450b52-5caa-492f-8790-d3c6b4f77fff	game	quality	69	0.5	0	0	2025-03-18 06:39:35.622
4b3bb6ee-7b13-41a8-9a90-fc4191cae1ac	f0e24ffc-e714-4da0-8510-35cfbb521ffb	game	quality	70	0.5	0	0	2025-03-18 06:39:35.622
42dad13f-dd3b-45bd-b908-393fe947b09b	e0173448-5bdb-410d-a47b-0174bf726c8b	game	quality	71	0.5	2	0	2025-03-18 06:39:35.622
3685911b-ed25-4bf8-a87e-f55af821734f	8ad6e622-f36f-42e3-aac7-92aa7d3a8288	game	quality	72	0.5	0	0	2025-03-18 06:39:35.622
e5837b90-2c80-479a-9ea8-4459b2f1d8e5	788597c7-0923-4688-a425-6e694b0007d2	game	quality	73	0.5	0	0	2025-03-18 06:39:35.622
c076cf07-5674-42db-8799-0804a6ee8aeb	8759da60-d5ce-42b4-b0aa-fafdbd345aa2	game	quality	74	0.5	0	0	2025-03-18 06:39:35.622
8a1d03e0-514d-4780-b9ec-bb6d74b2528f	25754fe0-22d6-4e01-b552-add4be72ae48	game	quality	75	0.5	0	0	2025-03-18 06:39:35.622
475df705-6fdc-45f9-b53b-a4da7072de8d	af707792-b791-4803-9d5d-dd83bf7fcc87	game	quality	76	0.5	0	0	2025-03-18 06:39:35.622
f7e41c7b-6a52-4d86-9343-bfc191be8394	f67f4c00-47fa-4ee3-a7bd-8a1bacd6f95e	game	quality	77	0.5	0	0	2025-03-18 06:39:35.622
b0dd225d-f0c5-455b-83e9-8fe410f1cc14	8cfc30a0-f692-4e4e-bdca-ad4c2c372cd1	game	quality	78	0.5	0	0	2025-03-18 06:39:35.622
e9492303-228b-4207-82b5-5c22a6c8818d	c10111fb-d178-4643-b837-7ef19bef8f41	game	quality	79	0.5	0	0	2025-03-18 06:39:35.622
f00ca62d-d3f5-4fa9-87f8-6cf6e7818a60	59b2393e-ebab-4d7e-b9c3-b2aaa0bd8513	game	quality	80	0.5	0	0	2025-03-18 06:39:35.622
679f290f-7263-4d85-b558-1dc2bcf6962d	dca78d28-45b4-44ea-9bc7-80baf7008641	game	quality	81	0.5	0	0	2025-03-18 06:39:35.622
e2308ce7-afe4-4d39-946b-76be48f9a418	07d6775c-e242-4597-a44e-e22437a49459	game	quality	82	0.5	0	0	2025-03-18 06:39:35.622
fb0ec2fa-8906-4de8-a047-6c488497d7e6	16d4082f-5b2f-4528-bc21-c105e46abbdf	game	quality	83	0.5	0	0	2025-03-18 06:39:35.622
8865585c-ddb2-4ca7-a2b5-9839e684c9ae	9748c31e-640b-4263-b719-da3a8f08736e	game	quality	84	0.5	0	0	2025-03-18 06:39:35.622
d4a7fd54-d152-46eb-93eb-40c478fc96fc	b4d24777-f913-46b7-983d-88490a68e2c0	game	quality	85	0.5	0	0	2025-03-18 06:39:35.622
1142ae13-437b-423a-8f0f-df252a8735fc	4626e481-051b-4832-ba44-be606da797c6	game	quality	86	0.5	0	0	2025-03-18 06:39:35.622
005cc6c6-0a05-4b41-8895-0dcf713117d6	8f9010c4-d77b-4887-9cc3-0c9b7010c569	game	quality	87	0.5	0	0	2025-03-18 06:39:35.622
927f4953-8102-4f70-bf86-fbceb9266ddc	6cb521f3-5336-4f75-8bbb-9b67d8b7ba3f	game	quality	88	0.5	0	0	2025-03-18 06:39:35.622
79435029-538e-46c6-a73b-1434a4ffae20	83afb8c5-9e23-4fa8-9168-83decbd7978d	game	quality	89	0.5	0	0	2025-03-18 06:39:35.622
9b5c00da-9411-4f89-884a-c9ee0cdf9dda	d2bc2c08-c7b5-47b7-b45b-fa3b5b2e8f36	game	quality	90	0.5	0	0	2025-03-18 06:39:35.622
d2d96b60-4e2f-46cf-951f-0faed80f7603	9b149ef6-7d84-4edc-8283-8b5522ce3518	game	quality	91	0.5	1	0	2025-03-18 06:39:35.622
73a536f6-02a4-44ea-b20a-ff563cf35ab6	4b3fa1ed-a7fa-4185-9f03-519c76913aca	game	quality	92	0.5	0	0	2025-03-18 06:39:35.622
58d35bba-7629-4524-a9e5-d5b6e946d3e2	0dd8000b-48c2-4f63-addc-f4e908dd939e	game	quality	93	0.5	0	0	2025-03-18 06:39:35.622
6d19eefe-02d5-4eee-981d-a0279a98aceb	46250f21-9a73-4146-88f4-513a1c5f99d9	game	quality	94	0.5	0	0	2025-03-18 06:39:35.622
c7b297f9-220a-4837-8634-baa8ddb69384	18b64c24-3028-4d04-98e5-c4382f0c8cd0	game	quality	95	0.5	0	0	2025-03-18 06:39:35.622
6083309e-a574-4e50-ab67-33723d58f522	4bebe6a9-db56-453e-a85d-0400cb5a08f5	game	quality	96	0.5	0	0	2025-03-18 06:39:35.622
1a4b214a-0ba0-44e4-aa49-dc0ad44e6697	61f434ad-2388-45de-b373-b561be63590b	game	quality	97	0.5	0	0	2025-03-18 06:39:35.622
3a6f8d6b-a9f2-445d-b3a1-75fdfb5eb862	3e78f568-8737-4c77-a46b-e326470acb70	game	quality	98	0.5	0	0	2025-03-18 06:39:35.622
aad58d91-42b6-4a0b-9a17-3653b2fad15e	24d8d342-b1d7-40ee-8ad4-6c5636c04661	game	quality	99	0.5	0	0	2025-03-18 06:39:35.622
a1d2ce1b-d62d-4a0e-bf8b-f384c7333554	a3235777-29c9-418d-8b3d-bec551b9e174	game	quality	100	0.5	1	0	2025-03-18 06:39:35.622
32083e1b-e9c2-4374-9973-bde756ce083a	2bfa4820-05e8-429d-91db-fd43914f98f9	game	quality	101	0.5	1	0	2025-03-18 06:39:35.622
b3a58fb3-f6aa-4678-ae57-0a6944545904	c60de4b9-bb22-4b66-ba31-8a6754f8a876	game	quality	102	0.5	2	1	2025-03-18 06:39:35.622
e9c583b9-f1df-46c5-9fcf-b00ac7550eb2	86c45ba5-ab0f-452b-b1e8-877a898bec14	game	quality	103	0.5	2	0	2025-03-18 06:39:35.622
82b16ac2-cc2c-4619-91a1-a2b011d83bfe	eccd75c9-812b-4464-b542-8dc1c4fa94f9	game	quality	104	0.5	0	0	2025-03-18 06:39:35.622
8da6edba-f83c-4297-9a83-e4bc2231077a	7f37cb28-0731-4c2a-b1b9-16cd56a57367	game	quality	105	0.5	1	0	2025-03-18 06:39:35.622
70a65bc2-ebb4-4382-b095-8bc7da9bf591	9359a360-70c0-43ad-bceb-9912f7d134da	game	quality	106	0.5	0	0	2025-03-18 06:39:35.622
d534dc56-8dfb-42fd-acbb-3290478d53f5	193935c5-ac96-4664-bcc0-9869b84e1548	game	quality	107	0.5	2	0	2025-03-18 06:39:35.622
1176ae35-28d4-4c77-920e-2f7592fb9798	91698f39-9bc5-464f-8aaf-e73a8a0f3cea	game	quality	108	0.5	3	3	2025-03-18 06:39:35.622
18f73479-8db9-46c7-87ce-ee14eba3a12e	8074fbb7-fe43-4c9b-aa2b-839438670652	game	quality	109	0.5	6	6	2025-03-18 06:39:35.622
b760bd19-365e-4e2e-9ec0-4f271940085a	054009be-8fa3-4bdb-a853-57f5c355583f	game	quality	110	0.5	0	0	2025-03-18 06:39:35.622
b9e0ea4f-37ee-47a9-81e1-39267689e19b	8d3ebac9-6a26-4269-96c4-d6da0514d5b1	game	quality	111	0.5	4	1	2025-03-18 06:39:35.622
33b1eb9b-90c6-45ae-8f1f-3011e9c5230a	https://x.com/jamesckemp	creator	creator	1	\N	4	17	2025-03-18 06:39:35.622
d3b9d4b0-9040-446d-93fc-a9fbda3e0572	https://x.com/cemilsvm	creator	creator	2	\N	15	2	2025-03-18 06:39:35.622
b681e60d-b985-4391-a79d-0dd15f19170a	https://x.com/pseudokid	creator	creator	3	\N	8	6	2025-03-18 06:39:35.622
015bc3c4-5963-41a6-835d-917dfc98e9d3	https://x.com/SieversJosua	creator	creator	4	\N	1	0	2025-03-18 06:39:35.622
4d1f532a-8872-4ecb-84ff-ee423eaef21b	https://x.com/byteonwire	creator	creator	5	\N	0	0	2025-03-18 06:39:35.622
3ad7eb79-5f86-4096-bb4b-92e44f76671e	https://x.com/dyoburon	creator	creator	6	\N	0	0	2025-03-18 06:39:35.622
6dbeff3c-71f0-473c-b9be-b06fbbf48e02	https://x.com/edwinhayward	creator	creator	7	\N	0	0	2025-03-18 06:39:35.622
10adb621-697f-4b4d-8751-a873587bf624	https://x.com/rfitzpatrick_io	creator	creator	8	\N	0	0	2025-03-18 06:39:35.622
d9168fc5-a78b-400e-96bd-ffa9f0485eda	https://x.com/paulwes_pw	creator	creator	9	\N	16	6	2025-03-18 06:39:35.622
11f39445-29b7-4b0d-a033-8dbb57892e2e	https://x.com/NicolaManzini	creator	creator	10	\N	4	9	2025-03-18 06:39:35.622
1b6161e3-907f-49da-8786-c909cf6dc2f4	https://x.com/pat_codes	creator	creator	11	\N	6	6	2025-03-18 06:39:35.622
ebc001bf-ad7f-40c6-b7ac-2f31b7301f52	https://x.com/jelmerdeboer	creator	creator	12	\N	11	0	2025-03-18 06:39:35.622
c6d5a723-34df-4791-91fa-52b2f27e5bdf	https://x.com/levelsio	creator	creator	13	\N	7	4	2025-03-18 06:39:35.622
a63e474f-4053-43e6-82d3-30a076611928	https://x.com/s13k_	creator	creator	14	\N	9	1	2025-03-18 06:39:35.622
84232afb-0332-40b6-9ede-a758f2873c41	https://x.com/LoukilAymen	creator	creator	15	\N	7	0	2025-03-18 06:39:35.622
5ffc4026-915c-4ae4-9644-47ad44c702f1	https://x.com/0xRome	creator	creator	16	\N	3	3	2025-03-18 06:39:35.622
af969259-2075-4b53-a690-533536cbf257	https://x.com/StephenRuhe	creator	creator	17	\N	4	1	2025-03-18 06:39:35.622
2786ba67-d1a2-4654-8458-f2fd41c39925	https://x.com/what_the_func	creator	creator	18	\N	4	1	2025-03-18 06:39:35.622
18648828-88d2-483c-bc75-6d6677b1600c	https://x.com/0xyardev	creator	creator	19	\N	4	0	2025-03-18 06:39:35.622
0ced8643-28e6-442b-8804-4cbae248e2bd	https://x.com/ged_ven	creator	creator	20	\N	2	1	2025-03-18 06:39:35.622
bbd4dd08-5cb7-462d-9582-07cd73df7570	https://x.com/IndieJayCodes	creator	creator	21	\N	2	1	2025-03-18 06:39:35.622
50e58cc3-c5a7-4fc4-9522-1434375b5359	https://x.com/darefailed	creator	creator	22	\N	2	0	2025-03-18 06:39:35.622
3293a4ef-6192-4350-8025-69d08e0322a1	https://x.com/bladeemaxxi	creator	creator	23	\N	2	0	2025-03-18 06:39:35.622
bfbee333-77be-4892-8dfd-4d9312cf50c4	https://x.com/nathansrobinson	creator	creator	24	\N	2	0	2025-03-18 06:39:35.622
07be819b-b2f6-4df9-bd4c-96407d95d2be	https://x.com/Aditya_T007	creator	creator	25	\N	1	0	2025-03-18 06:39:35.622
9991ae0b-fce8-48d4-9edd-126ea368241c	https://x.com/gabriel__xyz	creator	creator	26	\N	1	0	2025-03-18 06:39:35.622
be1f3c2a-37a0-43a9-9891-a190453945d7	https://x.com/aaronbesson	creator	creator	27	\N	1	0	2025-03-18 06:39:35.622
056a3110-3e17-4038-b9c0-e4797f17f48a	https://x.com/RyanEndacott	creator	creator	28	\N	1	0	2025-03-18 06:39:35.622
04304d54-7fde-478e-b8ba-7b67a8677314	https://x.com/ranking091	creator	creator	29	\N	0	0	2025-03-18 06:39:35.622
6a0ae8a1-eb62-455d-b7e4-800164d9f099	https://x.com/markszymik	creator	creator	30	\N	0	0	2025-03-18 06:39:35.622
92e0e154-5728-4adc-bf07-81a2865bb49f	https://x.com/FeineCapital	creator	creator	31	\N	0	0	2025-03-18 06:39:35.622
515c31fd-76a9-4f78-8388-b7dc0ad328bc	https://x.com/apsquareddev	creator	creator	32	\N	0	0	2025-03-18 06:39:35.622
cb85f6aa-6780-4be4-a442-acf436f0e552	https://x.com/codefun_xyz	creator	creator	33	\N	0	0	2025-03-18 06:39:35.622
e56a6cea-cd41-4904-a2e1-8cfbe1abe1fd	https://x.com/MrDee	creator	creator	34	\N	0	0	2025-03-18 06:39:35.622
545061d6-86d2-40db-88ca-f167921e30db	https://x.com/rajkstats	creator	creator	35	\N	0	0	2025-03-18 06:39:35.622
72b9166c-e8c5-4e6a-a3f8-65cdcf1b6ead	https://x.com/Hi_Bennie	creator	creator	36	\N	0	0	2025-03-18 06:39:35.622
484da3f2-69aa-4f89-9549-498171cf5280	https://x.com/sarperdag	creator	creator	37	\N	0	0	2025-03-18 06:39:35.622
35038d6f-643f-4f16-8fb1-4e99cd3c357d	https://x.com/vibecoding_	creator	creator	38	\N	0	0	2025-03-18 06:39:35.622
41c7ce52-ac07-46d7-a0d0-71d97ae2dc8e	https://x.com/NeuralPixelAI	creator	creator	39	\N	0	0	2025-03-18 06:39:35.622
f52aa7db-ee2d-409b-b278-0d902fc498ff	https://x.com/drosshole	creator	creator	40	\N	0	0	2025-03-18 06:39:35.622
b5940bb4-9972-4a3d-b89e-c46c5957c47e	https://x.com/reignboat	creator	creator	41	\N	0	0	2025-03-18 06:39:35.622
d9df1fdd-472f-4399-82b7-a11945e72069	https://x.com/NoFlinch	creator	creator	42	\N	0	0	2025-03-18 06:39:35.622
91f4a4f5-0d58-4983-8901-a442ee70f060	https://x.com/Oho_name	creator	creator	43	\N	0	0	2025-03-18 06:39:35.622
151b9918-6cb1-4c29-855e-cb758963bf20	https://x.com/nishant_ty	creator	creator	44	\N	0	0	2025-03-18 06:39:35.622
99375dd2-f403-4320-a460-c0abd7f6c73f	https://x.com/emreozdiyar	creator	creator	45	\N	0	0	2025-03-18 06:39:35.622
2a311f36-d45e-4379-acd1-e2df1ce466af	https://x.com/mischeiwiller	creator	creator	46	\N	0	0	2025-03-18 06:39:35.622
2c1a1dcd-9766-46b4-94f6-6eb4a75ad084	https://x.com/hankofalltrades	creator	creator	47	\N	0	0	2025-03-18 06:39:35.622
27942af9-00b5-4666-948e-e2625a25839d	https://x.com/tuantruong	creator	creator	48	\N	0	0	2025-03-18 06:39:35.622
6ca52f51-4dd3-4a10-831c-78670000b459	https://x.com/Khatarnak_Ishan	creator	creator	49	\N	0	0	2025-03-18 06:39:35.622
f2f20179-75b0-44bb-8606-df363fdbbdc8	https://x.com/hugohamelcom	creator	creator	50	\N	0	0	2025-03-18 06:39:35.622
ab8f6089-015c-4b12-91d2-41d7ea47d8c8	https://x.com/JonathanACaruso	creator	creator	51	\N	0	0	2025-03-18 06:39:35.622
0f9c0586-2bfe-416a-8e72-cdfa8a5e507c	https://x.com/AlbertSimonDev	creator	creator	52	\N	0	0	2025-03-18 06:39:35.622
7731b3b0-da73-407a-aa8d-64f8232cae8b	https://x.com/jbelevate	creator	creator	53	\N	0	0	2025-03-18 06:39:35.622
140405ea-1d3e-4c65-9716-7e76f572f143	https://x.com/HCBGreatWall	creator	creator	54	\N	0	0	2025-03-18 06:39:35.622
fafa8a79-2308-492c-9a6c-23dcd1b88d3e	https://x.com/Stianwalgermo	creator	creator	55	\N	0	0	2025-03-18 06:39:35.622
1156f9c3-80fc-418a-b263-7eebc263f236	https://x.com/balt1794	creator	creator	56	\N	0	0	2025-03-18 06:39:35.622
ac702583-face-416a-8670-cff4c4a1675b	https://x.com/benwmaddox	creator	creator	57	\N	0	0	2025-03-18 06:39:35.622
b6b6f2b2-1d5d-481d-9160-940457c82414	https://x.com/craygen9	creator	creator	58	\N	0	0	2025-03-18 06:39:35.622
71613d7e-1140-4bfa-bdd2-5eb246a608c5	https://x.com/skifull579	creator	creator	59	\N	0	0	2025-03-18 06:39:35.622
e6f62190-670d-4922-960b-054369b036bf	https://x.com/RealFredericVC	creator	creator	60	\N	0	0	2025-03-18 06:39:35.622
ee7ff031-5b7a-4502-a6c7-b1c21bf2c228	https://x.com/IsaacXVoxel	creator	creator	61	\N	0	0	2025-03-18 06:39:35.622
5caeb1dc-5d7c-4d18-852f-d952d725db88	https://x.com/Shpigford	creator	creator	62	\N	0	0	2025-03-18 06:39:35.622
33cfd7c0-8322-4b22-95fc-46c29c5e8e1a	https://x.com/joshuajohnsonAI	creator	creator	63	\N	0	0	2025-03-18 06:39:35.622
e1f24203-7da3-42a9-8e17-e5e4daea945a	https://x.com/isaactdozier	creator	creator	64	\N	0	0	2025-03-18 06:39:35.622
a5bc2f14-5be4-4f50-9480-875f295d9186	https://x.com/jasperdeboer	creator	creator	65	\N	0	0	2025-03-18 06:39:35.622
525465e2-d57b-4832-8c6b-a50222fcc019	https://x.com/andrwhcom	creator	creator	66	\N	0	0	2025-03-18 06:39:35.622
e2eac160-8bc3-4683-8af9-d7d06c550fc3	https://x.com/traemikal	creator	creator	67	\N	0	0	2025-03-18 06:39:35.622
03866a53-5110-4841-8cb3-c74cc09c04b9	https://x.com/adityakabra	creator	creator	68	\N	0	0	2025-03-18 06:39:35.622
64c01715-8844-4ec2-90b7-01051f4b7836	https://x.com/drewvergara	creator	creator	69	\N	0	0	2025-03-18 06:39:35.622
35cf91bd-5d7f-4447-b68f-7fc16e923a01	https://x.com/d4m1n	creator	creator	70	\N	0	0	2025-03-18 06:39:35.622
d39a60fb-0c7f-43ce-8ba1-19d15a1c232b	https://x.com/hi_itsbey	creator	creator	71	\N	0	0	2025-03-18 06:39:35.622
7ac0f2ab-1831-445e-b1a6-f6fda803adb1	https://x.com/mitchposts	creator	creator	72	\N	0	0	2025-03-18 06:39:35.622
64cfc83a-1cf5-4271-ac4e-c3696f903534	https://x.com/finvisual	creator	creator	73	\N	0	0	2025-03-18 06:39:35.622
d9b930bc-6d06-4b22-a911-eadd542c8828	https://x.com/xiaochi2	creator	creator	74	\N	0	0	2025-03-18 06:39:35.622
5c05face-7e06-41f4-968a-2187f1c8648b	https://x.com/PeakGrizzly	creator	creator	75	\N	0	0	2025-03-18 06:39:35.622
368e690f-ae67-4c91-bb86-c74029ca2c64	https://x.com/nomalex_	creator	creator	76	\N	0	0	2025-03-18 06:39:35.622
1d87bf06-978a-427e-a524-324d5504f7d9	https://x.com/Akkorothone	creator	creator	77	\N	0	0	2025-03-18 06:39:35.622
28e24bc2-9598-458e-b028-2a1603005c55	https://x.com/jasonleowsg	creator	creator	78	\N	0	0	2025-03-18 06:39:35.622
58829ced-785e-4c6e-b8f1-69c8b6507fca	https://x.com/notpurav	creator	creator	79	\N	0	0	2025-03-18 06:39:35.622
e43c177a-a167-4742-80ea-ac8fbf9a4ffd	https://x.com/iagolast	creator	creator	80	\N	0	0	2025-03-18 06:39:35.622
33600bd5-47cd-4998-9e64-3089b588abce	https://x.com/athcanft	creator	creator	81	\N	0	0	2025-03-18 06:39:35.622
8c850398-2144-4e12-b1b7-a32beb6cd59c	https://x.com/Kaberikram	creator	creator	82	\N	0	0	2025-03-18 06:39:35.622
2f6c1219-16c9-4235-a1f5-d79f6edbf939	https://x.com/sagarsaija	creator	creator	83	\N	0	0	2025-03-18 06:39:35.622
aa29e922-e009-4316-8bf7-623231425c72	https://x.com/donvito	creator	creator	84	\N	0	0	2025-03-18 06:39:35.622
fd53b594-8097-4710-8b4b-66495ac262b0	https://x.com/fabianbuilds	creator	creator	85	\N	0	0	2025-03-18 06:39:35.622
b1366fb7-f4d5-497a-83ce-d3c9ea3c0924	https://x.com/farez	creator	creator	86	\N	0	0	2025-03-18 06:39:35.622
7c44a387-ead8-455e-92c1-647be80ac44f	https://x.com/vlucendo	creator	creator	87	\N	0	0	2025-03-18 06:39:35.622
8b65abad-3165-4d2a-bfc2-25b4302ca620	https://x.com/anslogen	creator	creator	88	\N	0	0	2025-03-18 06:39:35.622
5f991713-3d47-473e-b00d-b4e05be4ee31	https://x.com/jagger_sa	creator	creator	89	\N	0	0	2025-03-18 06:39:35.622
cd80b2fd-602d-4fbc-b385-0ee968cbae88	https://x.com/Daniel_Farinax	creator	creator	90	\N	0	0	2025-03-18 06:39:35.622
23abdb3d-b6d9-4124-a9ca-5b60f0235ebb	https://x.com/saikatkrdey	creator	creator	91	\N	0	0	2025-03-18 06:39:35.622
a80f3a7e-7308-4adf-a574-b2232f0cfa3a	https://x.com/NicolasZu	creator	creator	92	\N	0	0	2025-03-18 06:39:35.622
d891dc0d-31af-4240-a499-ac09e7e0e63f	https://x.com/maxhertan	creator	creator	93	\N	0	0	2025-03-18 06:39:35.622
be1a5ac9-b8a7-4c42-93d0-022c0b68ddab	1c44b058-5546-4826-ae5b-262763ad2a31	game	popularity	1	38	4	17	2025-03-18 06:49:17.915
02386dbc-9451-4656-ab6d-26e0b51a13ac	708299c8-25f6-45c6-ad30-3dc8592775d4	game	popularity	2	28	16	6	2025-03-18 06:49:17.915
6cf9edef-6c4e-42d0-9cca-4c56e882901a	2272eed7-d25d-496f-aece-6aa7cbaac8bd	game	popularity	3	22	4	9	2025-03-18 06:49:17.915
e2fc3391-2f11-4647-9953-20a7ec12a72a	d5663aac-ae60-473b-b36d-d00b4504dcc2	game	popularity	4	19	15	2	2025-03-18 06:49:17.915
7af2afbc-85b5-44fc-81f9-8e13197774a4	408320e2-1adb-470a-b015-6e39bf8a5990	game	popularity	5	18	6	6	2025-03-18 06:49:17.915
c81ee25f-dd61-4da5-91cd-4f873f8e8f3f	8074fbb7-fe43-4c9b-aa2b-839438670652	game	popularity	6	18	6	6	2025-03-18 06:49:17.915
c93d5568-aa8d-4e44-a138-b4e454193f3b	bbbf2d80-4dba-4faf-a777-09cb88159bc1	game	popularity	7	15	7	4	2025-03-18 06:49:17.915
cd8c820c-c84d-424d-b042-21b15ae00420	bf456723-0c50-448d-9732-623f581da6a0	game	popularity	8	11	11	0	2025-03-18 06:49:17.915
9ff19e47-07a1-443b-af55-14ca0718e107	13a9b6f6-0b5b-416b-ab9e-3e143dd6bfce	game	popularity	9	11	9	1	2025-03-18 06:49:17.915
c073758a-5381-444c-b38c-417cc772e35e	f68e6594-fe6b-4779-8483-99c510580c6b	game	popularity	10	10	2	4	2025-03-18 06:49:17.915
b257567e-0c7e-444d-ae32-c6aafada11fc	cc4c1e10-ce79-4157-9138-7f59e14ef6fc	game	popularity	11	9	5	2	2025-03-18 06:49:17.915
71709395-6b6f-4485-b262-e1e43c6e2808	91698f39-9bc5-464f-8aaf-e73a8a0f3cea	game	popularity	12	9	3	3	2025-03-18 06:49:17.915
3088d72c-b335-4a8d-8840-26313a631694	20f4e68a-8d53-454a-a405-d40fa30e4674	game	popularity	13	7	7	0	2025-03-18 06:49:17.915
efe089da-0c3b-4ced-aa41-d2098f1b3a4d	75d16c0b-6af6-482b-8333-44247339f9e8	game	popularity	14	6	0	3	2025-03-18 06:49:17.915
c87c0e2d-a8ca-4eb2-91c6-cdd0ad17dbc5	30cdfe59-56b7-4ea4-8f20-c975698e4541	game	popularity	15	6	4	1	2025-03-18 06:49:17.915
f8fc0c3e-15df-42ba-9e4d-38eb61142385	8d3ebac9-6a26-4269-96c4-d6da0514d5b1	game	popularity	16	6	4	1	2025-03-18 06:49:17.915
a5445ea3-5593-4865-b75e-e4d170e4e1c0	cab0a67a-4967-4c77-901d-12970681ec85	game	popularity	17	4	2	1	2025-03-18 06:49:17.915
8766a9d5-bf00-4869-a9d8-70b1ae8ba67b	59aee7d1-1d45-4386-a3e4-c164cc4de46d	game	popularity	18	4	2	1	2025-03-18 06:49:17.915
cf2467d1-4156-4f83-979a-20fc2b5cb59b	c60de4b9-bb22-4b66-ba31-8a6754f8a876	game	popularity	19	4	2	1	2025-03-18 06:49:17.915
a91dc9a1-66b3-4a32-8772-714abd5059f9	bfbf5cd7-c44b-4054-a1a8-71455c04f29d	game	popularity	20	4	4	0	2025-03-18 06:49:17.915
0ebb945c-3316-41ca-87ac-98f8988a1475	162a11b3-6138-4540-86ae-f50619bac7f4	game	popularity	21	2	2	0	2025-03-18 06:49:17.915
47d564f3-af3e-402e-a2eb-3eb5519d262a	e0173448-5bdb-410d-a47b-0174bf726c8b	game	popularity	22	2	2	0	2025-03-18 06:49:17.915
2bbac219-15c5-4ef6-b204-621c1530c5fa	86c45ba5-ab0f-452b-b1e8-877a898bec14	game	popularity	23	2	2	0	2025-03-18 06:49:17.915
0b4a0af4-9da0-446a-843d-d7cbd207e0e2	193935c5-ac96-4664-bcc0-9869b84e1548	game	popularity	24	2	2	0	2025-03-18 06:49:17.915
57a8901c-3600-410e-b3b0-bc836f78e09b	2bc0e5cc-9d7e-438c-b1b3-c963b3c84aec	game	popularity	25	1	1	0	2025-03-18 06:49:17.915
0a0c5504-c3af-4384-9024-70da6c416eac	9b149ef6-7d84-4edc-8283-8b5522ce3518	game	popularity	26	1	1	0	2025-03-18 06:49:17.915
813d8bee-80f6-46f9-a7a6-094c2768f760	a3235777-29c9-418d-8b3d-bec551b9e174	game	popularity	27	1	1	0	2025-03-18 06:49:17.915
b910e2b1-da83-4857-afe1-ba7c599d6d97	2bfa4820-05e8-429d-91db-fd43914f98f9	game	popularity	28	1	1	0	2025-03-18 06:49:17.915
d2f56f78-0544-4c55-aec9-f61bdf85aefb	7f37cb28-0731-4c2a-b1b9-16cd56a57367	game	popularity	29	1	1	0	2025-03-18 06:49:17.915
1a21792c-3415-4666-b8fb-15cb372d4762	d675ee59-bc51-4acb-a74a-2a51dca64cbe	game	popularity	30	0	0	0	2025-03-18 06:49:17.915
c8386a5b-c7ea-4af6-a78f-d781406d50ce	d5fba96c-069e-4242-9206-3d145ccf899a	game	popularity	31	0	0	0	2025-03-18 06:49:17.915
c09b210d-b78c-4548-80d4-03f1369bfe01	b492c7d1-f9c5-4b3b-a49b-eae4fe82bc83	game	popularity	32	0	0	0	2025-03-18 06:49:17.915
6ffba013-8c1d-4c1d-bc07-00e3553e0758	bb935fc4-4063-4709-874a-20e8dd1ba36f	game	popularity	33	0	0	0	2025-03-18 06:49:17.915
0d9cd229-44fa-4061-9360-b1454da83967	2964c8d9-953c-41a9-aa4f-653d261d14e6	game	popularity	34	0	0	0	2025-03-18 06:49:17.915
3e57230f-eba6-4220-8c7d-ea51093a285b	3ebb0eb7-753f-4778-8b67-7fd98a94b49c	game	popularity	35	0	0	0	2025-03-18 06:49:17.915
278505bb-db96-4b4f-a065-15c3804123da	f8279a3a-cbc2-446e-a640-080b05366998	game	popularity	36	0	0	0	2025-03-18 06:49:17.915
9e5a7780-aefe-4d71-bea4-d6e1a3426a9a	34734b25-58ec-46ab-ac41-1bceccdab4fa	game	popularity	37	0	0	0	2025-03-18 06:49:17.915
6eb053cb-4dad-490f-90dc-81094026aaa4	63ecb365-86eb-4c0e-9100-b697c7df6a90	game	popularity	38	0	0	0	2025-03-18 06:49:17.915
37a05579-2ca1-4f1c-b03d-3fdeafb2909d	8c2d3fdb-bfa7-4838-9e7e-fbe9ca69c12b	game	popularity	39	0	0	0	2025-03-18 06:49:17.915
02eb4761-a679-48af-8801-0133fdff567b	bbdb0453-4d4d-45ed-ba49-e132cae453f1	game	popularity	40	0	0	0	2025-03-18 06:49:17.915
ca8d7eee-5d4d-43f1-b5f9-3090bd0dd042	e035a8c3-809b-4989-aa39-d5dae607c309	game	popularity	41	0	0	0	2025-03-18 06:49:17.915
58b561cf-d9c4-4a2a-bc3e-6cec58b4b3dd	844c3033-7af0-46bc-965f-d7d6c8696660	game	popularity	42	0	0	0	2025-03-18 06:49:17.915
5fb17a21-7bcd-412f-9c51-7f10b00d1428	0b859c68-a877-40a3-9f8e-ca0bc40317b5	game	popularity	43	0	0	0	2025-03-18 06:49:17.915
482fae12-f897-4127-a023-c3360358b09f	f7a0e68c-d889-4436-be6a-9f592244ecf0	game	popularity	44	0	0	0	2025-03-18 06:49:17.915
61e2408a-6a6a-4829-8403-f1ffe877ab09	00bae889-15b5-402f-976e-60f288c8c882	game	popularity	45	0	0	0	2025-03-18 06:49:17.915
1e003e97-b1d1-45ca-bd28-09bb50da2e53	b7c322be-7029-435d-baf3-631200ce6ddb	game	popularity	46	0	0	0	2025-03-18 06:49:17.915
4a53dce6-90c2-459e-b1f9-afbf898ddb40	90dd0c2f-f8cf-47ff-81a5-9613739b59b3	game	popularity	47	0	0	0	2025-03-18 06:49:17.915
f2e16263-3dce-40f8-8616-48f58ab40f89	5ab0ce77-3c98-4659-a98f-357d042047d9	game	popularity	48	0	0	0	2025-03-18 06:49:17.915
a59ae09f-847b-4211-82d7-ef977f8ba830	04699df4-76cd-4f84-900a-dd65d5ae7052	game	popularity	49	0	0	0	2025-03-18 06:49:17.915
61f97363-21b2-466c-a47c-e57d187dbe4f	7fa78729-6336-441f-8ed6-9c827de2bfe3	game	popularity	50	0	0	0	2025-03-18 06:49:17.915
e896af9b-b40b-47d4-a6b3-9b43c3e97e28	b98ca5e9-7424-4208-8f0a-dbac8c6ca808	game	popularity	51	0	0	0	2025-03-18 06:49:17.915
291d3296-be97-4c97-85d1-7843eb60fa1a	219f782b-fed3-4c58-84ec-25f59e930d34	game	popularity	52	0	0	0	2025-03-18 06:49:17.915
025064e9-198a-4b11-9f44-f866907a227e	23f70fdf-049c-4b86-b946-d66ef18d38b4	game	popularity	53	0	0	0	2025-03-18 06:49:17.915
c6824c9b-57fe-42a5-a376-acf833821c4d	db27129f-f6b4-409d-8d3a-20a590c816f3	game	popularity	54	0	0	0	2025-03-18 06:49:17.915
9d9b067b-9d70-4637-ae10-e2f52f32f9be	b25564d4-e26d-4933-baa4-60d04b385a6a	game	popularity	55	0	0	0	2025-03-18 06:49:17.915
a1fdf357-8cb8-40eb-ac2a-9bab42946ff5	55887d6d-ef93-44fc-9e0a-afb5cbd83df0	game	popularity	56	0	0	0	2025-03-18 06:49:17.915
6c384f62-8770-4bc4-a6af-df30aaf643de	73875939-a972-4927-b0c6-ae68249bfdb9	game	popularity	57	0	0	0	2025-03-18 06:49:17.915
f0822671-27d8-47d4-aa26-1fafc4b82e32	0af2b647-0e29-4f99-b32f-96501608bf3c	game	popularity	58	0	0	0	2025-03-18 06:49:17.915
1bd7b481-c310-47c3-8cb3-473be8136417	4aaa007f-ff17-452a-8917-4dd47a8102b4	game	popularity	59	0	0	0	2025-03-18 06:49:17.915
52dfa53d-79f7-4d1e-a01f-34bc26c76c38	31c831b2-5562-4968-ba09-1a5459bb1b92	game	popularity	60	0	0	0	2025-03-18 06:49:17.915
d568bf37-5bcb-47b2-af75-ca2c6a40d688	e5e98736-5eed-4bf3-82d5-fbc29eaaf4b2	game	popularity	61	0	0	0	2025-03-18 06:49:17.915
74d28b52-a2f1-49ab-a1b4-68ad1ce4862b	35096d12-6a4a-4e7a-aed9-19b5db5db10c	game	popularity	62	0	0	0	2025-03-18 06:49:17.915
44ec43a9-1c95-4d21-85bc-76920a3639d4	d5114658-91f6-4b1f-834d-be49235e419c	game	popularity	63	0	0	0	2025-03-18 06:49:17.915
53bdd2cd-deab-47d4-bb80-f171e5b051c2	533711da-7205-4171-b1b3-76f725ce4da2	game	popularity	64	0	0	0	2025-03-18 06:49:17.915
560f1981-a679-444c-a6c0-7d1ae61543ed	2c91becf-3c2b-4692-a762-66caeec53d1e	game	popularity	65	0	0	0	2025-03-18 06:49:17.915
3c080ec8-dcac-4514-b75c-d1b1a7232328	d41e8753-0ada-4b33-bed9-a688ffa34d9e	game	popularity	66	0	0	0	2025-03-18 06:49:17.915
22a2c588-6494-4cbd-8c21-3c841f00a65b	341b131e-4d79-4f7b-82da-bf8174bcceaf	game	popularity	67	0	0	0	2025-03-18 06:49:17.915
8ba78a72-3421-4ab1-b8cc-81ecb1b5ee7d	7854fc02-d82c-4044-a52b-dd01380bfd7d	game	popularity	68	0	0	0	2025-03-18 06:49:17.915
6608453f-7978-4fd3-b2be-a0a20177a062	4a8a627b-d49e-478c-9a93-d08d4100837a	game	popularity	69	0	0	0	2025-03-18 06:49:17.915
6d440be5-9978-405f-af73-53f361fa53e6	77261e65-6403-44cf-9f3f-2cc9f3d95f13	game	popularity	70	0	0	0	2025-03-18 06:49:17.915
90c94fe3-9bea-4637-b4d0-5daa7549495d	07b92061-6f7f-4355-8be5-7e215deba937	game	popularity	71	0	0	0	2025-03-18 06:49:17.915
eeb6ef4b-1028-4dad-b9e3-fe5aafa0f32d	8b7021c3-73e4-46d9-b84f-b6291be61d3a	game	popularity	72	0	0	0	2025-03-18 06:49:17.915
1b2b5082-8a0f-429c-9637-23f497639e7c	084cfb0c-2623-48cf-b8d6-2d6d6c0baec1	game	popularity	73	0	0	0	2025-03-18 06:49:17.915
bb3c2daa-7e0f-4bd0-8fe6-f2d12563e968	95b4658f-3578-4409-be47-6ec79ff6204f	game	popularity	74	0	0	0	2025-03-18 06:49:17.915
997ef732-a37b-4682-b1ca-46a83252bb54	d801607f-418e-4330-8f75-d947467ce3aa	game	popularity	75	0	0	0	2025-03-18 06:49:17.915
c8647c60-c7f3-4495-a331-04cc7427f817	ba0fa9e9-9eba-403c-be52-2a136ecf3b7a	game	popularity	76	0	0	0	2025-03-18 06:49:17.915
ad7bf396-df47-4eab-9820-56c21a1543fb	22845991-0fb6-4bdf-9725-0525b565699c	game	popularity	77	0	0	0	2025-03-18 06:49:17.915
b5582226-8899-466d-bfc5-cc95f9fa1299	dfba9261-3270-4ba2-9110-5103eb8c03c9	game	popularity	78	0	0	0	2025-03-18 06:49:17.915
77f160af-5d0c-4e7b-b756-355bf8c55c12	bcbbaf7b-bd8e-413d-b42b-e483d4dec771	game	popularity	79	0	0	0	2025-03-18 06:49:17.915
9045caad-bd7d-46dd-aba9-31a5bfb9ae49	ed450b52-5caa-492f-8790-d3c6b4f77fff	game	popularity	80	0	0	0	2025-03-18 06:49:17.915
523a84cd-a8d3-41f7-8f62-d64f4648e02f	f0e24ffc-e714-4da0-8510-35cfbb521ffb	game	popularity	81	0	0	0	2025-03-18 06:49:17.915
2253d704-c1a8-49ef-af9c-d4221b612fe2	8ad6e622-f36f-42e3-aac7-92aa7d3a8288	game	popularity	82	0	0	0	2025-03-18 06:49:17.915
a2853c97-1ef0-4eff-a0f7-14a060d0d88a	788597c7-0923-4688-a425-6e694b0007d2	game	popularity	83	0	0	0	2025-03-18 06:49:17.915
d8e56f0a-56f2-49b7-9053-2e8a9f63cd96	8759da60-d5ce-42b4-b0aa-fafdbd345aa2	game	popularity	84	0	0	0	2025-03-18 06:49:17.915
e2591b60-ddb2-4c00-836d-df425587afae	25754fe0-22d6-4e01-b552-add4be72ae48	game	popularity	85	0	0	0	2025-03-18 06:49:17.915
3c152fb8-61a6-4dad-8a4d-30834e9cf058	af707792-b791-4803-9d5d-dd83bf7fcc87	game	popularity	86	0	0	0	2025-03-18 06:49:17.915
832051c2-a45b-4807-af4e-6cab9edf37e6	f67f4c00-47fa-4ee3-a7bd-8a1bacd6f95e	game	popularity	87	0	0	0	2025-03-18 06:49:17.915
c64be099-2c9d-4b92-b406-fdfe00ce8263	8cfc30a0-f692-4e4e-bdca-ad4c2c372cd1	game	popularity	88	0	0	0	2025-03-18 06:49:17.915
5d6cffc8-555c-42fc-adf4-da51e60a86db	c10111fb-d178-4643-b837-7ef19bef8f41	game	popularity	89	0	0	0	2025-03-18 06:49:17.915
b49b9cfa-a2f7-4038-9143-18b289d4f260	59b2393e-ebab-4d7e-b9c3-b2aaa0bd8513	game	popularity	90	0	0	0	2025-03-18 06:49:17.915
62aed405-a0f4-462f-9429-b4ebfaddec1a	dca78d28-45b4-44ea-9bc7-80baf7008641	game	popularity	91	0	0	0	2025-03-18 06:49:17.915
9fdd5e7a-42f4-4557-ae3a-4654bb1423fa	07d6775c-e242-4597-a44e-e22437a49459	game	popularity	92	0	0	0	2025-03-18 06:49:17.915
71b96c6f-dcda-4b63-9ff0-38409d98dd2f	16d4082f-5b2f-4528-bc21-c105e46abbdf	game	popularity	93	0	0	0	2025-03-18 06:49:17.915
d49e51e5-e558-45d5-b8b7-3d1451b5f22b	9748c31e-640b-4263-b719-da3a8f08736e	game	popularity	94	0	0	0	2025-03-18 06:49:17.915
bf9232fd-1b35-4a45-8788-045afe626e01	b4d24777-f913-46b7-983d-88490a68e2c0	game	popularity	95	0	0	0	2025-03-18 06:49:17.915
7efbab7f-0cd2-41fa-b7e9-f0843400b24e	4626e481-051b-4832-ba44-be606da797c6	game	popularity	96	0	0	0	2025-03-18 06:49:17.915
7b57f5e3-f0c3-47b1-b60b-6b5566c93b34	8f9010c4-d77b-4887-9cc3-0c9b7010c569	game	popularity	97	0	0	0	2025-03-18 06:49:17.915
8a055ff2-c56c-415d-88d2-3a03cb60f9f4	6cb521f3-5336-4f75-8bbb-9b67d8b7ba3f	game	popularity	98	0	0	0	2025-03-18 06:49:17.915
a1693964-f9d7-4dfd-9f90-28bbf129e95a	83afb8c5-9e23-4fa8-9168-83decbd7978d	game	popularity	99	0	0	0	2025-03-18 06:49:17.915
69b87bee-72ca-46fc-ac24-6f5a7ee50d3d	d2bc2c08-c7b5-47b7-b45b-fa3b5b2e8f36	game	popularity	100	0	0	0	2025-03-18 06:49:17.915
7b0235e0-c6f0-46b0-8ce4-8ae5a4974064	4b3fa1ed-a7fa-4185-9f03-519c76913aca	game	popularity	101	0	0	0	2025-03-18 06:49:17.915
49e39cd5-2653-4d5e-be20-f1bf60b641a0	0dd8000b-48c2-4f63-addc-f4e908dd939e	game	popularity	102	0	0	0	2025-03-18 06:49:17.915
3f24bbba-b493-4ac9-842c-01a4e529c474	46250f21-9a73-4146-88f4-513a1c5f99d9	game	popularity	103	0	0	0	2025-03-18 06:49:17.915
20ff5b2a-cba3-4592-9ade-ed522c45af6b	18b64c24-3028-4d04-98e5-c4382f0c8cd0	game	popularity	104	0	0	0	2025-03-18 06:49:17.915
14f0936a-e652-4784-8cb5-4bb56824b0b3	4bebe6a9-db56-453e-a85d-0400cb5a08f5	game	popularity	105	0	0	0	2025-03-18 06:49:17.915
92af44a5-489b-4ff8-b757-ab7b35855ea2	61f434ad-2388-45de-b373-b561be63590b	game	popularity	106	0	0	0	2025-03-18 06:49:17.915
a80fcaf5-168d-415c-a6a6-ffe4cd9a5785	3e78f568-8737-4c77-a46b-e326470acb70	game	popularity	107	0	0	0	2025-03-18 06:49:17.915
f96b9ba6-aa3b-40b4-9acd-26f162908e19	24d8d342-b1d7-40ee-8ad4-6c5636c04661	game	popularity	108	0	0	0	2025-03-18 06:49:17.915
62361b5f-ac17-48e1-9a4e-acb5a4fa0d1f	eccd75c9-812b-4464-b542-8dc1c4fa94f9	game	popularity	109	0	0	0	2025-03-18 06:49:17.915
9cf27eff-34d6-489f-bcd2-a06ce5c324d2	9359a360-70c0-43ad-bceb-9912f7d134da	game	popularity	110	0	0	0	2025-03-18 06:49:17.915
9a683533-f8dd-4d2e-bd4a-111f44f3cf3c	054009be-8fa3-4bdb-a853-57f5c355583f	game	popularity	111	0	0	0	2025-03-18 06:49:17.915
ce8dd840-cf67-4539-a0a3-9e81f4e375f0	59aee7d1-1d45-4386-a3e4-c164cc4de46d	game	quality	1	0.8888888888888888	2	1	2025-03-18 06:49:17.915
f9d10d63-3337-4645-b1d7-098139bd1592	2272eed7-d25d-496f-aece-6aa7cbaac8bd	game	quality	2	0.875	4	9	2025-03-18 06:49:17.915
00cba177-cf5b-403c-a87b-6ecd2efc4755	13a9b6f6-0b5b-416b-ab9e-3e143dd6bfce	game	quality	3	0.8461538461538461	9	1	2025-03-18 06:49:17.915
02345037-06a8-4db6-aa5d-bb77223be15e	bbbf2d80-4dba-4faf-a777-09cb88159bc1	game	quality	4	0.8433734939759037	7	4	2025-03-18 06:49:17.915
0e1a097a-87da-4512-8520-842c22c1f823	d675ee59-bc51-4acb-a74a-2a51dca64cbe	game	quality	5	0.8181818181818182	0	0	2025-03-18 06:49:17.915
26c3ae39-2564-4058-a810-436464513462	75d16c0b-6af6-482b-8333-44247339f9e8	game	quality	6	0.8	0	3	2025-03-18 06:49:17.915
ca097607-90eb-4116-953b-5d868b325282	408320e2-1adb-470a-b015-6e39bf8a5990	game	quality	7	0.8	6	6	2025-03-18 06:49:17.915
dd3d664a-0299-457c-8b70-5be23a207136	708299c8-25f6-45c6-ad30-3dc8592775d4	game	quality	8	0.8	16	6	2025-03-18 06:49:17.915
f71e37ba-919f-4247-abe4-e03819031d7b	cc4c1e10-ce79-4157-9138-7f59e14ef6fc	game	quality	9	0.75	5	2	2025-03-18 06:49:17.915
409ba1c4-6dd7-4057-8d44-3f4d1a107793	d5663aac-ae60-473b-b36d-d00b4504dcc2	game	quality	10	0.6363636363636364	15	2	2025-03-18 06:49:17.915
bffadf44-b400-485a-a0c2-f9f91cc38525	1c44b058-5546-4826-ae5b-262763ad2a31	game	quality	11	0.625	4	17	2025-03-18 06:49:17.915
5bb55e74-4cfc-49ee-974f-8edb9450b9c1	30cdfe59-56b7-4ea4-8f20-c975698e4541	game	quality	12	0.6	4	1	2025-03-18 06:49:17.915
37e24ea6-6b09-40bd-b079-a3fb524c81d3	bf456723-0c50-448d-9732-623f581da6a0	game	quality	13	0.6	11	0	2025-03-18 06:49:17.915
c465b3f2-a4fd-4649-932c-86c02f6af3b8	162a11b3-6138-4540-86ae-f50619bac7f4	game	quality	14	0.6	2	0	2025-03-18 06:49:17.915
d2d0d0d8-5e42-493f-8acd-141006a1577b	20f4e68a-8d53-454a-a405-d40fa30e4674	game	quality	15	0.5	7	0	2025-03-18 06:49:17.915
ea83dd4c-28cd-4615-bd98-b50e017e5c9c	bfbf5cd7-c44b-4054-a1a8-71455c04f29d	game	quality	16	0.5	4	0	2025-03-18 06:49:17.915
863fa066-28a9-42e1-bf34-8c3d67ac1738	cab0a67a-4967-4c77-901d-12970681ec85	game	quality	17	0.5	2	1	2025-03-18 06:49:17.915
19c0f6cc-5a1a-4b71-9019-ac062d8cf195	f68e6594-fe6b-4779-8483-99c510580c6b	game	quality	18	0.5	2	4	2025-03-18 06:49:17.915
12811b39-618a-4aef-ad36-708c2010e2ec	d5fba96c-069e-4242-9206-3d145ccf899a	game	quality	19	0.5	0	0	2025-03-18 06:49:17.915
279fa80c-e151-45c2-acf4-3d9b5c45ff40	b492c7d1-f9c5-4b3b-a49b-eae4fe82bc83	game	quality	20	0.5	0	0	2025-03-18 06:49:17.915
31ddb676-aeb8-4aa7-81ee-993963fcf081	bb935fc4-4063-4709-874a-20e8dd1ba36f	game	quality	21	0.5	0	0	2025-03-18 06:49:17.915
65fc08a1-5772-495c-a957-e2836fa37c8b	2964c8d9-953c-41a9-aa4f-653d261d14e6	game	quality	22	0.5	0	0	2025-03-18 06:49:17.915
f348eeb3-711a-4d7e-a605-1a2f21f5b7cf	3ebb0eb7-753f-4778-8b67-7fd98a94b49c	game	quality	23	0.5	0	0	2025-03-18 06:49:17.915
3fa0c1c3-ad84-4e1d-832f-1b2554759936	f8279a3a-cbc2-446e-a640-080b05366998	game	quality	24	0.5	0	0	2025-03-18 06:49:17.915
c93ec258-6b51-4b94-83f0-807ca54c341e	34734b25-58ec-46ab-ac41-1bceccdab4fa	game	quality	25	0.5	0	0	2025-03-18 06:49:17.915
959a5bc7-5d85-46eb-b49a-5fd4e7f48906	63ecb365-86eb-4c0e-9100-b697c7df6a90	game	quality	26	0.5	0	0	2025-03-18 06:49:17.915
da006494-6b8c-4bff-b711-58e9df5f23c9	8c2d3fdb-bfa7-4838-9e7e-fbe9ca69c12b	game	quality	27	0.5	0	0	2025-03-18 06:49:17.915
8f815e5e-e1e0-42fe-a432-ef9f45c2c267	bbdb0453-4d4d-45ed-ba49-e132cae453f1	game	quality	28	0.5	0	0	2025-03-18 06:49:17.915
58c13206-43c2-4781-971a-f16f39fe0b46	e035a8c3-809b-4989-aa39-d5dae607c309	game	quality	29	0.5	0	0	2025-03-18 06:49:17.915
1d6785dd-89d1-4f25-919a-74cb46515683	844c3033-7af0-46bc-965f-d7d6c8696660	game	quality	30	0.5	0	0	2025-03-18 06:49:17.915
8a8349b2-5c58-4de4-929e-0fa563aef1ba	0b859c68-a877-40a3-9f8e-ca0bc40317b5	game	quality	31	0.5	0	0	2025-03-18 06:49:17.915
13ccc33a-d70b-49e4-9e3d-c86d066f2764	f7a0e68c-d889-4436-be6a-9f592244ecf0	game	quality	32	0.5	0	0	2025-03-18 06:49:17.915
419dfe62-52dc-4809-9853-5baa0e3f83df	00bae889-15b5-402f-976e-60f288c8c882	game	quality	33	0.5	0	0	2025-03-18 06:49:17.915
49a787c8-2095-42d6-a139-a7c9ca8f7e4f	b7c322be-7029-435d-baf3-631200ce6ddb	game	quality	34	0.5	0	0	2025-03-18 06:49:17.915
8613cb3c-9983-4db6-821f-6534404508e5	90dd0c2f-f8cf-47ff-81a5-9613739b59b3	game	quality	35	0.5	0	0	2025-03-18 06:49:17.915
c5e9039c-558d-4089-b68d-4e9466bf0eba	5ab0ce77-3c98-4659-a98f-357d042047d9	game	quality	36	0.5	0	0	2025-03-18 06:49:17.915
dd6ddfcd-e1ca-44b9-b4dc-e0f76e711359	04699df4-76cd-4f84-900a-dd65d5ae7052	game	quality	37	0.5	0	0	2025-03-18 06:49:17.915
a1795aa8-19a9-43fb-be9d-f54ee129596a	7fa78729-6336-441f-8ed6-9c827de2bfe3	game	quality	38	0.5	0	0	2025-03-18 06:49:17.915
e2dba6a9-9add-40ac-b239-da675c2c5856	b98ca5e9-7424-4208-8f0a-dbac8c6ca808	game	quality	39	0.5	0	0	2025-03-18 06:49:17.915
00a0db24-fefc-4be6-98c0-6f2f0078bb00	219f782b-fed3-4c58-84ec-25f59e930d34	game	quality	40	0.5	0	0	2025-03-18 06:49:17.915
c7fb0860-f758-47b8-9e3d-2e893938f140	23f70fdf-049c-4b86-b946-d66ef18d38b4	game	quality	41	0.5	0	0	2025-03-18 06:49:17.915
9eb116c9-a9a0-41af-a7c4-a8d3b05a25d4	db27129f-f6b4-409d-8d3a-20a590c816f3	game	quality	42	0.5	0	0	2025-03-18 06:49:17.915
90ade41d-9fc7-4e66-bfd5-00f47b35754b	b25564d4-e26d-4933-baa4-60d04b385a6a	game	quality	43	0.5	0	0	2025-03-18 06:49:17.915
8dccb780-8685-410e-9a6f-2049ce22706e	55887d6d-ef93-44fc-9e0a-afb5cbd83df0	game	quality	44	0.5	0	0	2025-03-18 06:49:17.915
b7f66734-53fb-486f-9807-7f801caef95d	73875939-a972-4927-b0c6-ae68249bfdb9	game	quality	45	0.5	0	0	2025-03-18 06:49:17.915
5be883ac-b88f-4d02-9c86-720d58d86d4d	0af2b647-0e29-4f99-b32f-96501608bf3c	game	quality	46	0.5	0	0	2025-03-18 06:49:17.915
9dadd5f4-afc8-49b5-b8a6-ac2e19f7bcd7	4aaa007f-ff17-452a-8917-4dd47a8102b4	game	quality	47	0.5	0	0	2025-03-18 06:49:17.915
2b054b57-4002-47b5-a1aa-e9f444822f1d	31c831b2-5562-4968-ba09-1a5459bb1b92	game	quality	48	0.5	0	0	2025-03-18 06:49:17.915
3390fe4f-8b0c-4716-b5df-61671bdae2fa	e5e98736-5eed-4bf3-82d5-fbc29eaaf4b2	game	quality	49	0.5	0	0	2025-03-18 06:49:17.915
1ba5b318-0160-40e9-8978-070cbd948fd3	35096d12-6a4a-4e7a-aed9-19b5db5db10c	game	quality	50	0.5	0	0	2025-03-18 06:49:17.915
826afa27-988c-4d4f-880a-721b57d42af6	d5114658-91f6-4b1f-834d-be49235e419c	game	quality	51	0.5	0	0	2025-03-18 06:49:17.915
29ae5489-1d51-417c-a3b5-859b29cc0d79	533711da-7205-4171-b1b3-76f725ce4da2	game	quality	52	0.5	0	0	2025-03-18 06:49:17.915
b797708b-465b-49bb-aa2d-a8202ef79df5	2c91becf-3c2b-4692-a762-66caeec53d1e	game	quality	53	0.5	0	0	2025-03-18 06:49:17.915
bbb700e2-cbab-47a9-8278-3591a912520f	d41e8753-0ada-4b33-bed9-a688ffa34d9e	game	quality	54	0.5	0	0	2025-03-18 06:49:17.915
8d602479-07de-4125-9dcd-baf05218bfc0	341b131e-4d79-4f7b-82da-bf8174bcceaf	game	quality	55	0.5	0	0	2025-03-18 06:49:17.915
0e677b02-eb84-4979-ac84-cf02d7a9dc42	7854fc02-d82c-4044-a52b-dd01380bfd7d	game	quality	56	0.5	0	0	2025-03-18 06:49:17.915
6a54ec8b-4182-4c6a-b9a8-78ed984dc102	4a8a627b-d49e-478c-9a93-d08d4100837a	game	quality	57	0.5	0	0	2025-03-18 06:49:17.915
eb2543f4-6776-4211-8d45-5f4f5736d110	2bc0e5cc-9d7e-438c-b1b3-c963b3c84aec	game	quality	58	0.5	1	0	2025-03-18 06:49:17.915
51079aa4-7672-448f-bc6c-6f45e3cd1a0f	77261e65-6403-44cf-9f3f-2cc9f3d95f13	game	quality	59	0.5	0	0	2025-03-18 06:49:17.915
ab371aac-af9e-4c7b-9c4e-f38849d3665a	07b92061-6f7f-4355-8be5-7e215deba937	game	quality	60	0.5	0	0	2025-03-18 06:49:17.915
d49c749d-032b-46c3-81d5-87e3f36a4852	8b7021c3-73e4-46d9-b84f-b6291be61d3a	game	quality	61	0.5	0	0	2025-03-18 06:49:17.915
abbf9acf-5d7b-485f-9082-f2ae03f283bf	084cfb0c-2623-48cf-b8d6-2d6d6c0baec1	game	quality	62	0.5	0	0	2025-03-18 06:49:17.915
bfa4b3e4-7790-4591-8879-3cb0f9c6b478	95b4658f-3578-4409-be47-6ec79ff6204f	game	quality	63	0.5	0	0	2025-03-18 06:49:17.915
501fc18a-368a-42af-ad82-560ca494d5bf	d801607f-418e-4330-8f75-d947467ce3aa	game	quality	64	0.5	0	0	2025-03-18 06:49:17.915
d68cd6b3-9f06-4560-b7e2-77d564646ebc	ba0fa9e9-9eba-403c-be52-2a136ecf3b7a	game	quality	65	0.5	0	0	2025-03-18 06:49:17.915
b1c47b62-0554-46c8-9475-dda50a93f4ac	22845991-0fb6-4bdf-9725-0525b565699c	game	quality	66	0.5	0	0	2025-03-18 06:49:17.915
2b2ebad9-f7f0-4e43-b70e-c5366103832b	dfba9261-3270-4ba2-9110-5103eb8c03c9	game	quality	67	0.5	0	0	2025-03-18 06:49:17.915
1e037d38-0b68-4b0b-9d20-841bbb5666f0	bcbbaf7b-bd8e-413d-b42b-e483d4dec771	game	quality	68	0.5	0	0	2025-03-18 06:49:17.915
6d5d8e0f-fed0-4517-a401-c776fec0e6b9	ed450b52-5caa-492f-8790-d3c6b4f77fff	game	quality	69	0.5	0	0	2025-03-18 06:49:17.915
c55aa8eb-a1f6-4c86-9fa5-f5adb91bf992	f0e24ffc-e714-4da0-8510-35cfbb521ffb	game	quality	70	0.5	0	0	2025-03-18 06:49:17.915
40b6b4e5-9aae-402a-a5ac-0c93b0bd7a79	e0173448-5bdb-410d-a47b-0174bf726c8b	game	quality	71	0.5	2	0	2025-03-18 06:49:17.915
2e41c67f-2e3f-4fee-883e-084e072891e5	8ad6e622-f36f-42e3-aac7-92aa7d3a8288	game	quality	72	0.5	0	0	2025-03-18 06:49:17.915
abcc17c4-3bdd-416f-8f86-c17a7d3e4fd6	788597c7-0923-4688-a425-6e694b0007d2	game	quality	73	0.5	0	0	2025-03-18 06:49:17.915
2b926b35-6bb8-48a1-8396-84eaee6c4729	8759da60-d5ce-42b4-b0aa-fafdbd345aa2	game	quality	74	0.5	0	0	2025-03-18 06:49:17.915
ed8b54fb-0fd3-437b-8cef-ee6126f7efce	25754fe0-22d6-4e01-b552-add4be72ae48	game	quality	75	0.5	0	0	2025-03-18 06:49:17.915
a62180d3-b517-4df5-b665-964c80bde8ac	af707792-b791-4803-9d5d-dd83bf7fcc87	game	quality	76	0.5	0	0	2025-03-18 06:49:17.915
fd6f0272-da4d-4129-b724-bcf7eaf32078	f67f4c00-47fa-4ee3-a7bd-8a1bacd6f95e	game	quality	77	0.5	0	0	2025-03-18 06:49:17.915
5b41e0fb-d5dc-494d-ae85-c07a7fef761e	8cfc30a0-f692-4e4e-bdca-ad4c2c372cd1	game	quality	78	0.5	0	0	2025-03-18 06:49:17.915
d9fbad81-80e2-437c-a05b-498029c432d5	c10111fb-d178-4643-b837-7ef19bef8f41	game	quality	79	0.5	0	0	2025-03-18 06:49:17.915
fd17d73c-52e9-4d69-8485-1695122a04b2	59b2393e-ebab-4d7e-b9c3-b2aaa0bd8513	game	quality	80	0.5	0	0	2025-03-18 06:49:17.915
927973ae-c398-4155-97da-bd1084a56d2c	dca78d28-45b4-44ea-9bc7-80baf7008641	game	quality	81	0.5	0	0	2025-03-18 06:49:17.915
48f4aefd-ac30-4aaf-b9ac-2804d18f0eb8	07d6775c-e242-4597-a44e-e22437a49459	game	quality	82	0.5	0	0	2025-03-18 06:49:17.915
91b728a2-ebd9-4d51-a002-32572b675e34	16d4082f-5b2f-4528-bc21-c105e46abbdf	game	quality	83	0.5	0	0	2025-03-18 06:49:17.915
ffb85603-2612-4b31-9a31-0da690a62692	9748c31e-640b-4263-b719-da3a8f08736e	game	quality	84	0.5	0	0	2025-03-18 06:49:17.915
021f8696-6a4f-486c-a800-f86a6c350cfa	b4d24777-f913-46b7-983d-88490a68e2c0	game	quality	85	0.5	0	0	2025-03-18 06:49:17.915
13029d34-d550-4dff-a832-dc80f0f7b048	4626e481-051b-4832-ba44-be606da797c6	game	quality	86	0.5	0	0	2025-03-18 06:49:17.915
dc05d35f-dc7b-4ccd-8ae3-8818e2b17ad0	8f9010c4-d77b-4887-9cc3-0c9b7010c569	game	quality	87	0.5	0	0	2025-03-18 06:49:17.915
85194b68-7086-4b19-8057-2869a386b2eb	6cb521f3-5336-4f75-8bbb-9b67d8b7ba3f	game	quality	88	0.5	0	0	2025-03-18 06:49:17.915
d1fd0ed6-074c-4de1-95fc-2f7d526b5a00	83afb8c5-9e23-4fa8-9168-83decbd7978d	game	quality	89	0.5	0	0	2025-03-18 06:49:17.915
f81ac2b4-5425-417c-9ce3-af63001b1d43	d2bc2c08-c7b5-47b7-b45b-fa3b5b2e8f36	game	quality	90	0.5	0	0	2025-03-18 06:49:17.915
89a8a146-9399-4288-8f35-800d55286ccc	9b149ef6-7d84-4edc-8283-8b5522ce3518	game	quality	91	0.5	1	0	2025-03-18 06:49:17.915
dbd43057-5943-400f-85d5-4859ec73d31a	4b3fa1ed-a7fa-4185-9f03-519c76913aca	game	quality	92	0.5	0	0	2025-03-18 06:49:17.915
445183ef-5bcf-4a52-9236-0f951ada0f72	0dd8000b-48c2-4f63-addc-f4e908dd939e	game	quality	93	0.5	0	0	2025-03-18 06:49:17.915
00e75420-11d8-4f03-8e48-993a870182c4	46250f21-9a73-4146-88f4-513a1c5f99d9	game	quality	94	0.5	0	0	2025-03-18 06:49:17.915
efbb1263-6ec0-4efd-996c-92a295a6c6d7	18b64c24-3028-4d04-98e5-c4382f0c8cd0	game	quality	95	0.5	0	0	2025-03-18 06:49:17.915
4242f056-a106-4c16-bbfd-b7f63539736b	4bebe6a9-db56-453e-a85d-0400cb5a08f5	game	quality	96	0.5	0	0	2025-03-18 06:49:17.915
923e9357-ef68-4a47-a702-f9f3af2207c6	61f434ad-2388-45de-b373-b561be63590b	game	quality	97	0.5	0	0	2025-03-18 06:49:17.915
759cdbe1-9d3c-42ca-98c5-7a4fa58e7d4c	3e78f568-8737-4c77-a46b-e326470acb70	game	quality	98	0.5	0	0	2025-03-18 06:49:17.915
33b29adf-3468-4b87-a254-b5e4ba706ce2	24d8d342-b1d7-40ee-8ad4-6c5636c04661	game	quality	99	0.5	0	0	2025-03-18 06:49:17.915
290ab7c3-9f0b-4afe-b274-38dfbc1570f4	a3235777-29c9-418d-8b3d-bec551b9e174	game	quality	100	0.5	1	0	2025-03-18 06:49:17.915
7048fc62-a181-4f81-89b7-96c82f399a5e	2bfa4820-05e8-429d-91db-fd43914f98f9	game	quality	101	0.5	1	0	2025-03-18 06:49:17.915
1c8b8b6d-d4f3-40a1-9819-703ca3e9c599	c60de4b9-bb22-4b66-ba31-8a6754f8a876	game	quality	102	0.5	2	1	2025-03-18 06:49:17.915
892aeacf-e9ba-45d9-899b-f92790ff31f8	86c45ba5-ab0f-452b-b1e8-877a898bec14	game	quality	103	0.5	2	0	2025-03-18 06:49:17.915
89f40900-d3c1-417b-9a04-8b9d042608d3	eccd75c9-812b-4464-b542-8dc1c4fa94f9	game	quality	104	0.5	0	0	2025-03-18 06:49:17.915
a1a66423-48f8-4ecf-a1b0-c2c5b6626e6b	7f37cb28-0731-4c2a-b1b9-16cd56a57367	game	quality	105	0.5	1	0	2025-03-18 06:49:17.915
97fb6edc-c288-4fa7-9e70-f40b17f32933	9359a360-70c0-43ad-bceb-9912f7d134da	game	quality	106	0.5	0	0	2025-03-18 06:49:17.915
d28640f4-2178-4f41-a753-9a5c1f0627a3	193935c5-ac96-4664-bcc0-9869b84e1548	game	quality	107	0.5	2	0	2025-03-18 06:49:17.915
60056642-358e-488a-b2c0-806f253d0b47	91698f39-9bc5-464f-8aaf-e73a8a0f3cea	game	quality	108	0.5	3	3	2025-03-18 06:49:17.915
51704c8c-0469-40be-b101-8158e4e5604f	8074fbb7-fe43-4c9b-aa2b-839438670652	game	quality	109	0.5	6	6	2025-03-18 06:49:17.915
b4ceb45b-ad2d-4f5d-99f4-6b62202f6a3d	054009be-8fa3-4bdb-a853-57f5c355583f	game	quality	110	0.5	0	0	2025-03-18 06:49:17.915
7b5fca78-5489-46e3-9c90-ac19caace34e	8d3ebac9-6a26-4269-96c4-d6da0514d5b1	game	quality	111	0.5	4	1	2025-03-18 06:49:17.915
eaf0ba55-2fe5-483e-9791-d893fe0437a3	https://x.com/jamesckemp	creator	creator	1	\N	4	17	2025-03-18 06:49:17.915
973b309f-dad3-4c88-b63d-bb67b1d505da	https://x.com/cemilsvm	creator	creator	2	\N	15	2	2025-03-18 06:49:17.915
3499ce49-cb8f-4430-adcf-4046f5e1e5c9	https://x.com/pseudokid	creator	creator	3	\N	8	6	2025-03-18 06:49:17.915
357aeb7d-bfc4-4261-8b02-353a3322d3ef	https://x.com/SieversJosua	creator	creator	4	\N	1	0	2025-03-18 06:49:17.915
46125f97-e66f-4401-ae10-df525017a7eb	https://x.com/byteonwire	creator	creator	5	\N	0	0	2025-03-18 06:49:17.915
c6a10332-b73c-436d-97d3-197ab0344546	https://x.com/dyoburon	creator	creator	6	\N	0	0	2025-03-18 06:49:17.915
f48caf43-b6d4-4200-bc1c-ffbc51dad4cd	https://x.com/edwinhayward	creator	creator	7	\N	0	0	2025-03-18 06:49:17.915
e9290be9-876d-4acc-bf5c-fa81b567571c	https://x.com/rfitzpatrick_io	creator	creator	8	\N	0	0	2025-03-18 06:49:17.915
3202294f-fa93-407c-95bf-72b8126ee92f	https://x.com/paulwes_pw	creator	creator	9	\N	16	6	2025-03-18 06:49:17.915
c26369ac-2b85-4c84-b735-3c857a23ab82	https://x.com/NicolaManzini	creator	creator	10	\N	4	9	2025-03-18 06:49:17.915
c0106af3-ee22-4c95-8da7-aba5c42f5af0	https://x.com/pat_codes	creator	creator	11	\N	6	6	2025-03-18 06:49:17.915
faa8f57e-b9ba-4069-8300-e8b69e885a74	https://x.com/jelmerdeboer	creator	creator	12	\N	11	0	2025-03-18 06:49:17.915
575d4642-a697-453a-a960-d29203a5bca6	https://x.com/levelsio	creator	creator	13	\N	7	4	2025-03-18 06:49:17.915
4d5514c4-e547-4673-99ef-1ac115445282	https://x.com/s13k_	creator	creator	14	\N	9	1	2025-03-18 06:49:17.915
b703ccf0-2878-4e18-b937-d612da63e187	https://x.com/LoukilAymen	creator	creator	15	\N	7	0	2025-03-18 06:49:17.915
2edd7190-7a83-4128-910a-090a199eb25e	https://x.com/0xRome	creator	creator	16	\N	3	3	2025-03-18 06:49:17.915
ceed0d20-1100-46ab-b480-52d268e4d75f	https://x.com/StephenRuhe	creator	creator	17	\N	4	1	2025-03-18 06:49:17.915
4ed05704-5e61-4360-bc53-9dc797280399	https://x.com/what_the_func	creator	creator	18	\N	4	1	2025-03-18 06:49:17.915
789e30d9-cc01-4c22-ba87-6debab511b0c	https://x.com/0xyardev	creator	creator	19	\N	4	0	2025-03-18 06:49:17.915
0d5b68cc-7231-433c-9fa3-9f07e95ec81e	https://x.com/ged_ven	creator	creator	20	\N	2	1	2025-03-18 06:49:17.915
4932380a-7145-4a14-bb84-7308da0b3cc7	https://x.com/IndieJayCodes	creator	creator	21	\N	2	1	2025-03-18 06:49:17.915
cbbdc03f-aec0-4886-989e-4bb57b19136e	https://x.com/darefailed	creator	creator	22	\N	2	0	2025-03-18 06:49:17.915
54ac6bae-f9b5-4654-9e09-75e4348d8efe	https://x.com/bladeemaxxi	creator	creator	23	\N	2	0	2025-03-18 06:49:17.915
53945d97-0fa6-4cea-ac42-c6271d0bce60	https://x.com/nathansrobinson	creator	creator	24	\N	2	0	2025-03-18 06:49:17.915
c7a12fff-d0b9-478f-b218-ad3f766fa7d1	https://x.com/Aditya_T007	creator	creator	25	\N	1	0	2025-03-18 06:49:17.915
3ece202b-cefc-4723-91ba-8c546e99a9d2	https://x.com/gabriel__xyz	creator	creator	26	\N	1	0	2025-03-18 06:49:17.915
6be8916b-de2c-42ad-a4c2-80a58ef7889a	https://x.com/aaronbesson	creator	creator	27	\N	1	0	2025-03-18 06:49:17.915
09a71df5-7c28-49c4-ab28-445ce9015e8a	https://x.com/RyanEndacott	creator	creator	28	\N	1	0	2025-03-18 06:49:17.915
69b7d0e2-6509-4ea1-bcd0-aa18833b20e9	https://x.com/ranking091	creator	creator	29	\N	0	0	2025-03-18 06:49:17.915
6acbe89b-f60b-4fe9-97dc-7bf734218041	https://x.com/markszymik	creator	creator	30	\N	0	0	2025-03-18 06:49:17.915
ae3d3dc2-a74b-40f5-af93-6144b95394d7	https://x.com/FeineCapital	creator	creator	31	\N	0	0	2025-03-18 06:49:17.915
947edda2-957a-4466-8138-afd439630d11	https://x.com/apsquareddev	creator	creator	32	\N	0	0	2025-03-18 06:49:17.915
64dd1064-14f8-4f4f-b9d4-2f2b099d5d28	https://x.com/codefun_xyz	creator	creator	33	\N	0	0	2025-03-18 06:49:17.915
11b2a9ff-b0a3-443f-bf57-dedb41651338	https://x.com/MrDee	creator	creator	34	\N	0	0	2025-03-18 06:49:17.915
e1e239b5-9d6d-4945-ae11-81686d1a71a2	https://x.com/rajkstats	creator	creator	35	\N	0	0	2025-03-18 06:49:17.915
dce4f86d-0ff3-4de1-843d-37412e879b81	https://x.com/Hi_Bennie	creator	creator	36	\N	0	0	2025-03-18 06:49:17.915
514e457b-abdf-48a2-9f65-7ffafcfe451d	https://x.com/sarperdag	creator	creator	37	\N	0	0	2025-03-18 06:49:17.915
b0243f95-d8de-4cf7-b9b9-c5947a5974ad	https://x.com/vibecoding_	creator	creator	38	\N	0	0	2025-03-18 06:49:17.915
1a29d706-1136-40ae-b99d-bb6a37a78b82	https://x.com/NeuralPixelAI	creator	creator	39	\N	0	0	2025-03-18 06:49:17.915
5b270c60-6f93-4727-8746-d73f77a4825e	https://x.com/drosshole	creator	creator	40	\N	0	0	2025-03-18 06:49:17.915
b25db727-f501-40b3-89df-a1c824ead780	https://x.com/reignboat	creator	creator	41	\N	0	0	2025-03-18 06:49:17.915
47aba1c3-9ef0-409e-8278-fd157d9a80ed	https://x.com/NoFlinch	creator	creator	42	\N	0	0	2025-03-18 06:49:17.915
934f2dcc-518c-46d1-9997-eeaff316b3f7	https://x.com/Oho_name	creator	creator	43	\N	0	0	2025-03-18 06:49:17.915
c2e2697b-d770-482d-bfa7-2c6e9d0cd6d4	https://x.com/nishant_ty	creator	creator	44	\N	0	0	2025-03-18 06:49:17.915
4990b937-885f-423d-be85-276fd1935072	https://x.com/emreozdiyar	creator	creator	45	\N	0	0	2025-03-18 06:49:17.915
38388c04-8e7a-4d0d-9e66-ea6da8e20bc5	https://x.com/mischeiwiller	creator	creator	46	\N	0	0	2025-03-18 06:49:17.915
27b6ddcc-0941-4bdf-8082-f7dc15bc686b	https://x.com/hankofalltrades	creator	creator	47	\N	0	0	2025-03-18 06:49:17.915
7f584212-20ef-4f11-9b6b-0af739e2f9ad	https://x.com/tuantruong	creator	creator	48	\N	0	0	2025-03-18 06:49:17.915
5a93fcb2-93c2-47b8-a3e9-71945679b5e0	https://x.com/Khatarnak_Ishan	creator	creator	49	\N	0	0	2025-03-18 06:49:17.915
d89dc5f2-1d7f-45bc-a763-4c5fd497e991	https://x.com/hugohamelcom	creator	creator	50	\N	0	0	2025-03-18 06:49:17.915
cd434291-2b7c-4bf0-a3a1-7f7b3cd9e18e	https://x.com/JonathanACaruso	creator	creator	51	\N	0	0	2025-03-18 06:49:17.915
df090980-a1c3-4359-b3a5-952ba0ae2baa	https://x.com/AlbertSimonDev	creator	creator	52	\N	0	0	2025-03-18 06:49:17.915
3dd7dbda-a775-4f25-b797-94c15c62b743	https://x.com/jbelevate	creator	creator	53	\N	0	0	2025-03-18 06:49:17.915
3dc84311-c802-4794-80bf-a615d3b40615	https://x.com/HCBGreatWall	creator	creator	54	\N	0	0	2025-03-18 06:49:17.915
0e5468dc-acf9-42d5-81c2-a0f3a498da55	https://x.com/Stianwalgermo	creator	creator	55	\N	0	0	2025-03-18 06:49:17.915
6c18890e-cc39-4fcd-a6d6-8c8ae53425c4	https://x.com/balt1794	creator	creator	56	\N	0	0	2025-03-18 06:49:17.915
4aeb8619-77af-4117-b1b5-f107c641690c	https://x.com/benwmaddox	creator	creator	57	\N	0	0	2025-03-18 06:49:17.915
73ed93b9-dbc4-47a1-9d83-84ddd96a052e	https://x.com/craygen9	creator	creator	58	\N	0	0	2025-03-18 06:49:17.915
02949710-2c76-4b52-a5b3-8e2ea0e30b58	https://x.com/skifull579	creator	creator	59	\N	0	0	2025-03-18 06:49:17.915
161ac12d-a501-430f-98ab-8fdf39533ca3	https://x.com/RealFredericVC	creator	creator	60	\N	0	0	2025-03-18 06:49:17.915
922f98ac-edc1-4de1-8cbe-f5d1edd28747	https://x.com/IsaacXVoxel	creator	creator	61	\N	0	0	2025-03-18 06:49:17.915
ddc81957-8e5d-4dd6-a367-642e4e7ee177	https://x.com/Shpigford	creator	creator	62	\N	0	0	2025-03-18 06:49:17.915
151a0a86-6891-400d-a581-b3427ad8405b	https://x.com/joshuajohnsonAI	creator	creator	63	\N	0	0	2025-03-18 06:49:17.915
4f3859d4-6eeb-4117-84f4-d5f5f2e535ea	https://x.com/isaactdozier	creator	creator	64	\N	0	0	2025-03-18 06:49:17.915
35fae4ae-843f-4807-90bb-4f1a580da3e0	https://x.com/jasperdeboer	creator	creator	65	\N	0	0	2025-03-18 06:49:17.915
0cb2f5c2-59f7-46b4-ade6-ea0f52573504	https://x.com/andrwhcom	creator	creator	66	\N	0	0	2025-03-18 06:49:17.915
c42c13d4-e1dc-4b7d-9743-8e09c28cd97e	https://x.com/traemikal	creator	creator	67	\N	0	0	2025-03-18 06:49:17.915
1dc8ef6f-9062-4e97-8ebe-e51e720ef08c	https://x.com/adityakabra	creator	creator	68	\N	0	0	2025-03-18 06:49:17.915
195802c9-1309-4687-8546-2dd84008e7ac	https://x.com/drewvergara	creator	creator	69	\N	0	0	2025-03-18 06:49:17.915
320bf9f2-969d-4a48-b2d1-402c84bd7851	https://x.com/d4m1n	creator	creator	70	\N	0	0	2025-03-18 06:49:17.915
492dd575-781a-4bc3-9048-6c0e7dc9c380	https://x.com/hi_itsbey	creator	creator	71	\N	0	0	2025-03-18 06:49:17.915
58388414-f6de-4d1f-9b4f-13da65fa38aa	https://x.com/mitchposts	creator	creator	72	\N	0	0	2025-03-18 06:49:17.915
3a218d68-324e-4152-9319-cd3397309f84	https://x.com/finvisual	creator	creator	73	\N	0	0	2025-03-18 06:49:17.915
c8a36810-f1db-4aec-ba7f-3a354e43708f	https://x.com/xiaochi2	creator	creator	74	\N	0	0	2025-03-18 06:49:17.915
992a53e7-8def-4b2a-afb1-bee44ff600f1	https://x.com/PeakGrizzly	creator	creator	75	\N	0	0	2025-03-18 06:49:17.915
0e36a7e4-c245-455d-b58d-02d0ebf2137e	https://x.com/nomalex_	creator	creator	76	\N	0	0	2025-03-18 06:49:17.915
1e6a1446-e6d9-4b83-8845-b0831a3ee409	https://x.com/Akkorothone	creator	creator	77	\N	0	0	2025-03-18 06:49:17.915
e8dba5a4-9e7e-41a3-9cdb-134568649b41	https://x.com/jasonleowsg	creator	creator	78	\N	0	0	2025-03-18 06:49:17.915
541b2fdd-2e09-4be0-8cf3-6602b45a054d	https://x.com/notpurav	creator	creator	79	\N	0	0	2025-03-18 06:49:17.915
0f61b901-70cf-44b2-a64d-21ed03adf03d	https://x.com/iagolast	creator	creator	80	\N	0	0	2025-03-18 06:49:17.915
f85eae94-078c-4899-b1e4-c2351d6a1082	https://x.com/athcanft	creator	creator	81	\N	0	0	2025-03-18 06:49:17.915
fb6f612a-ee18-4ec5-a676-7751c67397a9	https://x.com/Kaberikram	creator	creator	82	\N	0	0	2025-03-18 06:49:17.915
0656e985-443e-4561-95d4-d23b42ee4dac	https://x.com/sagarsaija	creator	creator	83	\N	0	0	2025-03-18 06:49:17.915
c17fe068-c0bb-4026-8d07-21fb74d86f19	https://x.com/donvito	creator	creator	84	\N	0	0	2025-03-18 06:49:17.915
e067e629-76ed-4056-ad78-c94c4891c970	https://x.com/fabianbuilds	creator	creator	85	\N	0	0	2025-03-18 06:49:17.915
5a21827b-963d-45ef-8080-40b4ad220a86	https://x.com/farez	creator	creator	86	\N	0	0	2025-03-18 06:49:17.915
c26d5c9c-05de-4366-a5d2-973cf7575e48	https://x.com/vlucendo	creator	creator	87	\N	0	0	2025-03-18 06:49:17.915
29f70d95-0100-4fa8-a88f-18ef919b2165	https://x.com/anslogen	creator	creator	88	\N	0	0	2025-03-18 06:49:17.915
18373372-7d64-47b5-bf2f-681aa1b34b41	https://x.com/jagger_sa	creator	creator	89	\N	0	0	2025-03-18 06:49:17.915
23794f53-a11a-47b0-94b4-ec865bd6f761	https://x.com/Daniel_Farinax	creator	creator	90	\N	0	0	2025-03-18 06:49:17.915
2324161c-891d-4b5b-b413-d0ccfaaee84d	https://x.com/saikatkrdey	creator	creator	91	\N	0	0	2025-03-18 06:49:17.915
5d674f49-f952-48c5-8143-79c82384ca0b	https://x.com/NicolasZu	creator	creator	92	\N	0	0	2025-03-18 06:49:17.915
1b35f248-243b-4d23-b48f-82de436cea9d	https://x.com/maxhertan	creator	creator	93	\N	0	0	2025-03-18 06:49:17.915
\.


--
-- Data for Name: sponsors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sponsors (id, name, description, "logoUrl", website, "createdAt", "updatedAt") FROM stdin;
bbbc6247-782a-4f1b-8f60-cd5e3a2d69fd	GitHub	Development platform	https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/github-logo.png	https://github.com	2025-03-16 02:05:31.002	2025-03-16 02:34:10.65
20de7838-dc4a-4dc4-be04-300db35feb1d	npm	Package registry	https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/npm-logo.png	https://www.npmjs.com	2025-03-16 02:05:31.525	2025-03-16 02:34:10.983
7e702654-f6c1-45c3-af6c-13fad1f01923	Python	Programming language	https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/python-logo.png	https://python.org	2025-03-16 02:05:31.678	2025-03-16 02:34:11.101
f031ffa6-d698-44e3-8e55-8d07afb91bf0	Ubuntu	Operating system	https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/ubuntu-logo.png	https://ubuntu.com	2025-03-16 02:05:31.831	2025-03-16 02:34:11.21
af0d9214-fa29-4410-a635-3b691e573417	Laravel	Backend framework provider	https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/laravel-logo.svg	https://laravel.com	2025-03-16 02:05:29.586	2025-03-16 02:34:09.649
a7f9f60f-0ca9-448d-966f-884103f27c87	React	Frontend library partner	https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/react-logo.png	https://reactjs.org	2025-03-16 02:05:29.902	2025-03-16 02:34:09.805
d1926221-d51b-4e57-bf71-43175556c9f8	Node.js	Server runtime environment	https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/nodejs-logo.png	https://nodejs.org	2025-03-16 02:05:30.053	2025-03-16 02:34:09.91
c3faa617-490e-4356-8a1c-3a18ea929e1b	AWS	Cloud infrastructure partner	https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/aws-logo.png	https://aws.amazon.com	2025-03-16 02:05:30.217	2025-03-16 02:34:10.019
b0081589-dc99-4c90-809a-13bc32fc99ea	DigitalOcean	Hosting services provider	https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/digitalocean-logo.png	https://digitalocean.com	2025-03-16 02:05:30.392	2025-03-16 02:34:10.149
ad66957f-8770-41c8-a88d-3ae7198bd944	MongoDB	Database solutions	https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/mongodb-logo.png	https://mongodb.com	2025-03-16 02:05:30.544	2025-03-16 02:34:10.274
d74600e3-64c7-43fd-a61b-3f51db746f5a	Stripe	Payment processing	https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/stripe-logo.png	https://stripe.com	2025-03-16 02:05:30.697	2025-03-16 02:34:10.418
5c4420bd-641f-4dd1-872b-3427552fad6c	Docker	Container platform	https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/97_Docker_logo_logos-512.png	https://docker.com	2025-03-16 02:05:31.178	2025-03-16 02:40:47.015
66f36e27-f85c-4e3d-a2e9-1ee5ab23623c	Google Cloud	Cloud services partner	https://cdn.worldvectorlogo.com/logos/google-cloud-1.svg	https://cloud.google.com	2025-03-16 02:05:30.85	2025-03-16 02:40:47.216
\.


--
-- Data for Name: subscribers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscribers (id, email, name, status, "createdAt", "updatedAt") FROM stdin;
86b866cc-4663-4f36-a37b-c3d4d4559253	james@veruca.io	\N	active	2025-03-18 02:16:58.3	2025-03-18 02:16:58.3
\.


--
-- Data for Name: user_achievements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_achievements (id, "userId", "achievementId", "unlockedAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, "displayName", password, "createdAt", "updatedAt", role) FROM stdin;
37211933-f036-4942-a90a-b4d5e34e5a26	test	test@example.com	test	$2b$10$XrHbEsVWQegDgZ8iFAjgpOgnH.Liaewt4/D5nP7CcrJ0/i09XfTX2	2025-03-15 00:38:17.422	2025-03-15 00:38:17.422	REGULAR
aa737d17-fa89-402a-83cc-ae911bb0730d	Testing	Testing@test.com	Testing	$2b$10$MR5w3Hi9clJ8KZy3In1gUeuQAisqkC8l6w6kewULtKv6FcguEPc1a	2025-03-15 01:04:33.189	2025-03-15 01:04:33.189	REGULAR
a6c246ae-f84b-4c43-87b4-05db6b55afc3	admin	admin@grokade.com	Admin User	$2b$10$KQQRQjkpMfSuuYVpdnAZBe35b73PYmsdK3METy1GONsG1qkPEjyuG	2025-03-14 21:19:05.893	2025-03-18 04:09:47.562	ADMIN
406e20cd-07f9-4227-9a14-cba2e292afa4	aigamelord	aigamelord@gmail.com	aigamelord	$2b$10$wAGz8dwjQYYAXQr7yx/JbuJ4Yb8DdHgSHMAwJf0aGz0uR4Gk.btz6	2025-03-15 00:44:10.731	2025-03-18 04:09:53.674	ADMIN
bc7ef627-d00d-40f9-a2e0-6271df18d692	p0tfur	hrab.wesol@gmail.com	p0tfur	$2b$10$WuPtkbWPrhP9bRMW32YLtO4rhLWvAFhm/RFoWxFBI2em6bx4eFXl.	2025-03-18 07:04:44.825	2025-03-18 07:04:44.825	REGULAR
\.


--
-- Name: game_favorites game_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_favorites
    ADD CONSTRAINT game_favorites_pkey PRIMARY KEY ("userId", "gameId");


--
-- Name: game_metrics game_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_metrics
    ADD CONSTRAINT game_metrics_pkey PRIMARY KEY (id);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- Name: page_views page_views_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.page_views
    ADD CONSTRAINT page_views_pkey PRIMARY KEY (id);


--
-- Name: ranking_history ranking_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ranking_history
    ADD CONSTRAINT ranking_history_pkey PRIMARY KEY (id);


--
-- Name: sponsors sponsors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sponsors
    ADD CONSTRAINT sponsors_pkey PRIMARY KEY (id);


--
-- Name: subscribers subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscribers
    ADD CONSTRAINT subscribers_pkey PRIMARY KEY (id);


--
-- Name: user_achievements user_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: game_metrics_gameId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "game_metrics_gameId_key" ON public.game_metrics USING btree ("gameId");


--
-- Name: ranking_history_entityId_rankingType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ranking_history_entityId_rankingType_idx" ON public.ranking_history USING btree ("entityId", "rankingType");


--
-- Name: ranking_history_recordedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ranking_history_recordedAt_idx" ON public.ranking_history USING btree ("recordedAt");


--
-- Name: subscribers_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX subscribers_email_key ON public.subscribers USING btree (email);


--
-- Name: user_achievements_userId_achievementId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "user_achievements_userId_achievementId_key" ON public.user_achievements USING btree ("userId", "achievementId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: game_favorites game_favorites_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_favorites
    ADD CONSTRAINT "game_favorites_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public.games(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: game_favorites game_favorites_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_favorites
    ADD CONSTRAINT "game_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: game_metrics game_metrics_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_metrics
    ADD CONSTRAINT "game_metrics_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public.games(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: games games_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT "games_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: page_views page_views_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.page_views
    ADD CONSTRAINT "page_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_achievements user_achievements_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT "user_achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT CREATE ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

