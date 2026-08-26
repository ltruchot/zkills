# Rebrand

## Preset

```bash
cp flavor/preset.example.json flavor/preset.json
```

- `name`: `acme-skills`, shown in every intro, hint, help example
- `sources`: `[{ "repo": "acme/skills", "ref": "main", "path": "skills", "host": "github.com" }]`
- `host`: GitHub Enterprise hostname when bank lives there, trusted for token automatically
- `policy.allowedSources`: `["acme/skills"]`, projects cannot add other banks
- `policy.denyFrontmatter`: `["hooks"]` when hooks forbidden org wide
- `policy.requireAudit`: `true`, audit error blocks `add` and `update`
- `conflict`: `inline` default, `rej` for teams preferring side files
- `links`: wiki, support channel; `notes`: printed by `acme-skills info`
- Commit file

## package.json

- `name`: `@acme/skills-cli`
- `bin`: `{ "acme-skills": "dist/cli.js" }`
- `description`, `homepage`, `bugs`, `repository`: internal URLs
- `publishConfig`: `{ "registry": "https://npm.pkg.github.com", "access": "restricted" }`
- `version`: bump above every mirrored tag, else the release tag collides
- `vp check --fix` after editing, oxfmt owns json formatting

## Prove

```bash
vp check && vp run lines && vp run -r test && vp run -r build && vp run packcheck && vp run flavorcheck
cd packages/zkills && vp pack && node dist/cli.js --help   # acme-skills in Usage
node dist/cli.js info --cwd /tmp                           # baked sources, links
```

## What stays

- File names `zkills.config.json`, `.claude/zkills.lock.json`, `zkills.yaml`, cache `~/.cache/zkills`
- Env names `ZKILLS_TOKEN`, `ZKILLS_HOSTS`, `ZKILLS_OFFLINE`, `ZKILLS_ANSWER_*`
- Conflict marker labels `zkills base`, `zkills update` in merged files
- Format identifiers, renaming = grep `zkills` in `src`, diverges from upstream merges
