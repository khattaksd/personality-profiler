# GitHub Workflows Summary

This folder keeps one deployment workflow: `deploy.yml`.

## Current Deployment Flow

- Trigger: manual only (`workflow_dispatch`)
- Runtime: Ubuntu + Node 20
- Quality gates: `npm run lint`, `npm run test:unit -- --run`, `npm run build`
- Deploy target: `pages-deploy` branch
- Publish source: `dist/`
- Domain: `essence.khattak.cc`

## Required GitHub Settings

- Pages source should be `Deploy from a branch`
- Branch should be `pages-deploy` with folder `/ (root)`
- Keep automatic GitHub Actions Pages deployment disabled to avoid duplicate runs

## Operational Notes

- Deployments happen only when manually triggered from the Actions tab
- The workflow uses `contents: write` permission to push built files to `pages-deploy`
- Treat `pages-deploy` as generated output, not a branch for manual edits
