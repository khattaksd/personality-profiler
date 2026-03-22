# GitHub Pages Deployment - Manual Configuration Required

## Current Situation

This repository has **two GitHub Actions workflows** for GitHub Pages:

1. ✅ **Your manual workflow** (`.github/workflows/deploy.yml`)
   - Trigger: Manual button click (workflow_dispatch)
   - Action: Builds, tests, then deploys to GitHub Pages
   - Controlled and intentional

2. ⚠️ **GitHub's automatic workflow** ("pages-build-deployment")
   - Trigger: Automatic (when artifact detected)
   - Action: Takes uploaded dist/ and deploys
   - Redundant with your manual workflow

**Result**: Two deployments run sequentially, wasting GitHub Actions minutes.

---

## Solution: Disable Automatic GitHub Pages Deployment

Follow these steps to keep only your manual workflow:

### Step 1: Access Repository Settings

1. Go to your GitHub repository
2. Click **Settings** (top navigation)
3. Click **Pages** (left sidebar, under "Code and automation")

### Step 2: Disable Automatic Deployment

Under "Build and deployment" section:

**Current setting** (causing dual workflows):
```
Source: GitHub Actions
```

**Change to:**
```
Source: Deploy from a branch
```

Then select:
```
Branch: None (or leave empty)
```

This tells GitHub: "Don't automatically deploy when artifacts are uploaded. I'll handle deployment manually."

### Step 3: Verify the Change

After saving:
- The automatic "pages-build-deployment" workflow will stop
- Your manual "Deploy to GitHub Pages" workflow will continue working
- Deployments only happen when you click the workflow button

---

## How to Deploy (After Change)

1. Go to your repository
2. Click **Actions** (top navigation)
3. Click **Deploy to GitHub Pages** (left sidebar)
4. Click **Run workflow**
5. Select "production" from dropdown
6. Click **Run workflow** button

Wait for the workflow to complete. Your site will deploy automatically.

---

## Verification

After disabling automatic deployment, check that:

✅ Only ONE workflow runs per deployment (not two)
✅ Workflow name: "Deploy to GitHub Pages" (manual)
✅ No "pages-build-deployment" workflow appears
✅ Deployment completes successfully
✅ Site updates at https://essence.khattak.cc

---

## Why This Setup?

### Benefits of Manual-Only Deployment

- **Explicit Control**: You decide when to deploy
- **Prevents Accidents**: No unexpected deployments
- **Saves Minutes**: GitHub Actions minutes only used when you deploy
- **Cleaner History**: Workflow runs show only intentional deployments
- **Better for Testing**: Build/test locally before committing to deploy

### Alternative Approaches

If you wanted automatic deployment on every push to main:
- Delete `.github/workflows/deploy.yml`
- Leave GitHub Pages set to "GitHub Actions"
- GitHub will auto-deploy on push

But manual deployment (current) is recommended for more control.

---

## Troubleshooting

**Q: I disabled automatic deployment but my workflow still doesn't work?**
- A: Ensure `.github/workflows/deploy.yml` still exists in the repo
- Verify deploy.yml has correct permissions and steps

**Q: Can I re-enable automatic deployment?**
- A: Yes! Go back to Settings → Pages → "Source: GitHub Actions"
- Note: This will trigger the dual-workflow issue again

**Q: How do I know it worked?**
- A: Trigger a manual deployment and check Actions tab
- Should see only one "Deploy to GitHub Pages" workflow
- Should NOT see "pages-build-deployment" workflow

---

## References

- GitHub Pages docs: https://docs.github.com/en/pages
- Manual deployment workflow: `.github/workflows/deploy.yml`
- Deployment history: Settings → Pages → "Visit site" link

