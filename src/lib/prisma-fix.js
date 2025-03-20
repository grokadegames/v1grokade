import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global;

// Clean the DATABASE_URL if it has any whitespace issues
if (process.env.DATABASE_URL) {
  console.log('[PRISMA-FIX] Original DATABASE_URL length:', process.env.DATABASE_URL.length);
  process.env.DATABASE_URL = process.env.DATABASE_URL.trim();
  console.log('[PRISMA-FIX] Cleaned DATABASE_URL length:', process.env.DATABASE_URL.length);
}

// Create the PrismaClient instance with extra logging in development
const prismaClientOptions = process.env.NODE_ENV === 'development' 
  ? {
      log: ['query', 'info', 'warn', 'error'],
    }
  : {};

export const prismaClient = globalForPrisma.prisma || new PrismaClient(prismaClientOptions);

// Create a wrapped version of Prisma that can handle the stage filter issue
const enhancedPrisma = {
  ...prismaClient,

  // Override the game model with custom filter handling
  game: {
    ...prismaClient.game,
    
    // Override findMany to handle stage filter
    findMany: async (args) => {
      try {
        // First try the native Prisma query
        console.log('[PRISMA-FIX] Attempting native findMany query...');
        return await prismaClient.game.findMany(args);
      } catch (error) {
        console.log('[PRISMA-FIX] Native query failed, applying workaround...');
        
        // If we have a stage filter in the where clause, handle it differently
        if (args?.where?.stage) {
          console.log('[PRISMA-FIX] Detected stage filter:', args.where.stage);
          
          // Try a raw SQL query when stage filter is causing problems
          const stageValue = args.where.stage;
          delete args.where.stage;
          
          // First get IDs of games with matching stage
          console.log('[PRISMA-FIX] Executing raw SQL query for stage filter...');
          const stageFilteredIds = await prismaClient.$queryRaw`
            SELECT id FROM games WHERE stage = ${stageValue}::text::"GameStage"
          `;
          
          if (!stageFilteredIds || stageFilteredIds.length === 0) {
            console.log('[PRISMA-FIX] No games found with matching stage');
            return [];
          }
          
          // Extract the IDs
          const ids = stageFilteredIds.map(row => row.id);
          console.log(`[PRISMA-FIX] Found ${ids.length} games with matching stage`);
          
          // Add ID filter to the where clause
          args.where = {
            ...args.where,
            id: { in: ids }
          };
          
          // Now execute the query without the problematic stage filter
          return await prismaClient.game.findMany(args);
        }
        
        // If it's not a stage filter issue, rethrow the error
        throw error;
      }
    },
    
    // Override count to handle stage filter
    count: async (args) => {
      try {
        // First try the native Prisma query
        console.log('[PRISMA-FIX] Attempting native count query...');
        return await prismaClient.game.count(args);
      } catch (error) {
        console.log('[PRISMA-FIX] Native count query failed, applying workaround...');
        
        // If we have a stage filter in the where clause, handle it differently
        if (args?.where?.stage) {
          console.log('[PRISMA-FIX] Detected stage filter in count:', args.where.stage);
          
          // Try a raw SQL query when stage filter is causing problems
          const stageValue = args.where.stage;
          
          // Execute a raw count query
          console.log('[PRISMA-FIX] Executing raw SQL count query...');
          const result = await prismaClient.$queryRaw`
            SELECT COUNT(*) as count FROM games WHERE stage = ${stageValue}::text::"GameStage"
          `;
          
          return parseInt(result[0].count.toString());
        }
        
        // If it's not a stage filter issue, rethrow the error
        throw error;
      }
    }
  }
};

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;

export default enhancedPrisma; 