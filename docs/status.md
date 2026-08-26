# Status

- `check` computes statuses per managed skill, worst one sets exit code
- `list` prints same labels next to every bank skill

| Status       | Label                        | Meaning                                       | Exit |
| ------------ | ---------------------------- | --------------------------------------------- | ---- |
| `ok`         | up to date                   | disk = lock, lock = bank                      | 0    |
| `update`     | update available             | bank template changed since lock              | 1    |
| `wrong-ref`  | ref differs from config      | config ref ≠ lock ref, `update` re-pins       | 1    |
| `drift`      | modified on disk             | tree hash ≠ lock rendered hash                | 2    |
| `missing`    | missing on disk              | skill dir absent, `add` or `repair`           | 2    |
| `conflict`   | conflict markers present     | unresolved merge, edit file then `check`      | 2    |
| `unverified` | installed outside zkills     | `--frozen` without bank template to re-render | 2    |
| `extra`      | not in lock                  | reserved, never emitted today                 | 2    |
| `tamper`     | lock does not match template | `--frozen` re-render ≠ lock rendered hash     | 3    |

## Other exit codes

- 1 refusal or error: policy, unknown skill, unreachable bank, invalid config
- 130 prompt cancelled with Ctrl-C

## Reading in CI

- 0 merge
- 1 run `update`, commit lock
- 2 human look at diff
- 3 stop, lock or bank tampered, see [threat-model.md](threat-model.md)
