# Enterprise: white-label fork

## Model

- Public `zkills` = name reservation + white-label source, nothing more
- Your fork = the real tool: own name, own registry, own bank, baked rules
- Fork never depends on the public package, `dist/cli.js` is one self-contained file
- Public package can vanish, your fork keeps working with the same guarantees

## Fork in five steps

- Fork or mirror `ltruchot/zkills` into your org, private
- `cp flavor/preset.example.json flavor/preset.json`, fill bank, policy, links, notes
- `packages/zkills/package.json`: `name` `@acme/zkills`, `publishConfig.registry`
- `vp run ready` (includes `packcheck` and `flavorcheck`)
- Tag, `release.yml` publishes to your registry with your token

## Consumers

```bash
npx @acme/zkills init      # preset bank, no prompt
npx @acme/zkills add qa-pr # policy from preset, cannot be weakened
npx @acme/zkills info      # links, notes, effective policy
```

## Air gap

- `host` per source targets GitHub Enterprise `https://<host>/api/v3`
- `ZKILLS_OFFLINE=1` forbids every network call, cache serves known shas
- Mirror banks with `type: local` on a synced folder when no API is reachable
- One tarball, zero dependencies, one file: easy to mirror and to audit

## Upstream updates

- `git fetch upstream && git merge` when you want, never forced
- Your changes stay in `flavor/` and `package.json`, merges stay trivial
