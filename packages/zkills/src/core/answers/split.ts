import type { Manifest } from "../schema/manifest.ts";
import type { Answers } from "../types.ts";

export type SplitAnswers = { public: Answers; secret: Answers };

// Public answers go to lock, secret ones to local file
export function splitAnswers(manifest: Manifest, answers: Answers): SplitAnswers {
  const secretNames = new Set(manifest.placeholders.filter((p) => p.secret).map((p) => p.name));
  const out: SplitAnswers = { public: {}, secret: {} };
  for (const [name, value] of Object.entries(answers)) {
    if (secretNames.has(name)) out.secret[name] = value;
    else out.public[name] = value;
  }
  return out;
}

export function secretNames(manifest: Manifest): string[] {
  return manifest.placeholders.filter((p) => p.secret).map((p) => p.name);
}
