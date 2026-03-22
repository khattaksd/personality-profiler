# Deployment Guide: essence.khattak.cc

## Quick Deploy

To deploy to GitHub Pages:

```bash
npm run deploy
```

This command:
1. Builds the production bundle (`npm run build`)
2. Deploys to the `gh-pages` branch
3. GitHub Pages automatically deploys to essence.khattak.cc

## Setup (One-time)

### Prerequisites
- Repository must be public
- Domain must be verified in GitHub

### Steps

1. **GitHub Pages Settings** (in repository settings)
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)
   - Save

2. **Configure Custom Domain** (in repository settings)
   - Go to Settings → Pages
   - Custom domain: essence.khattak.cc
   - Save (GitHub will create CNAME file check)

3. **DNS Configuration** (at your DNS provider)
   - Add CNAME record:
     - Subdomain: essence
     - Target: khattak.github.io
     - TTL: 3600
   - Wait for DNS propagation (5-30 minutes)

4. **Enable HTTPS** (automatic)
   - GitHub Pages provides free HTTPS via Let's Encrypt
   - Wait a few minutes after DNS is configured
   - Visit https://essence.khattak.cc

## Deployment Process

### Before Deploying
- Ensure all tests pass: `npm run test:unit -- --run`
- Ensure linting passes: `npm run lint`
- Ensure build succeeds: `npm run build`

### Deploy
```bash
npm run deploy
```

### After Deploying
- Wait 1-2 minutes for GitHub Pages to rebuild
- Visit https://essence.khattak.cc
- Verify all pages load
- Check mobile responsiveness
- Check console for errors

## What Gets Deployed

The `npm run deploy` command:
- Builds the project to `dist/`
- Includes CNAME file (essence.khattak.cc)
- Includes index.html for Vue Router fallback
- Includes all assets (CSS, JS, images)
- Pushes to `gh-pages` branch

## Troubleshooting

### Site not live yet
- Check GitHub Pages settings
- Wait for DNS propagation (5-30 minutes)
- Verify CNAME record at DNS provider

### 404 on refresh
- Vue Router should fallback to index.html automatically
- If not, check GitHub Pages settings

### HTTPS not working
- Wait a few minutes after DNS is configured
- Check browser console for mixed content warnings

### Old content showing
- Clear browser cache (Ctrl+Shift+Delete)
- Check dist/ folder has latest build
- Verify gh-pages branch was updated

## Rollback

If something goes wrong, you can rollback to previous version:

```bash
# Check available versions in gh-pages history
git log --all --graph --oneline | head -20

# Deploy specific commit
git reset --hard <commit-hash>
npm run deploy
```

## Build Output

```
dist/
├── index.html          (Vue app entry point)
├── CNAME              (essence.khattak.cc)
├── favicon.ico
└── assets/
    ├── index-*.css    (Tailwind + app styles)
    └── index-*.js     (Vue bundle)
```

Size: ~157 kB (57 kB gzip)
Update time: ~11 seconds

## Deployment History

Track deployments:
- GitHub Pages: Settings → Pages → View Deployments
- Repository: View gh-pages branch commits
- Status: https://www.githubstatus.com

## Notes

- Production build excludes development tools
- MCP server (vite-plugin-vue-mcp) is dev-only
- All assets are minified and optimized
- Browser caching is automatic via GitHub Pages
