# Update algorithm

## Inputs

- `base` = template at install, rendered with old answers
- `theirs` = template now, rendered with current answers
- `disk` = files in `.claude/skills/<name>`
- `lock.files` = hash of every file zkills wrote last time

## Base source

- Template cache `~/.cache/zkills/templates/<templateHash>`
- Else GitHub tarball at lock sha
- Else no base, drift becomes conflict, warned

## Per file

- In `skipIfExists` and on disk → keep
- Disk hash = lock hash → write theirs, no questions
- Absent on disk → write
- Gone upstream, untouched → delete; edited → keep, warn
- Binary drift → keep, unless mode `theirs`
- Text drift → `node-diff3` merge base, disk, theirs
- Clean merge → write; conflict → per mode

## Safety

- Previous dir copied to `~/.cache/zkills/backup/<project>/<name>` before any write
- Merge applied in a work dir, swapped in with one rename
- `zkills repair --from-backup` undoes the last write

## Lock after update

- `files` and `renderedHash` = pure `theirs`, never disk
- Merged local edits still read as drift, by design
- Next update merges again with correct base

## Guarantees

- Placeholder-only change never touches merge
- Same template hash = skip, `--force` to re-render
- Nothing written before preview and confirm, `-y` skips confirm
