# Grokade Database Backup Tools

This directory contains database backups and tools for Grokade.

## Backup Types

1. **Schema Snapshots**: In the `snapshots` directory
   - These are point-in-time copies of your Prisma schema
   - Useful for tracking schema changes over time

2. **CSV Exports**: In the `csv` directory
   - Each table is exported as a CSV file
   - Good for viewing data in spreadsheet applications
   - Easy to import into other systems

3. **SQL Dumps**: In the `sql` directory
   - Full database dumps in SQL format
   - Can be used to completely restore your database

## How to Create Backups

### Full Backup (All Methods)

```bash
npm run backup
```

This creates:
- Schema snapshot in `prisma/backups/snapshots/`
- CSV exports in `prisma/backups/csv/[timestamp]/`
- SQL dump in `prisma/backups/sql/`
- A ZIP archive with all of the above

### Schema Snapshot Only

```bash
npm run prisma:snapshot
```

This creates a migration file in your `prisma/migrations` directory that captures your current schema, without applying it to the database.

### Export Single Table to CSV

```bash
# Export a specific table
npm run export-table [ModelName]

# Examples:
npm run export-games     # Export Games table
npm run export-users     # Export Users table
npm run export-sponsors  # Export Sponsors table
```

Exports are saved to the `exports` directory in the project root.

## Restoring from Backup

### From SQL Dump

```bash
# Replace with your actual DB connection details
psql [CONNECTION_STRING] < prisma/backups/sql/dump_[timestamp].sql
```

### From CSV Files

CSV files need to be imported individually. You can use the Prisma Studio UI to do this:

1. Open Prisma Studio: `npx prisma studio`
2. Navigate to the model you want to restore
3. Use the "Import" feature to import the CSV file

## Backup Retention

Consider implementing a backup retention policy to manage disk space:

- Keep daily backups for 7 days
- Keep weekly backups for 1 month
- Keep monthly backups for 1 year

## Best Practices

1. **Regular Backups**: Schedule the backup script to run daily
2. **Offsite Storage**: Copy the backup files to an offsite location or cloud storage
3. **Verify Backups**: Periodically test restoring from your backups
4. **Documentation**: Document any schema changes alongside your backups 