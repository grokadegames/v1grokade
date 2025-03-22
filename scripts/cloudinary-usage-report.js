const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dxow1rafl',
  api_key: process.env.CLOUDINARY_API_KEY || '189369456186199',
  api_secret: process.env.CLOUDINARY_API_SECRET || '31EANFqVf28WcdN3p7IE2_q-wtw'
});

// Function to find all Cloudinary URLs in codebase
async function findCloudinaryUrls() {
  return new Promise((resolve, reject) => {
    // Use grep to search for Cloudinary URLs across all files in codebase
    // Matches URLs in the format res.cloudinary.com/cloud_name/ followed by any non-whitespace chars
    exec('grep -r --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" --include="*.json" "res.cloudinary.com" .', 
      { maxBuffer: 1024 * 1000 * 5 }, // 5MB buffer for large codebases
      (error, stdout, stderr) => {
        if (error && error.code !== 1) { // grep returns 1 when no matches found
          console.error('Error running grep:', stderr);
          reject(error);
          return;
        }

        // Extract Cloudinary URLs from grep output
        const lines = stdout.split('\n');
        const urlRegex = /https:\/\/res\.cloudinary\.com\/[^/]+\/[^/]+\/[^/]+\/[^\s"',)]+/g;
        
        let urls = [];
        lines.forEach(line => {
          const matches = line.match(urlRegex);
          if (matches) {
            urls = [...urls, ...matches];
          }
        });

        // Remove duplicates
        const uniqueUrls = [...new Set(urls)];
        resolve(uniqueUrls);
      }
    );
  });
}

// Function to extract asset IDs from Cloudinary URLs
function extractAssetIds(urls) {
  const assetIds = new Set();
  
  urls.forEach(url => {
    // Extract public_id from Cloudinary URL
    // Example: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/file.jpg
    // We want to extract: folder/file
    
    try {
      const match = url.match(/https:\/\/res\.cloudinary\.com\/[^/]+\/[^/]+\/[^/]+\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
      if (match && match[1]) {
        let publicId = match[1];
        // Remove any URL parameters
        publicId = publicId.split('?')[0];
        assetIds.add(publicId);
      }
    } catch (err) {
      console.error(`Could not parse URL: ${url}`);
    }
  });
  
  return Array.from(assetIds);
}

// Function to get all assets from Cloudinary
async function getAllCloudinaryAssets() {
  let allAssets = [];
  let nextCursor = null;
  
  do {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        max_results: 500,
        next_cursor: nextCursor
      });
      
      allAssets = allAssets.concat(result.resources);
      nextCursor = result.next_cursor;
      
      console.log(`Retrieved ${result.resources.length} assets, total so far: ${allAssets.length}`);
      
      // Continue until no more results
    } catch (error) {
      console.error('Error retrieving Cloudinary assets:', error);
      break;
    }
  } while (nextCursor);
  
  return allAssets;
}

// Function to check for assets in specific folders
async function getAssetsInFolders(folders) {
  let allAssets = [];
  
  for (const folder of folders) {
    let nextCursor = null;
    
    do {
      try {
        const result = await cloudinary.api.resources({
          type: 'upload',
          prefix: folder,
          max_results: 500,
          next_cursor: nextCursor
        });
        
        allAssets = allAssets.concat(result.resources);
        nextCursor = result.next_cursor;
        
        console.log(`Retrieved ${result.resources.length} assets from folder '${folder}', total in this folder: ${allAssets.length}`);
        
      } catch (error) {
        console.error(`Error retrieving Cloudinary assets from folder '${folder}':`, error);
        break;
      }
    } while (nextCursor);
  }
  
  return allAssets;
}

// Main function
async function generateReport() {
  console.log('Generating Cloudinary Usage Report...');
  
  try {
    // Step 1: Find all Cloudinary URLs in the codebase
    console.log('Searching for Cloudinary URLs in the codebase...');
    const cloudinaryUrls = await findCloudinaryUrls();
    console.log(`Found ${cloudinaryUrls.length} Cloudinary URLs`);
    
    // Step 2: Extract asset IDs from URLs
    const usedAssetIds = extractAssetIds(cloudinaryUrls);
    console.log(`Extracted ${usedAssetIds.length} unique asset IDs from URLs`);
    
    // Step 3: Get all assets from Cloudinary
    console.log('Fetching all assets from Cloudinary...');
    
    // Option 1: Get all assets
    // const allCloudinaryAssets = await getAllCloudinaryAssets();
    
    // Option 2: Get assets from specific folders (more efficient)
    // Define common folders used in your project
    const folders = ['sponsors', 'games', 'profiles', 'gallery'];
    const allCloudinaryAssets = await getAssetsInFolders(folders);
    
    console.log(`Retrieved ${allCloudinaryAssets.length} total assets from Cloudinary`);
    
    // Step 4: Compare and find unused assets
    const allAssetIds = allCloudinaryAssets.map(asset => asset.public_id);
    const unusedAssetIds = allAssetIds.filter(id => !usedAssetIds.includes(id));
    
    // Step 5: Generate report
    const report = {
      total_assets_in_cloudinary: allCloudinaryAssets.length,
      total_assets_used_in_codebase: usedAssetIds.length,
      total_unused_assets: unusedAssetIds.length,
      used_assets: usedAssetIds,
      unused_assets: unusedAssetIds,
      cloudinary_urls_found: cloudinaryUrls
    };
    
    // Write report to file
    const reportPath = path.join(__dirname, '../cloudinary-usage-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Generate human-readable summary
    const summaryPath = path.join(__dirname, '../cloudinary-usage-summary.txt');
    const summary = `
Cloudinary Usage Report
=======================
Generated on: ${new Date().toISOString()}

Summary:
- Total assets in Cloudinary: ${allCloudinaryAssets.length}
- Total assets used in codebase: ${usedAssetIds.length}
- Total unused assets: ${unusedAssetIds.length}

Used Assets:
${usedAssetIds.map(id => `- ${id}`).join('\n')}

Unused Assets:
${unusedAssetIds.map(id => `- ${id}`).join('\n')}
`;
    
    fs.writeFileSync(summaryPath, summary);
    
    console.log(`
Report generation complete!
- JSON report: ${reportPath}
- Text summary: ${summaryPath}
    `);
    
  } catch (error) {
    console.error('Error generating report:', error);
  }
}

// Run the report
generateReport(); 