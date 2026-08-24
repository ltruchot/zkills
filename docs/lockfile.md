# Lockfile

- Path `.claude/zkills.lock.json`, committed
- Keys sorted, no timestamps, trailing newline, merge friendly

```json
{
  "skills": {
    "qa-pr": {
      "answers": { "DEFAULT_BRANCH": "main", "GITHUB_REPO": "o/r" },
      "files": { "SKILL.md": "<sha256>", "references/checklist.md": "<sha256>" },
      "path": ".claude/skills/qa-pr",
      "ref": "main",
      "renderedHash": "<sha256>",
      "secrets": ["PROD_TOKEN"],
      "sha": "<40 hex commit>",
      "skillPath": "skills/qa-pr",
      "source": "Gods-Academy/skills",
      "sourceType": "github",
      "templateHash": "<sha256>"
    }
  },
  "version": 1
}
```

## Hashes

- Per file: `sha256(rel \0 mode \0 len \0 bytes)`
- Text normalized: BOM stripped, CRLF and CR → LF
- Binary hashed raw, symlinks refused
- Tree: `sha256(sorted "rel \0 fileHash \n")`
- `templateHash` covers bank files incl `zkills.yaml`
- `renderedHash` covers what zkills wrote

## Managed set

- Lock keys = managed skills
- Any other dir under `.claude/skills` is yours, never touched

## Local file

- `.claude/zkills.local.json` = `{ version, secrets: { skill: { NAME: value } } }`
