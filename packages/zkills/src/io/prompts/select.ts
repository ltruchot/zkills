import { isCancel, multiselect } from "@clack/prompts";
import { cancelled } from "./confirm.ts";

export async function selectSkills(names: string[], message = "Pick skills"): Promise<string[]> {
  const value = await multiselect({ message, options: names.map((n) => ({ value: n, label: n })) });
  if (isCancel(value)) cancelled();
  return value;
}
