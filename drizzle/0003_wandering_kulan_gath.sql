CREATE TABLE "match" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"winner" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matchParticipant" (
	"match_id" uuid,
	"user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "matchParticipant_match_id_user_id_pk" PRIMARY KEY("match_id","user_id")
);
--> statement-breakpoint
DROP TABLE "guestBook" CASCADE;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_winner_user_id_fk" FOREIGN KEY ("winner") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matchParticipant" ADD CONSTRAINT "matchParticipant_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."match"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matchParticipant" ADD CONSTRAINT "matchParticipant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;