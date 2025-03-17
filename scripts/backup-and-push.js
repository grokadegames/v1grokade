const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Directories to check for backups
const CSV_DIR = path.join(__dirname, '../prisma/backups/csv');
const SQL_DIR = path.join(__dirname, '../prisma/backups/sql');
const SNAPSHOTS_DIR = path.join(__dirname, '../prisma/backups/snapshots');
const ZIP_DIR = path.join(__dirname, '../prisma/backups');

/**
 * Runs the backup process
 */
function runBackup() {
  console.log('📦 Starting database backup...');
  try {
    execSync('npm run backup', { stdio: 'inherit' });
    console.log('✅ Backup completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    return false;
  }
}

/**
 * Gets the timestamp from the most recent backup
 */
function getLatestBackupTimestamp() {
  // Check backup ZIP files for the latest timestamp
  const backupFiles = fs.readdirSync(ZIP_DIR)
    .filter(file => file.startsWith('grokade_backup_') && file.endsWith('.zip'))
    .sort()
    .reverse();

  if (backupFiles.length === 0) {
    return null;
  }

  // Extract timestamp from filename (grokade_backup_TIMESTAMP.zip)
  const latestBackup = backupFiles[0];
  return latestBackup.replace('grokade_backup_', '').replace('.zip', '');
}

/**
 * Cleans up old backups, keeping the most recent N
 */
function cleanupOldBackups(keepCount = 5) {
  console.log(`🧹 Cleaning up old backups, keeping the ${keepCount} most recent...`);

  // Get all backup timestamps by listing the ZIP files
  const allBackups = fs.readdirSync(ZIP_DIR)
    .filter(file => file.startsWith('grokade_backup_') && file.endsWith('.zip'))
    .map(file => file.replace('grokade_backup_', '').replace('.zip', ''))
    .sort()
    .reverse();

  // Keep only the specified number of recent backups
  const backupsToRemove = allBackups.slice(keepCount);
  
  if (backupsToRemove.length === 0) {
    console.log('  No old backups to remove.');
    return;
  }

  console.log(`  Removing ${backupsToRemove.length} old backups...`);
  
  for (const timestamp of backupsToRemove) {
    try {
      // Remove CSV files
      const csvDir = path.join(CSV_DIR, timestamp);
      if (fs.existsSync(csvDir)) {
        fs.rmSync(csvDir, { recursive: true, force: true });
      }
      
      // Remove SQL dump
      const sqlFile = path.join(SQL_DIR, `dump_${timestamp}.sql`);
      if (fs.existsSync(sqlFile)) {
        fs.unlinkSync(sqlFile);
      }
      
      // Remove schema snapshot
      const schemaFile = path.join(SNAPSHOTS_DIR, `schema_${timestamp}.prisma`);
      if (fs.existsSync(schemaFile)) {
        fs.unlinkSync(schemaFile);
      }
      
      // Remove ZIP file
      const zipFile = path.join(ZIP_DIR, `grokade_backup_${timestamp}.zip`);
      if (fs.existsSync(zipFile)) {
        fs.unlinkSync(zipFile);
      }
      
      console.log(`  ✅ Removed backup ${timestamp}`);
    } catch (error) {
      console.error(`  ❌ Error removing backup ${timestamp}:`, error.message);
    }
  }
}

/**
 * Pushes backup changes to Git
 */
function pushToGit(timestamp) {
  console.log('🚀 Pushing backup to Git repository...');
  
  try {
    // Add backup files to git
    execSync('git add prisma/backups/', { stdio: 'inherit' });
    
    // Create commit with the timestamp
    const commitMessage = `Add database backup (${timestamp})`;
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    
    // Push to remote repository
    execSync('git push', { stdio: 'inherit' });
    
    console.log('✅ Backup pushed to Git successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error pushing to Git:', error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🗄️  Database Backup and Push Tool');
  console.log('================================');
  
  // 1. Run database backup
  const backupSuccess = runBackup();
  if (!backupSuccess) {
    process.exit(1);
  }
  
  // 2. Get the timestamp of the latest backup
  const timestamp = getLatestBackupTimestamp();
  if (!timestamp) {
    console.error('❌ Could not determine the latest backup timestamp.');
    process.exit(1);
  }
  
  // 3. Push to Git
  const pushSuccess = pushToGit(timestamp);
  if (!pushSuccess) {
    process.exit(1);
  }
  
  // 4. Clean up old backups
  cleanupOldBackups(5);
  
  console.log('');
  console.log('✨ All tasks completed successfully!');
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 