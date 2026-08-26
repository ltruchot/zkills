# Commands

- `zkills <command> --help` prints flags and examples
- Global: `--cwd <dir>`, `-y` no prompts, `--json`, `--dry-run` writes nothing

| Command          | Does                                                                         | Exit                              |
| ---------------- | ---------------------------------------------------------------------------- | --------------------------------- |
| `init [repo]`    | config from arg, preset or prompt; lock; `.claude/.gitignore`; skills dir    | 0                                 |
| `info`           | flavor, sources, effective policy, links, notes                              | 0                                 |
| `list`, `ls`     | bank skills with status, orphans, hand-written dirs, skills.sh externals     | 0                                 |
| `add [names]`    | prompt placeholders, preview, atomic write, lock; no names = restore missing | 1 on refusal                      |
| `update [names]` | 3-way merge, keeps local edits, prompts new placeholders                     | 1 on refusal                      |
| `remove`, `rm`   | managed only: backup, dir, lock, secrets, gitignore line                     | 1 if unmanaged                    |
| `check`          | status per skill, see [status.md](status.md), unreachable bank = 1           | 0 ok, 1 update, 2 drift, 3 tamper |
| `doctor`         | token, gitignore, secrets, disk state, shadowing, fixes in messages          | 1 on error                        |
| `repair [names]` | rebuild from lock, `--from-backup` restores last state                       | 1 on failure                      |
| `answers <name>` | show values, secrets masked, `--edit` re-renders                             | 1 if unmanaged                    |
| `lint <dirs>`    | spec rules, `--portable` = 6 open-spec keys                                  | 1 on error                        |
| `audit [dirs]`   | offline danger scan, default = managed skills                                | 1 on error                        |

## Flags

- `add --force` replaces an unmanaged dir of same name
- `update --force` re-renders when template unchanged, `--external` asks then runs `npx skills update`
- `check --frozen` re-renders template with lock answers, mismatch = tamper; `--offline` skips fetch
- `lint --portable` rejects Claude Code only frontmatter keys
- policy `requireAudit: true` makes `add` and `update` refuse skills the audit flags

## Env

- `ZKILLS_ANSWER_<NAME>` answers a placeholder without prompt
- `ZKILLS_TOKEN`, `GH_TOKEN`, `GITHUB_TOKEN`, else `gh auth token`
- `ZKILLS_OFFLINE=1` forbids network, cache only
- `ZKILLS_HOSTS=a,b` extra hosts allowed to receive token, see [auth.md](auth.md)
- `ZKILLS_FLAVOR=<file>` build time only, preset to bake instead of `flavor/preset.json`
- `ZKILLS_PRESET=<file.json>` loads a preset without a flavor build
- `XDG_CACHE_HOME` moves cache and backups

## Safety

- Every write goes to work dir then swap, previous state backed up
- Exit 130 when prompt cancelled
- Names validated on every argument and lock key, no path can escape `.claude/skills`
- Writes only under `.claude/`, `zkills.config.json` and the cache dir
