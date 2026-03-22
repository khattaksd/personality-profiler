# GitHub Actions Deployment

## Deploy Workflow

**File:** `deploy.yml`

### What It Does

Manually triggered workflow that:
1. Checks out your code
2. Runs all tests (4/4 must pass)
3. Runs linter (0 errors)
4. Builds production bundle
5. Deploys to GitHub Pages
6. Sets environment as `github-pages`

### How to Use

1. **Push the workflow file** to your repository (already done)
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "ci: Add GitHub Actions deployment workflow"
   git push
   ```

2. **Go to GitHub web UI**
   - Your repo → Actions tab
   - You should see "Deploy to GitHub Pages" workflow

3. **Trigger deployment**
   - Click "Deploy to GitHub Pages"
   - Click "Run workflow" button
   - Wait for it to complete (2-3 minutes)

4. **Monitor progress**
   - Watch the logs in real-time
   - See each step (checkout, install, lint, test, build, deploy)

5. **Verify deployment**
   - After success, visit https://essence.khattak.cc
   - Check GitHub Pages settings (should auto-configure)

### Manual Trigger Steps

1. GitHub repo → **Actions** tab
2. Left sidebar → **Deploy to GitHub Pages** workflow
3. Blue button: **Run workflow**
4. Click **Run workflow** again (confirms)
5. Watch the workflow run in real-time
6. Wait for ✅ completion
7. Visit https://essence.khattak.cc

### What to Look For

**Success indicators:**
```
✅ Checkout
✅ Setup Node
✅ Install dependencies  
✅ Run linter - All checks passing
✅ Run tests - 4 passed
✅ Build - Built in X seconds
✅ Upload artifact - dist/ uploaded
✅ Deploy to GitHub Pages - Deployed
```

**URL should appear like:**
```
https://essence.khattak.cc
```

### If Something Fails

Click on the failed step to see the error.

Common issues:
- **Tests fail:** Something broke in code
- **Linter fails:** Code style issue
- **Build fails:** TypeScript or Vite error
- **Deploy fails:** GitHub Pages configuration issue

### Advantages Over npm run deploy

1. ✅ **No credentials needed locally** - Uses GitHub's built-in token
2. ✅ **Visible in UI** - See all workflows in Actions tab
3. ✅ **History** - All deployments logged
4. ✅ **Manual control** - Trigger when you want
5. ✅ **Safety checks** - Tests & linting before deploy
6. ✅ **No gh-pages package** - Built-in GitHub feature
7. ✅ **Better error messages** - Detailed logs in UI

### GitHub Pages Configuration

The workflow automatically:
- Creates the gh-pages branch (GitHub manages it)
- Publishes to essence.khattak.cc
- Handles SSL certificates
- Manages environment settings

You just need to make sure:
1. **Settings → Pages → Source** is set to "Deploy from a branch" (NOT "GitHub Actions")
2. **Custom domain** is set to essence.khattak.cc

**⚠️ Important:** If "Source" is set to "GitHub Actions", GitHub will trigger a redundant automatic deployment workflow in addition to your manual one. To avoid this, change to "Deploy from a branch" and set the branch to "None". See `PAGES_SETUP.md` for detailed setup instructions.

### Future Deployments

Every time you want to deploy:

1. Go to: Repo → Actions
2. Select: "Deploy to GitHub Pages"
3. Click: "Run workflow"
4. Wait: 2-3 minutes
5. Visit: https://essence.khattak.cc

That's it! No npm commands needed locally.

### Workflow File Location

```
your-repo/
├── .github/
│   └── workflows/
│       └── deploy.yml     ← This file
├── src/
├── dist/
└── ...
```

### Need to Update?

Edit `.github/workflows/deploy.yml` and:
1. Make changes
2. Commit
3. Push
4. New version is immediately available

### Permissions

The workflow uses:
- `contents: read` - Read code
- `pages: write` - Deploy to Pages
- `id-token: write` - Authenticate with GitHub

All standard and secure.
