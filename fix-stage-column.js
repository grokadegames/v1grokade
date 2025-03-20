// Script to verify and fix the stage column in the Game table
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyAndFixStageColumn() {
  try {
    console.log('Starting stage column verification...');

    // 1. Check database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('Database connection successful');
    } catch (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
    }

    // 2. Get database schema information
    console.log('\nFetching column information for "games" table...');
    const columnInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, udt_name, column_default
      FROM information_schema.columns 
      WHERE table_name = 'games'
      ORDER BY ordinal_position
    `;
    
    console.log('Column information:');
    console.table(columnInfo);

    // 3. Check if the stage column exists
    const stageColumn = columnInfo.find(col => col.column_name === 'stage');
    if (!stageColumn) {
      console.error('Stage column does not exist in the games table!');
      
      // Create the column if it doesn't exist
      console.log('Adding stage column to games table...');
      await prisma.$executeRaw`ALTER TABLE games ADD COLUMN stage TEXT`;
      await prisma.$executeRaw`ALTER TABLE games ALTER COLUMN stage SET DEFAULT 'PRODUCTION'`;
      
      console.log('Stage column added successfully.');
    } else {
      console.log(`\nStage column exists with type: ${stageColumn.data_type}, udt: ${stageColumn.udt_name}`);
      
      // 4. Check if the enum type exists
      console.log('\nChecking GameStage enum type...');
      const enumTypes = await prisma.$queryRaw`
        SELECT n.nspname as enum_schema, t.typname as enum_name, e.enumlabel as enum_value
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'GameStage'
        ORDER BY e.enumsortorder
      `;
      
      if (enumTypes.length === 0) {
        console.log('GameStage enum type does not exist.');
        console.log('Fixing: Converting stage column to use proper enum type...');
        
        // Create enum and convert column
        await prisma.$executeRaw`CREATE TYPE "GameStage" AS ENUM ('BETA', 'PRODUCTION')`;
        await prisma.$executeRaw`ALTER TABLE games ALTER COLUMN stage TYPE "GameStage" USING stage::text::"GameStage"`;
        
        console.log('Stage column type fixed. Now using GameStage enum.');
      } else {
        console.log('GameStage enum exists with values:');
        console.table(enumTypes);
      }
    }

    // 5. Count games by stage
    const stageGroups = await prisma.$queryRaw`SELECT stage, COUNT(*) FROM games GROUP BY stage`;
    console.log('\nGames grouped by stage:');
    console.table(stageGroups);

    // 6. Check a sample of games
    const sampleGames = await prisma.game.findMany({
      take: 5,
      select: { id: true, title: true, stage: true }
    });
    
    console.log('\nSample games with stage values:');
    console.table(sampleGames);

    console.log('\nTest querying by stage value...');
    
    try {
      const prodCount = await prisma.game.count({
        where: {
          stage: 'PRODUCTION'
        }
      });
      console.log(`Games with stage = PRODUCTION: ${prodCount}`);
    } catch (error) {
      console.error('Error filtering by PRODUCTION stage:', error.message);
    }
    
    try {
      const betaCount = await prisma.game.count({
        where: {
          stage: 'BETA'
        }
      });
      console.log(`Games with stage = BETA: ${betaCount}`);
    } catch (error) {
      console.error('Error filtering by BETA stage:', error.message);
    }

    console.log('\nVerification and fixes completed.');
  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAndFixStageColumn(); 