# Vercel Deployment Guide

This guide explains how to deploy the SBIE CRM application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Git repository with your code

## Deployment Steps

### Recommended: Deploy via Vercel Dashboard

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket)

2. **Go to [vercel.com](https://vercel.com)** and sign in

3. **Click "New Project"**

4. **Import your Git repository**

5. **Vercel will automatically detect the configuration from `vercel.json`**

6. **Important: Use these build settings:**
   - Build Command: `npm run build:client`
   - Output Directory: `dist/spa`
   - Install Command: `npm install` (not pnpm)

7. **Click "Deploy"**

### Alternative: Deploy via CLI

1. Install Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:

   ```bash
   vercel login
   ```

3. From the project root, run:
   ```bash
   vercel --build-env NPM_RC=""
   ```

## Important Notes

- **Package Manager**: Vercel works better with `npm` than `pnpm` for this configuration
- **Build Process**: Only the client app is built and deployed as a static site
- **API Routes**: Simple serverless functions are configured in `/api/`

## Configuration

The project is already configured for Vercel deployment with:

- **vercel.json**: Main configuration file
- **api/**: Serverless functions for backend API
- **Build command**: `npm run build:client`
- **Output directory**: `dist/spa`

## Environment Variables

If you need to set environment variables:

1. In Vercel Dashboard: Go to Project Settings → Environment Variables
2. Via CLI: Use `vercel env add [name]`

Common environment variables:

- `NODE_ENV=production` (automatically set by Vercel)
- `PING_MESSAGE` (for API testing)

## File Structure for Vercel

```
├── api/                 # Vercel serverless functions
│   ├── index.ts        # Main API handler
│   ├── ping.ts         # Ping endpoint
│   └── demo.ts         # Demo endpoint
├── vercel.json         # Vercel configuration
├── dist/spa/           # Built client files (auto-generated)
└── ...
```

## API Routes

After deployment, your API will be available at:

- `https://your-app.vercel.app/api/ping`
- `https://your-app.vercel.app/api/demo`

## Troubleshooting

### Build Issues

- Ensure all dependencies are in `package.json`
- Check that `npm run build:client` works locally

### API Issues

- Check function logs in Vercel Dashboard
- Verify environment variables are set correctly
- Ensure API routes match the expected structure

## Local Testing

To test the Vercel build locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Build the project
npm run build:client

# Test locally with Vercel dev server
vercel dev
```

## Production URL

After deployment, your application will be available at:
`https://your-project-name.vercel.app`

## Custom Domain

To add a custom domain:

1. Go to Project Settings → Domains in Vercel Dashboard
2. Add your domain and follow DNS configuration instructions
