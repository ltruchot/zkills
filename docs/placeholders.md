# Placeholders

## Why `{{NAME}}`

- Claude Code owns `$ARGUMENTS`, `$1`, `$name`, `${CLAUDE_*}`, `` !`cmd` ``
- `${CLAUDE_*}` cannot even be escaped
- `{{UPPER_SNAKE}}` is untouched by Claude Code, greppable, familiar

## Flow

- `add` reads `zkills.yaml`, asks each missing placeholder once
- Order: lock answers, then env `ZKILLS_ANSWER_<NAME>`, then `default`, then prompt
- `-y` fails on a missing answer instead of prompting
- Values validated: url parses, enum in options, pattern matches
- Value containing `${CLAUDE_` rejected

## Storage

- Public answers → `.claude/zkills.lock.json`, committed
- Secret answers → `.claude/zkills.local.json`, mode 0600, gitignored
- Skill dir with secrets gets gitignored, restore with `zkills add`

## Update semantics

- Lock hash = hash of rendered files, not template
- Placeholder change alone = rewrite, never drift
- Upstream adds placeholder = prompt during `update`
- `answers <name> --edit` = re-render through the same merge

## Bank side

- Undeclared token = lint error
- Declared unused = lint warning
- Placeholder in frontmatter `name` = lint error
