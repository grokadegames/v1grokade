const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

// TwicPics configuration
const TWICPICS_DOMAIN = process.env.TWICPICS_DOMAIN;
const TWICPICS_PATH_PREFIX = process.env.TWICPICS_PATH_PREFIX || 'grokade/';

// Read migration CSV to get old and new URLs
async function readMigrationData() {
  return new Promise((resolve, reject) => {
    const csvPath = path.join(__dirname, '../cloudinary-to-twicpics-migration.csv');
    
    if (!fs.existsSync(csvPath)) {
      reject(new Error(`Migration CSV file not found at ${csvPath}`));
      return;
    }
    
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    
    // Skip header
    const dataLines = lines.slice(1);
    
    const urlMap = {};
    dataLines.forEach(line => {
      const parts = line.split(',');
      // Only include successful migrations
      if (parts.length >= 4 && parts[3] === 'SUCCESS') {
        const cloudinaryUrl = parts[1];
        const twicPicsUrl = parts[2];
        if (cloudinaryUrl && twicPicsUrl) {
          urlMap[cloudinaryUrl] = twicPicsUrl;
        }
      }
    });
    
    resolve(urlMap);
  });
}

// Function to update URLs in a file
function updateFile(filePath, urlMap) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    Object.entries(urlMap).forEach(([oldUrl, newUrl]) => {
      // Escape special characters in URL for regex
      const escapedOldUrl = oldUrl.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      if (content.includes(oldUrl)) {
        content = content.replace(new RegExp(escapedOldUrl, 'g'), newUrl);
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error updating file ${filePath}:`, error);
    return false;
  }
}

// Find all JS, JSX, TS, TSX files
async function findAllSourceFiles() {
  return new Promise((resolve, reject) => {
    const extensions = ['js', 'jsx', 'ts', 'tsx', 'json'];
    const findCommand = `find ./src -type f \\( ${extensions.map(ext => `-name "*.${ext}"`).join(' -o ')} \\)`;
    
    exec(findCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('Error finding files:', stderr);
        reject(error);
        return;
      }
      resolve(stdout.trim().split('\n').filter(f => f.trim()));
    });
  });
}

// Main function
async function updateUrls() {
  try {
    console.log('Starting to update Cloudinary URLs to TwicPics URLs...');
    
    // Get the URL mapping from migration
    const urlMap = await readMigrationData();
    console.log(`Loaded ${Object.keys(urlMap).length} URL mappings from migration data`);
    
    if (Object.keys(urlMap).length === 0) {
      console.error('No successful migrations found in the CSV file');
      return;
    }
    
    // Find all source files
    const files = await findAllSourceFiles();
    console.log(`Found ${files.length} source files to check`);
    
    // Update each file
    let updatedFiles = 0;
    let updatedUrls = 0;
    
    for (const file of files) {
      try {
        const fileContent = fs.readFileSync(file, 'utf8');
        let urlsFound = 0;
        
        // Check if any of the Cloudinary URLs are in this file
        Object.keys(urlMap).forEach(url => {
          if (fileContent.includes(url)) {
            urlsFound++;
          }
        });
        
        if (urlsFound > 0) {
          const updated = updateFile(file, urlMap);
          if (updated) {
            console.log(`Updated ${urlsFound} URLs in ${file}`);
            updatedFiles++;
            updatedUrls += urlsFound;
          }
        }
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
      }
    }
    
    console.log(`
URL Update Summary:
------------------
Total files checked: ${files.length}
Files updated: ${updatedFiles}
URLs replaced: ${updatedUrls}
    `);
    
  } catch (error) {
    console.error('Error updating URLs:', error);
  }
}

// Run the update
updateUrls(); 