const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;
const FormData = require('form-data');
require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dxow1rafl',
  api_key: process.env.CLOUDINARY_API_KEY || '189369456186199',
  api_secret: process.env.CLOUDINARY_API_SECRET || '31EANFqVf28WcdN3p7IE2_q-wtw'
});

// TwicPics configuration - add to your .env file
const TWICPICS_TOKEN = process.env.TWICPICS_TOKEN || 'cb2d5e10-e115-41a0-90a5-638174c87335';
const TWICPICS_DOMAIN = process.env.TWICPICS_DOMAIN;
const TWICPICS_PATH_PREFIX = process.env.TWICPICS_PATH_PREFIX || 'grokade/';

// Function to fetch assets from Cloudinary from the specified folders
async function getCloudinaryAssets(folders) {
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

// Download asset from Cloudinary
async function downloadAsset(asset) {
  const url = asset.secure_url;
  const downloadDir = path.join(__dirname, '../temp-downloads');
  const downloadPath = path.join(downloadDir, path.basename(url));
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }
  
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });
    
    const writer = fs.createWriteStream(downloadPath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(downloadPath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading asset ${asset.public_id}:`, error);
    throw error;
  }
}

// Upload asset to TwicPics
async function uploadToTwicPics(filePath, assetId) {
  try {
    // Read the file
    const fileData = fs.readFileSync(filePath);
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    
    // Construct the TwicPics upload URL
    const twicPicsPath = `${TWICPICS_PATH_PREFIX}${assetId}`;
    
    // New approach: using the direct domain with an Auth header
    const response = await axios.post(
      `https://${TWICPICS_DOMAIN}/upload`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${TWICPICS_TOKEN}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    // Return success info
    return {
      success: true,
      twicPicsUrl: `https://${TWICPICS_DOMAIN}/${twicPicsPath}`,
      response: response.data
    };
  } catch (error) {
    console.error(`Error uploading to TwicPics:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to write results to CSV
function writeToCSV(migrationResults) {
  const csvPath = path.join(__dirname, '../cloudinary-to-twicpics-migration.csv');
  
  // Create CSV header if file doesn't exist
  if (!fs.existsSync(csvPath)) {
    const header = 'Asset ID,Cloudinary URL,TwicPics URL,Migration Status,Timestamp,Notes\n';
    fs.writeFileSync(csvPath, header);
  }
  
  // Convert results to CSV rows and append
  const rows = migrationResults.map(result => {
    return [
      result.assetId,
      result.cloudinaryUrl,
      result.twicPicsUrl,
      result.status,
      result.timestamp,
      `"${result.notes.replace(/"/g, '""')}"`
    ].join(',');
  });
  
  fs.appendFileSync(csvPath, rows.join('\n') + '\n');
}

// Main migration function
async function migrateAssets() {
  try {
    // Check for TwicPics credentials
    if (!TWICPICS_TOKEN || !TWICPICS_DOMAIN) {
      console.error('Missing TwicPics credentials. Please set TWICPICS_TOKEN and TWICPICS_DOMAIN in your .env file');
      return;
    }
    
    // Create temp download directory
    const tempDir = path.join(__dirname, '../temp-downloads');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Define folders to migrate
    const folders = ['sponsors', 'games', 'profiles', 'gallery', 'grokade-screenshots'];
    
    // Get assets from Cloudinary
    console.log('Fetching assets from Cloudinary...');
    const assets = await getCloudinaryAssets(folders);
    console.log(`Found ${assets.length} assets to migrate`);
    
    // Process assets
    const migrationResults = [];
    
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      console.log(`Migrating asset ${i+1}/${assets.length}: ${asset.public_id}`);
      
      try {
        // Download from Cloudinary
        const downloadPath = await downloadAsset(asset);
        
        // Upload to TwicPics
        const uploadResult = await uploadToTwicPics(downloadPath, asset.public_id);
        
        // Record result
        migrationResults.push({
          assetId: asset.public_id,
          cloudinaryUrl: asset.secure_url,
          twicPicsUrl: uploadResult.success ? uploadResult.twicPicsUrl : '',
          status: uploadResult.success ? 'SUCCESS' : 'FAILED',
          timestamp: new Date().toISOString(),
          notes: uploadResult.success ? '' : uploadResult.error
        });
        
        // Clean up downloaded file
        fs.unlinkSync(downloadPath);
        
      } catch (error) {
        console.error(`Error processing asset ${asset.public_id}:`, error);
        
        migrationResults.push({
          assetId: asset.public_id,
          cloudinaryUrl: asset.secure_url,
          twicPicsUrl: '',
          status: 'FAILED',
          timestamp: new Date().toISOString(),
          notes: error.message || 'Unknown error'
        });
      }
      
      // Write results to CSV after each batch of 10 to avoid data loss on error
      if (i % 10 === 0 || i === assets.length - 1) {
        writeToCSV(migrationResults.slice(i % 10 === 0 ? 0 : -1));
        console.log(`Migration progress saved: ${i+1}/${assets.length}`);
      }
    }
    
    console.log('Migration completed!');
    console.log(`Results saved to: cloudinary-to-twicpics-migration.csv`);
    
    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateAssets(); 