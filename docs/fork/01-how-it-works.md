# How it works

## Three repos

- Tool repo: this code, builds one file `dist/cli.js`, published as `@acme/skills-cli`
- Bank repo: `skills/<name>/SKILL.md` + `zkills.yaml`, reviewed like code
- Consumer repos: any project, `.claude/skills/` + `zkills.config.json` + lock

## One command run

- `acme-skills add qa-pr` resolves bank ref to commit sha through GitHub API
- Downloads tarball, extracts `skills/` into `~/.cache/zkills/github/<host>/<owner>/<name>/<sha>`
- Reads `zkills.yaml`, asks placeholders once, renders files
- Audit scan when policy `requireAudit`, preview, confirm
- Writes `.claude/skills/qa-pr/` through work dir and swap, backup before
- Lock pins sha, template hash, rendered hash, answers; secrets to gitignored local file

## What preset bakes

- Bank sources with host, policy floor, default conflict mode, links, notes, tool name
- Baked at build into `dist/cli.js`, consumer cannot override, env `ZKILLS_PRESET` ignored
- Preset hosts trusted for token, nothing to configure on laptops

## What stays per project

- `zkills.config.json` sources and stricter policy, `.claude/zkills.lock.json`
- `.claude/zkills.local.json` secrets, mode 0600, gitignored by `init`

## Token path

- `ZKILLS_TOKEN` → `GH_TOKEN` → `GITHUB_TOKEN` → `gh auth token`
- Sent to `github.com`, preset hosts, `ZKILLS_HOSTS` only
- Two GitHub API calls per bank fetch, nothing else on network

## Update

- 3-way merge: base template at install, theirs template now, disk
- Local edits survive, conflicts as git markers or `.zk-rej` files per mode
- Details: [../update.md](../update.md), statuses: [../status.md](../status.md)
