# Config

- Path `zkills.config.json` at project root, committed

```json
{
  "version": 1,
  "sources": [
    {
      "repo": "my-org/skills",
      "ref": "main",
      "path": "skills",
      "type": "github",
      "host": "github.com"
    },
    { "repo": "../local-bank", "path": "skills", "type": "local" }
  ],
  "conflict": "inline",
  "policy": {
    "allowedSources": ["my-org/skills"],
    "denyFrontmatter": ["hooks"],
    "requireAudit": false
  }
}
```

## Sources

- `github`: `owner/name`, `ref` branch, tag or sha, resolved to sha at install
- `host`: `github.com` or GitHub Enterprise hostname, API at `https://<host>/api/v3`
- Host must be trusted before token leaves laptop, see [auth.md](auth.md)
- `repo` shape `owner/name`, host shape bare hostname with optional port
- `local`: path relative to project root, sha = `local:<tree hash>`
- First bank holding name wins

## Conflict modes

- `inline` git markers in file, default
- `rej` keep yours, write `<file>.zk-rej` with theirs
- `ours` keep yours silently
- `theirs` take upstream silently

## Policy

- `allowedSources` blocks `add` from other repos
- `denyFrontmatter` blocks skills using listed keys
- `requireAudit` blocks `add` and `update` when the offline audit finds an error
- Preset policy from a flavor merges first and only tightens: allowlist intersect, denylist union
- `conflict` absent = preset default, else `inline`
