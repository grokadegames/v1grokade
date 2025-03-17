#!/bin/bash

# Cloudinary credentials
CLOUD_NAME="dxow1rafl"
API_KEY="189369456186199"
API_SECRET="31EANFqVf28WcdN3p7IE2_q-wtw"

# Image options
PUBLIC_ID="land-booster-mars"
FOLDER="games"
IMAGE_PATH="../temp-upload/land-booster-mars.jpg"

# Upload the image to Cloudinary
echo "Uploading image to Cloudinary..."
RESPONSE=$(curl -X POST -F "file=@$IMAGE_PATH" \
  -F "public_id=$PUBLIC_ID" \
  -F "folder=$FOLDER" \
  -F "upload_preset=ml_default" \
  "https://api.cloudinary.com/v1_1/$CLOUD_NAME/image/upload" | cat)

echo "Response: $RESPONSE"

# Extract the secure URL from the response
SECURE_URL=$(echo $RESPONSE | grep -o '"secure_url":"[^"]*"' | sed 's/"secure_url":"//;s/"//')

echo "Secure URL: $SECURE_URL"

# Output the URL for use in updating the database
echo "Use this URL to update the game record: $SECURE_URL" 