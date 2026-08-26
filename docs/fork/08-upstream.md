# Upstream sync

## When

- Security fix in upstream `CHANGELOG.md`, or feature wanted
- Never automatic, maintainer decides

## How

```bash
git fetch upstream
git merge upstream/main
vp install
vp check && vp run lines && vp run -r test && vp run -r build && vp run packcheck && vp run flavorcheck
```

- Conflicts expected in `README.md`, `packages/zkills/package.json`, `release.yml`, docs
- Keep yours on branding, take theirs on `src/` unless customized
- Bump patch version, tag, release

## Compatibility

- `zkills.config.json`, lock and `zkills.yaml` carry `version: 1`
- Upstream bump to `version: 2` = migration note in `CHANGELOG.md`, read before merge
- Consumers pin `@acme/skills-cli@x.y.z` in CI, bump after test on one pilot project

## Discretion

- `upstream` remote on maintainer laptops only
- No upstream URL in repo docs, package fields or preset links, see [09-erase-traces.md](09-erase-traces.md)
