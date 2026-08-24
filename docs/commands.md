# Commands

## Global flags

- `--cwd <dir>` project dir, default cwd, walks up to config or `.git`
- `-y, --yes` no prompts, fails on missing answers
- `--json` machine output for `list`, `lint`, `audit`

## init [repo]

- Writes `zkills.config.json`, empty lock, `.claude/.gitignore`
- Creates `.claude/skills`, warns to restart Claude Code

## list

- Bank skills with status, orphans, hand-written dirs, skills.sh externals

## add [names...]

- Prompts declared placeholders, env `ZKILLS_ANSWER_<NAME>` wins
- Shows files and `SKILL.md` diff, asks before writing
- No names = restore locked skills missing on disk
- `--force` replaces an unmanaged dir of same name

## update [names...]

- Skips when template hash unchanged, `--force` re-renders
- Prompts new placeholders only
- 3-way merge per file, see [update.md](update.md)
- `--external` runs `npx skills update` after warning

## remove <names...>

- Managed only: dir, lock entry, secrets, gitignore line

## check

- Exit 0 ok, 1 update or wrong ref, 2 drift or missing, 3 tamper
- `--frozen` re-renders template with lock answers, mismatch = tamper
- `--offline` skips bank fetch
- Warns when `~/.claude/skills/<name>` shadows the project skill

## answers, lint, audit

- `answers <name> [--edit]` shows values, secrets masked, re-renders on edit
- `lint <dirs...> [--portable]` spec rules, exit 1 on error
- `audit [dirs...]` offline scan, default = managed skills, exit 1 on error
