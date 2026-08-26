# Gotchas: npm, release, GitHub

## npm and release

- Root `devEngines` pins pnpm, npm commands only inside `packages/zkills` or `/tmp`
- `npm publish` ships `catalog:` versions, always publish a `pnpm pack` tarball
- `publishConfig.provenance` breaks local publish, provenance comes from trusted publishing in CI only
- `bin` path without `./`, npm normalizes to `dist/cli.js`
- Trusted publishing needs an existing package, first version is published by hand
- A cancelled release may already be on npm, bump the patch version, keep the tag on the published commit
- WSL: npm web auth needs `BROWSER=wslview`, or `--auth-type=legacy` for a terminal OTP
- Actions with setup-vp: `pnpm` is not on PATH outside `vp run`, call `vp pm <cmd>`

## YAML and GitHub

- Never a bare `word:` inside an unquoted `name:` value
- Repo transfer is async, first push after may 403, retry
