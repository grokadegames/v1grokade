# GitHub Actions for Netlify Continuous Deployment

This repository is configured to automatically deploy to Netlify whenever changes are pushed to the main branch.

## Setting Up GitHub Secrets

For the GitHub Actions workflow to work properly, you need to set up the following secrets in your GitHub repository:

1. Go to your GitHub repository at https://github.com/grokadegames/v1grokade
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Add the following secrets:

### Required Secrets

1. **NETLIFY_AUTH_TOKEN**
   - To get this token:
     - Log in to your Netlify account
     - Go to User Settings (https://app.netlify.com/user/applications)
     - Scroll down to "Personal access tokens"
     - Generate a new token with a descriptive name
     - Copy the token value

2. **NETLIFY_SITE_ID**
   - Your Netlify site ID is: `09fb6134-3d04-4428-9539-d32422a1707d`

3. **DATABASE_URL**
   - Add your Railway PostgreSQL connection string here
   - Format: `postgresql://username:password@host:port/database`

4. **JWT_SECRET**
   - Add your JWT secret string here
   - This should be the same secret used for token generation

## How It Works

- When you push changes to the main branch, GitHub Actions will:
  1. Check out your repository
  2. Set up Node.js
  3. Install dependencies
  4. Build your Next.js application
  5. Deploy the built site to Netlify

This approach gives you the following benefits:
- Automated deployments without manual steps
- Build logs in GitHub Actions
- Deployment previews on pull requests
- Environment variable management through GitHub Secrets 