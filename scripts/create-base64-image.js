const fs = require('fs');
const path = require('path');
const https = require('https');

// URL of a similar Mars landing image
const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg';
const outputPath = path.join(__dirname, '../temp-upload/mars-landing.jpg');

// Download the image
const downloadImage = (url, outputPath) => {
  return new Promise((resolve, reject) => {
    console.log(`Downloading image from ${url} to ${outputPath}...`);
    
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log('Image downloaded successfully!');
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete the file on error
      console.error('Error downloading image:', err.message);
      reject(err);
    });
  });
};

// Execute the download
downloadImage(imageUrl, outputPath)
  .then(() => {
    console.log('Ready to run the upload script.');
  })
  .catch((error) => {
    console.error('Failed to download image:', error);
  }); 