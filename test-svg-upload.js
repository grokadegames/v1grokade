const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dxow1rafl',
  api_key: '189369456186199',
  api_secret: '31EANFqVf28WcdN3p7IE2_q-wtw'
});

async function uploadSvg() {
  try {
    console.log('Uploading React SVG logo to Cloudinary...');
    const result = await cloudinary.uploader.upload('./temp-test/react-logo.svg', {
      public_id: 'react-logo-test',
      folder: 'sponsors',
      overwrite: true,
      resource_type: 'image'  // Try specifying resource type
    });
    console.log('Upload successful!');
    console.log('URL:', result.secure_url);
  } catch (error) {
    console.error('Error uploading SVG:', error);
  }
}

uploadSvg(); 