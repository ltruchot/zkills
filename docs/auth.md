# Auth

## Token chain

- `ZKILLS_TOKEN`
- `GH_TOKEN`
- `GITHUB_TOKEN`
- `gh auth token`, failure ignored

## Trusted hosts

- Token sent to `github.com`, preset bank hosts, `ZKILLS_HOSTS` only
- Project config never adds host, cloned repo cannot redirect token
- Untrusted host: warning, anonymous request, `ZKILLS_HOSTS=ghe.corp,other.corp` fixes
- GitHub Enterprise laptop: export `ZKILLS_HOSTS` in shell profile
- Flavor build: preset sources trust own hosts, nothing to set

## Needs

- Read bank repo: `repo` scope or fine-grained contents read on bank
- Sibling private bank in CI: default `GITHUB_TOKEN` cannot read it, PAT or GitHub App token

## Network calls

- `GET <api>/repos/{owner}/{name}/commits/{ref}` → sha
- `GET <api>/repos/{owner}/{name}/tarball/{sha}` → bank archive, global `fetch`
- `<api>` = `https://api.github.com` or `https://<host>/api/v3`
- Nothing else, no telemetry, no audit service

## Cache

- `~/.cache/zkills/github/<host>/<owner>/<name>/<sha>/` bank at sha
- `~/.cache/zkills/templates/<hash>/` raw templates
- `~/.cache/zkills/backup/<project hash>/<name>/` last state before write
- `XDG_CACHE_HOME` respected, safe to delete

## Private repo checklist

- `gh auth status` green
- `gh api repos/my-org/skills` returns 200
- `zkills list` shows bank skills
