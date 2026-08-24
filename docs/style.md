# Style

## Law

- Every file under 50 lines, `vp run lines` fails otherwise
- Exceptions: `pnpm-lock.yaml`, `LICENSE.md`

## Prose

- US English, telegraphic, bullets
- No articles, no adjectives, no trailing punctuation
- Sentences under 15 words
- README first, docs one topic each

## Code

- One responsibility per file, split before 50
- Named exports, explicit return types
- Comments say why, one line
- No new dependency without catalog pin
- `vp check` and `vp test` green = done

## Commits

- Imperative subject, milestone prefix while bootstrapping
- Never `--no-verify`
