# Sponsor Logo Resources

This document provides direct links to official logo resources for each sponsor. You can download these logos and upload them to Cloudinary for use in the application.

## Official Logo Sources

### Laravel
- SVG: https://laravel.com/img/logomark.min.svg
- PNG: https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Laravel.svg/1200px-Laravel.svg.png

### React
- SVG: https://reactjs.org/logo-og.png
- PNG: https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png

### Node.js
- SVG: https://nodejs.org/static/images/logo.svg
- PNG: https://nodejs.org/static/images/logo-hexagon-card.png

### AWS
- SVG: https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg
- PNG: https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1280px-Amazon_Web_Services_Logo.svg.png

### DigitalOcean
- SVG: https://www.digitalocean.com/static/brand/logo-svg/digitalocean-logo.svg
- PNG: https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/DigitalOcean_logo.svg/1200px-DigitalOcean_logo.svg.png

### MongoDB
- SVG: https://www.mongodb.com/assets/images/global/leaf.svg
- PNG: https://www.mongodb.com/assets/images/global/MongoDB_Logo_FullColorBlack_RGB-4td3yuxzjs.png

### Stripe
- SVG: https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg
- PNG: https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png

### Google Cloud
- SVG: https://www.gstatic.com/devrel-devsite/prod/v2210deb8920cd4a55bd580441aa58e7853afc04b39a9d9ac4198e1cd7fbe04ef/cloud/images/cloud-logo.svg
- PNG: https://www.gstatic.com/devrel-devsite/prod/v2210deb8920cd4a55bd580441aa58e7853afc04b39a9d9ac4198e1cd7fbe04ef/cloud/images/favicons/onecloud/apple-icon.png

### GitHub
- SVG: https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.svg
- PNG: https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png

### Docker
- SVG: https://www.docker.com/wp-content/uploads/2022/03/vertical-logo-monochromatic.svg
- PNG: https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png

### Apple
- SVG: https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg
- PNG: https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png

### NPM
- SVG: https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg
- PNG: https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/1200px-Npm-logo.svg.png

### Python
- SVG: https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg
- PNG: https://www.python.org/static/community_logos/python-logo-generic.png

### Ubuntu
- SVG: https://assets.ubuntu.com/v1/8114528b-ubuntu-logo.svg
- PNG: https://assets.ubuntu.com/v1/29985a98-ubuntu-logo32.png

## Preparing Logos for Cloudinary

1. Download all the logos you need (preferably SVG for better quality).
2. Create a ZIP file containing all the logos.
3. Upload this ZIP to Cloudinary:
   - Log in to your Cloudinary account
   - Navigate to Media Library
   - Click the "Upload" button
   - Select your ZIP file
   - Choose to extract the ZIP file during upload

4. After uploading, you'll have a folder structure with all your logo images.
5. The URLs will be in the format: `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/sponsors/logo-name.svg`

## Updating the Database

After uploading the logos to Cloudinary, update the seed script in `sponsor-icons/seed.js` with the correct URLs for each logo, then run:

```bash
npx prisma db seed
```

This will populate your database with the sponsor information, including the correct Cloudinary URLs. 