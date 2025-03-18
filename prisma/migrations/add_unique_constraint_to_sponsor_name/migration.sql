-- Add unique constraint to sponsor name
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_name_key" UNIQUE ("name"); 