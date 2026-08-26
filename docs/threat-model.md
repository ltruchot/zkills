# Threat model

## Assets

- Claude context of every consumer repo
- Developer laptops running skills with `allowed-tools`
- Bank repo credibility, lock integrity, secret answers

## Attackers

- Malicious skill in a public catalog, poisoned bank commit, tampered lock in a PR
- Compromised registry mirror, MITM on tarball download, path traversal in archives

## Controls

| Threat                           | Control                                                                            |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| Path traversal via names         | kebab regex on every arg and lock key, lock path pinned to `.claude/skills/<name>` |
| Path traversal via tarball       | own ustar/pax reader, `..`, absolute, links refused, 5000 entries cap              |
| Blind overwrite of local edits   | 3-way merge, rendered hash in lock, conflict modes                                 |
| Tampered lock                    | `check --frozen` re-renders and compares, exit 3                                   |
| Secrets in git                   | `.claude/zkills.local.json` 0600, gitignored, skill dir gitignored                 |
| Reserved Claude syntax in values | `${CLAUDE_` rejected at input                                                      |
| Malicious content                | `audit` rules, `lint` on bank CI, CODEOWNERS review                                |
| Supply chain of the tool         | zero runtime deps, single file, provenance, fork owns source                       |
| Token exfiltration via config    | token only to `github.com`, preset hosts, `ZKILLS_HOSTS`; repo and host validated  |
| Network exfiltration             | GitHub API only, `ZKILLS_OFFLINE` hard stop, no telemetry                          |
| Decompression bomb               | gunzip output capped at 200 MiB, download capped at 50 MiB                         |
| Backslash paths                  | refused in lock and tarball, Windows never reads one as separator                  |
| Partial writes on crash          | work dir, two renames, old dir kept until new in place, backup, `repair`           |
| Policy bypass by project         | preset policy merges first and only tightens                                       |

## Out of scope

- Claude Code runtime itself, `disableSkillShellExecution` and tool permissions belong to its settings
- Personal `~/.claude/skills` shadowing a project skill, reported by `check` and `doctor` only
