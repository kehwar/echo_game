# Deployment Guide

## GitHub Pages Setup

This project is configured to deploy automatically to GitHub Pages using GitHub Actions. However, **GitHub Pages must be enabled manually in the repository settings** before the first deployment can succeed.

### Initial Setup (Required - One-time only)

1. **Enable GitHub Pages:**
   - Go to your repository settings: https://github.com/kehwar/echo_game/settings/pages
   - Under "Source", select **"GitHub Actions"**
   - Click **Save**

2. **Verify the deployment:**
   - Go to the Actions tab: https://github.com/kehwar/echo_game/actions
   - Find the failed "Deploy to GitHub Pages" workflow
   - Click "Re-run all jobs" to trigger a new deployment

3. **Access your site:**
   - After successful deployment, your site will be available at: https://kehwar.github.io/echo_game/

### How It Works

The deployment process is automated through GitHub Actions:

1. **Trigger:** On every push to the `main` branch
2. **Build:** The workflow runs `npm run generate` to create a static site
3. **Deploy:** The generated files from `.output/public` are deployed to GitHub Pages

### Configuration Files

- **`.github/workflows/deploy.yml`** - GitHub Actions workflow for deployment
- **`nuxt.config.ts`** - Nuxt configuration with GitHub Pages settings
  - `baseURL: '/echo_game/'` - Configured for GitHub Pages subdirectory
  - `ssr: false` - Static site generation mode
  - `nitro.preset: 'static'` - Static generation preset

### Local Testing

To test the production build locally:

```bash
# Generate the static site
npm run generate

# Preview the generated site
npm run preview
```

The generated site will be in `.output/public/`.

### Troubleshooting

**Error: "Failed to create deployment (status: 404)"**
- This means GitHub Pages is not enabled in the repository settings
- Follow the "Initial Setup" steps above

**Site shows 404 errors for assets**
- Ensure `baseURL` in `nuxt.config.ts` matches your repository name
- The `.nojekyll` file in `public/` ensures GitHub Pages serves all files correctly

**Deployment succeeds but site doesn't update**
- GitHub Pages can take a few minutes to update
- Check the Pages settings to see the deployment status
- Clear your browser cache

### Manual Deployment

If you need to deploy manually:

```bash
# Build the static site
npm run generate

# The files in .output/public can be deployed to any static hosting service
```
