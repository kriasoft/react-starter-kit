CREATE TABLE "clara_activesoft_launch_log" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"individual_record_id" text NOT NULL,
	"launched_by_user_id" text,
	"launched_at" timestamp with time zone DEFAULT now() NOT NULL,
	"activesoft_reference" text,
	"manual_confirmation" boolean DEFAULT true NOT NULL,
	"internet_visible" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clara_activesoft_occurrence_type_mapping" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"clara_event_type" text NOT NULL,
	"activesoft_occurrence_type_id" text NOT NULL,
	"activesoft_occurrence_type_name" text NOT NULL,
	"internet_visible_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clara_activesoft_mapping_event_type_unique" UNIQUE("school_id","clara_event_type")
);
--> statement-breakpoint
CREATE TABLE "clara_attendance_record" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"lesson_session_id" text NOT NULL,
	"student_id" text NOT NULL,
	"status" text NOT NULL,
	"source" text DEFAULT 'teacher' NOT NULL,
	"recorded_by_user_id" text NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clara_attendance_record_lesson_student_unique" UNIQUE("lesson_session_id","student_id")
);
--> statement-breakpoint
CREATE TABLE "clara_class" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"term_id" text NOT NULL,
	"name" text NOT NULL,
	"grade" text,
	"shift" text,
	"activesoft_class_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clara_class_id_school_unique" UNIQUE("id","school_id"),
	CONSTRAINT "clara_class_school_term_name_unique" UNIQUE("school_id","term_id","name")
);
--> statement-breakpoint
CREATE TABLE "clara_enrollment" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"class_id" text NOT NULL,
	"student_id" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clara_enrollment_class_student_unique" UNIQUE("class_id","student_id")
);
--> statement-breakpoint
CREATE TABLE "clara_event_participant" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"event_id" text NOT NULL,
	"student_id" text NOT NULL,
	"role" text NOT NULL,
	"hidden_in_text" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clara_individual_student_record" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"event_id" text NOT NULL,
	"student_id" text NOT NULL,
	"raw_teacher_note" text NOT NULL,
	"normalized_internal_summary" text NOT NULL,
	"activesoft_observation_draft" text NOT NULL,
	"family_message_draft" text NOT NULL,
	"approved_activesoft_observation" text,
	"approved_family_message" text,
	"visibility_to_family" boolean DEFAULT false NOT NULL,
	"review_status" text DEFAULT 'awaiting_review' NOT NULL,
	"approved_by_user_id" text,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clara_individual_student_record_event_student_unique" UNIQUE("event_id","student_id"),
	CONSTRAINT "clara_individual_student_record_id_school_unique" UNIQUE("id","school_id")
);
--> statement-breakpoint
CREATE TABLE "clara_lesson_session" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"class_id" text NOT NULL,
	"subject_id" text NOT NULL,
	"teacher_profile_id" text NOT NULL,
	"scheduled_date" date NOT NULL,
	"starts_at" text NOT NULL,
	"ends_at" text NOT NULL,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clara_lesson_session_id_school_unique" UNIQUE("id","school_id")
);
--> statement-breakpoint
CREATE TABLE "clara_pedagogical_event" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"lesson_session_id" text NOT NULL,
	"event_type" text NOT NULL,
	"axis_code" text NOT NULL,
	"internal_code" text NOT NULL,
	"severity_suggestion" text NOT NULL,
	"sensitive_case" boolean DEFAULT false NOT NULL,
	"requires_coordinator_approval" boolean DEFAULT true NOT NULL,
	"raw_teacher_note" text NOT NULL,
	"created_by_user_id" text NOT NULL,
	"review_status" text DEFAULT 'awaiting_review' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clara_pedagogical_event_id_school_unique" UNIQUE("id","school_id")
);
--> statement-breakpoint
CREATE TABLE "clara_review_action" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"individual_record_id" text NOT NULL,
	"action" text NOT NULL,
	"from_status" text NOT NULL,
	"to_status" text NOT NULL,
	"note" text,
	"acted_by_user_id" text,
	"acted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clara_school" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"activesoft_school_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clara_student" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"display_name" text NOT NULL,
	"activesoft_student_id" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clara_student_id_school_unique" UNIQUE("id","school_id")
);
--> statement-breakpoint
CREATE TABLE "clara_subject" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"name" text NOT NULL,
	"code" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clara_subject_id_school_unique" UNIQUE("id","school_id"),
	CONSTRAINT "clara_subject_school_name_unique" UNIQUE("school_id","name")
);
--> statement-breakpoint
CREATE TABLE "clara_teacher_assignment" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"teacher_profile_id" text NOT NULL,
	"class_id" text NOT NULL,
	"subject_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clara_teacher_assignment_unique" UNIQUE("teacher_profile_id","class_id","subject_id")
);
--> statement-breakpoint
CREATE TABLE "clara_teacher_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"user_id" text NOT NULL,
	"display_name" text NOT NULL,
	"activesoft_teacher_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clara_teacher_profile_id_school_unique" UNIQUE("id","school_id"),
	CONSTRAINT "clara_teacher_profile_school_user_unique" UNIQUE("school_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "clara_term" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"name" text NOT NULL,
	"starts_on" date NOT NULL,
	"ends_on" date NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clara_term_id_school_unique" UNIQUE("id","school_id"),
	CONSTRAINT "clara_term_valid_date_range" CHECK ("clara_term"."ends_on" >= "clara_term"."starts_on")
);
--> statement-breakpoint
ALTER TABLE "clara_activesoft_launch_log" ADD CONSTRAINT "clara_activesoft_launch_log_school_id_clara_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."clara_school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_activesoft_launch_log" ADD CONSTRAINT "clara_activesoft_launch_log_individual_record_id_clara_individual_student_record_id_fk" FOREIGN KEY ("individual_record_id") REFERENCES "public"."clara_individual_student_record"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_activesoft_launch_log" ADD CONSTRAINT "clara_activesoft_launch_log_launched_by_user_id_user_id_fk" FOREIGN KEY ("launched_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_activesoft_launch_log" ADD CONSTRAINT "clara_activesoft_launch_record_school_fk" FOREIGN KEY ("individual_record_id","school_id") REFERENCES "public"."clara_individual_student_record"("id","school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_activesoft_occurrence_type_mapping" ADD CONSTRAINT "clara_activesoft_occurrence_type_mapping_school_id_clara_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."clara_school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_attendance_record" ADD CONSTRAINT "clara_attendance_record_school_id_clara_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."clara_school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_attendance_record" ADD CONSTRAINT "clara_attendance_record_lesson_session_id_clara_lesson_session_id_fk" FOREIGN KEY ("lesson_session_id") REFERENCES "public"."clara_lesson_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_attendance_record" ADD CONSTRAINT "clara_attendance_record_student_id_clara_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."clara_student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_attendance_record" ADD CONSTRAINT "clara_attendance_record_recorded_by_user_id_user_id_fk" FOREIGN KEY ("recorded_by_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_attendance_record" ADD CONSTRAINT "clara_attendance_record_lesson_school_fk" FOREIGN KEY ("lesson_session_id","school_id") REFERENCES "public"."clara_lesson_session"("id","school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_attendance_record" ADD CONSTRAINT "clara_attendance_record_student_school_fk" FOREIGN KEY ("student_id","school_id") REFERENCES "public"."clara_student"("id","school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_class" ADD CONSTRAINT "clara_class_school_id_clara_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."clara_school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_class" ADD CONSTRAINT "clara_class_term_id_clara_term_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."clara_term"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_class" ADD CONSTRAINT "clara_class_term_school_fk" FOREIGN KEY ("term_id","school_id") REFERENCES "public"."clara_term"("id","school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_enrollment" ADD CONSTRAINT "clara_enrollment_school_id_clara_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."clara_school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_enrollment" ADD CONSTRAINT "clara_enrollment_class_id_clara_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."clara_class"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_enrollment" ADD CONSTRAINT "clara_enrollment_student_id_clara_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."clara_student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_enrollment" ADD CONSTRAINT "clara_enrollment_class_school_fk" FOREIGN KEY ("class_id","school_id") REFERENCES "public"."clara_class"("id","school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_enrollment" ADD CONSTRAINT "clara_enrollment_student_school_fk" FOREIGN KEY ("student_id","school_id") REFERENCES "public"."clara_student"("id","school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_event_participant" ADD CONSTRAINT "clara_event_participant_school_id_clara_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."clara_school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_event_participant" ADD CONSTRAINT "clara_event_participant_event_id_clara_pedagogical_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."clara_pedagogical_event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_event_participant" ADD CONSTRAINT "clara_event_participant_student_id_clara_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."clara_student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_event_participant" ADD CONSTRAINT "clara_event_participant_event_school_fk" FOREIGN KEY ("event_id","school_id") REFERENCES "public"."clara_pedagogical_event"("id","school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_event_participant" ADD CONSTRAINT "clara_event_participant_student_school_fk" FOREIGN KEY ("student_id","school_id") REFERENCES "public"."clara_student"("id","school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_individual_student_record" ADD CONSTRAINT "clara_individual_student_record_school_id_clara_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."clara_school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_individual_student_record" ADD CONSTRAINT "clara_individual_student_record_event_id_clara_pedagogical_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."clara_pedagogical_event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_individual_student_record" ADD CONSTRAINT "clara_individual_student_record_student_id_clara_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."clara_student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_individual_student_record" ADD CONSTRAINT "clara_individual_student_record_approved_by_user_id_user_id_fk" FOREIGN KEY ("approved_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_individual_student_record" ADD CONSTRAINT "clara_individual_record_event_school_fk" FOREIGN KEY ("event_id","school_id") REFERENCES "public"."clara_pedagogical_event"("id","school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_individual_student_record" ADD CONSTRAINT "clara_individual_record_student_school_fk" FOREIGN KEY ("student_id","school_id") REFERENCES "public"."clara_student"("id","school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_lesson_session" ADD CONSTRAINT "clara_lesson_session_school_id_clara_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."clara_school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_lesson_session" ADD CONSTRAINT "clara_lesson_session_class_id_clara_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."clara_class"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_lesson_session" ADD CONSTRAINT "clara_lesson_session_subject_id_clara_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."clara_subject"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_lesson_session" ADD CONSTRAINT "clara_lesson_session_teacher_profile_id_clara_teacher_profile_id_fk" FOREIGN KEY ("teacher_profile_id") REFERENCES "public"."clara_teacher_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_lesson_session" ADD CONSTRAINT "clara_lesson_session_class_school_fk" FOREIGN KEY ("class_id","school_id") REFERENCES "public"."clara_class"("id","school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_lesson_session" ADD CONSTRAINT "clara_lesson_session_subject_school_fk" FOREIGN KEY ("subject_id","school_id") REFERENCES "public"."clara_subject"("id","school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_lesson_session" ADD CONSTRAINT "clara_lesson_session_teacher_school_fk" FOREIGN KEY ("teacher_profile_id","school_id") REFERENCES "public"."clara_teacher_profile"("id","school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_pedagogical_event" ADD CONSTRAINT "clara_pedagogical_event_school_id_clara_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."clara_school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_pedagogical_event" ADD CONSTRAINT "clara_pedagogical_event_lesson_session_id_clara_lesson_session_id_fk" FOREIGN KEY ("lesson_session_id") REFERENCES "public"."clara_lesson_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_pedagogical_event" ADD CONSTRAINT "clara_pedagogical_event_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_pedagogical_event" ADD CONSTRAINT "clara_pedagogical_event_lesson_school_fk" FOREIGN KEY ("lesson_session_id","school_id") REFERENCES "public"."clara_lesson_session"("id","school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_review_action" ADD CONSTRAINT "clara_review_action_school_id_clara_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."clara_school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_review_action" ADD CONSTRAINT "clara_review_action_individual_record_id_clara_individual_student_record_id_fk" FOREIGN KEY ("individual_record_id") REFERENCES "public"."clara_individual_student_record"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_review_action" ADD CONSTRAINT "clara_review_action_acted_by_user_id_user_id_fk" FOREIGN KEY ("acted_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_review_action" ADD CONSTRAINT "clara_review_action_record_school_fk" FOREIGN KEY ("individual_record_id","school_id") REFERENCES "public"."clara_individual_student_record"("id","school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_school" ADD CONSTRAINT "clara_school_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_student" ADD CONSTRAINT "clara_student_school_id_clara_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."clara_school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_subject" ADD CONSTRAINT "clara_subject_school_id_clara_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."clara_school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_teacher_assignment" ADD CONSTRAINT "clara_teacher_assignment_school_id_clara_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."clara_school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_teacher_assignment" ADD CONSTRAINT "clara_teacher_assignment_teacher_profile_id_clara_teacher_profile_id_fk" FOREIGN KEY ("teacher_profile_id") REFERENCES "public"."clara_teacher_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_teacher_assignment" ADD CONSTRAINT "clara_teacher_assignment_class_id_clara_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."clara_class"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_teacher_assignment" ADD CONSTRAINT "clara_teacher_assignment_subject_id_clara_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."clara_subject"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_teacher_assignment" ADD CONSTRAINT "clara_teacher_assignment_teacher_school_fk" FOREIGN KEY ("teacher_profile_id","school_id") REFERENCES "public"."clara_teacher_profile"("id","school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_teacher_assignment" ADD CONSTRAINT "clara_teacher_assignment_class_school_fk" FOREIGN KEY ("class_id","school_id") REFERENCES "public"."clara_class"("id","school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_teacher_assignment" ADD CONSTRAINT "clara_teacher_assignment_subject_school_fk" FOREIGN KEY ("subject_id","school_id") REFERENCES "public"."clara_subject"("id","school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_teacher_profile" ADD CONSTRAINT "clara_teacher_profile_school_id_clara_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."clara_school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_teacher_profile" ADD CONSTRAINT "clara_teacher_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clara_term" ADD CONSTRAINT "clara_term_school_id_clara_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."clara_school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "clara_activesoft_launch_log_school_id_idx" ON "clara_activesoft_launch_log" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "clara_activesoft_launch_log_individual_record_id_idx" ON "clara_activesoft_launch_log" USING btree ("individual_record_id");--> statement-breakpoint
CREATE INDEX "clara_activesoft_launch_log_launched_by_user_id_idx" ON "clara_activesoft_launch_log" USING btree ("launched_by_user_id");--> statement-breakpoint
CREATE INDEX "clara_activesoft_mapping_school_id_idx" ON "clara_activesoft_occurrence_type_mapping" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "clara_attendance_record_school_id_idx" ON "clara_attendance_record" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "clara_attendance_record_lesson_session_id_idx" ON "clara_attendance_record" USING btree ("lesson_session_id");--> statement-breakpoint
CREATE INDEX "clara_attendance_record_student_id_idx" ON "clara_attendance_record" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "clara_attendance_record_recorded_by_user_id_idx" ON "clara_attendance_record" USING btree ("recorded_by_user_id");--> statement-breakpoint
CREATE INDEX "clara_class_school_id_idx" ON "clara_class" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "clara_class_term_id_idx" ON "clara_class" USING btree ("term_id");--> statement-breakpoint
CREATE INDEX "clara_enrollment_school_id_idx" ON "clara_enrollment" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "clara_enrollment_class_id_idx" ON "clara_enrollment" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "clara_enrollment_student_id_idx" ON "clara_enrollment" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "clara_event_participant_school_id_idx" ON "clara_event_participant" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "clara_event_participant_event_id_idx" ON "clara_event_participant" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "clara_event_participant_student_id_idx" ON "clara_event_participant" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "clara_individual_student_record_school_id_idx" ON "clara_individual_student_record" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "clara_individual_student_record_event_id_idx" ON "clara_individual_student_record" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "clara_individual_student_record_student_id_idx" ON "clara_individual_student_record" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "clara_individual_student_record_review_status_idx" ON "clara_individual_student_record" USING btree ("review_status");--> statement-breakpoint
CREATE INDEX "clara_individual_student_record_approved_by_user_id_idx" ON "clara_individual_student_record" USING btree ("approved_by_user_id");--> statement-breakpoint
CREATE INDEX "clara_lesson_session_school_id_idx" ON "clara_lesson_session" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "clara_lesson_session_class_id_idx" ON "clara_lesson_session" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "clara_lesson_session_subject_id_idx" ON "clara_lesson_session" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "clara_lesson_session_teacher_profile_id_idx" ON "clara_lesson_session" USING btree ("teacher_profile_id");--> statement-breakpoint
CREATE INDEX "clara_lesson_session_scheduled_date_idx" ON "clara_lesson_session" USING btree ("scheduled_date");--> statement-breakpoint
CREATE INDEX "clara_pedagogical_event_school_id_idx" ON "clara_pedagogical_event" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "clara_pedagogical_event_lesson_session_id_idx" ON "clara_pedagogical_event" USING btree ("lesson_session_id");--> statement-breakpoint
CREATE INDEX "clara_pedagogical_event_created_by_user_id_idx" ON "clara_pedagogical_event" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "clara_pedagogical_event_review_status_idx" ON "clara_pedagogical_event" USING btree ("review_status");--> statement-breakpoint
CREATE INDEX "clara_review_action_school_id_idx" ON "clara_review_action" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "clara_review_action_individual_record_id_idx" ON "clara_review_action" USING btree ("individual_record_id");--> statement-breakpoint
CREATE INDEX "clara_review_action_acted_by_user_id_idx" ON "clara_review_action" USING btree ("acted_by_user_id");--> statement-breakpoint
CREATE INDEX "clara_school_organization_id_idx" ON "clara_school" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "clara_student_school_id_idx" ON "clara_student" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "clara_subject_school_id_idx" ON "clara_subject" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "clara_teacher_assignment_school_id_idx" ON "clara_teacher_assignment" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "clara_teacher_assignment_teacher_profile_id_idx" ON "clara_teacher_assignment" USING btree ("teacher_profile_id");--> statement-breakpoint
CREATE INDEX "clara_teacher_assignment_class_id_idx" ON "clara_teacher_assignment" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "clara_teacher_assignment_subject_id_idx" ON "clara_teacher_assignment" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "clara_teacher_profile_school_id_idx" ON "clara_teacher_profile" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "clara_teacher_profile_user_id_idx" ON "clara_teacher_profile" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "clara_term_school_id_idx" ON "clara_term" USING btree ("school_id");