# Enterprise: white-label fork

## Model

- Public `zkills` = name reservation + white-label source, nothing more
- Fork = real tool: own name, own registry, own bank, baked rules
- Fork never depends on public package, `dist/cli.js` one self-contained file
- Consumers see internal tool from internal registry, upstream never mentioned
- Step-by-step: [fork/README.md](fork/README.md)

## Consumers

```bash
npx @acme/zkills init      # preset bank, no prompt
npx @acme/zkills add qa-pr # policy from preset, cannot be weakened
npx @acme/zkills info      # links, notes, effective policy
```

## Air gap

- `host` per source targets GitHub Enterprise `https://<host>/api/v3`, trusted through preset
- `ZKILLS_OFFLINE=1` forbids every network call, cache serves known shas
- Mirror banks with `type: local` on synced folder when no API reachable
- One tarball, zero dependencies, one file: easy to mirror and audit
