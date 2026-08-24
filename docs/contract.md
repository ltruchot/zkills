# Contract bank ↔ CLI

## Bank layout

```text
skills/<name>/SKILL.md      required
skills/<name>/zkills.yaml   optional, placeholders + skipIfExists
skills/<name>/references/   optional
skills/<name>/scripts/      optional
skills/<name>/assets/       optional, binaries copied raw
```

## Rules

- Dir name = frontmatter `name`, `^[a-z0-9]+(-[a-z0-9]+)*$`, max 64
- No `claude`, no `anthropic` in name
- Description 1..1024 chars, no XML tags
- `SKILL.md` under 500 lines
- No symlinks anywhere
- Only declared `{{TOKENS}}` substituted, others literal

## zkills.yaml

```yaml
version: 1
placeholders:
  - name: PROD_URL # ^[A-Z][A-Z0-9_]*$
    prompt: Production URL
    type: url # string | url | path | enum | boolean
    default: https://x # optional
    secret: false # optional
    pattern: "^https" # optional, string and path
    options: [a, b] # enum only
skipIfExists: [] # never overwritten once present
```

## CLI promises

- Writes plain files to `.claude/skills/<name>/`
- Pins bank commit sha and template hash in lock
- Never touches dirs absent from lock
- Never overwrites a modified file without a 3-way merge
- Refuses to substitute reserved Claude syntax into values
