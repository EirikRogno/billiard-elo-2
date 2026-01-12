ALTER TABLE "match" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "match" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;