-- Create GameStage enum type if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gamestage') THEN
        CREATE TYPE "GameStage" AS ENUM ('BETA', 'PRODUCTION');
    END IF;
END $$;

-- Alter the column to use the enum type (with temporary conversion)
ALTER TABLE "games" 
  ALTER COLUMN "stage" TYPE "GameStage" 
  USING 
    CASE 
      WHEN "stage" = 'BETA' THEN 'BETA'::"GameStage"
      WHEN "stage" = 'PRODUCTION' THEN 'PRODUCTION'::"GameStage"
      ELSE 'BETA'::"GameStage" 
    END;

-- Add default value
ALTER TABLE "games" 
  ALTER COLUMN "stage" SET DEFAULT 'BETA'::"GameStage";
