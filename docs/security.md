# Security

## Threat model

- Full text: [threat-model.md](threat-model.md)
- Skill text enters Claude context in every consumer repo
- Payloads hide in `scripts/` and `references/`, not only `SKILL.md`

## Controls

- Bank private, CODEOWNERS review, CI lint + audit
- Lock pins commit sha and hashes, `check --frozen` detects tamper
- Names validated everywhere, lock paths pinned, archives read by our own guarded reader
- Symlinks refused, binaries never rendered, values with `${CLAUDE_` rejected
- Atomic writes with backup, `doctor` and `repair`
- Diff preview before every write, `--dry-run`
- No telemetry, no third-party endpoint, `ZKILLS_OFFLINE` hard stop

## Audit rules

- `curl | sh`, `wget | bash`
- base64 blobs over 200 chars, `eval`
- "ignore previous instructions", "do not tell the user"
- env or dotfile piped to network, reverse shells
- `allowed-tools` with `*` or `Bash(*)`, `hooks` warns, scripts with URLs warn

## Registry

- `zkills` is public on npm, owned by ltruchot, name reserved against squatting
- Package holds no secrets, no org name, no bank, zero dependencies
- Published by GitHub Actions through npm trusted publishing, provenance attached
- Enterprises fork the source and publish their own package, see [enterprise.md](enterprise.md)

## Claude Code knobs

- `disableSkillShellExecution` kills `` !`cmd` `` org-wide
- `Skill(name)` deny rules in settings
- Personal `~/.claude/skills/<name>` shadows project skill, `check` and `doctor` warn
