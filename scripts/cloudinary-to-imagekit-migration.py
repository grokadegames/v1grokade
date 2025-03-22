#!/usr/bin/env python3
import os
import csv
import json
import requests
import cloudinary
import cloudinary.api
import shutil
import tempfile
from urllib.parse import urlparse
from imagekitio import ImageKit
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions

# Configuration
# Cloudinary credentials - update these with your values
cloudinary.config(
    cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME', 'dxow1rafl'),
    api_key = os.environ.get('CLOUDINARY_API_KEY', '189369456186199'),
    api_secret = os.environ.get('CLOUDINARY_API_SECRET', '31EANFqVf28WcdN3p7IE2_q-wtw')
)

# ImageKit credentials
IMAGEKIT_PRIVATE_KEY = os.environ.get('IMAGEKIT_PRIVATE_KEY', 'private_bCEM9K7BDaU6Aes7yp0Xj0uMTqw=')
IMAGEKIT_PUBLIC_KEY = os.environ.get('IMAGEKIT_PUBLIC_KEY', 'public_yf4/s4sqsRi/BPBW6g3HD+k5TuI=')
IMAGEKIT_URL_ENDPOINT = os.environ.get('IMAGEKIT_URL_ENDPOINT', 'https://ik.imagekit.io/cbzkrwprl').rstrip('/')

# Initialize ImageKit SDK
imagekit = ImageKit(
    private_key=IMAGEKIT_PRIVATE_KEY,
    public_key=IMAGEKIT_PUBLIC_KEY,
    url_endpoint=IMAGEKIT_URL_ENDPOINT
)

# Create temp directory for downloads
TEMP_DIR = os.path.join(tempfile.gettempdir(), "cloudinary_downloads")
os.makedirs(TEMP_DIR, exist_ok=True)

def list_cloudinary_assets(max_assets=None, resource_type="image"):
    """List all Cloudinary assets"""
    assets = []
    next_cursor = None
    
    print(f"Fetching {resource_type} assets from Cloudinary...")
    
    while True:
        params = {"max_results": 500}
        if next_cursor:
            params["next_cursor"] = next_cursor
        
        try:
            response = cloudinary.api.resources(resource_type=resource_type, **params)
            batch_assets = response.get("resources", [])
            assets.extend(batch_assets)
            
            print(f"Retrieved {len(batch_assets)} assets, total: {len(assets)}")
            
            if max_assets and len(assets) >= max_assets:
                assets = assets[:max_assets]
                break
            
            next_cursor = response.get("next_cursor")
            if not next_cursor:
                break
        except Exception as e:
            print(f"Error fetching assets: {e}")
            break
    
    return assets

def download_asset(asset, resource_type="image"):
    """Download asset from Cloudinary"""
    url = asset["secure_url"]
    public_id = asset["public_id"]
    format = asset.get("format", "")
    
    # Create file structure similar to public_id paths
    path_parts = public_id.split("/")
    if len(path_parts) > 1:
        folder_path = os.path.join(TEMP_DIR, *path_parts[:-1])
        os.makedirs(folder_path, exist_ok=True)
    
    # Set download path
    filename = f"{path_parts[-1]}.{format}" if format else path_parts[-1]
    download_path = os.path.join(TEMP_DIR, public_id)
    if format:
        download_path += f".{format}"
    
    print(f"Downloading {public_id}")
    
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(download_path, 'wb') as f:
                response.raw.decode_content = True
                shutil.copyfileobj(response.raw, f)
            return download_path
        else:
            print(f"Failed to download {public_id}: HTTP {response.status_code}")
            return None
    except Exception as e:
        print(f"Error downloading {public_id}: {e}")
        return None

def upload_to_imagekit(file_path, folder_path):
    """Upload file to ImageKit using the official SDK"""
    try:
        # Get file name
        file_name = os.path.basename(file_path)
        
        # Preserve folder structure
        upload_path = file_name
        if folder_path:
            upload_path = f"{folder_path}/{file_name}"
        
        print(f"Uploading {upload_path} to ImageKit")
        
        # Create options object
        options = UploadFileRequestOptions(
            use_unique_file_name=False,
            folder=folder_path if folder_path else None
        )
        
        # Upload file using ImageKit SDK
        with open(file_path, 'rb') as f:
            upload_result = imagekit.upload_file(
                file=f,
                file_name=os.path.basename(file_path),
                options=options
            )
            
            if hasattr(upload_result, 'response_metadata') and upload_result.response_metadata.http_status_code == 200:
                return upload_result.url
            else:
                print(f"Failed to upload to ImageKit: {upload_result}")
                return None
    except Exception as e:
        print(f"Error uploading to ImageKit: {str(e)}")
        return None

def create_url_mapping(cloudinary_url, imagekit_url):
    """Create a mapping between Cloudinary and ImageKit URLs"""
    return {
        "cloudinary_url": cloudinary_url,
        "imagekit_url": imagekit_url
    }

def save_url_mapping(url_mappings):
    """Save URL mappings to CSV file"""
    with open("cloudinary_to_imagekit_mapping.csv", "w", newline="") as csvfile:
        fieldnames = ["cloudinary_url", "imagekit_url"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for mapping in url_mappings:
            writer.writerow(mapping)
    
    print(f"URL mapping saved to cloudinary_to_imagekit_mapping.csv")

def main():
    """Main migration function"""
    print("Starting Cloudinary to ImageKit migration")
    
    # Check ImageKit credentials
    if not all([IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL_ENDPOINT]):
        print("Error: ImageKit credentials not set correctly.")
        return
    
    # Optional: limit number of assets to migrate (remove or set to None for all assets)
    max_assets = int(os.environ.get('MAX_ASSETS', '0')) or None
    if max_assets:
        print(f"Limiting migration to {max_assets} assets")
    
    # List assets
    assets = list_cloudinary_assets(max_assets=max_assets)
    print(f"Found {len(assets)} assets to migrate")
    
    # Store URL mappings
    url_mappings = []
    
    # Process assets
    for i, asset in enumerate(assets):
        print(f"Processing asset {i+1}/{len(assets)}: {asset['public_id']}")
        
        # Download asset
        download_path = download_asset(asset)
        if not download_path:
            continue
        
        # Upload to ImageKit
        upload_result = upload_to_imagekit(download_path, os.path.dirname(asset["public_id"]))
        if not upload_result:
            continue
        
        # Create URL mapping
        mapping = create_url_mapping(asset["secure_url"], upload_result)
        url_mappings.append(mapping)
        
        # Optional: Clean up downloaded file
        os.remove(download_path)
        
        print(f"Successfully migrated {asset['public_id']}")
    
    # Save URL mappings
    save_url_mapping(url_mappings)
    
    # Clean up temp directory
    shutil.rmtree(TEMP_DIR)
    
    print("Migration completed!")

if __name__ == "__main__":
    main() 