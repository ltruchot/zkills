# Install

## Package

- `zkills` on public npm
- No secrets inside, bank stays private
- No `.npmrc`, no registry setup

```bash
npx zkills --version   # one-off
npm i -g zkills        # global bin `zkills`
```

## Maintainers

- Run `npm` commands inside `packages/zkills`, never at monorepo root
- Root `devEngines` pins pnpm, npm refuses to run there
- Publish `pnpm pack` tarball, plain `npm publish` ships `catalog:` versions
- `vp run packcheck` guards both in CI

## Token for bank

- Private bank needs GitHub token with repo read
- Resolution: `ZKILLS_TOKEN` → `GH_TOKEN` → `GITHUB_TOKEN` → `gh auth token`
- Logged-in `gh` enough on laptop
- GitHub Enterprise host: `ZKILLS_HOSTS=<host>`, see [auth.md](auth.md)

## First project

```bash
cd my-repo
zkills init my-org/skills   # bank repo, any org
zkills add qa-pr            # answer placeholders one by one
git add .claude zkills.config.json
```

- Restart Claude Code once when `.claude/skills` new
- Commit `.claude/zkills.lock.json`, never `.claude/zkills.local.json`

## CI

```yaml
- run: npx --yes zkills@0.3.3 check --frozen # pin version, unreachable bank = exit 1
  env:
    ZKILLS_TOKEN: ${{ secrets.BANK_READ_TOKEN }}
```

- `BANK_READ_TOKEN`: fine-grained PAT with contents read on bank, or GitHub App token
- Default `GITHUB_TOKEN` reads current repo only, never sibling private bank
