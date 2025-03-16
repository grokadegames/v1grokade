/**
 * Database Backup Script for Grokade
 * 
 * This script:
 * 1. Creates a snapshot of the Prisma schema
 * 2. Exports all tables to CSV files
 * 3. Creates a full SQL dump of the database
 * 
 * Usage: node scripts/backup-db.js
 */

const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

// Get timestamp for file naming
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

// Directories for backups
const SNAPSHOT_DIR = path.join(__dirname, '../prisma/backups/snapshots');
const CSV_DIR = path.join(__dirname, '../prisma/backups/csv', timestamp);
const SQL_DIR = path.join(__dirname, '../prisma/backups/sql');

// Ensure directories exist
fs.mkdirSync(CSV_DIR, { recursive: true });

/**
 * Create a Prisma schema snapshot using Prisma migrate
 */
async function createSchemaSnapshot() {
  try {
    console.log('Creating Prisma schema snapshot...');
    
    // Copy the current schema to snapshots directory
    const schemaContent = fs.readFileSync(path.join(__dirname, '../prisma/schema.prisma'), 'utf8');
    fs.writeFileSync(
      path.join(SNAPSHOT_DIR, `schema_${timestamp}.prisma`), 
      schemaContent
    );
    
    console.log(`Schema snapshot saved to prisma/backups/snapshots/schema_${timestamp}.prisma`);
    return true;
  } catch (error) {
    console.error('Error creating schema snapshot:', error);
    return false;
  }
}

/**
 * Export all database tables to CSV files
 */
async function exportTablesToCSV() {
  try {
    console.log('Exporting database tables to CSV...');
    
    // Get all models from Prisma schema
    const models = ['User', 'Game', 'GameFavorite', 'Sponsor', 'GameMetrics'];
    
    // Export each model to CSV
    for (const model of models) {
      console.log(`Exporting ${model}...`);
      
      // Query all records for this model
      const records = await prisma[model.charAt(0).toLowerCase() + model.slice(1)].findMany();
      
      if (records.length === 0) {
        console.log(`No records found for ${model}`);
        continue;
      }
      
      // Convert to CSV
      const headers = Object.keys(records[0]).join(',');
      const rows = records.map(record => {
        return Object.values(record).map(value => {
          // Handle different data types for CSV
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') {
            if (value instanceof Date) return value.toISOString();
            return JSON.stringify(value).replace(/"/g, '""');
          }
          if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
          return value;
        }).join(',');
      });
      
      const csv = [headers, ...rows].join('\n');
      
      // Write to file
      fs.writeFileSync(path.join(CSV_DIR, `${model}.csv`), csv);
      console.log(`Exported ${records.length} ${model} records to CSV`);
    }
    
    console.log(`All tables exported to CSV in prisma/backups/csv/${timestamp}/`);
    return true;
  } catch (error) {
    console.error('Error exporting tables to CSV:', error);
    return false;
  }
}

/**
 * Create a full SQL dump of the database
 */
async function createSQLDump() {
  try {
    console.log('Creating SQL dump...');
    
    // Extract database connection details from DATABASE_URL
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    // Use pg_dump to create a SQL dump (this requires PostgreSQL tools to be installed)
    const dumpFile = path.join(SQL_DIR, `dump_${timestamp}.sql`);
    
    execSync(`pg_dump "${databaseUrl}" > "${dumpFile}"`, {
      stdio: 'inherit'
    });
    
    console.log(`SQL dump saved to prisma/backups/sql/dump_${timestamp}.sql`);
    return true;
  } catch (error) {
    console.error('Error creating SQL dump:', error);
    return false;
  }
}

/**
 * Zip all backup files
 */
async function createZipArchive() {
  try {
    console.log('Creating ZIP archive of all backups...');
    
    const zipFile = path.join(__dirname, `../prisma/backups/grokade_backup_${timestamp}.zip`);
    
    execSync(`zip -r "${zipFile}" "${CSV_DIR}" "${path.join(SNAPSHOT_DIR, `schema_${timestamp}.prisma`)}" "${path.join(SQL_DIR, `dump_${timestamp}.sql`)}"`, {
      stdio: 'inherit'
    });
    
    console.log(`ZIP archive created at prisma/backups/grokade_backup_${timestamp}.zip`);
    return true;
  } catch (error) {
    console.error('Error creating ZIP archive:', error);
    return false;
  }
}

/**
 * Main backup process
 */
async function performBackup() {
  console.log('Starting Grokade database backup...');
  
  try {
    const schemaResult = await createSchemaSnapshot();
    const csvResult = await exportTablesToCSV();
    const sqlResult = await createSQLDump();
    
    if (schemaResult && csvResult && sqlResult) {
      await createZipArchive();
      console.log('Backup completed successfully!');
    } else {
      console.error('Backup completed with some errors. Please check the logs above.');
    }
  } catch (error) {
    console.error('Error during backup process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the backup
performBackup(); 