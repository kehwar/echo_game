---
name: GitHub Pages Setup
about: Instructions for enabling GitHub Pages deployment
title: 'Enable GitHub Pages for automatic deployment'
labels: documentation, deployment
assignees: ''
---

## GitHub Pages Setup Required

The GitHub Pages deployment workflow is configured and ready, but **GitHub Pages must be enabled manually** in the repository settings before deployment can succeed.

### ✅ Steps to Enable GitHub Pages

1. **Navigate to Pages Settings:**
   - Go to: https://github.com/kehwar/echo_game/settings/pages

2. **Configure the Source:**
   - Under "Build and deployment"
   - In the "Source" dropdown, select **"GitHub Actions"**
   - Click **Save**

3. **Re-run the Failed Deployment:**
   - Go to: https://github.com/kehwar/echo_game/actions
   - Find the "Deploy to GitHub Pages" workflow (the one that failed)
   - Click "Re-run all jobs"

4. **Verify Deployment:**
   - Wait for the workflow to complete successfully
   - Your site will be available at: **https://kehwar.github.io/echo_game/**

### 📚 Additional Resources

- Detailed deployment documentation: [DEPLOYMENT.md](../../DEPLOYMENT.md)
- Workflow configuration: [.github/workflows/deploy.yml](../workflows/deploy.yml)

### 🔍 Current Status

- ✅ Workflow file configured correctly
- ✅ Nuxt build configuration set for GitHub Pages
- ✅ `.nojekyll` file present to prevent Jekyll processing
- ⏳ **Waiting:** GitHub Pages needs to be enabled in repository settings

### ❓ Need Help?

See the [DEPLOYMENT.md](../../DEPLOYMENT.md) file for troubleshooting and additional information.
