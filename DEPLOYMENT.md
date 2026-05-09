# Frontend Deployment Guide

The frontend is ready to be deployed to **Vercel**, **Netlify**, or **GitHub Pages**.

## Prerequisites

1. **GitHub Repository**: Frontend code is pushed to `https://github.com/vishxesh10/medtech-AI-frontend`
2. **Vercel/Netlify Account**: For hosting
3. **Backend API URL**: Your deployed backend URL (e.g., `https://api.yourdomain.com`)

## Environment Variables

Create a `.env.production` file or set in deployment platform:

```
VITE_API_BASE_URL=https://your-backend-api.com
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New** → **Project**
3. Select `medtech-AI-frontend` repository
4. Configure project:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   - `VITE_API_BASE_URL`: Your backend API URL
6. Click **Deploy**

Vercel auto-deploys on every push to `main`.

### Option 2: Netlify

1. Go to [Netlify.com](https://netlify.com) and sign in with GitHub
2. Click **Add new site** → **Import an existing project**
3. Select `medtech-AI-frontend` repository
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add environment variable:
   - `VITE_API_BASE_URL`: Your backend API URL
6. Click **Save & Deploy**

### Option 3: GitHub Pages

1. Update `vite.config.js` to set the correct `base`:
   ```js
   export default {
     base: '/medtech-AI-frontend/',
     plugins: [react()],
   }
   ```

2. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 18
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

## GitHub Actions Setup (for CI/CD)

### Vercel Deployment Secret

1. Generate a Vercel token: https://vercel.com/account/tokens
2. Go to frontend repo → **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:
   - `VERCEL_TOKEN`: Your Vercel token
   - `VERCEL_ORG_ID`: Your Vercel org ID (found in account settings)
   - `VERCEL_PROJECT_ID`: Your project ID (found in project settings)

The workflow in `.github/workflows/frontend.yml` will auto-deploy to Vercel.

## Local Development

```bash
cd frontend
npm install
npm run dev
```

The app opens at `http://localhost:5173` by default.

## Build & Preview

```bash
npm run build
npm run preview
```

## API Configuration

The frontend connects to the backend using:

- Development: `http://127.0.0.1:8001` (default)
- Production: Set `VITE_API_BASE_URL` env var

Users can also override the API URL in the Settings panel of the app.

## Troubleshooting

- **CORS errors**: Ensure backend `CORS_ALLOW_ORIGINS` includes your frontend domain
- **Build fails**: Check `npm run lint` for errors
- **API 404**: Verify `VITE_API_BASE_URL` is set correctly

## Support

For issues or questions, check the main README or open an issue on GitHub.
