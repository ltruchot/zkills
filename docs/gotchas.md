# Gotchas

## Shell and files

- Shell cwd resets between commands, always absolute paths, never bare `rm -rf`
- zsh: quote globs (`--include='*.md'`), `setopt nonomatch` before `rm -f *.tgz`
- Blind string patches fail after oxfmt reformat, rewrite small files whole

## Lint and format

- CI runs `vp check` without `--fix`, run that form before every push
- `vp check --fix` hides rules that flip with oxfmt, e.g. `number-literal-case`
- `vp run lines` after `vp check --fix`, reformat adds lines
- Pre-commit hook runs `vp check --fix` only, `lines` and `packcheck` are on you before push
- `vp lint --fix` toggles between contradicting rules, resolve with one exception + reason in `lint/off-*.ts`
- `coverage/` must stay in `.gitignore` and `scripts/lines.ts` skip list

## Tests

- Vitest swallows `console.log`, CLI prints through `process.stdout.write`
- e2e call `main()` in-process for real coverage, one spawn test for the bin
- `ZKILLS_ANSWER_<NAME>` feeds prompts, `XDG_CACHE_HOME` isolates cache

## npm and release

- Root `devEngines` pins pnpm, npm commands only inside `packages/zkills` or `/tmp`
- `npm publish` ships `catalog:` versions, always publish a `pnpm pack` tarball
- `vp run packcheck` guards catalog leaks and the `bin` entry
- `publishConfig.provenance` breaks local publish, provenance comes from trusted publishing in CI only
- `bin` path without `./`, npm normalizes to `dist/cli.js`
- Trusted publishing needs an existing package, first version is published by hand
- WSL: npm web auth needs `BROWSER=wslview`, or `--auth-type=legacy` for a terminal OTP
- New version pinned in bank CI only once it exists on npm

## YAML and GitHub

- Never a bare `word:` inside an unquoted `name:` value
- Repo transfer is async, first push after may 403, retry
- Actions of another repo cannot read a GitHub Packages package without a grant
