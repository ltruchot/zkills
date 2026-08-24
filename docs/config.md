# Config

- Path `zkills.config.json` at project root, committed

```json
{
  "version": 1,
  "sources": [
    {
      "repo": "Gods-Academy/skills",
      "ref": "main",
      "path": "skills",
      "type": "github",
      "host": "github.com"
    },
    { "repo": "../local-bank", "path": "skills", "type": "local" }
  ],
  "conflict": "inline",
  "policy": {
    "allowedSources": ["Gods-Academy/skills"],
    "denyFrontmatter": ["hooks"],
    "requireAudit": false
  }
}
```

## Sources

- `github`: `owner/name`, `ref` branch, tag or sha, resolved to sha at install
- `host`: `github.com` or a GitHub Enterprise host, API at `https://<host>/api/v3`
- `local`: path relative to project root, sha = `local:<tree hash>`
- First bank holding a name wins

## Conflict modes

- `inline` git markers in file, default
- `rej` keep yours, write `<file>.zk-rej` with theirs
- `ours` keep yours silently
- `theirs` take upstream silently

## Policy

- `allowedSources` blocks `add` from other repos
- `denyFrontmatter` blocks skills using listed keys
- `requireAudit` reserved for a future gate
- Preset policy from a flavor merges first and only tightens: allowlist intersect, denylist union
- `conflict` absent = preset default, else `inline`
