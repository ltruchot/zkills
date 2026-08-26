# GitHub org and tool repo

## Why mirror, not fork

- GitHub fork of public repo cannot become private
- Mirror = new private repo with full history, upstream remote local only

## Create tool repo

```bash
gh repo create acme/skills-cli --private --description "Claude Code skills manager"
cd skills-cli
git remote rename origin upstream
git remote add origin git@github.com:acme/skills-cli.git
git push -u origin main --tags
```

- `upstream` remote stays on maintainer laptop, never written in repo
- `--tags` copies upstream tags, first own release must bump above the highest one

## Protect

- Settings → Branches → `main`: require PR, one review, status check `ready`
- Settings → Actions → General: allow actions, `voidzero-dev/setup-vp` already sha pinned
- `.github/CODEOWNERS`: `* @acme/platform-team`

## Teams

- `@acme/platform-team`: maintains tool and bank, admin on both repos
- `@acme/skill-authors`: write on bank
- Every engineer: read on bank, read on package

## Secrets

- None for tool release, `GITHUB_TOKEN` publishes to GitHub Packages
- Bank read in consumer CI: org secret `BANK_READ_TOKEN`, see [07-rollout.md](07-rollout.md)
