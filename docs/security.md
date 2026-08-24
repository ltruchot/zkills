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

## Registry squatting

- Public npm name `zkills` is unclaimed on purpose, we publish private only
- Bare `npx zkills` resolves to public npm, never to our package
- Always type `@gods-academy/zkills` or use the global bin
- Machine without `~/.npmrc` scope line = dependency confusion risk
- Reserve org `gods-academy` on npmjs.com, publish nothing there

## Claude Code knobs

- `disableSkillShellExecution` kills `` !`cmd` `` org-wide
- `Skill(name)` deny rules in settings
- Personal `~/.claude/skills/<name>` shadows project skill, `check` warns
