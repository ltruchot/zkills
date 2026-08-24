import type { CAC } from "cac";

// Shown by `zkills <command> --help`
const EXAMPLES: Record<string, string[]> = {
  init: [
    "zkills init my-org/skills",
    "zkills init            # prompt, or preset in a flavor build",
  ],
  info: ["zkills info", "zkills info --json"],
  list: ["zkills list", "zkills list --json"],
  add: [
    "zkills add qa-pr",
    "zkills add qa-pr npm-vulnerability-check -y",
    "zkills add               # restore skills missing on disk",
  ],
  update: ["zkills update", "zkills update qa-pr --dry-run", "zkills update --external"],
  remove: ["zkills remove qa-pr -y"],
  check: [
    "zkills check",
    "zkills check --frozen    # CI: exit 3 on tampered lock",
    "ZKILLS_OFFLINE=1 zkills check --offline",
  ],
  doctor: ["zkills doctor", "zkills doctor --json"],
  repair: ["zkills repair", "zkills repair qa-pr --from-backup"],
  answers: ["zkills answers qa-pr", "zkills answers qa-pr --edit"],
  lint: ["zkills lint skills/*", "zkills lint skills/qa-pr --portable"],
  audit: ["zkills audit", "zkills audit skills/*"],
};

export function attachExamples(cli: CAC): void {
  for (const command of cli.commands) {
    for (const example of EXAMPLES[command.name] ?? []) command.example(example);
  }
}
