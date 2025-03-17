# V1 Grokade

AI Gaming Vibe Hub - A platform to discover and play AI-powered games.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment

### Continuous Deployment with GitHub

This repository is configured for continuous deployment to Netlify. Whenever changes are pushed to the main branch, the site will automatically be built and deployed.

To set up continuous deployment, see [GITHUB_SETUP.md](./GITHUB_SETUP.md) for instructions on configuring GitHub Secrets.

### Manual Netlify Deployment

For manual deployments to Netlify, you can use the provided script:

```bash
./deploy-netlify.sh
```

Alternatively, you can:

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy to Netlify:
   ```bash
   netlify deploy --prod
   ```

### Railway Deployment

To deploy to Railway, you can use the provided script:

```bash
./deploy-railway.sh
```

Alternatively, you can:

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Build and deploy:
   ```bash
   npm run build
   railway up
   ```

## Project Structure

- `/src/app` - Next.js app directory
- `/src/components` - React components
- `/public` - Static files like images and fonts
- `/src/app/globals.css` - Global CSS styles
- `/.github/workflows` - GitHub Actions workflow for CI/CD

## Technologies Used

- Next.js 15
- React 19
- Tailwind CSS
- Node.js
- PostgreSQL (on Railway)
- Netlify for hosting
- GitHub Actions for CI/CD

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## Authentication System

V1 Grokade includes a complete authentication system:

- User registration
- Login/logout functionality
- Protected routes
- JWT-based authentication
- PostgreSQL database storage

The login and registration pages are styled to match the design of the platform.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Build trigger: [Timestamp: 2025-03-17 16:30:00]
