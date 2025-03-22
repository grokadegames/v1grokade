# Instructions for migrating your Cloudinary assets to TwicPics

## Step 1: Set up TwicPics credentials

1. Copy the TwicPics environment file template:
   ```
   cp .env.twicpics .env
   ```

2. Edit `.env` and replace the placeholder values with your actual TwicPics credentials:
   - `TWICPICS_API_KEY`: Your TwicPics API key from the dashboard
   - `TWICPICS_DOMAIN`: Your TwicPics domain (e.g., your-domain.twic.pics)
   - `TWICPICS_PATH_PREFIX`: Optional prefix for your assets (default: "grokade/")

## Step 2: Run the migration

1. Execute the migration script:
   ```
   node scripts/cloudinary-to-twicpics-migration.js
   ```

2. Monitor the progress in the console. The script will:
   - Fetch all assets from Cloudinary
   - Download each asset to a temporary folder
   - Upload it to TwicPics
   - Track results in a CSV file

3. When complete, review the CSV file `cloudinary-to-twicpics-migration.csv` for migration results

## Step 3: Update references in your codebase

1. Run the URL update script:
   ```
   node scripts/update-image-urls.js
   ```

2. This script will:
   - Read the migration CSV to get old and new URLs
   - Find all source files in your project
   - Replace Cloudinary URLs with TwicPics URLs
   - Generate a summary of changes

## Step 4: Testing

1. Test your application to ensure all images load correctly
2. Check the TwicPics dashboard to verify all assets were uploaded
3. If any images are missing, check the migration CSV for errors

## Troubleshooting

- If the migration fails, check the TwicPics credentials in your `.env` file
- If images aren't displaying, ensure the TwicPics domain is correctly configured
- For any failed migrations, you can re-run the script - it will skip already migrated files

## Optional: Clean up Cloudinary

After verifying everything works with TwicPics, you can optionally clean up your Cloudinary account to save resources:

1. Keep the migration CSV as a reference
2. Cancel your Cloudinary subscription if no longer needed 