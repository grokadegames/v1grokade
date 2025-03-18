#!/bin/bash

# Create directory for sponsor images if it doesn't exist
mkdir -p sponsor-images

# Laravel
curl -o sponsor-images/laravel-logo.svg https://laravel.com/img/logomark.min.svg

# React 
curl -o sponsor-images/react-logo.svg https://raw.githubusercontent.com/reactjs/reactjs.org/main/src/icons/logo.svg

# Node.js
curl -o sponsor-images/nodejs-logo.svg https://nodejs.org/static/images/logo.svg

# AWS
curl -o sponsor-images/aws-logo.svg https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg

# DigitalOcean
curl -o sponsor-images/digitalocean-logo.svg https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_vertical_blue.svg

# MongoDB (Leaf logo)
curl -o sponsor-images/mongodb-logo.svg https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg

# Stripe
curl -o sponsor-images/stripe-logo.svg https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg

# Google Cloud
curl -o sponsor-images/google-logo.svg https://upload.wikimedia.org/wikipedia/commons/6/61/Google_Cloud_Logo.svg

# GitHub
curl -o sponsor-images/github-logo.svg https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.svg

# Docker
curl -o sponsor-images/docker-logo.svg https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png

# Apple
curl -o sponsor-images/apple-logo.svg https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg

# NPM
curl -o sponsor-images/npm-logo.svg https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg

# Python
curl -o sponsor-images/python-logo.svg https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg

# Ubuntu
curl -o sponsor-images/ubuntu-logo.svg https://assets.ubuntu.com/v1/8114528b-ubuntu-logo.svg

echo "All logos downloaded to sponsor-images directory"
echo "Creating zip file of all logos..."

# Create zip file of all logos
zip -r sponsor-logos.zip sponsor-images

echo "Done! Upload sponsor-logos.zip to Cloudinary" 