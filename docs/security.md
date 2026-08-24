# Security

## Threat model

- Skill text enters Claude context in every consumer repo
- Project `allowed-tools` applies even in untrusted folders
- Payloads hide in `scripts/` and `references/`, not only `SKILL.md`
- Bank compromise = org-wide prompt injection

## Controls

- Bank private, CODEOWNERS review, CI lint + audit
- Lock pins commit sha and hashes, `check --frozen` detects tamper
- Symlinks refused, binaries never rendered
- Values with `${CLAUDE_` rejected
- Diff preview before every write
- No telemetry, no third-party endpoint

## Audit rules

- `curl | sh`, `wget | bash`
- base64 blobs over 200 chars
- `eval`
- "ignore previous instructions", "do not tell the user"
- env or dotfile piped to network, reverse shells
- `allowed-tools` with `*` or `Bash(*)`
- `hooks` in frontmatter warns, scripts with URLs warn

## Registry

- `zkills` is public on npm, owned by ltruchot, name reserved
- Package holds no secrets, no org name, no bank
- Published by GitHub Actions through npm trusted publishing, provenance attached
- Verify: `npm view zkills dist.attestations` or the provenance badge on npmjs.com
- Banks stay private per org, reached with the caller's GitHub token

## Claude Code knobs

- `disableSkillShellExecution` kills `` !`cmd` `` org-wide
- `Skill(name)` deny rules in settings
- Personal `~/.claude/skills/<name>` shadows project skill, `check` warns
