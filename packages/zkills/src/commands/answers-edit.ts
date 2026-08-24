import { validateAnswer } from "../core/answers/validate.ts";
import type { Manifest } from "../core/schema/manifest.ts";
import type { Answers } from "../core/types.ts";
import { askPlaceholder } from "../io/prompts/placeholder.ts";
import { ENV_PREFIX } from "./add-prompts.ts";

// Every placeholder re-asked, env wins, -y keeps current
export async function editAnswers(
  manifest: Manifest,
  known: Answers,
  yes: boolean,
): Promise<Answers> {
  const answers: Answers = { ...known };
  for (const decl of manifest.placeholders) {
    const fromEnv = process.env[`${ENV_PREFIX}${decl.name}`];
    if (fromEnv !== undefined && validateAnswer(decl, fromEnv) === null)
      answers[decl.name] = fromEnv;
    else if (!yes) answers[decl.name] = await askPlaceholder(decl, known[decl.name]);
  }
  return answers;
}
