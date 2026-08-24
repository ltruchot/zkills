# zkills

- Skills manager for Claude Code, private banks, any GitHub org
- Installs `SKILL.md` dirs into `.claude/skills/`, plain files, committed
- Placeholders `{{GITHUB_REPO}}` asked once per project, never mistaken for drift
- Update = 3-way merge, local edits survive; every write atomic with backup
- Zero telemetry, zero dependencies, one file; fork it as your enterprise tool

## Install

```bash
npx zkills --help        # one-off
npm i -g zkills          # global bin
```

## Daily use

```bash
zkills init my-org/skills   # once per project
zkills add qa-pr            # prompts placeholders, previews, writes
zkills update               # merges bank changes
zkills check --frozen       # CI: 0 ok, 1 update, 2 drift, 3 tamper
zkills doctor               # what is wrong and how to fix it
```

## Contract with a bank

- Bank repo: `skills/<name>/SKILL.md` + `skills/<name>/zkills.yaml`
- Only declared `{{PLACEHOLDERS}}` substituted
- Lock pins commit sha and hashes, secrets stay in gitignored `.claude/zkills.local.json`
- Hand-written skills next to managed ones are never touched
- Reference bank: [Gods-Academy/skills](https://github.com/Gods-Academy/skills)

## Enterprise

- Fork this repo, drop `flavor/preset.json`, publish on your registry
- Your fork owns the source, never depends on this package
- Guide: [docs/enterprise.md](docs/enterprise.md)

## Docs

- [Commands](docs/commands.md), [Install](docs/install.md), [Config](docs/config.md)
- [Contract](docs/contract.md), [Placeholders](docs/placeholders.md), [Lockfile](docs/lockfile.md), [Update](docs/update.md)
- [Security](docs/security.md), [Threat model](docs/threat-model.md), [Auth](docs/auth.md), [Interop](docs/interop.md)
- [Testing](docs/testing.md), [Style](docs/style.md), [Philosophy](docs/philosophy.md), [Gotchas](docs/gotchas.md)
