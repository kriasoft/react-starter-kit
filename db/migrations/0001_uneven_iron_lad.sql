CREATE TABLE "credits_account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "credits_account_userId_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "credits_transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"delta" integer NOT NULL,
	"type" text NOT NULL,
	"ref_id" text NOT NULL,
	"balance_after" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "credits_txn_type_ref_unique" UNIQUE("type","ref_id")
);
--> statement-breakpoint
CREATE TABLE "generation" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"idempotency_key" text NOT NULL,
	"status" text DEFAULT 'processing' NOT NULL,
	"prompt" text NOT NULL,
	"model" text NOT NULL,
	"steps" integer NOT NULL,
	"cost" integer NOT NULL,
	"r2_key" text,
	"error_kind" text,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "generation_idempotency_key_unique" UNIQUE("user_id","idempotency_key")
);
--> statement-breakpoint
ALTER TABLE "credits_account" ADD CONSTRAINT "credits_account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credits_transaction" ADD CONSTRAINT "credits_transaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generation" ADD CONSTRAINT "generation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "credits_account_user_id_idx" ON "credits_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "credits_txn_user_created_idx" ON "credits_transaction" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "generation_user_created_idx" ON "generation" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "generation_status_idx" ON "generation" USING btree ("status");