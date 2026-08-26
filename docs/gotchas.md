# Gotchas

- Release, npm and GitHub frictions: [gotchas-release.md](gotchas-release.md)

## Shell and files

- Shell cwd resets between commands, always absolute paths, never bare `rm -rf`
- zsh: quote globs (`--include='*.md'`), `setopt nonomatch` before `rm -f *.tgz`
- Blind string patches fail after oxfmt reformat, rewrite small files whole
- `vp lint --fix` may rename matchers (`toEqual` → `toStrictEqual`), grep before patching tests
- An edit script that asserts mid-way ships half the change, grep every expected line before commit
- `cd dir && cmd` fails when shell already sits in `dir`, later commands still run, absolute paths only

## Lint and format

- CI runs `vp check` without `--fix`, run that form before every push
- `vp check --fix` hides rules that flip with oxfmt, e.g. `number-literal-case`
- `vp run lines` after `vp check --fix`, reformat adds lines
- Pre-commit hook runs `vp check --fix` then `vp run lines`, `packcheck` is on you before push
- Never chain `gates; git commit`, gate output does not stop the chain, use `&&`
- `vp lint --fix` toggles between contradicting rules, resolve with one exception + reason in `lint/off-*.ts`
- `coverage/` must stay in `.gitignore` and `scripts/lines.ts` skip list

## Tests

- Vitest swallows `console.log`, CLI prints through `process.stdout.write`
- e2e call `main()` in-process for real coverage, one spawn test for the bin
- `ZKILLS_ANSWER_<NAME>` feeds prompts, `XDG_CACHE_HOME` isolates cache
- Reworded message breaks string asserts, grep tests for old wording first
- vitest `toThrow` needs message or regex
- Mocked `fetch` ignoring headers hides real API errors, assert headers and mimic status codes

## Build

- `dts` with tsgo spawns EBUSY under WSL, keep `dts: false`
- Two entries make tsdown split a shared chunk, keep one entry so `dist/cli.js` runs alone
- Never `require("../package.json")` at runtime, bake values with `define`
- Runtime deps live in `devDependencies` so tsdown bundles them, `packcheck` enforces zero deps
- `vp run` task cache ignores env, `ZKILLS_FLAVOR` needs direct `vp pack` in `packages/zkills`
