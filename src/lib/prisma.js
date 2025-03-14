import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global;

// Clean the DATABASE_URL if it has any whitespace issues
if (process.env.DATABASE_URL) {
  console.log('[PRISMA] Original DATABASE_URL length:', process.env.DATABASE_URL.length);
  process.env.DATABASE_URL = process.env.DATABASE_URL.trim();
  console.log('[PRISMA] Cleaned DATABASE_URL length:', process.env.DATABASE_URL.length);
}

// Create the PrismaClient instance with extra logging in development
const prismaClientOptions = process.env.NODE_ENV === 'development' 
  ? {
      log: ['query', 'info', 'warn', 'error'],
    }
  : {};

export const prisma = globalForPrisma.prisma || new PrismaClient(prismaClientOptions);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma; 