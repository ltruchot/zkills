# Install

## Package

- `zkills` on public npm, published from github.com/ltruchot/zkills
- No secrets inside, the bank stays private
- No `.npmrc`, no registry setup

```bash
npx zkills --version   # one-off
npm i -g zkills        # global bin `zkills`
```

## Maintainers

- Run `npm` commands inside `packages/zkills`, never at the monorepo root
- Root `devEngines` pins pnpm, npm refuses to run there
- Publish a `pnpm pack` tarball, plain `npm publish` ships `catalog:` versions
- `vp run packcheck` guards both in CI

## Token for the bank

- Private bank needs a GitHub token with repo read
- Resolution: `ZKILLS_TOKEN` → `GH_TOKEN` → `GITHUB_TOKEN` → `gh auth token`
- Logged-in `gh` is enough on a laptop

## First project

```bash
cd my-repo
zkills init my-org/skills   # bank repo, any org
zkills add qa-pr            # answer placeholders one by one
git add .claude zkills.config.json
```

- Restart Claude Code once when `.claude/skills` is new
- Commit `.claude/zkills.lock.json`, never `.claude/zkills.local.json`

## CI

```yaml
- run: npx --yes zkills check --frozen
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- Same-org bank: grant the workflow read access to the bank repo, or use a PAT
- Pin a version in CI: `npx --yes zkills@0.1.3`
