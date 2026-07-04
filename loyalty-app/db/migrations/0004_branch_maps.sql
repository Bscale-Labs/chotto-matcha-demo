ALTER TABLE "branches" ADD COLUMN "google_maps_url" text;--> statement-breakpoint
ALTER TABLE "branches" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "branches" DROP COLUMN "operating_hours";
