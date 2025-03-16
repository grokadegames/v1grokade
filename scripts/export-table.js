/**
 * Export a Specific Table to CSV
 * 
 * Usage:
 *   node scripts/export-table.js <ModelName>
 * 
 * Example:
 *   node scripts/export-table.js Game
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Initialize Prisma client
const prisma = new PrismaClient();

// Get the model name from command line arguments
const modelName = process.argv[2];

if (!modelName) {
  console.error('Please specify a model name');
  console.log('Usage: node scripts/export-table.js <ModelName>');
  console.log('Available models: User, Game, GameFavorite, Sponsor, GameMetrics');
  process.exit(1);
}

// Validate model name
const validModels = ['User', 'Game', 'GameFavorite', 'Sponsor', 'GameMetrics'];
if (!validModels.includes(modelName)) {
  console.error(`Invalid model name: ${modelName}`);
  console.log('Available models: User, Game, GameFavorite, Sponsor, GameMetrics');
  process.exit(1);
}

// Export function
async function exportTable(model) {
  try {
    console.log(`Exporting ${model} table to CSV...`);
    
    // Get the Prisma model (convert model name to camelCase for Prisma)
    const prismaModel = model.charAt(0).toLowerCase() + model.slice(1);
    
    // Query all records for this model
    const records = await prisma[prismaModel].findMany();
    
    if (records.length === 0) {
      console.log(`No records found for ${model}`);
      return;
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
    
    // Create output directory if it doesn't exist
    const exportDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    // Write to file with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(exportDir, `${model}_${timestamp}.csv`);
    fs.writeFileSync(filePath, csv);
    
    console.log(`Exported ${records.length} ${model} records to ${filePath}`);
  } catch (error) {
    console.error(`Error exporting ${model}:`, error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute export
exportTable(modelName); 