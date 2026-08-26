# zkills

- Package manager for Claude Code skills: reviewed `SKILL.md` folders from private GitHub repo into any project
- Skill = folder with `SKILL.md`, Claude Code loads it from `.claude/skills/`
- Bank = GitHub repo `my-org/skills` holding `skills/<name>/`, reviewed like code
- Placeholders `{{TEAM}}` asked once per project, update = 3-way merge, local edits survive
- Zero telemetry, zero dependencies, one file, MIT, forkable as internal enterprise tool

## Prerequisites

- Node 22.18+, `gh auth login` done, read access on bank repo; token from `gh` or `ZKILLS_TOKEN`

## Create bank, once per org

```bash
gh repo create my-org/skills --private --clone && cd skills && mkdir -p skills/hello
printf -- '---\nname: hello\ndescription: Greets {{TEAM}}\n---\nSay hello to {{TEAM}}.\n' > skills/hello/SKILL.md
printf 'version: 1\nplaceholders:\n  - name: TEAM\n    prompt: Team name\n' > skills/hello/zkills.yaml
npx zkills lint skills/* && git add . && git commit -m "Add hello skill" && git push
```

## First skill, per project

```bash
cd my-project
npx zkills init my-org/skills   # zkills.config.json, lock, .claude/.gitignore
npx zkills add hello            # asks TEAM, previews, writes .claude/skills/hello
npx zkills list                 # bank skills with status
git add .claude zkills.config.json && git commit -m "Add hello skill"
```

- Restart Claude Code once, `.claude/skills` loads at startup

## Keep, update, remove

```bash
npx zkills update               # merges bank changes, keeps local edits
npx zkills check --frozen       # CI: 0 ok, 1 update, 2 drift, 3 tamper
npx zkills remove hello         # backup, dir, lock entry, secrets
npx zkills doctor               # what is wrong, how to fix
```

## Enterprise

- Fork, commit `flavor/preset.json`, own registry, consumers see internal tool: [docs/fork/README.md](docs/fork/README.md)

## Docs

- [docs/README.md](docs/README.md): commands, config, contract, security, testing, contributing
