# zkills

- Claude-only skills manager for private org banks, any GitHub org
- Installs, updates, removes `SKILL.md` dirs in `.claude/skills/`
- Placeholders `{{GITHUB_REPO}}` asked once per project, never seen as drift
- Update = 3-way merge, local edits survive
- Zero telemetry, GitHub only

## Install

```bash
npm i -g zkills   # or npx zkills
```

## Use

```bash
zkills init                 # zkills.config.json + .claude/zkills.lock.json
zkills list                 # bank, installed, external skills
zkills add qa-pr            # prompts placeholders, previews, writes
zkills update               # merges bank changes, keeps local edits
zkills check --frozen       # exit 0 ok, 1 update, 2 drift, 3 tamper
zkills answers qa-pr --edit # change placeholder values, then remove
zkills lint skills/*        # bank CI
zkills audit                # offline danger scan
```

## Contract with the bank

- Bank repo = `skills/<name>/SKILL.md` + `skills/<name>/zkills.yaml`
- Only declared `{{PLACEHOLDERS}}` get substituted
- Lock pins commit sha, template hash, rendered hash, public answers
- Secrets live in gitignored `.claude/zkills.local.json`
- Hand-written skills never touched
- Reference bank: [Gods-Academy/skills](https://github.com/Gods-Academy/skills)

## Docs

- [Install](docs/install.md) registry, token, first run
- [Commands](docs/commands.md) flags, exit codes
- [Contract](docs/contract.md) bank layout, `zkills.yaml`
- [Placeholders](docs/placeholders.md) syntax, types, secrets
- [Lockfile](docs/lockfile.md) schema, hashing
- [Config](docs/config.md) sources, conflict mode, policy
- [Update](docs/update.md) merge algorithm
- [Auth](docs/auth.md) token chain, private repos
- [Security](docs/security.md) threat model, audit rules, squatting
- [Interop](docs/interop.md) skills.sh coexistence
- [Testing](docs/testing.md), [Style](docs/style.md), [Philosophy](docs/philosophy.md)
