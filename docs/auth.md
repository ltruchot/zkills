# Auth

## Token chain

- `ZKILLS_TOKEN`
- `GH_TOKEN`
- `GITHUB_TOKEN`
- `gh auth token`, failure ignored

## Needs

- Read the bank repo: `repo` scope or fine-grained contents read
- Install the CLI: `read:packages`
- CI: `permissions: { contents: read, packages: read }`

## Network calls

- `GET api.github.com/repos/{repo}/commits/{ref}` → sha
- `GET api.github.com/repos/{repo}/tarball/{sha}` via giget
- Nothing else, no telemetry, no audit service

## Cache

- `~/.cache/zkills/github/<repo>/<sha>/` bank at sha
- `~/.cache/zkills/templates/<hash>/` raw templates
- `XDG_CACHE_HOME` respected, safe to delete

## Private repo checklist

- `gh auth status` green
- `gh api repos/Gods-Academy/skills` returns 200
- `zkills list` shows bank skills
