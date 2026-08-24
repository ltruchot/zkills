# Testing

## Run

```bash
vp check          # fmt, lint, types
vp run lines      # 50-line law
vp run -r test    # unit + e2e
vp test --coverage # inside packages/zkills
vp run ready      # all of the above + build
```

## Layout

- `tests/unit/*.test.ts` one per core module
- `tests/e2e/*.test.ts` run `main()` in-process, stdout captured, real coverage
- `tests/e2e/bin.test.ts` spawns `src/cli.ts` once for shebang and exit codes
- `tests/fixtures/bank-v1` skill `hello` with two placeholders
- `tests/fixtures/bank-v2` same skill, body change, new placeholder
- `tests/fixtures/bank-bad` lint and audit failures
- `tests/fixtures/skills-lock.json` skills.sh sample

## e2e flow

- init → add → check 0 → bank v2 → check 1 → update → check 0
- edit file → check 2 → bank v1 → update keeps edit → check 2
- answers --edit re-renders, edit survives
- remove refuses unmanaged, removes managed

## Env in tests

- `ZKILLS_ANSWER_<NAME>` feeds prompts
- `XDG_CACHE_HOME` isolates template cache
