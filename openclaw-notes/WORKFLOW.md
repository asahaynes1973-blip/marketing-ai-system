# GOAT-OSS → GitHub → Lovable Workflow

## Overview

Luke (CTO) pushes landing page code to this repo. Lovable auto-syncs from main branch and publishes the pages live.

## Repo Structure

- `landing-pages/` — Lovable bridge pages (one folder per page/angle)
- `ad-creatives/` — Ad creative assets and copy
- `campaigns/` — Campaign-specific assets and configs
- `funnel-assets/` — Funnel components (quiz elements, VSL scripts, etc.)
- `prompts/` — AI generation prompts used to build pages
- `testing/` — A/B test variants
- `documentation/` — SOPs and workflow docs
- `openclaw-notes/` — Internal GOAT-OSS notes (not deployed)

## Bridge Page Convention

Each bridge page lives at: `landing-pages/<campaign-id>-<angle>/`

Example for YU SLEEP 5-angle build:
- `landing-pages/yusleep-001-problem-agitation/`
- `landing-pages/yusleep-001-social-proof/`
- `landing-pages/yusleep-001-curiosity-contrarian/`
- `landing-pages/yusleep-001-identity/`
- `landing-pages/yusleep-001-fear-urgency/`

## Git Workflow

```bash
# Pull latest from Lovable/main
GIT_SSH_COMMAND="ssh -i /data/.ssh/goat_oss_deploy -o StrictHostKeyChecking=no" git pull origin main

# Stage and commit
git add .
git commit -m "feat: [description]"

# Push to GitHub (Lovable auto-syncs)
GIT_SSH_COMMAND="ssh -i /data/.ssh/goat_oss_deploy -o StrictHostKeyChecking=no" git push origin main
```

## SSH Key

- Key file: `/data/.ssh/goat_oss_deploy`
- Public key added as deploy key on GitHub repo (read/write)
- Added: 2026-05-25

## Status

- ✅ GitHub connected and authenticated
- ✅ Repo cloned to /data/.openclaw/workspace/projects/lovable/
- ✅ Lovable auto-sync active
- ⏳ Awaiting bridge page briefs from John (CMO) to begin YU SLEEP builds
