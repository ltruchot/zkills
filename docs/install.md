# Install

## Registry

- Package `@gods-academy/zkills` lives on GitHub Packages, private
- Scope routing goes in `~/.npmrc`, never in the repo

```ini
@gods-academy:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## Token

- Classic PAT with `read:packages`, or `gh auth refresh -s read:packages`
- Export: `export GITHUB_TOKEN=$(gh auth token)`
- Same token reads the private bank at runtime

## Run

```bash
npx @gods-academy/zkills --version   # one-off
npm i -g @gods-academy/zkills        # global bin `zkills`
```

## First project

```bash
cd my-repo
zkills init                 # accept default bank or type owner/name
zkills add qa-pr            # answer placeholders one by one
git add .claude zkills.config.json
```

- Restart Claude Code once when `.claude/skills` is new
- Commit `.claude/zkills.lock.json`, never `.claude/zkills.local.json`

## CI

```yaml
- run: npx --yes @gods-academy/zkills check --frozen
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- Needs `packages: read` permission and package access for the repo
