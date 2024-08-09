CREATE OR REPLACE FUNCTION public.set_application_id()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.application_id := 'C' || to_char(current_date, 'YY') || NEW.id;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_job_id()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.job_id :=to_char(current_date, 'YYYY') || NEW.id;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_response_application_id()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.application_id := 'UP' || to_char(current_date, 'YY') || NEW.id;
    RETURN NEW;
END;
$function$
;







-- public.candidate_responses_view source

CREATE OR REPLACE VIEW public.candidate_responses_view
AS SELECT 'new'::character varying AS info,
    cd.id,
    cd.phonenumber,
    cd.urole,
    cd.application_id,
    cd.whatsappnumber,
    cd.name,
    cd.emailid,
    cd.marragestatus,
    cd.area,
    cd.city,
    cd.state,
    cd.pincode,
    cd.dob,
    cd.gender,
    cd.qualification_10,
    cd.university_10,
    cd.ctype_10,
    cd.percent_10,
    cd.yos_10,
    cd.yoc_10,
    cd.college_10,
    cd.state_10,
    cd.qualification_12,
    cd.university_12,
    cd.ctype_12,
    cd.percent_12,
    cd.yos_12,
    cd.yoc_12,
    cd.college_12,
    cd.state_12,
    cd.ugqualification,
    cd.uguniversity,
    cd.ugctype,
    cd.ugpercent,
    cd.ugyos,
    cd.ugyoc,
    cd.ugcollege,
    cd.ugstate,
    cd.pgqualification,
    cd.pguniversity,
    cd.pgctype,
    cd.pgpercent,
    cd.pgyos,
    cd.pgyoc,
    cd.pgcollege,
    cd.pgstate,
    cd.qualification_diploma,
    cd.university_diploma,
    cd.ctype_diploma,
    cd.percent_diploma,
    cd.yos_diploma,
    cd.yoc_diploma,
    cd.college_diploma,
    cd.state_diploma,
    cd.languages,
    cd.skill1,
    cd.skill2,
    cd.skill3,
    cd.skill4,
    cd.skill5,
    cd.exp_seeker_type,
    cd.company_project_name,
    cd.exp_sdate,
    cd.exp_edate,
    cd.project_role_summary,
    cd."position",
    cd.experience,
    cd.job_category,
    cd.job_location,
    cd.job_industry,
    cd.job_role,
    cd.job_department,
    cd.preferred_designation,
    cd.preferred_ctc,
    cd.present_ctc,
    cd.job_type,
    cd.job_jdate,
    cd.referee_name,
    cd.referee_num,
    cd.referee_paynum,
    cd.referee_email,
    cd."createdAt",
    cd."updatedAt"
   FROM candidate_details cd
UNION ALL
 SELECT 'old'::character varying AS info,
    r.id,
    r.phonenumber,
    r.urole,
    r.application_id,
    r.whatsappnumber,
    r.name,
    r.emailid,
    r.marragestatus,
    r.area,
    r.city,
    r.state,
    r.pincode,
    r.dob,
    r.gender,
    r.qualification_10,
    r.university_10,
    r.ctype_10,
    r.percent_10,
    r.yos_10,
    r.yoc_10,
    r.college_10,
    r.state_10,
    r.qualification_12,
    r.university_12,
    r.ctype_12,
    r.percent_12,
    r.yos_12,
    r.yoc_12,
    r.college_12,
    r.state_12,
    r.ugqualification,
    r.uguniversity,
    r.ugctype,
    r.ugpercent,
    r.ugyos,
    r.ugyoc,
    r.ugcollege,
    r.ugstate,
    r.pgqualification,
    r.pguniversity,
    r.pgctype,
    r.pgpercent,
    r.pgyos,
    r.pgyoc,
    r.pgcollege,
    r.pgstate,
    r.qualification_diploma,
    r.university_diploma,
    r.ctype_diploma,
    r.percent_diploma,
    r.yos_diploma,
    r.yoc_diploma,
    r.college_diploma,
    r.state_diploma,
    r.languages,
    r.skill1,
    r.skill2,
    r.skill3,
    r.skill4,
    r.skill5,
    r.exp_seeker_type,
    r.company_project_name,
    r.exp_sdate,
    r.exp_edate,
    r.project_role_summary,
    r."position",
    r.experience,
    r.job_category,
    r.job_location,
    r.job_industry,
    r.job_role,
    r.job_department,
    r.preferred_designation,
    r.preferred_ctc,
    r.present_ctc,
    r.job_type,
    r.job_jdate,
    r.referee_name,
    r.referee_num,
    r.referee_paynum,
    r.referee_email,
    r."createdAt",
    r."updatedAt"
   FROM responses r;

-- public.activitylog definition

-- Drop table

-- DROP TABLE public.activitylog;

CREATE TABLE public.activitylog (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	admin_id int4 NOT NULL,
	activity text NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	CONSTRAINT activitylog_pkey PRIMARY KEY (id)
);


-- public.assessmentreports definition

-- Drop table

-- DROP TABLE public.assessmentreports;

CREATE TABLE public.assessmentreports (
	id serial4 NOT NULL,
	meeting_id varchar(255) NULL,
	candidateid varchar(255) NULL,
	interviewername varchar(255) NULL,
	candidatename varchar(255) NULL,
	candidateemail varchar(255) NULL,
	candidatephone varchar(255) NULL,
	collegename varchar(255) NULL,
	interviewpreparedness varchar(255) NULL,
	confidencenervousness varchar(255) NULL,
	nonverbalcommunication varchar(255) NULL,
	industryspecific varchar(255) NULL,
	projectmanagement varchar(255) NULL,
	"comments" text NULL,
	verbalcommunication varchar(255) NULL,
	teamwork varchar(255) NULL,
	computerproficiency varchar(255) NULL,
	enthusiasmmotivation varchar(255) NULL,
	timemanagement varchar(255) NULL,
	worklifebalance varchar(255) NULL,
	achievementsaccomplishments varchar(255) NULL,
	fresherexperienced varchar(255) NULL,
	"createdAt" timestamptz NULL DEFAULT now(),
	"updatedAt" timestamptz NULL DEFAULT now(),
	CONSTRAINT assessmentreports_pkey PRIMARY KEY (id)
);


-- public.blogs definition

-- Drop table

-- DROP TABLE public.blogs;

CREATE TABLE public.blogs (
	summary text NULL,
	heading varchar(255) NULL,
	metatitle varchar(255) NULL,
	metadescription text NULL,
	metakeywords text NULL,
	photo bytea NULL,
	id serial4 NOT NULL,
	"createdAt" date NOT NULL DEFAULT now(),
	"updatedAt" date NULL DEFAULT now(),
	url_title varchar(255) NULL,
	CONSTRAINT blogs_pkey PRIMARY KEY (id)
);


-- public.candidate_details definition

-- Drop table

-- DROP TABLE public.candidate_details;

CREATE TABLE public.candidate_details (
	id serial4 NOT NULL,
	phonenumber varchar(255) NULL,
	urole varchar(255) NULL,
	application_id varchar(255) NULL,
	whatsappnumber varchar(255) NULL,
	"name" varchar(255) NULL,
	emailid varchar(255) NULL,
	marragestatus varchar(255) NULL,
	area varchar(255) NULL,
	city varchar(255) NULL,
	state varchar(255) NULL,
	pincode varchar(255) NULL,
	dob varchar(255) NULL,
	gender varchar(255) NULL,
	qualification_10 varchar(255) NULL,
	university_10 varchar(255) NULL,
	ctype_10 varchar(255) NULL,
	percent_10 varchar(255) NULL,
	yos_10 varchar(255) NULL,
	yoc_10 varchar(255) NULL,
	college_10 varchar(255) NULL,
	state_10 varchar(255) NULL,
	qualification_12 varchar(255) NULL,
	university_12 varchar(255) NULL,
	ctype_12 varchar(255) NULL,
	percent_12 varchar(255) NULL,
	yos_12 varchar(255) NULL,
	yoc_12 varchar(255) NULL,
	college_12 varchar(255) NULL,
	state_12 varchar(255) NULL,
	ugqualification varchar(255) NULL,
	uguniversity varchar(255) NULL,
	ugctype varchar(255) NULL,
	ugpercent varchar(255) NULL,
	ugyos varchar(255) NULL,
	ugyoc varchar(255) NULL,
	ugcollege varchar(255) NULL,
	ugstate varchar(255) NULL,
	pgqualification varchar(255) NULL,
	pguniversity varchar(255) NULL,
	pgctype varchar(255) NULL,
	pgpercent varchar(255) NULL,
	pgyos varchar(255) NULL,
	pgyoc varchar(255) NULL,
	pgcollege varchar(255) NULL,
	pgstate varchar(255) NULL,
	qualification_diploma varchar(255) NULL,
	university_diploma varchar(255) NULL,
	ctype_diploma varchar(255) NULL,
	percent_diploma varchar(255) NULL,
	yos_diploma varchar(255) NULL,
	yoc_diploma varchar(255) NULL,
	college_diploma varchar(255) NULL,
	state_diploma varchar(255) NULL,
	languages varchar(255) NULL,
	skill1 varchar(255) NULL,
	skill2 varchar(255) NULL,
	skill3 varchar(255) NULL,
	skill4 varchar(255) NULL,
	skill5 varchar(255) NULL,
	exp_seeker_type varchar(255) NULL,
	company_project_name varchar(255) NULL,
	exp_sdate varchar(255) NULL,
	exp_edate varchar(255) NULL,
	project_role_summary varchar(255) NULL,
	"position" varchar(255) NULL,
	experience varchar(255) NULL,
	job_category varchar(255) NULL,
	job_location varchar(255) NULL,
	job_industry varchar(255) NULL,
	job_role varchar(255) NULL,
	job_department varchar(255) NULL,
	preferred_designation varchar(255) NULL,
	preferred_ctc varchar(255) NULL,
	present_ctc varchar(255) NULL,
	job_type varchar(255) NULL,
	job_jdate varchar(255) NULL,
	upload_photo bytea NULL,
	referee_name varchar(255) NULL,
	referee_num varchar(255) NULL,
	referee_paynum varchar(255) NULL,
	referee_email varchar(255) NULL,
	resume_file json NULL,
	"createdAt" date NULL,
	"updatedAt" date NULL,
	CONSTRAINT candidate_details_pkey PRIMARY KEY (id),
	CONSTRAINT candidate_details_un UNIQUE (emailid)
);

-- Table Triggers

create trigger before_insert_set_application_id before
insert
    on
    public.candidate_details for each row execute function set_application_id();


-- public.contactus definition

-- Drop table

-- DROP TABLE public.contactus;

CREATE TABLE public.contactus (
	"name" varchar(255) NULL,
	subject varchar(255) NULL,
	email varchar(255) NULL,
	message text NULL,
	category text NULL,
	id serial4 NOT NULL,
	"createdAt" date NULL DEFAULT now(),
	"updatedAt" date NULL DEFAULT now(),
	CONSTRAINT contactus_pkey PRIMARY KEY (id)
);


-- public.corporatecorner definition

-- Drop table

-- DROP TABLE public.corporatecorner;

CREATE TABLE public.corporatecorner (
	partner_id serial4 NOT NULL,
	company_name varchar(255) NOT NULL,
	company_url varchar(255) NOT NULL,
	company_category varchar(255) NOT NULL,
	company_address varchar(255) NULL,
	contact_person varchar(255) NULL,
	email varchar(255) NULL,
	phone varchar(255) NULL,
	photo bytea NULL,
	partner_status varchar(255) NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	company_description text NULL,
	heading text NULL,
	subheading text NULL,
	CONSTRAINT corporatecorner_pkey PRIMARY KEY (partner_id)
);


-- public.corporateservices definition

-- Drop table

-- DROP TABLE public.corporateservices;

CREATE TABLE public.corporateservices (
	service_id serial4 NOT NULL,
	partner_id int4 NOT NULL,
	service_name text NOT NULL,
	service_description text NULL,
	service_price varchar(255) NULL,
	photo bytea NULL,
	service_status varchar(255) NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	service_heading varchar(255) NULL,
	service_subheading varchar(255) NULL,
	CONSTRAINT corporateservices_pkey PRIMARY KEY (service_id)
);


-- public.dashlogins definition

-- Drop table

-- DROP TABLE public.dashlogins;

CREATE TABLE public.dashlogins (
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	phonenumber varchar(255) NULL,
	createdby varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	id serial4 NOT NULL,
	"createdAt" date NULL DEFAULT now(),
	"updatedAt" date NULL DEFAULT now(),
	googleid varchar(255) NULL,
	two_step int4 NULL DEFAULT 0,
	CONSTRAINT dashlogins_email_key UNIQUE (email),
	CONSTRAINT dashlogins_pkey PRIMARY KEY (id)
);


-- public.dorzet_contact_us definition

-- Drop table

-- DROP TABLE public.dorzet_contact_us;

CREATE TABLE public.dorzet_contact_us (
	id serial4 NOT NULL,
	"name" varchar(255) NULL,
	phone varchar(255) NULL,
	email varchar(255) NULL,
	subject varchar(255) NULL,
	message text NULL,
	"createdAt" timestamptz NULL DEFAULT now(),
	CONSTRAINT dorzet_contact_us_pkey PRIMARY KEY (id)
);


-- public.jobs definition

-- Drop table

-- DROP TABLE public.jobs;

CREATE TABLE public.jobs (
	description text NULL,
	sub_heading varchar(255) NULL,
	job_type varchar(255) NULL,
	job_id varchar(255) NULL,
	"location" varchar(255) NULL,
	heading varchar(255) NULL,
	status int4 NULL,
	company_size varchar(255) NULL,
	website varchar(255) NULL,
	relocation varchar(255) NULL,
	amount varchar(255) NULL,
	photo bytea NULL,
	id serial4 NOT NULL,
	"createdAt" date NULL,
	"updatedAt" date NULL,
	experience varchar(255) NULL,
	vacancy int4 NULL,
	CONSTRAINT jobs_pkey PRIMARY KEY (id),
	CONSTRAINT unique_job_id UNIQUE (job_id)
);

-- Table Triggers

create trigger before_insert_set_job_id before
insert
    on
    public.jobs for each row execute function set_job_id();


-- public.meetings definition

-- Drop table

-- DROP TABLE public.meetings;

CREATE TABLE public.meetings (
	title varchar(255) NULL,
	email varchar(255) NULL,
	"alloted_HR" varchar(255) NULL,
	status varchar(255) NULL,
	application_id varchar(255) NULL,
	meeting_id varchar(255) NULL,
	username varchar(255) NULL,
	phone_number varchar(255) NULL,
	hr_phone_number varchar(255) NULL,
	"role" varchar(255) NULL,
	start_time varchar(255) NULL,
	end_time varchar(255) NULL,
	process_status varchar(255) NULL,
	meeting_link text NULL,
	id serial4 NOT NULL,
	"createdAt" date NULL DEFAULT now(),
	"updatedAt" date NULL DEFAULT now(),
	CONSTRAINT meetings_pkey PRIMARY KEY (id)
);


-- public.mou_registrations definition

-- Drop table

-- DROP TABLE public.mou_registrations;

CREATE TABLE public.mou_registrations (
	"name" varchar(255) NOT NULL,
	shortname varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	"number" varchar(255) NOT NULL,
	description varchar(255) NOT NULL,
	link varchar(255) NOT NULL,
	photo bytea NULL,
	qr varchar(255) NULL,
	address varchar(255) NOT NULL,
	college varchar(255) NULL,
	city varchar(255) NOT NULL,
	facebook varchar(255) NULL,
	instagram varchar(255) NULL,
	twitter varchar(255) NULL,
	linkedin varchar(255) NULL,
	youtube varchar(255) NULL,
	supportby varchar(255) NULL,
	supportnumber varchar(255) NULL,
	supportemail varchar(255) NULL,
	thread varchar(255) NULL,
	id serial4 NOT NULL,
	"createdAt" date NULL DEFAULT now(),
	"updatedAt" date NULL DEFAULT now(),
	CONSTRAINT mou_registrations_pkey PRIMARY KEY (id)
);


-- public.partner_registrations definition

-- Drop table

-- DROP TABLE public.partner_registrations;

CREATE TABLE public.partner_registrations (
	"name" varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	"number" varchar(255) NOT NULL,
	city varchar(255) NOT NULL,
	id serial4 NOT NULL,
	"createdAt" date NOT NULL DEFAULT now(),
	"updatedAt" date NULL DEFAULT now(),
	CONSTRAINT partner_registrations_pkey PRIMARY KEY (id),
	CONSTRAINT partner_registrations_un UNIQUE (email)
);


-- public.paymentdetails definition

-- Drop table

-- DROP TABLE public.paymentdetails;

CREATE TABLE public.paymentdetails (
	"name" varchar(255) NULL,
	email varchar(255) NULL,
	phone varchar(255) NULL,
	product_name varchar(255) NULL,
	"paymentModes" varchar(255) NULL,
	utr varchar(255) NULL,
	"transactionId" varchar(255) NULL,
	"merchantTransactionId" varchar(255) NULL,
	payer_name varchar(255) NULL,
	"merchantId" varchar(255) NULL,
	payment_time timestamptz NULL,
	"providerReferenceId" varchar(255) NULL,
	code varchar(255) NULL,
	amount varchar(255) NULL,
	id serial4 NOT NULL,
	credit int4 NULL,
	"createdAt" date NULL DEFAULT now(),
	"updatedAt" date NULL DEFAULT now(),
	CONSTRAINT paymentdetails_pkey PRIMARY KEY (id),
	CONSTRAINT "paymentdetails_transactionId_key" UNIQUE ("transactionId")
);


-- public.products definition

-- Drop table

-- DROP TABLE public.products;

CREATE TABLE public.products (
	"name" varchar(255) NOT NULL,
	description varchar(255) NOT NULL,
	link varchar(255) NOT NULL,
	photo bytea NULL,
	price varchar(255) NOT NULL,
	id serial4 NOT NULL,
	"createdAt" date NULL DEFAULT now(),
	"updatedAt" date NULL DEFAULT now(),
	CONSTRAINT products_pkey PRIMARY KEY (id)
);


-- public.questions definition

-- Drop table

-- DROP TABLE public.questions;

CREATE TABLE public.questions (
	question varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	id serial4 NOT NULL,
	important varchar(255) NOT NULL,
	"options" json NULL,
	remarks varchar(255) NULL,
	order_id int4 NOT NULL,
	"createdAt" date NULL DEFAULT now(),
	"updatedAt" date NULL DEFAULT now(),
	CONSTRAINT questions_pkey PRIMARY KEY (id)
);


-- public.resumes definition

-- Drop table

-- DROP TABLE public.resumes;

CREATE TABLE public.resumes (
	id serial4 NOT NULL,
	resume_title varchar(255) NULL,
	photo bytea NULL,
	resume_category varchar(255) NULL,
	"createdAt" date NULL DEFAULT now(),
	"updatedAt" date NULL DEFAULT now(),
	resume_template varchar NULL,
	resume_description varchar NULL,
	resume_link _json NULL,
	CONSTRAINT resumes_pkey PRIMARY KEY (id)
);


-- public.settings definition

-- Drop table

-- DROP TABLE public.settings;

CREATE TABLE public.settings (
	id serial4 NOT NULL,
	timming varchar(255) NULL,
	phone varchar(255) NULL,
	email varchar(255) NULL,
	website varchar(255) NULL,
	"location" varchar(255) NULL,
	"createdAt" date NULL DEFAULT now(),
	"updatedAt" date NULL DEFAULT now(),
	CONSTRAINT settings_pkey PRIMARY KEY (id)
);


-- public.testimonials definition

-- Drop table

-- DROP TABLE public.testimonials;

CREATE TABLE public.testimonials (
	description text NOT NULL,
	author varchar(255) NOT NULL,
	photo bytea NULL,
	id serial4 NOT NULL,
	"createdAt" date NULL DEFAULT now(),
	"updatedAt" date NULL DEFAULT now(),
	CONSTRAINT testimonials_pkey PRIMARY KEY (id)
);


-- public.tokendata definition

-- Drop table

-- DROP TABLE public.tokendata;

CREATE TABLE public.tokendata (
	id serial4 NOT NULL,
	"token" text NULL,
	CONSTRAINT tokendata_pkey PRIMARY KEY (id)
);


-- public.viewerfeedbacks definition

-- Drop table

-- DROP TABLE public.viewerfeedbacks;

CREATE TABLE public.viewerfeedbacks (
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	title varchar(255) NULL,
	description varchar(255) NULL,
	id serial4 NOT NULL,
	"createdAt" date NOT NULL DEFAULT now(),
	"updatedAt" date NULL DEFAULT now(),
	CONSTRAINT viewerfeedbacks_pkey PRIMARY KEY (id)
);


-- public.job_applications definition

-- Drop table

-- DROP TABLE public.job_applications;

CREATE TABLE public.job_applications (
	id serial4 NOT NULL,
	job_id varchar(255) NULL,
	phone_number varchar(255) NULL,
	"name" varchar(255) NULL,
	email varchar(255) NULL,
	resume bytea NULL,
	status int4 NULL,
	"createdAt" date NULL,
	"updatedAt" date NULL,
	CONSTRAINT job_applications_pkey PRIMARY KEY (id),
	CONSTRAINT fk_job_applications_job_id FOREIGN KEY (job_id) REFERENCES public.jobs(job_id)
);


-- public.responses definition

-- Drop table

-- DROP TABLE public.responses;

CREATE TABLE public.responses (
	id serial4 NOT NULL,
	phonenumber varchar(255) NULL,
	urole varchar(255) NULL,
	application_id varchar(255) NULL,
	phone_verify varchar(255) NULL,
	email_verify varchar(255) NULL,
	whatsapp_verify varchar(255) NULL,
	whatsappnumber varchar(255) NULL,
	"name" varchar(255) NULL,
	emailid varchar(255) NULL,
	marragestatus varchar(255) NULL,
	area varchar(255) NULL,
	city varchar(255) NULL,
	state varchar(255) NULL,
	pincode varchar(255) NULL,
	dob varchar(255) NULL,
	"password" varchar(255) NULL,
	gender varchar(255) NULL,
	qualification_10 varchar(255) NULL,
	university_10 varchar(255) NULL,
	ctype_10 varchar(255) NULL,
	percent_10 varchar(255) NULL,
	yos_10 varchar(255) NULL,
	yoc_10 varchar(255) NULL,
	college_10 varchar(255) NULL,
	state_10 varchar(255) NULL,
	qualification_12 varchar(255) NULL,
	university_12 varchar(255) NULL,
	ctype_12 varchar(255) NULL,
	percent_12 varchar(255) NULL,
	yos_12 varchar(255) NULL,
	yoc_12 varchar(255) NULL,
	college_12 varchar(255) NULL,
	state_12 varchar(255) NULL,
	ugqualification varchar(255) NULL,
	uguniversity varchar(255) NULL,
	ugctype varchar(255) NULL,
	ugpercent varchar(255) NULL,
	ugyos varchar(255) NULL,
	ugyoc varchar(255) NULL,
	ugcollege varchar(255) NULL,
	ugstate varchar(255) NULL,
	pgqualification varchar(255) NULL,
	pguniversity varchar(255) NULL,
	pgctype varchar(255) NULL,
	pgpercent varchar(255) NULL,
	pgyos varchar(255) NULL,
	pgyoc varchar(255) NULL,
	pgcollege varchar(255) NULL,
	pgstate varchar(255) NULL,
	qualification_diploma varchar(255) NULL,
	university_diploma varchar(255) NULL,
	ctype_diploma varchar(255) NULL,
	percent_diploma varchar(255) NULL,
	yos_diploma varchar(255) NULL,
	yoc_diploma varchar(255) NULL,
	college_diploma varchar(255) NULL,
	state_diploma varchar(255) NULL,
	languages varchar(255) NULL,
	skill1 varchar(255) NULL,
	skill2 varchar(255) NULL,
	skill3 varchar(255) NULL,
	skill4 varchar(255) NULL,
	skill5 varchar(255) NULL,
	exp_seeker_type varchar(255) NULL,
	company_project_name varchar(255) NULL,
	exp_sdate varchar(255) NULL,
	exp_edate varchar(255) NULL,
	project_role_summary varchar(255) NULL,
	"position" varchar(255) NULL,
	experience varchar(255) NULL,
	job_category varchar(255) NULL,
	job_location varchar(255) NULL,
	job_industry varchar(255) NULL,
	job_role varchar(255) NULL,
	job_department varchar(255) NULL,
	preferred_designation varchar(255) NULL,
	preferred_ctc varchar(255) NULL,
	present_ctc varchar(255) NULL,
	job_type varchar(255) NULL,
	job_jdate varchar(255) NULL,
	upload_photo bytea NULL,
	referee_name varchar(255) NULL,
	referee_num varchar(255) NULL,
	referee_paynum varchar(255) NULL,
	referee_email varchar(255) NULL,
	plan_detail varchar(255) NULL,
	alldata json NULL,
	"createdAt" date NULL DEFAULT now(),
	"updatedAt" date NULL DEFAULT now(),
	resume_file json NULL,
	CONSTRAINT responses_emailid_key UNIQUE (emailid),
	CONSTRAINT responses_pkey PRIMARY KEY (id),
	CONSTRAINT fk_email FOREIGN KEY (emailid) REFERENCES public.dashlogins(email)
);

-- Table Triggers

create trigger before_insert_set_application_id before
insert
    on
    public.responses for each row execute function set_response_application_id();