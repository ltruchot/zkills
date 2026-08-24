# Interop with skills.sh

## Detection

- `zkills list` reads `skills-lock.json` from `npx skills`
- Rows show `external, unmanaged, review manually`
- zkills never writes to `.agents/` or those symlinks

## Delegation

- `zkills update --external` runs `npx skills update -y`
- Warning printed first: not from your bank, telemetry, review manually
- Exit code of `npx skills` becomes zkills exit code

## Why separate

- skills.sh update replaces dirs blindly, no drift detection
- No placeholders, no private repo guarantees
- Different trust level, different lockfile

## Migration

- Pick the external skill, fork into bank, add `zkills.yaml`
- `npx skills remove <name>`, then `zkills add <name>`
