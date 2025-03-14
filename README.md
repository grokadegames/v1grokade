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

### Netlify Deployment

To deploy to Netlify, you can use the provided script:

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

## Technologies Used

- Next.js 15
- React 19
- Tailwind CSS
- Node.js

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
