# GitHub Pages Deployment - Final Setup

## Architecture

This project uses a **dedicated deployment branch** (`pages-deploy`) for GitHub Pages hosting. This approach follows GitHub best practices for manual deployment workflows.

### Why This Approach?

**GitHub Documentation Reference:**
- From [GitHub Pages Publishing Sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site):
  > "If you do not need any control over the build process for your site, we recommend that you publish your site when changes are pushed to a specific branch."

**Benefits:**
✅ Manual deployment only (no auto-deploy on push)
✅ Single, clean workflow execution
✅ No redundant automatic workflows
✅ Full control over deployment timing
✅ Protected branch prevents accidental deletion
✅ Follows GitHub standard practices

## Setup (One-time)

### 1. GitHub Pages Configuration

Go to: `Settings` → `Pages` → `Build and deployment`

**Set to:**
- Source: **Deploy from a branch**
- Branch: **pages-deploy**
- Folder: **/ (root)**

Click **Save**.

### 2. Protect the Deployment Branch

Go to: `Settings` → `Branches` → `Add rule`

**Branch name pattern:** `pages-deploy`

**Enable:**
- ✅ Restrict who can push to matching branches
- ✅ Allow force pushes (optional, but recommended for automation)
  - Select: GitHub Actions

This prevents accidental deletion or manual overwrites of the deployment branch.

## How It Works

### Workflow Steps:

1. **Build Phase** (in GitHub Actions runner):
   - Checkout code
   - Setup Node 20 + npm cache
   - Install dependencies
   - Run linter (0 errors required)
   - Run tests (4/4 must pass)
   - Build production bundle → `dist/` folder

2. **Deploy Phase** (in same runner):
   - Configure git credentials
   - Create or checkout `pages-deploy` branch
   - Clear all files
   - Copy `dist/` contents into branch
   - Preserve `CNAME` for custom domain
   - Commit with timestamp
   - Push to `pages-deploy` branch

3. **Serve Phase** (GitHub Pages):
   - GitHub Pages detects push to `pages-deploy`
   - Serves contents at https://essence.khattak.cc

## How to Deploy

### Manual Deployment:

1. Go to: **Actions** tab
2. Select: **Deploy to GitHub Pages** workflow
3. Click: **Run workflow** button
4. Wait: ~2-3 minutes for completion
5. Visit: https://essence.khattak.cc

Site updates appear within 30 seconds of workflow completion.

### What You'll See:

- ✅ Build step completes in ~30s
- ✅ Linter passes (0 errors)
- ✅ Tests pass (4/4)
- ✅ Deploy step completes in ~20s
- ✅ Workflow shows complete

## Branch Protection Rules

The `pages-deploy` branch is protected with:

- **Rule:** Prevent accidental deletion
- **Branch pattern:** `pages-deploy`
- **Restrictions:**
  - Restrict who can push (allows GitHub Actions bot)
  - Force push allowed for GitHub Actions only
  - Prevents manual deletion

This ensures the deployment branch can only be modified by the GitHub Actions workflow, not by accident.

## Technical Details

### Branch Strategy:

- **main**: Source code (protected normally)
- **pages-deploy**: Compiled static files only (protected)
  - No source code
  - No config files
  - Only contents of `dist/` folder
  - CNAME for custom domain

### Permissions:

```yaml
permissions:
  contents: write
```

Only needs `contents: write` to push to `pages-deploy` branch.

### Custom Domain (CNAME):

The workflow preserves the `CNAME` file on each deployment:
```
essence.khattak.cc
```

This ensures custom domain persists across deployments.

## GitHub Pages Standards Compliance

✅ **GitHub Recommended Approach:**
- Official docs recommend publishing from a branch when you want full control
- Matches the pattern used by many modern projects

✅ **Best Practices Followed:**
- Dedicated deployment branch (not main)
- Protected branch rules
- Manual trigger only (no auto-deploys)
- Clean separation: source vs. compiled

✅ **No Anti-Patterns:**
- Not using deprecated gh-pages package
- Not relying on automatic Jekyll builds
- Not uploading via GitHub API
- Not using artifact system (which triggers dual workflows)

## Troubleshooting

**Q: Workflow failed at deploy step?**
- A: Check git permissions - branch may not exist yet
- Solution: Run workflow, it will create the branch on first run

**Q: CNAME file keeps disappearing?**
- A: Workflow re-creates it on each deploy
- This is intentional and correct

**Q: Can I manually edit pages-deploy branch?**
- A: You shouldn't - workflow is the only source of truth
- Branch protection prevents accidental edits

**Q: How do I rollback a deployment?**
- A: Previous commit history is available
- Use `git revert` if needed, or re-run workflow

**Q: Site not updating after deployment?**
- A: GitHub Pages cache - can take up to 30 seconds
- Check workflow completion status first
- Verify `pages-deploy` branch has latest commit

## References

- [GitHub Pages Configuration](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions](https://docs.github.com/en/actions)

